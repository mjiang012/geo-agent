from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Server Settings
    SERVER_HOST: str = "0.0.0.0"
    SERVER_PORT: int = 8000
    DEBUG: bool = True

    # CORS Settings
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]

    # Database Settings
    DATABASE_URL: str = "sqlite:///data/citify_ai.db"

    # Pinecone Settings
    PINECONE_API_KEY: str = ""
    PINECONE_ENVIRONMENT: str = ""
    PINECONE_INDEX_NAME: str = "citify-ai-index"

    # OpenAI Settings
    OPENAI_API_KEY: str = ""
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-large"
    OPENAI_CHAT_MODEL: str = "gpt-4-turbo"

    # Anthropic Settings
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_CHAT_MODEL: str = "claude-3-opus-20240229"

    # External API Settings
    STATISTA_API_KEY: str = ""
    SEMANTIC_SCHOLAR_API_KEY: str = ""

    # Security Settings
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440

    # Logging Settings
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/citify-ai.log"

    # Data Settings
    DATA_DIR: str = "data"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
