# Citify AI Backend

The backend service for Citify AI, built with Python, FastAPI, and PostgreSQL.

## Development Setup

1. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate  # Windows
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database Migration

The database is automatically initialized on startup using the SQL in `database/init.sql`.

## Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/          # API endpoints
│   ├── services/        # Business logic
│   ├── models/          # Database models
│   ├── utils/           # Utilities
│   ├── config/          # Configuration
│   └── main.py          # Application entry
├── database/            # Database scripts
├── data/                # Data storage
├── logs/                # Log files
└── tests/               # Tests
```
