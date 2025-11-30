from fastapi import APIRouter
from services.spacing import get_next_card, grade_card

router = APIRouter()

@router.get("/next")
def next_card():
    return get_next_card()

@router.post("/grade")
def grade(data: dict):
    return grade_card(data)

@router.get("/stats")
def stats():
    return {"retention": 0.87, "streak": 12}