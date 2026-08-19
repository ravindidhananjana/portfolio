from app.agent.llm_client_fallback import LLMClientWithFallback
from app.agent.retriever import Retriever
from app.agent.prompts import build_agent_prompt

class ElaraAgent:
    def __init__(self):
        self.llm_client = LLMClientWithFallback()
        self.retriever = Retriever(self.llm_client)

    def reload_knowledge(self):
        """Reload vector store index."""
        self.retriever.reload()

    async def answer_stream(self, query: str):
        """
        Retrieves context, constructs prompt, and yields streamed tokens.
        Automatically falls back through Gemini models, then OpenRouter free models.
        """
        # 1. Retrieve context chunks from FAISS
        chunks = await self.retriever.retrieve(query)

        # 2. Build prompt with grounding context
        prompt = build_agent_prompt(query, chunks)

        # 3. Stream tokens from LLM client with fallback
        async for token in self.llm_client.generate_stream(prompt):
            yield token

    async def close(self):
        """Close underlying HTTP connections."""
        await self.llm_client.close()
