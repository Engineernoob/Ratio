⸻

RATIO — API SPECIFICATION (DRAFT)

This document outlines backend routes for Ratio once the FastAPI backend is implemented.

⸻

Content API

GET /content/book/:id
GET /content/chapter/:id
POST /content/summarize

⸻

Memoria API

GET /memoria/next
POST /memoria/grade
GET /memoria/stats

⸻

ML API

POST /ml/embed → returns vector embeddings
POST /ml/decompose → breaks topics into micro-lessons
POST /ml/search → semantic search via embeddings

⸻

Analytics API

GET /analytics/progress
GET /analytics/streaks
GET /analytics/retention

⸻
