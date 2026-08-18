from google import genai
from app.config import settings

class GeminiClient:
    def __init__(self):
        # The genai.Client constructor reads GEMINI_API_KEY from environment automatically.
        # But we pass it explicitly to be absolutely safe.
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model = settings.GEMINI_MODEL
        self.embedding_model = settings.GEMINI_EMBEDDING_MODEL

    async def generate_stream(self, prompt: str):
        """Stream tokens from Gemini asynchronously."""
        response = await self.client.aio.models.generate_content_stream(
            model=self.model,
            contents=prompt
        )
        async for chunk in response:
            if chunk.text:
                yield chunk.text

    async def embed(self, text: str) -> list[float]:
        """Embed text using Gemini embedding model asynchronously."""
        result = await self.client.aio.models.embed_content(
            model=self.embedding_model,
            contents=text
        )
        return result.embeddings[0].values
