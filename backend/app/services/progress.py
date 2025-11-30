

from datetime import datetime, timedelta
from typing import Optional, List
from app.core.database import get_supabase
from app.core.config import USER_ID

supabase = get_supabase()

# ---------------------------------------------------------
# Progress Service — Tracks User Sessions, Activity & Streaks
# ---------------------------------------------------------

def _now_iso():
    return datetime.utcnow().isoformat()


# ---------------------------------------------------------
# Log a study session
# ---------------------------------------------------------
async def log_session(session_type: str, score: int = 0, duration: int = 0):
    """
    Log a user activity session.
    session_type: memoria | reading | logic | ritual | oikos
    duration: seconds
    """
    res = (
        supabase.table("progress_sessions")
        .insert(
            {
                "user_id": USER_ID,
                "session_type": session_type,
                "score": score,
                "duration": duration,
                "timestamp": _now_iso(),
            }
        )
        .execute()
    )
    return res.data


# ---------------------------------------------------------
# Get all sessions for a specific day
# ---------------------------------------------------------
async def get_daily_stats(day: Optional[str] = None) -> List[dict]:
    """
    day: "2025-11-30" format, defaults to today UTC.
    """

    if day is None:
        day = datetime.utcnow().strftime("%Y-%m-%d")

    start = f"{day}T00:00:00"
    end = f"{day}T23:59:59"

    res = (
        supabase.table("progress_sessions")
        .select("*")
        .eq("user_id", USER_ID)
        .gte("timestamp", start)
        .lte("timestamp", end)
        .order("timestamp")
        .execute()
    )
    return res.data or []


# ---------------------------------------------------------
# Calculate streak: consecutive days with activity
# ---------------------------------------------------------
async def get_streak() -> dict:
    """
    A streak is counted if the user has ANY logged activity for that day.
    """

    # Fetch last 30 days of activity
    today = datetime.utcnow().date()
    start = today - timedelta(days=30)

    res = (
        supabase.table("progress_sessions")
        .select("timestamp")
        .eq("user_id", USER_ID)
        .gte("timestamp", start.isoformat())
        .execute()
    )

    if not res.data:
        return {"streak": 0, "active_days": []}

    # Convert timestamps → date set
    activity_dates = {datetime.fromisoformat(x["timestamp"]).date() for x in res.data}

    streak = 0
    current = today

    # Count backward until a day has no activity
    while current in activity_dates:
        streak += 1
        current -= timedelta(days=1)

    return {"streak": streak, "active_days": sorted(list(activity_dates))}