from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.agent.agent import ElaraAgent
import json
import asyncio

router = APIRouter()
agent = ElaraAgent()

class ChatRequest(BaseModel):
    query: str

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    async def event_generator():
        try:
            # Reload knowledge vector store in case index was refreshed
            agent.reload_knowledge()

            # Stream tokens
            async for token in agent.answer_stream(request.query):
                yield f"data: {json.dumps({'token': token})}\n\n"
                await asyncio.sleep(0.01)

            # Signal stream completion
            yield "data: [DONE]\n\n"
        except Exception as e:
            print(f"Chat stream error: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
