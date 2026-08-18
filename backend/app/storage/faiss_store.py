import faiss
import numpy as np
import json
import os
from app.storage.interface import VectorStoreInterface

class FaissStore(VectorStoreInterface):
    def __init__(self):
        self.index = None
        self.chunks = []

    def add_chunks(self, chunks: list[dict], embeddings: list[list[float]]):
        if not chunks or not embeddings:
            return

        embeddings_np = np.array(embeddings, dtype=np.float32)
        dimension = embeddings_np.shape[1]

        if self.index is None:
            # Flat Inner Product index for cosine similarity (on normalized vectors)
            self.index = faiss.IndexFlatIP(dimension)

        # L2 normalize embeddings so inner product acts as cosine similarity
        faiss.normalize_L2(embeddings_np)
        self.index.add(embeddings_np)
        self.chunks.extend(chunks)

    def search(self, query_embedding: list[float], k: int = 5) -> list[dict]:
        if self.index is None or not self.chunks:
            return []

        query_np = np.array([query_embedding], dtype=np.float32)
        faiss.normalize_L2(query_np)

        # Query index
        scores, indices = self.index.search(query_np, min(k, len(self.chunks)))

        results = []
        for i, idx in enumerate(indices[0]):
            if idx == -1 or idx >= len(self.chunks):
                continue
            chunk = self.chunks[idx].copy()
            chunk["score"] = float(scores[0][i])
            results.append(chunk)

        return results

    def save(self, directory: str):
        os.makedirs(directory, exist_ok=True)
        if self.index is not None:
            faiss.write_index(self.index, os.path.join(directory, "index.faiss"))
        with open(os.path.join(directory, "chunks.json"), "w", encoding="utf-8") as f:
            json.dump(self.chunks, f, ensure_ascii=False, indent=2)

    def load(self, directory: str) -> bool:
        index_path = os.path.join(directory, "index.faiss")
        chunks_path = os.path.join(directory, "chunks.json")

        if not os.path.exists(index_path) or not os.path.exists(chunks_path):
            return False

        try:
            self.index = faiss.read_index(index_path)
            with open(chunks_path, "r", encoding="utf-8") as f:
                self.chunks = json.load(f)
            return True
        except Exception as e:
            print(f"Error loading FAISS store: {e}")
            return False
