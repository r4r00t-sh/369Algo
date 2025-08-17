from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import redis
from config import settings

# PostgreSQL Database
postgres_engine = create_engine(
    settings.POSTGRES_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=settings.DEBUG
)

PostgresSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=postgres_engine)
Base = declarative_base()

# Redis Connection
redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    password=settings.REDIS_PASSWORD,
    decode_responses=True,
    socket_connect_timeout=5,
    socket_timeout=5,
    retry_on_timeout=True
)

# Database dependency
def get_postgres_db():
    db = PostgresSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Redis dependency
def get_redis_client():
    return redis_client

# Health check function
def check_database_health():
    """Check if both PostgreSQL and Redis are healthy"""
    try:
        # Check PostgreSQL
        with postgres_engine.connect() as conn:
            conn.execute("SELECT 1")
        
        # Check Redis
        redis_client.ping()
        
        return True
    except Exception as e:
        print(f"Database health check failed: {e}")
        return False

# Initialize database
def init_database():
    """Create all tables in PostgreSQL"""
    try:
        Base.metadata.create_all(bind=postgres_engine)
        print("✅ Database tables created successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to create database tables: {e}")
        return False
