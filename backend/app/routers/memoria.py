from fastapi import APIRouter
from app.services.memoria import (
    get_next_card,
    grade_card,
    create_card
)

router = APIRouter()

# ---------------------------------------------------------
# Memoria Router — Single User Mode (USER_ID handled in service)
# ---------------------------------------------------------

@router.get("/next")
async def next_card():
    """
    Return the next due Memoria card.
    """
    return await get_next_card()


@router.post("/grade")
async def grade(data: dict):
    """
    Grade a Memoria card.
    data = {
        "card_id": str,
        "difficulty": int (1–5)
    }
    """
    return await grade_card(
        data["card_id"],
        data["difficulty"]
    )


@router.post("/create")
async def create(data: dict):
    """
    Create a new Memoria card.
    data = {
        "concept": str,
        "question": str,
        "answer": str
    }
    """
    return await create_card(
        data["concept"],
        data["question"],
        data["answer"]
    )