from fastapi import APIRouter

router = APIRouter()

@router.get("/book/{book_id}")
def get_book(book_id: str):
    return {"book_id": book_id, "status": "ok"}

@router.get("/chapter/{chapter_id}")
def get_chapter(chapter_id: str):
    return {"chapter_id": chapter_id}

@router.post("/summarize")
def summarize_chapter(data: dict):
    # later: call ML summarizer
    return {"summary": "placeholder summary"}