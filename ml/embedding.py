import os
from typing import List
from dotenv import load_dotenv
import openai

# ---------------------------------------------------------
# Embedding Engine — Generates Embeddings for Ratio
# ---------------------------------------------------------

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("Missing OPENAI_API_KEY in environment variables.")

openai.api_key = OPENAI_API_KEY

# ---------------------------------------------------------
# Generate a single embedding vector
# ---------------------------------------------------------
async def get_embedding(text: str) -> List[float]:
    """
    Generates a semantic vector embedding from text.
    Uses the OpenAI 'text-embedding-3-large' model by default.
    """
    try:
        response = openai.embeddings.create(
            model="text-embedding-3-large",
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        print("Embedding error:", e)
        return []


# ---------------------------------------------------------
# Chunk text into smaller segments for long chapters
# ---------------------------------------------------------
def chunk_text(text: str, max_length: int = 750) -> List[str]:
    """
    Splits long text into chunks suitable for embeddings.
    """
    words = text.split()
    chunks = []
    current = []

    for word in words:
        current.append(word)
        if len(current) >= max_length:
            chunks.append(" ".join(current))
            current = []

    if current:
        chunks.append(" ".join(current))

    return chunks


# ---------------------------------------------------------
# Average multiple embeddings (for chunked chapters)
# ---------------------------------------------------------
def average_embeddings(embeddings: List[List[float]]) -> List[float]:
    if not embeddings:
        return []

    dim = len(embeddings[0])
    avg = [0.0] * dim

    for vec in embeddings:
        for i, val in enumerate(vec):
            avg[i] += val

    return [v / len(embeddings) for v in avg]


# ---------------------------------------------------------
# Full pipeline: chapter → chunks → embeddings → averaged vector
# ---------------------------------------------------------
async def embed_chapter(text: str) -> List[float]:
    chunks = chunk_text(text)
    vectors = []

    for chunk in chunks:
        vec = await get_embedding(chunk)
        if vec:
            vectors.append(vec)

    return average_embeddings(vectors)
