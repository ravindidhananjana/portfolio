# Portfolio

Personal portfolio website with an AI-powered chat agent ("Elara") that answers questions about the owner using retrieval-augmented generation (RAG).

## Architecture

```
portfolio/
├── backend/    FastAPI + Gemini-powered RAG agent
└── frontend/   Next.js 14 portfolio site
```

### Backend

- **FastAPI** server exposing:
  - `POST /api/chat` — streaming chat endpoint (SSE) backed by the Elara agent
  - `POST /api/sync` — protected background job that ingests knowledge (GitHub repos, resume, etc.) into the vector store
- **ElaraAgent** (`backend/app/agent/`) — RAG pipeline: retrieves relevant chunks from a FAISS vector store and streams an answer
- **LLM fallback chain** — Gemini primary, Gemini fallback models, then OpenRouter free models
- **Embeddings** — `text-embedding-004`, indexed in FAISS (`backend/vector_store/`)

### Frontend

- **Next.js 14 + TypeScript + Tailwind CSS**
- Pages: home, about, agent, projects, resume, lab, contact
- Chat UI streams responses from the backend via Server-Sent Events

## Setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in at minimum:

- `GEMINI_API_KEY` (from Google AI Studio)
- `OPENROUTER_API_KEY` (optional fallback)
- `GITHUB_TOKEN` (optional, avoids GitHub rate limits)

Start the server:

```bash
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env.local` (set `NEXT_PUBLIC_API_URL` if the backend is not on port 8000).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Keeping knowledge in sync

Trigger ingestion so the agent knows about new repos/content:

```bash
curl -X POST http://localhost:8000/api/sync \
  -H "X-Sync-Secret: your_sync_secret_here"
```

The knowledge base is also reloaded from disk on every chat request, so `scripts/ingest_knowledge.py` can be run manually to refresh it.

## Environment variables

See `backend/.env.example` and `frontend/.env.example` for the full list with comments. Never commit real keys — only `.env.example` templates.
