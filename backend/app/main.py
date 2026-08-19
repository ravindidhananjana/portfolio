from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import chat, sync
from app.agent.agent import ElaraAgent


# Global agent instance for lifespan management
_agent: ElaraAgent | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    global _agent
    _agent = ElaraAgent()
    # Make agent accessible to routers
    chat.agent = _agent
    yield
    # Cleanup on shutdown
    if _agent:
        await _agent.close()


app = FastAPI(title="Elara Portfolio Agent Backend", version="1.0.0", lifespan=lifespan)

# CORS configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(sync.router, prefix="/api", tags=["sync"])

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "agent": "Elara",
        "version": "1.0.0"
    }
