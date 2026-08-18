from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    GEMINI_API_KEY: str = Field(..., validation_alias="GEMINI_API_KEY")
    GEMINI_MODEL: str = Field("gemini-3.6-flash", validation_alias="GEMINI_MODEL")
    GEMINI_EMBEDDING_MODEL: str = Field("gemini-embedding-2", validation_alias="GEMINI_EMBEDDING_MODEL")
    
    GITHUB_USERNAME: str = Field("ravindidhananjana", validation_alias="GITHUB_USERNAME")
    GITHUB_TOKEN: str | None = Field(None, validation_alias="GITHUB_TOKEN")
    GITHUB_EXCLUDE_REPOS: str = Field("", validation_alias="GITHUB_EXCLUDE_REPOS")
    
    SYNC_SECRET: str = Field("super_secret_sync_key", validation_alias="SYNC_SECRET")
    MAX_RETRIEVAL_CHUNKS: int = Field(5, validation_alias="MAX_RETRIEVAL_CHUNKS")
    
    FRONTEND_URL: str = Field("http://localhost:3000", validation_alias="FRONTEND_URL")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
