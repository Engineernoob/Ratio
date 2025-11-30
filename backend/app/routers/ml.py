from fastapi import APIRouter
from ml.embedding import (
    get_embedding,
    chunk_text,
    embed_chapter
)
from app.services.books import save_chapter_embedding

router = APIRouter()

# ---------------------------------------------------------
# ML Router — Embeddings, Chunking, Summaries, AI Ops
# ---------------------------------------------------------

@router.post("/embed")
async def embed_text(data: dict):
    """
    Generate an embedding vector for a piece of text.
    data = { "text": "..." }
    """
    text = data.get("text", "")
    vector = await get_embedding(text)
    return {"embedding": vector}


@router.post("/chunk")
async def chunk(data: dict):
    """
    Split text into AI-friendly chunks.
    data = { "text": "long text...", "max_length": 750 }
    """
    text = data.get("text", "")
    max_len = data.get("max_length", 750)
    chunks = chunk_text(text, max_len)
    return {"chunks": chunks}


@router.post("/embed-chapter")
async def embed_full_chapter(data: dict):
    """
    Full pipeline: chapter text → chunk → embeddings → averaged vector.
    Optionally saves the vector into the database.
    
    data = {
        "chapter_id": str,
        "text": str,
        "save": bool
    }
    """
    chapter_id = data.get("chapter_id")
    text = data.get("text", "")
    save = data.get("save", False)

    vector = await embed_chapter(text)

    if save and chapter_id:
        await save_chapter_embedding(chapter_id, vector)

    return {
        "chapter_id": chapter_id,
        "embedding": vector,
        "saved": save
    }


@router.post("/similarity")
async def similarity(data: dict):
    """
    Endpoint reserved for future semantic similarity / ranking.
    """
    return {
        "status": "not_implemented",
        "message": "Semantic similarity comparator will be added in Phase 4."
    }