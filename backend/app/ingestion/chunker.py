import re

class RecursiveCharacterTextSplitter:
    def __init__(self, chunk_size: int = 400, chunk_overlap: int = 50, separators: list[str] = None):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = separators or ["\n\n", "\n", " ", ""]

    def split_text(self, text: str) -> list[str]:
        if not text:
            return []

        def _split(text_to_split: str, separators: list[str]) -> list[str]:
            if len(text_to_split) <= self.chunk_size:
                return [text_to_split]

            if not separators:
                # Force chunk by character count if no separators left
                return [text_to_split[i : i + self.chunk_size] for i in range(0, len(text_to_split), self.chunk_size)]

            separator = separators[0]
            # Special case for empty string separator
            splits = text_to_split.split(separator) if separator else list(text_to_split)

            final_splits = []
            current_chunk = ""

            for part in splits:
                test_len = len(current_chunk) + len(part) + len(separator) if current_chunk else len(part)
                if test_len <= self.chunk_size:
                    if current_chunk:
                        current_chunk += separator + part
                    else:
                        current_chunk = part
                else:
                    if current_chunk:
                        final_splits.append(current_chunk)
                    if len(part) > self.chunk_size:
                        sub_splits = _split(part, separators[1:])
                        final_splits.extend(sub_splits[:-1])
                        current_chunk = sub_splits[-1]
                    else:
                        current_chunk = part

            if current_chunk:
                final_splits.append(current_chunk)

            return final_splits

        raw_chunks = _split(text, self.separators)

        # Merge chunks with overlap
        merged_chunks = []
        current_chunk = ""

        for rc in raw_chunks:
            if not current_chunk:
                current_chunk = rc
            elif len(current_chunk) + len(rc) + 1 <= self.chunk_size:
                current_chunk += "\n" + rc
            else:
                merged_chunks.append(current_chunk)
                overlap_len = min(self.chunk_overlap, len(current_chunk))
                overlap_text = current_chunk[-overlap_len:]
                space_idx = overlap_text.find(" ")
                if space_idx != -1:
                    overlap_text = overlap_text[space_idx:]
                current_chunk = (overlap_text + "\n" + rc).strip()

        if current_chunk:
            merged_chunks.append(current_chunk)

        return [c.strip() for c in merged_chunks if c.strip()]

def chunk_document(doc: dict, chunk_size: int = 400, chunk_overlap: int = 50) -> list[dict]:
    """
    Chunks a document structure.
    Expected doc: { "title": str, "content": str, "source": str, "type": str, "url": str }
    """
    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    content = doc.get("content", "")
    title = doc.get("title", "")
    source = doc.get("source", "")
    doc_type = doc.get("type", "")
    url = doc.get("url", "")

    # Prepend title and context metadata to content to help RAG context retrieval relevance
    context_prefix = f"Document Title: {title}\nSource: {source}\nType: {doc_type}\nURL: {url}\n\n"
    chunks = splitter.split_text(content)

    result_chunks = []
    for idx, text in enumerate(chunks):
        # We store both the full formatted chunk text (for embedding and LLM prompt context)
        # and individual fields.
        full_text = f"Context Source: {source} ({doc_type})\nTitle: {title}\nURL: {url}\nContent Chunk:\n{text}"
        result_chunks.append({
            "text": full_text,
            "metadata": {
                "source": source,
                "title": title,
                "type": doc_type,
                "url": url,
                "chunk_index": idx
            }
        })
    return result_chunks
