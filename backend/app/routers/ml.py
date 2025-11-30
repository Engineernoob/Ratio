from fastapi import APIRouter
from services.embeddings import embed_text
from services.summarizer import generate_micro_lessons

router = APIRouter()

@router.post("/embed")
def embed(data: dict):
    text = data.get("text", "")
    return {"vector": embed_text(text)}

@router.post("/decompose")
def decompose(data: dict):
    topic = data.get("topic", "")
    return generate_micro_lessons(topic)

@router.post("/search")
def search(data: dict):
    return {"results": []}