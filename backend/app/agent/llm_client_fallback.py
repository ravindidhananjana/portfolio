"""
LLM Client with automatic fallback support.

Attempts models in this order:
1. Primary Gemini model (GEMINI_MODEL)
2. Fallback Gemini models (GEMINI_FALLBACK_MODELS)
3. OpenRouter free models (OPENROUTER_FALLBACK_MODELS) - if API key is configured
"""

import logging
from typing import AsyncGenerator, List, Optional
from google import genai
from google.genai import types
import httpx

from app.config import settings

logger = logging.getLogger(__name__)


class LLMClientWithFallback:
    """
    LLM client that automatically falls back through multiple models/providers.
    """

    def __init__(self):
        # Initialize Gemini client
        self.gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.embedding_model = settings.GEMINI_EMBEDDING_MODEL

        # Build ordered list of Gemini models to try
        self._gemini_models = [settings.GEMINI_MODEL] + settings.gemini_fallback_models

        # Build ordered list of OpenRouter models to try
        self._openrouter_models = settings.openrouter_fallback_models
        self._openrouter_api_key = settings.OPENROUTER_API_KEY
        self._openrouter_base_url = settings.OPENROUTER_BASE_URL

        # HTTP client for OpenRouter (reused for connection pooling)
        self._http_client: Optional[httpx.AsyncClient] = None

    async def _get_http_client(self) -> httpx.AsyncClient:
        """Get or create the HTTP client for OpenRouter."""
        if self._http_client is None or self._http_client.is_closed:
            self._http_client = httpx.AsyncClient(
                base_url=self._openrouter_base_url,
                headers={
                    "Authorization": f"Bearer {self._openrouter_api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://github.com/ravindidhananjana/portfolio",
                    "X-Title": "Portfolio Agent",
                },
                timeout=60.0,
            )
        return self._http_client

    async def close(self):
        """Close the HTTP client."""
        if self._http_client and not self._http_client.is_closed:
            await self._http_client.aclose()
            self._http_client = None

    async def generate_stream(self, prompt: str) -> AsyncGenerator[str, None]:
        """
        Stream tokens from the first working model.

        Tries models in order:
        1. Primary Gemini model
        2. Fallback Gemini models
        3. OpenRouter free models (if API key configured)
        """
        last_error = None

        # Try Gemini models first
        for model in self._gemini_models:
            try:
                logger.info(f"Attempting to generate with Gemini model: {model}")
                async for chunk in self._generate_gemini_stream(model, prompt):
                    yield chunk
                logger.info(f"Successfully generated with Gemini model: {model}")
                return  # Success - exit the generator
            except Exception as e:
                last_error = e
                logger.warning(f"Gemini model {model} failed: {e}. Trying next model...")
                continue

        # If all Gemini models failed and OpenRouter is configured, try OpenRouter
        if self._openrouter_api_key:
            for model in self._openrouter_models:
                try:
                    logger.info(f"Attempting to generate with OpenRouter model: {model}")
                    async for chunk in self._generate_openrouter_stream(model, prompt):
                        yield chunk
                    logger.info(f"Successfully generated with OpenRouter model: {model}")
                    return  # Success - exit the generator
                except Exception as e:
                    last_error = e
                    logger.warning(f"OpenRouter model {model} failed: {e}. Trying next model...")
                    continue

        # If we get here, all models failed
        error_msg = f"All models failed. Last error: {last_error}"
        logger.error(error_msg)
        raise RuntimeError(error_msg) from last_error

    async def _generate_gemini_stream(self, model: str, prompt: str) -> AsyncGenerator[str, None]:
        """Generate stream using Gemini API."""
        response = await self.gemini_client.aio.models.generate_content_stream(
            model=model,
            contents=prompt
        )
        async for chunk in response:
            if chunk.text:
                yield chunk.text

    async def _generate_openrouter_stream(self, model: str, prompt: str) -> AsyncGenerator[str, None]:
        """Generate stream using OpenRouter API (OpenAI-compatible)."""
        client = await self._get_http_client()

        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "stream": True,
            "temperature": 0.7,
            "max_tokens": 4096,
        }

        async with client.stream("POST", "/chat/completions", json=payload) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if not line or not line.startswith("data: "):
                    continue
                data = line[6:]  # Remove "data: " prefix
                if data == "[DONE]":
                    break
                try:
                    import json
                    chunk = json.loads(data)
                    if chunk.get("choices") and chunk["choices"][0].get("delta", {}).get("content"):
                        yield chunk["choices"][0]["delta"]["content"]
                except json.JSONDecodeError:
                    continue

    async def embed(self, text: str) -> List[float]:
        """
        Embed text using Gemini embedding model.
        Falls back to OpenRouter if Gemini fails (but only for embeddings if OpenRouter supports it).
        """
        # Try Gemini first
        try:
            result = await self.gemini_client.aio.models.embed_content(
                model=self.embedding_model,
                contents=text
            )
            return result.embeddings[0].values
        except Exception as e:
            logger.warning(f"Gemini embedding failed: {e}")

        # If OpenRouter is configured, we could try an embedding model there
        # For now, re-raise since OpenRouter free models typically don't support embeddings
        raise RuntimeError(f"Embedding failed: {e}") from e


# Backward compatibility alias
GeminiClient = LLMClientWithFallback