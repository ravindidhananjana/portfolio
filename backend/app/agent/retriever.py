from app.agent.llm_client import GeminiClient
from app.storage.faiss_store import FaissStore
from app.config import settings
import os

class Retriever:
    def __init__(self, gemini_client: GeminiClient, vector_store_dir: str = "vector_store"):
        self.client = gemini_client
        self.store = FaissStore()
        self.vector_store_dir = vector_store_dir
        self.loaded = self.store.load(self.vector_store_dir)
        if not self.loaded:
            print(f"Warning: Vector store not found in {self.vector_store_dir}. Please run ingestion script first.")

    def reload(self):
        """Reload vector store from disk after sync/ingestion."""
        self.loaded = self.store.load(self.vector_store_dir)

    async def retrieve(self, query: str, limit: int | None = None) -> list[dict]:
        if not self.loaded:
            self.reload()
            if not self.loaded:
                return []

        limit = limit or settings.MAX_RETRIEVAL_CHUNKS
        limit = max(1, min(limit, 3))

        # 1. Embed query
        query_embedding = await self.client.embed(query)

        # 2. Search FAISS index
        hits = self.store.search(query_embedding, k=max(limit * 3, 6))

        # 3. Remove near-duplicate chunks before prompting the model.
        unique_hits: list[dict] = []
        for chunk in hits:
            text = (chunk.get("text") or "").strip()
            if not text:
                continue

            normalized = " ".join(text.lower().split())
            is_duplicate = False
            for prev in unique_hits:
                prev_text = (prev.get("text") or "").strip().lower()
                prev_norm = " ".join(prev_text.split())
                if not prev_norm:
                    continue

                if normalized == prev_norm:
                    is_duplicate = True
                    break

                prev_tokens = set(prev_norm.split())
                curr_tokens = set(normalized.split())
                if not prev_tokens or not curr_tokens:
                    continue
                similarity = len(prev_tokens & curr_tokens) / max(1, len(prev_tokens | curr_tokens))
                if similarity >= 0.8:
                    is_duplicate = True
                    break

            if is_duplicate:
                continue

            unique_hits.append(chunk)
            if len(unique_hits) >= limit:
                break

        return unique_hits
