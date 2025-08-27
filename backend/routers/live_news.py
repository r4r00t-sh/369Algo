from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import json
import logging
from jose import jwt

from database import get_postgres_db
from models.user import User
from config import settings
from services.live_news_service import live_news_service

router = APIRouter()
security = HTTPBearer()

logger = logging.getLogger(__name__)

async def get_current_user_from_token(token: str, db) -> Optional[User]:
    """Extract user from JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        
        user = db.query(User).filter(User.email == email).first()
        return user
    except jwt.JWTError:
        return None

@router.websocket("/ws/test")
async def websocket_test(websocket: WebSocket):
    """Test WebSocket endpoint"""
    await websocket.accept()
    await websocket.send_text("Test WebSocket working!")
    await websocket.close()

@router.websocket("/ws/live-news")
async def websocket_live_news(websocket: WebSocket):
    """WebSocket endpoint for live news updates"""
    try:
        await websocket.accept()
        
        # Send connection confirmation
        await websocket.send_text(json.dumps({
            "type": "connection_status",
            "status": "connected",
            "message": "Connected to live news service"
        }))
        
        # Start live news updates if not already running
        try:
            await live_news_service.start_live_updates()
        except Exception as e:
            logger.error(f"Failed to start live news updates: {e}")
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Failed to start live news service"
            }))
            return
        
        # Connect to live news service
        try:
            await live_news_service.connect(websocket)
        except Exception as e:
            logger.error(f"Failed to connect to live news service: {e}")
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Failed to connect to live news service"
            }))
            return
        
        # Keep connection alive and handle incoming messages
        while True:
            try:
                # Wait for any message from client (ping/pong for keep-alive)
                data = await websocket.receive_text()
                message = json.loads(data)
                
                if message.get("type") == "ping":
                    await websocket.send_text(json.dumps({
                        "type": "pong",
                        "timestamp": "2024-01-01T00:00:00Z"
                    }))
                elif message.get("type") == "request_news":
                    # Send latest news on request
                    try:
                        latest_news = await live_news_service.get_latest_news()
                        await websocket.send_text(json.dumps({
                            "type": "news_response",
                            "news": latest_news,
                            "timestamp": "2024-01-01T00:00:00Z"
                        }))
                    except Exception as e:
                        logger.error(f"Error getting latest news: {e}")
                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "message": "Failed to get latest news"
                        }))
                elif message.get("type") == "refresh_news":
                    # Manually refresh news
                    try:
                        refreshed_news = await live_news_service.refresh_news()
                        await websocket.send_text(json.dumps({
                            "type": "news_refreshed",
                            "news": refreshed_news,
                            "timestamp": "2024-01-01T00:00:00Z"
                        }))
                    except Exception as e:
                        logger.error(f"Error refreshing news: {e}")
                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "message": "Failed to refresh news"
                        }))
                elif message.get("type") == "request_breaking_news":
                    # Send breaking news on request
                    try:
                        breaking_news = await live_news_service.get_breaking_news()
                        await websocket.send_text(json.dumps({
                            "type": "breaking_news_response",
                            "news": breaking_news,
                            "timestamp": "2024-01-01T00:00:00Z"
                        }))
                    except Exception as e:
                        logger.error(f"Error getting breaking news: {e}")
                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "message": "Failed to get breaking news"
                        }))
                
            except WebSocketDisconnect:
                logger.info("WebSocket disconnected by client")
                break
            except json.JSONDecodeError:
                logger.error("Invalid JSON received from client")
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Invalid JSON format"
                }))
            except Exception as e:
                logger.error(f"Error handling WebSocket message: {e}")
                try:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": "Error processing message"
                    }))
                except:
                    # If we can't send error message, connection is likely broken
                    break
    
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Internal server error"
            }))
        except:
            pass
    finally:
        # Clean up connection
        try:
            await live_news_service.disconnect(websocket)
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")

@router.websocket("/ws/live-news/{user_token}")
async def websocket_live_news_authenticated(websocket: WebSocket, user_token: str):
    """WebSocket endpoint for authenticated live news updates"""
    try:
        await websocket.accept()
        
        # Verify user token
        try:
            from database import get_postgres_db
            db = next(get_postgres_db())
            user = await get_current_user_from_token(user_token, db)
            
            if not user:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Invalid authentication token"
                }))
                await websocket.close(code=4001)  # Invalid token
                return
        except Exception as e:
            logger.error(f"Error verifying user token: {e}")
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Authentication error"
            }))
            await websocket.close(code=4001)
            return
        
        # Send connection confirmation
        await websocket.send_text(json.dumps({
            "type": "connection_status",
            "status": "connected",
            "message": f"Connected as {user.username}",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }))
        
        # Start live news updates if not already running
        try:
            await live_news_service.start_live_updates()
        except Exception as e:
            logger.error(f"Failed to start live news updates: {e}")
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Failed to start live news service"
            }))
            return
        
        # Connect to live news service
        try:
            await live_news_service.connect(websocket)
        except Exception as e:
            logger.error(f"Failed to connect to live news service: {e}")
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Failed to connect to live news service"
            }))
            return
        
        # Keep connection alive and handle incoming messages
        while True:
            try:
                # Wait for any message from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                if message.get("type") == "ping":
                    await websocket.send_text(json.dumps({
                        "type": "pong",
                        "timestamp": "2024-01-01T00:00:00Z"
                    }))
                elif message.get("type") == "request_news":
                    # Send latest news on request
                    try:
                        latest_news = await live_news_service.get_latest_news()
                        await websocket.send_text(json.dumps({
                            "type": "news_response",
                            "news": latest_news,
                            "timestamp": "2024-01-01T00:00:00Z"
                        }))
                    except Exception as e:
                        logger.error(f"Error getting latest news: {e}")
                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "message": "Failed to get latest news"
                        }))
                elif message.get("type") == "refresh_news":
                    # Manually refresh news
                    try:
                        refreshed_news = await live_news_service.refresh_news()
                        await websocket.send_text(json.dumps({
                            "type": "news_refreshed",
                            "news": refreshed_news,
                            "timestamp": "2024-01-01T00:00:00Z"
                        }))
                    except Exception as e:
                        logger.error(f"Error refreshing news: {e}")
                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "message": "Failed to refresh news"
                        }))
                elif message.get("type") == "request_breaking_news":
                    # Send breaking news on request
                    try:
                        breaking_news = await live_news_service.get_breaking_news()
                        await websocket.send_text(json.dumps({
                            "type": "breaking_news_response",
                            "news": breaking_news,
                            "timestamp": "2024-01-01T00:00:00Z"
                        }))
                    except Exception as e:
                        logger.error(f"Error getting breaking news: {e}")
                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "message": "Failed to get breaking news"
                        }))
                elif message.get("type") == "request_category_news":
                    # Send news by category
                    try:
                        category = message.get("category", "business")
                        category_news = await live_news_service.get_news_by_category(category)
                        await websocket.send_text(json.dumps({
                            "type": "category_news_response",
                            "category": category,
                            "news": category_news,
                            "timestamp": "2024-01-01T00:00:00Z"
                        }))
                    except Exception as e:
                        logger.error(f"Error getting category news: {e}")
                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "message": "Failed to get category news"
                        }))
                
            except WebSocketDisconnect:
                logger.info(f"WebSocket disconnected for user {user.username if user else 'unknown'}")
                break
            except json.JSONDecodeError:
                logger.error("Invalid JSON received from client")
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Invalid JSON format"
                }))
            except Exception as e:
                logger.error(f"Error handling WebSocket message: {e}")
                try:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": "Error processing message"
                    }))
                except:
                    # If we can't send error message, connection is likely broken
                    break
    
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for user {user.username if user else 'unknown'}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Internal server error"
            }))
        except:
            pass
    finally:
        # Clean up connection
        try:
            await live_news_service.disconnect(websocket)
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")

@router.get("/status")
async def get_live_news_status():
    """Get live news service status"""
    return {
        "status": "running" if live_news_service.is_running else "stopped",
        "active_connections": len(live_news_service.active_connections),
        "last_update": live_news_service.last_update.isoformat(),
        "news_count": len(live_news_service.news_cache),
        "breaking_news_count": len([n for n in live_news_service.news_cache if n.get('isBreaking')])
    }

@router.post("/start")
async def start_live_news_service():
    """Start live news service"""
    await live_news_service.start_live_updates()
    return {"message": "Live news service started", "status": "running"}

@router.post("/stop")
async def stop_live_news_service():
    """Stop live news service"""
    await live_news_service.stop_live_updates()
    return {"message": "Live news service stopped", "status": "stopped"}

@router.get("/latest")
async def get_latest_live_news():
    """Get latest news from live service (REST endpoint)"""
    news = await live_news_service.get_latest_news()
    return {
        "news": news,
        "count": len(news),
        "last_update": live_news_service.last_update.isoformat()
    }

@router.get("/breaking")
async def get_breaking_live_news():
    """Get breaking news from live service (REST endpoint)"""
    breaking_news = await live_news_service.get_breaking_news()
    return {
        "breaking_news": breaking_news,
        "count": len(breaking_news),
        "last_update": live_news_service.last_update.isoformat()
    }
