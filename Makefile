# 369 Algo Trading Application Makefile
# Usage: make <target>

.PHONY: help install install-dev install-test install-docs clean test test-backend test-frontend lint lint-backend lint-frontend format format-backend format-frontend type-check build build-backend build-frontend docker-build docker-run docker-stop docker-clean run run-backend run-frontend migrate migrate-up migrate-down seed-db setup-db health-check logs backup restore deploy-staging deploy-production release

# Default target
help: ## Show this help message
	@echo "369 Algo Trading Application - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "For more information, contact your team lead or visit: https://github.com/r4r00t-sh/369Algo"

# Installation
install: ## Install production dependencies
	@echo "Installing production dependencies..."
	pip install -r backend/requirements.txt
	cd frontend && npm ci --only=production

install-dev: ## Install development dependencies
	@echo "Installing development dependencies..."
	pip install -r backend/requirements.txt
	pip install -e ".[dev]"
	cd frontend && npm ci

install-test: ## Install testing dependencies
	@echo "Installing testing dependencies..."
	pip install -e ".[test]"
	cd frontend && npm ci

install-docs: ## Install documentation dependencies
	@echo "Installing documentation dependencies..."
	pip install -e ".[docs]"

# Cleaning
clean: ## Clean all build artifacts and caches
	@echo "Cleaning build artifacts..."
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.pyd" -delete
	find . -type f -name ".coverage" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	find . -type d -name "htmlcov" -exec rm -rf {} +
	find . -type d -name "dist" -exec rm -rf {} +
	find . -type d -name "build" -exec rm -rf {} +
	cd frontend && rm -rf node_modules build coverage .nyc_output

# Testing
test: test-backend test-frontend ## Run all tests

test-backend: ## Run backend tests
	@echo "Running backend tests..."
	cd backend && python -m pytest tests/ -v --cov=. --cov-report=html --cov-report=term

test-frontend: ## Run frontend tests
	@echo "Running frontend tests..."
	cd frontend && npm test -- --coverage --watchAll=false

test-integration: ## Run integration tests
	@echo "Running integration tests..."
	cd backend && python -m pytest tests/integration/ -v -m integration

test-e2e: ## Run end-to-end tests
	@echo "Running end-to-end tests..."
	cd frontend && npm run test:e2e

# Linting and Formatting
lint: lint-backend lint-frontend ## Run all linting checks

lint-backend: ## Run backend linting
	@echo "Running backend linting..."
	cd backend && flake8 . --max-line-length=88 --extend-ignore=E203,W503
	cd backend && black --check .
	cd backend && isort --check-only .
	cd backend && mypy .

lint-frontend: ## Run frontend linting
	@echo "Running frontend linting..."
	cd frontend && npm run lint
	cd frontend && npm run type-check

format: format-backend format-frontend ## Format all code

format-backend: ## Format backend code
	@echo "Formatting backend code..."
	cd backend && black .
	cd backend && isort .

format-frontend: ## Format frontend code
	@echo "Formatting frontend code..."
	cd frontend && npm run format

type-check: ## Run type checking
	@echo "Running type checking..."
	cd backend && mypy .
	cd frontend && npm run type-check

# Building
build: build-backend build-frontend ## Build all components

build-backend: ## Build backend
	@echo "Building backend..."
	cd backend && python setup.py build

build-frontend: ## Build frontend
	@echo "Building frontend..."
	cd frontend && npm run build

# Docker
docker-build: ## Build Docker image
	@echo "Building Docker image..."
	docker build -t 369algo:latest .

docker-run: ## Run Docker container
	@echo "Running Docker container..."
	docker run -d --name 369algo-app -p 8000:8000 369algo:latest

docker-stop: ## Stop Docker container
	@echo "Stopping Docker container..."
	docker stop 369algo-app || true
	docker rm 369algo-app || true

docker-clean: ## Clean Docker images and containers
	@echo "Cleaning Docker..."
	docker stop 369algo-app || true
	docker rm 369algo-app || true
	docker rmi 369algo:latest || true

# Running
run: run-backend ## Run the application (backend only)

run-backend: ## Run backend server
	@echo "Starting backend server..."
	cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000

run-frontend: ## Run frontend development server
	@echo "Starting frontend development server..."
	cd frontend && npm start

run-full: ## Run both backend and frontend
	@echo "Starting full application..."
	@make run-backend & make run-frontend & wait

# Database
migrate: ## Run database migrations
	@echo "Running database migrations..."
	cd backend && alembic upgrade head

migrate-up: ## Run database migrations up
	@echo "Running database migrations up..."
	cd backend && alembic upgrade +1

migrate-down: ## Run database migrations down
	@echo "Running database migrations down..."
	cd backend && alembic downgrade -1

migrate-revision: ## Create new migration revision
	@echo "Creating new migration revision..."
	cd backend && alembic revision --autogenerate -m "$(message)"

seed-db: ## Seed database with initial data
	@echo "Seeding database..."
	cd backend && python scripts/seed_db.py

setup-db: ## Setup database (create, migrate, seed)
	@echo "Setting up database..."
	@make migrate
	@make seed-db

# Health and Monitoring
health-check: ## Check application health
	@echo "Checking application health..."
	curl -f http://localhost:8000/health || echo "Backend not responding"
	curl -f http://localhost:3000 || echo "Frontend not responding"

logs: ## Show application logs
	@echo "Showing application logs..."
	docker logs 369algo-app -f || echo "Docker container not running"

# Backup and Restore
backup: ## Backup database
	@echo "Backing up database..."
	@mkdir -p backups
	pg_dump -h localhost -U postgres -d trading_app > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql

restore: ## Restore database from backup
	@echo "Restoring database from backup..."
	@if [ -z "$(file)" ]; then echo "Usage: make restore file=backup_file.sql"; exit 1; fi
	psql -h localhost -U postgres -d trading_app < backups/$(file)

# Deployment
deploy-staging: ## Deploy to staging environment
	@echo "Deploying to staging..."
	@echo "Add your staging deployment logic here"

deploy-production: ## Deploy to production environment
	@echo "Deploying to production..."
	@echo "Add your production deployment logic here"

# Release Management
release: ## Create a new release
	@echo "Creating new release..."
	@if [ -z "$(version)" ]; then echo "Usage: make release version=x.y.z"; exit 1; fi
	git tag -a v$(version) -m "Release v$(version)"
	git push origin v$(version)
	@echo "Release v$(version) created and pushed"

release-patch: ## Create patch release
	@echo "Creating patch release..."
	@make release version=$$(git describe --tags --abbrev=0 | sed 's/v//' | awk -F. '{print $$1"."$$2"."$$3+1}')

release-minor: ## Create minor release
	@echo "Creating minor release..."
	@make release version=$$(git describe --tags --abbrev=0 | sed 's/v//' | awk -F. '{print $$1"."$$2+1".0"}')

release-major: ## Create major release
	@echo "Creating major release..."
	@make release version=$$(git describe --tags --abbrev=0 | sed 's/v//' | awk -F. '{print $$1+1".0.0"}')

# Development Tools
pre-commit: ## Install pre-commit hooks
	@echo "Installing pre-commit hooks..."
	pre-commit install

pre-commit-run: ## Run pre-commit on all files
	@echo "Running pre-commit on all files..."
	pre-commit run --all-files

security-scan: ## Run security scans
	@echo "Running security scans..."
	cd backend && bandit -r . -f json -o bandit-report.json
	cd frontend && npm audit --audit-level moderate

coverage: ## Generate coverage reports
	@echo "Generating coverage reports..."
	cd backend && python -m pytest tests/ --cov=. --cov-report=html --cov-report=term
	cd frontend && npm test -- --coverage --watchAll=false
	@echo "Coverage reports generated in backend/htmlcov/ and frontend/coverage/"

docs: ## Generate documentation
	@echo "Generating documentation..."
	cd backend && mkdocs build
	@echo "Documentation generated in backend/site/"

docs-serve: ## Serve documentation locally
	@echo "Serving documentation..."
	cd backend && mkdocs serve

# Quick Setup
quick-setup: ## Quick setup for development
	@echo "Setting up development environment..."
	@make install-dev
	@make setup-db
	@make pre-commit
	@echo "Development environment ready!"

# Production Setup
prod-setup: ## Setup production environment
	@echo "Setting up production environment..."
	@make install
	@make setup-db
	@make docker-build
	@echo "Production environment ready!"

# Utility
status: ## Show application status
	@echo "Application Status:"
	@echo "Backend: $$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health || echo "Not running")"
	@echo "Frontend: $$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "Not running")"
	@echo "Database: $$(pg_isready -h localhost -p 5432 > /dev/null 2>&1 && echo "Ready" || echo "Not ready")"
	@echo "Redis: $$(redis-cli ping > /dev/null 2>&1 && echo "Ready" || echo "Not ready")"

info: ## Show project information
	@echo "369 Algo Trading Application"
	@echo "Version: 1.0.0"
	@echo "Repository: https://github.com/r4r00t-sh/369Algo (Private Team Repository)"
	@echo "Documentation: https://369algo.com/docs"
	@echo ""
	@echo "Current branch: $$(git branch --show-current)"
	@echo "Last commit: $$(git log -1 --oneline)"
	@echo "Python version: $$(python --version)"
	@echo "Node version: $$(node --version)"
	@echo "npm version: $$(npm --version)"

# Default target
.DEFAULT_GOAL := help
