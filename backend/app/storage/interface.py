from abc import ABC, abstractmethod

class VectorStoreInterface(ABC):
    @abstractmethod
    def add_chunks(self, chunks: list[dict], embeddings: list[list[float]]):
        """Add text chunks and their embeddings to the vector store."""
        pass

    @abstractmethod
    def search(self, query_embedding: list[float], k: int = 5) -> list[dict]:
        """Search top k chunks closest to query_embedding."""
        pass

    @abstractmethod
    def save(self, directory: str):
        """Save vector index and chunks metadata to disk."""
        pass

    @abstractmethod
    def load(self, directory: str) -> bool:
        """Load vector index and chunks metadata from disk. Returns True if successful."""
        pass
