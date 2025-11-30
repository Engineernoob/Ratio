

from typing import Optional, List
from app.core.database import get_supabase

supabase = get_supabase()

# ---------------------------------------------------------
# Storage Service — Handles Supabase Storage Buckets
# ---------------------------------------------------------

async def upload_file(bucket: str, path: str, file_bytes: bytes, content_type: str = "application/octet-stream"):
    """
    Upload a file to a Supabase storage bucket.
    bucket: name of the bucket (books, notes, highlights, maps, puzzles, userdata)
    path:   file path within the bucket (e.g., "mybook/chapter1.json")
    """
    try:
        res = supabase.storage.from_(bucket).upload(path, file_bytes, {
            "content-type": content_type,
            "upsert": True
        })
        return {"status": "uploaded", "path": path, "bucket": bucket}
    except Exception as e:
        return {"error": str(e)}


async def list_files(bucket: str, folder: str = "") -> List[dict]:
    """
    List files in a bucket folder.
    folder: e.g. "mybook/" or "" for root
    """
    try:
        res = supabase.storage.from_(bucket).list(folder)
        return res
    except Exception as e:
        return {"error": str(e)}


async def download_file(bucket: str, path: str) -> Optional[bytes]:
    """
    Download a file from Supabase storage.
    Returns raw bytes if found.
    """
    try:
        res = supabase.storage.from_(bucket).download(path)
        return res
    except Exception as e:
        return None


async def delete_file(bucket: str, path: str):
    """
    Delete a file from a Supabase bucket.
    """
    try:
        res = supabase.storage.from_(bucket).remove([path])
        return {"status": "deleted", "path": path}
    except Exception as e:
        return {"error": str(e)}