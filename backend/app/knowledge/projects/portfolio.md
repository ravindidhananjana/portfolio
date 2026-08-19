---
title: portfolio
type: project
classification: PORTFOLIO_PROJECT
last_commit: b6eeeef20b4f17517d1bf688a0308afe0dc7eacb
---

# Personal Portfolio & Elara AI Agent

## Project Overview
The **Personal Portfolio & Elara AI Agent** repository contains the complete full-stack implementation of Ravindi Gunasekara's professional portfolio website, integrated with an AI-powered conversational agent named **"Elara"**. Elara answers questions about Ravindi's profile, academic background, research interests, projects, skills, and contact details using a custom Retrieval-Augmented Generation (RAG) pipeline built with FastAPI, FAISS, Google Gemini, and OpenRouter fallback models.

- **VERIFIED Source:** `README.md`, `backend/app/agent/prompts.py`, `frontend/src/app/agent/page.tsx`
- **Primary Language:** Python (Backend) & TypeScript (Frontend) VERIFIED (Source: repository metadata, `README.md`, `package.json`)
- **Repository URL:** `https://github.com/ravindidhananjana/portfolio` VERIFIED (Source: repository metadata)

---

## Author & Role Contribution
- **Owner / Author:** Ravindi Gunasekara VERIFIED (Source: `backend/app/knowledge/profile.md`, `README.md`)
- **Contribution:** Designed and implemented the complete frontend website, backend API server, local knowledge base, vector embedding ingestion pipeline, FAISS vector search, and multi-provider LLM fallback chain. VERIFIED (Source: `backend/`, `frontend/`, `scripts/ingest_knowledge.py`)

---

## System Architecture & Technologies

### Architecture Overview
The repository is split into a decoupled frontend and backend architecture:

```
portfolio/
├── backend/    FastAPI + Gemini/OpenRouter RAG Agent + FAISS Vector Store
└── frontend/   Next.js 14 Portfolio Site + Streaming Chat Interface
```
- **VERIFIED Source:** `README.md`

### Tech Stack Table
| Component | Technology / Library | Purpose | Evidence / Source |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router), React 18 | Client-side UI & routing | VERIFIED (`frontend/package.json`) |
| **Frontend Styling** | Tailwind CSS, Framer Motion | Modern styling & animations | VERIFIED (`frontend/package.json`, `frontend/tailwind.config.ts`) |
| **Icons** | Lucide React, React Icons | UI Iconography | VERIFIED (`frontend/package.json`) |
| **Backend Framework** | FastAPI, Uvicorn | Asynchronous REST & SSE streaming server | VERIFIED (`backend/requirements.txt`, `backend/app/main.py`) |
| **LLM APIs** | Google GenAI SDK (`google-genai`), `httpx` | Interface for Gemini & OpenRouter APIs | VERIFIED (`backend/requirements.txt`, `backend/app/agent/llm_client_fallback.py`) |
| **Vector Indexing** | FAISS (`faiss-cpu`), NumPy | In-memory/disk vector store using inner product index | VERIFIED (`backend/requirements.txt`, `backend/app/storage/faiss_store.py`) |
| **Configuration** | `pydantic-settings` | Environment variable parsing and defaults | VERIFIED (`backend/app/config.py`) |

---

## Ingestion Pipeline & Knowledge Base

### Data Sources
1. **Local Knowledge Files:** Markdown files stored in `backend/app/knowledge/` covering profile, skills, education, experience, achievements, and contact details. VERIFIED (Source: `backend/app/ingestion/load_local.py`)
2. **GitHub Repositories:** Automated ingestion of public repositories and README files for `GITHUB_USERNAME` ("ravindidhananjana") via the GitHub REST API. VERIFIED (Source: `backend/app/ingestion/fetch_github.py`)

### Text Splitting & Embedding
- **Chunking Strategy:** `RecursiveCharacterTextSplitter` with a target chunk size of 400 characters and 50 characters overlap. Chunks are prepended with metadata (Title, Source, Type, URL). VERIFIED (Source: `backend/app/ingestion/chunker.py`)
- **Embedding Model:** `text-embedding-004` via Gemini API. VERIFIED (Source: `backend/app/config.py`, `backend/scripts/ingest_knowledge.py`)
- **Vector Storage:** FAISS `IndexFlatIP` index stored on disk in `backend/vector_store/index.faiss` along with chunk metadata in `chunks.json`. Embeddings are L2-normalized so inner product performs cosine similarity search. VERIFIED (Source: `backend/app/storage/faiss_store.py`)
- **Background Synchronization:** Triggered via `POST /api/sync` protected by an `X-Sync-Secret` header, which runs `scripts/ingest_knowledge.py` as an asynchronous background task. VERIFIED (Source: `backend/app/routers/sync.py`)

---

## RAG Pipeline & Agent Implementation

### Search & Deduplication
- **Query Embedding:** User queries are embedded via `text-embedding-004`. VERIFIED (Source: `backend/app/agent/retriever.py`)
- **Retrieval Limit:** Retrieves top candidate chunks (up to `MAX_RETRIEVAL_CHUNKS`, max 3). VERIFIED (Source: `backend/app/agent/retriever.py`, `backend/app/config.py`)
- **Deduplication:** Filters out near-duplicate chunks before building the context prompt based on text normalization and token overlap similarity threshold ($\ge 0.8$). VERIFIED (Source: `backend/app/agent/retriever.py`)

### Prompting & Grounding Rules
- **System Identity:** Agent "Elara", personal AI portfolio assistant for Ravindi Gunasekara. Speaks in first person for self ("I can tell you about...") and third person for Ravindi. VERIFIED (Source: `backend/app/agent/prompts.py`)
- **Grounding Rules:** Strict instruction to answer ONLY using verified context provided. Hallucination is strictly forbidden. Redirects out-of-scope trivia queries. VERIFIED (Source: `backend/app/agent/prompts.py`)

### Multi-Tiered LLM Fallback Chain
The agent (`LLMClientWithFallback`) sequentially attempts models to ensure high availability:
1. **Primary Gemini Model:** `gemini-2.0-flash` VERIFIED (Source: `backend/app/config.py`, `backend/app/agent/llm_client_fallback.py`)
2. **Gemini Fallbacks:** `gemini-1.5-flash`, `gemini-1.5-pro` VERIFIED (Source: `backend/app/config.py`)
3. **OpenRouter Free Fallbacks:** `meta-llama/llama-3.1-8b-instruct:free`, `google/gemma-2-9b-it:free`, `mistralai/mistral-7b-instruct:free` (if `OPENROUTER_API_KEY` is configured). VERIFIED (Source: `backend/app/config.py`, `backend/app/agent/llm_client_fallback.py`)

### Streaming Response
- Delivered via Server-Sent Events (SSE) from `POST /api/chat` emitting JSON tokens (`{"token": "..."}`) and closing with `data: [DONE]`. VERIFIED (Source: `backend/app/routers/chat.py`)

---

## Frontend Pages & User Experience

- **Home Page (`/`):** Hero section featuring Ravindi's background, quick links to projects, agent chat, CV, GitHub, LinkedIn, and Kaggle. VERIFIED (Source: `frontend/src/app/page.tsx`, `frontend/src/components/home/Hero.tsx`)
- **About Page (`/about`):** Details education at NIBM, technical focus areas, mission, and technical interests grid. VERIFIED (Source: `frontend/src/app/about/page.tsx`)
- **AI Agent Chat (`/agent`):** Dedicated chat interface connecting to the FastAPI backend, featuring Markdown rendering, suggested questions, stream buffer parsing, and chat reset capabilities. VERIFIED (Source: `frontend/src/app/agent/page.tsx`)
- **Projects Page (`/projects`):** Displays highlighted projects including Multimodal AML Classification, Lunar Landing Site Risk Analysis, and AI Clinical Case Simulator. VERIFIED (Source: `frontend/src/app/projects/page.tsx`, `frontend/src/data/projects.ts`)
- **AI Lab (`/lab`):** Experimental space highlighting ongoing/completed research projects like RAG pipelines, Vision Transformers, and Edge AI tracking. VERIFIED (Source: `frontend/src/app/lab/page.tsx`, `frontend/src/data/lab.ts`)
- **Resume Page (`/resume`):** Outlines education, categorized technical skills, and download link for CV. VERIFIED (Source: `frontend/src/app/resume/page.tsx`)
- **Contact Page (`/contact`):** Direct contact options (Email, Location, Socials), contact form, and CTA to Elara agent. VERIFIED (Source: `frontend/src/app/contact/page.tsx`)

---

## Key Results & Capabilities

- **Streaming RAG Integration:** Successfully streams responses token-by-token from Gemini/OpenRouter to Next.js frontend via SSE. VERIFIED (Source: `backend/app/routers/chat.py`, `frontend/src/app/agent/page.tsx`)
- **High Availability LLM Failover:** Prevents downtime during rate limits or API outages by falling back across 6 different models across 2 providers. VERIFIED (Source: `backend/app/agent/llm_client_fallback.py`)
- **Automatic Knowledge Refresh:** Reloads vector store state on disk per request and supports background ingestion syncs. VERIFIED (Source: `backend/app/agent/agent.py`, `backend/app/routers/sync.py`)

---

## Challenges & Solutions

| Challenge | Solution | Source / Evidence |
| :--- | :--- | :--- |
| **Gemini API Rate Limits / Quotas** | Implemented `asyncio.sleep(0.5)` during chunk ingestion and built a multi-model fallback chain to Gemini 1.5 models and OpenRouter free models. | VERIFIED (`backend/scripts/ingest_knowledge.py`, `backend/app/agent/llm_client_fallback.py`) |
| **Vector Search Duplication** | Developed custom token overlap and string normalization deduplication in `Retriever.retrieve()` to prevent duplicate context chunks from polluting the LLM prompt. | VERIFIED (`backend/app/agent/retriever.py`) |
| **LLM Chunk Dumping / Database Echoing** | Configured system prompt with explicit guidelines instructing Elara to synthesize facts conversationally without outputting chunk IDs or verbatim metadata. | VERIFIED (`backend/app/agent/prompts.py`) |
