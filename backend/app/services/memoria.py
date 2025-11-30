

from datetime import datetime, timedelta
from typing import Optional, List
from app.core.database import get_supabase
from app.core.config import USER_ID

supabase = get_supabase()

# ---------------------------------------------------------
# Memoria Service — Single User Mode (USER_ID injected)
# Spaced Repetition Engine (SM‑2 inspired)
# ---------------------------------------------------------

def _now_iso():
    return datetime.utcnow().isoformat()

# ---------------------------------------------------------
# Fetch all due cards for the single user
# ---------------------------------------------------------
async def get_due_cards() -> List[dict]:
    res = (
        supabase.table("memoria")
        .select("*")
        .eq("user_id", USER_ID)
        .lte("next_review", _now_iso())
        .order("next_review")
        .execute()
    )
    return res.data or []

# ---------------------------------------------------------
# Return the next due card
# ---------------------------------------------------------
async def get_next_card() -> Optional[dict]:
    due_cards = await get_due_cards()
    if not due_cards:
        return {
            "status": "no_due_cards",
            "message": "No cards due for review."
        }
    return due_cards[0]

# ---------------------------------------------------------
# Grade a card (difficulty 1–5)
# ---------------------------------------------------------
async def grade_card(card_id: str, difficulty: int):
    # Fetch card
    res = (
        supabase.table("memoria")
        .select("*")
        .eq("id", card_id)
        .single()
        .execute()
    )
    card = res.data
    if not card:
        return {"error": "Card not found"}

    # SM‑2 inspired interval logic
    if difficulty <= 2:
        interval = 1
    elif difficulty == 3:
        interval = 3
    elif difficulty == 4:
        interval = 7
    else:
        interval = 14

    next_review = datetime.utcnow() + timedelta(days=interval)

    update_res = (
        supabase.table("memoria")
        .update(
            {
                "difficulty": difficulty,
                "interval_days": interval,
                "last_review": _now_iso(),
                "next_review": next_review.isoformat(),
            }
        )
        .eq("id", card_id)
        .execute()
    )

    return {
        "status": "graded",
        "card_id": card_id,
        "difficulty": difficulty,
        "next_review": next_review.isoformat()
    }

# ---------------------------------------------------------
# Create a new card (Single User Mode)
# ---------------------------------------------------------
async def create_card(concept: str, question: str, answer: str):
    res = (
        supabase.table("memoria")
        .insert(
            {
                "user_id": USER_ID,
                "concept": concept,
                "question": question,
                "answer": answer,
                "difficulty": 3,
                "interval_days": 0,
                "last_review": _now_iso(),
                "next_review": _now_iso(),
            }
        )
        .execute()
    )
    return res.data