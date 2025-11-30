from fastapi import APIRouter

router = APIRouter()

@router.get("/progress")
def progress():
    return {"progress": []}

@router.get("/retention")
def retention():
    return {"retention": {}}