from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """AI Service configuration loaded from environment variables."""

    AI_SERVICE_PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_URL: str = "http://localhost:5000"

    # LLM configuration — will be expanded in Phase 5
    # LLM_PROVIDER: str = "openai"
    # LLM_API_KEY: str = ""
    # LLM_MODEL: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # Also check parent directory for .env
        extra = "ignore"


settings = Settings()
