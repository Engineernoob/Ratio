from fastapi import APIRouter
from app.services.books import (
    get_books,
    get_book,
    get_chapters,
    get_chapter,
    save_chapter_embedding,
    search_chapters_by_embedding
)

router = APIRouter()

# ---------------------------------------------------------
# Books Router — Bibliotheca System for Ratio
# ---------------------------------------------------------

@router.get("/list")
async def list_books():
    """Return all books in the library."""
    return await get_books()


@router.get("/{book_id}")
async def fetch_book(book_id: str):
    """Get metadata for a specific book."""
    return await get_book(book_id)


@router.get("/{book_id}/chapters")
async def fetch_chapters(book_id: str):
    """Return all chapters of a book."""
    return await get_chapters(book_id)


@router.get("/{book_id}/{chapter_number}")
async def fetch_single_chapter(book_id: str, chapter_number: int):
    """Get a specific chapter."""
    return await get_chapter(book_id, chapter_number)


@router.post("/embed/{chapter_id}")
async def embed_chapter(chapter_id: str, data: dict):
    """
    Save a chapter embedding vector.
    data = {
        "embedding": [...]
    }
    """
    return await save_chapter_embedding(chapter_id, data.get("embedding", []))


@router.post("/search")
async def chapter_search(data: dict):
    """
    Search chapters semantically using embeddings.
    data = {
        "embedding": [...],
        "limit": 5
    }
    """
    return await search_chapters_by_embedding(
        data["embedding"],
        data.get("limit", 5)
    )
