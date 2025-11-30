⸻
RATIO — SYSTEM ARCHITECTURE

A cognitive computing platform engineered by Taahirah Denmark

Ratio is a modular intelligence engine built using a monorepo architecture.
It blends UI, data modeling, ML inference, cognitive-science algorithms, and personalized learning flows.

This document outlines the technical structure and the interactions between components.
⸻
🏛 High-Level Architecture Diagram

                         ┌──────────────────────────┐
                         │        FRONTEND          │  │
                         │      (Next.js 15)        │  │
                         └────────────┬─────────────┘
                                      │
             User Interaction (Learn / Understand / Retain)
                                      │
                                      ▼

┌────────────────────────────────────────────────────────────────────────┐
│ BACKEND APIs │
│ (FastAPI / Node.js) │
│ │
│ ┌────────────────┐ ┌──────────────────┐ ┌────────────────────┐ │
│ │ Content API │←→│ Memoria API │←→ │ Analytics Engine │ │
│ └────────────────┘ └──────────────────┘ └────────────────────┘ │
│ │ │ │ │
└─────────┼───────────────────────┼────────────────────────┼────────────┘
│ │ │
▼ ▼ ▼
┌────────────────┐ ┌─────────────────────┐ ┌────────────────────────┐
│ ML Engine │ │ Spaced Repetition │ │ Vector Database / DB │
│ (embeddings) │ │ Scheduler (SR) │ │ (Postgres / Qdrant) │
└────────────────┘ └─────────────────────┘ └────────────────────────┘
⸻
🧠 Subsystems

1. Frontend (web/)
   • Next.js 15
   • React Server Components
   • TailwindCSS
   • Zustand / Context
   • Local vector-like memory for client-side caching
   • Renders:
   • Oikos feed
   • Bibliotheca (library)
   • Memoria (flashcards)
   • Laboratorivm (reasoning gym)

The frontend is a cognitive UX layer, not just UI — designed to reinforce focus, clarity, and retention.
⸻

2. Backend (backend/)

The backend (planned FastAPI) manages all data-driven and ML-driven operations.

Responsibilities:
• Handling user profiles
• Fetching and storing book chapters
• Generating micro-lessons
• Serving spaced-repetition prompts
• Running ML inference endpoints
• Storing learning metrics

Example services:

/content/get
/content/summarize
/memoria/review
/memoria/next
/ml/embed
/analytics/progress

⸻

3. Machine Learning Engine (ml/)

This is the heart of Ratio’s intelligence.

Modules:

embeddings/
• Concept encoding
• Text → vector space
• Similarity scoring
• Clustering for topic grouping

scheduler/
• Spaced repetition model
• Based on SM-2, Bayesian Knowledge Tracing
• Difficulty adaptive scheduling
• Forgetting curve predictions

models/
• LLM calls
• Concept decomposition
• Micro-lesson generation

⸻

4. Data Layer

PostgreSQL or Supabase
• User data
• Study sessions
• Book metadata
• Ritual configurations

Vector Database (Qdrant, Pinecone)
• Store concept embeddings
• Enable semantic retrieval
• Provide “memory palace map”

⸻

5. Mobile (mobile/)

Optional future system:
• Standalone Expo/React Native app
• Integrates with backend APIs
• Local caching for offline study

⸻

6. Scripts & Tooling (scripts/)
   • Build automation
   • Deployment scripts
   • Cron jobs for scheduled reviews
   • Embedding cleanup tasks

⸻

🔄 Data Flow Example (Memoria)

User → Web UI → Memoria API → SR Engine → Next Concept → Web UI → User

This creates a closed cognitive loop, where the system continuously adapts to the learner.

⸻

🧩 Conclusion

Ratio’s architecture is intentionally modular, allowing independent evolution of UI, backend services, ML engines, and cognitive modules.
It is both an engineering project and a research environment.
⸻
