from fastapi import FastAPI
from routers import content, memoria, ml, analytics

app = FastAPI(
    title="Ratio Backend",
    description="API backend for Ratio personal intelligence engine",
    version="0.1.0"
)

app.include_router(content.router, prefix="/content", tags=["Content"])
app.include_router(memoria.router, prefix="/memoria", tags=["Memoria"])
app.include_router(ml.router, prefix="/ml", tags=["ML"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"status": "Ratio backend running"}
