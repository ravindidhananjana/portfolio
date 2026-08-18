from fastapi import APIRouter, Header, HTTPException, BackgroundTasks
from app.config import settings
from scripts.ingest_knowledge import main as run_ingestion
import asyncio

router = APIRouter()
sync_lock = asyncio.Lock()

async def sync_task():
    async with sync_lock:
        try:
            print("Background sync: Starting knowledge ingestion...")
            await run_ingestion()
            print("Background sync: Ingestion complete.")
        except Exception as e:
            print(f"Background sync: Error during ingestion: {e}")

@router.post("/sync")
async def trigger_sync(
    background_tasks: BackgroundTasks,
    x_sync_secret: str | None = Header(None, alias="X-Sync-Secret")
):
    if not settings.SYNC_SECRET:
        raise HTTPException(status_code=500, detail="SYNC_SECRET is not configured on server")

    if x_sync_secret != settings.SYNC_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid sync secret")

    if sync_lock.locked():
        return {"status": "running", "message": "Sync is already in progress"}

    background_tasks.add_task(sync_task)
    return {"status": "initiated", "message": "Ingestion started in background"}
