import os
import sys
import asyncio

# Ensure parent directory is in the python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.ingestion.fetch_github import fetch_github_repos
from app.ingestion.load_local import load_local_knowledge
from app.ingestion.chunker import chunk_document
from app.agent.llm_client import GeminiClient
from app.storage.faiss_store import FaissStore

async def main():
    print("Starting knowledge ingestion pipeline...")

    # 1. Fetch GitHub Repos
    print("Fetching repositories from GitHub...")
    github_docs = await fetch_github_repos()
    print(f"Fetched {len(github_docs)} GitHub projects.")

    # 2. Load Local Knowledge Files
    print("Loading local knowledge files...")
    local_docs = load_local_knowledge()
    print(f"Loaded {len(local_docs)} local docs.")

    # 3. Combine documents
    all_docs = github_docs + local_docs
    if not all_docs:
        print("No documents found to ingest!")
        return

    # 4. Chunk documents
    print("Chunking documents...")
    all_chunks = []
    for doc in all_docs:
        chunks = chunk_document(doc)
        all_chunks.extend(chunks)
    print(f"Created {len(all_chunks)} chunks.")

    # 5. Embed chunks
    print("Embedding chunks using Gemini API...")
    client = GeminiClient()
    embeddings = []

    for idx, chunk in enumerate(all_chunks):
        try:
            print(f"Embedding chunk {idx+1}/{len(all_chunks)}...")
            embedding = await client.embed(chunk["text"])
            embeddings.append(embedding)
            # Sleep slightly to respect free tier rate limits (15 RPM / 1500 RPD)
            await asyncio.sleep(0.5)
        except Exception as e:
            print(f"Error embedding chunk {idx+1}: {e}")
            break

    # If some embeddings failed or rate limited, keep only the successful ones
    successful_chunks = all_chunks[:len(embeddings)]

    # 6. Save FAISS index
    if successful_chunks and embeddings:
        print("Saving vector index and chunks to disk...")
        store = FaissStore()
        store.add_chunks(successful_chunks, embeddings)
        store.save("vector_store")
        print("Ingestion pipeline completed successfully! FAISS index saved in 'vector_store/'.")
    else:
        print("No embeddings were generated. Vector store not updated.")

if __name__ == "__main__":
    asyncio.run(main())
