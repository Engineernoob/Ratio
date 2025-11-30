

from typing import List, Optional
from app.core.database import get_supabase

supabase = get_supabase()

# -----------------------------
# Books Service
# -----------------------------

async def get_books() -> List[dict]:
    res = supabase.table('books').select('*').execute()
    return res.data or []

async def get_book(book_id: str) -> Optional[dict]:
    res = (
        supabase.table('books')
        .select('*')
        .eq('id', book_id)
        .single()
        .execute()
    )
    return res.data

async def get_chapters(book_id: str) -> List[dict]:
    res = (
        supabase.table('chapters')
        .select('*')
        .eq('book_id', book_id)
        .order('chapter_number')
        .execute()
    )
    return res.data or []

async def get_chapter(book_id: str, chapter_number: int) -> Optional[dict]:
    res = (
        supabase.table('chapters')
        .select('*')
        .eq('book_id', book_id)
        .eq('chapter_number', chapter_number)
        .single()
        .execute()
    )
    return res.data

async def save_chapter_embedding(chapter_id: str, embedding: list):
    res = (
        supabase.table('chapters')
        .update({'embedding': embedding})
        .eq('id', chapter_id)
        .execute()
    )
    return res.data

async def search_chapters_by_embedding(embedding: list, limit: int = 5):
    # Requires pgvector + function match_chapters in Supabase
    res = supabase.rpc(
        'match_chapters',
        {
            'query_embedding': embedding,
            'match_limit': limit
        }
    ).execute()
    return res.data or []