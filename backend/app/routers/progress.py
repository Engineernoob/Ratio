from fastapi import APIRouter
from app.services.progress import (
    log_session,
    get_daily_stats,
    get_streak
)
from app.core.config import USER_ID

router = APIRouter()

# ---------------------------------------------------------
# Progress Router — Exposes Study & Learning Analytics
# ---------------------------------------------------------

@router.post("/log")
async def log_activity(data: dict):
    """
    Log a user session.
    data = {
        "session_type": "reading" | "memoria" | "logic" | "oikos" | "ritual",
        "score": int,
        "duration": int (seconds)
    }
    """
    return await log_session(
        data["session_type"],
        data.get("score", 0),
        data.get("duration", 0)
    )


@router.get("/daily")
async def daily_stats():
    """
    Get all activity for the current day.
    """
    return await get_daily_stats()


@router.get("/streak")
async def streak():
    """
    Return the user's reading/study streak.
    """
    return await get_streak()