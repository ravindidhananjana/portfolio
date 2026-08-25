from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    # ── Gemini API ──────────────────────────────────────────────
    GEMINI_API_KEY: str = Field(..., validation_alias="GEMINI_API_KEY")
    GEMINI_MODEL: str = Field("gemini-3.6-flash", validation_alias="GEMINI_MODEL")
    GEMINI_EMBEDDING_MODEL: str = Field("gemini-embedding-2", validation_alias="GEMINI_EMBEDDING_MODEL")
    # Comma-separated list of fallback Gemini models to try in order
    GEMINI_FALLBACK_MODELS: str = Field("gemini-2.5-flash,gemini-2.0-flash", validation_alias="GEMINI_FALLBACK_MODELS")

    # ── OpenRouter API (fallback) ───────────────────────────────
    OPENROUTER_API_KEY: str | None = Field(None, validation_alias="OPENROUTER_API_KEY")
    # Comma-separated list of free OpenRouter models to try in order
    OPENROUTER_FALLBACK_MODELS: str = Field(
        "meta-llama/llama-3.1-8b-instruct:free,google/gemma-2-9b-it:free,mistralai/mistral-7b-instruct:free",
        validation_alias="OPENROUTER_FALLBACK_MODELS"
    )
    OPENROUTER_BASE_URL: str = Field("https://openrouter.ai/api/v1", validation_alias="OPENROUTER_BASE_URL")

    # ── GitHub ──────────────────────────────────────────────────
    GITHUB_USERNAME: str = Field("ravindidhananjana", validation_alias="GITHUB_USERNAME")
    GITHUB_TOKEN: str | None = Field(None, validation_alias="GITHUB_TOKEN")
    GITHUB_EXCLUDE_REPOS: str = Field("", validation_alias="GITHUB_EXCLUDE_REPOS")
    GITHUB_ANALYZE_REPOS: str = Field("", validation_alias="GITHUB_ANALYZE_REPOS")
    GITHUB_MAX_FILE_SIZE_KB: int = Field(50, validation_alias="GITHUB_MAX_FILE_SIZE_KB")

    # ── Agent ────────────────────────────────────────────────────
    SYNC_SECRET: str = Field("super_secret_sync_key", validation_alias="SYNC_SECRET")
    MAX_RETRIEVAL_CHUNKS: int = Field(5, validation_alias="MAX_RETRIEVAL_CHUNKS")

    # ── Server ───────────────────────────────────────────────────
    FRONTEND_URL: str = Field("http://localhost:3000", validation_alias="FRONTEND_URL")

    @property
    def gemini_fallback_models(self) -> List[str]:
        """Parse comma-separated fallback models, filtering empty strings."""
        return [m.strip() for m in self.GEMINI_FALLBACK_MODELS.split(",") if m.strip()]

    @property
    def openrouter_fallback_models(self) -> List[str]:
        """Parse comma-separated OpenRouter fallback models, filtering empty strings."""
        return [m.strip() for m in self.OPENROUTER_FALLBACK_MODELS.split(",") if m.strip()]

    class Config:
        import os
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
        env_file_encoding = "utf-8"


settings = Settings()
