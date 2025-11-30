from datetime import datetime, timedelta

def get_next_card():
    return {
        "id": "concept_001",
        "question": "What is first principles reasoning?",
        "due": datetime.now().isoformat()
    }

def grade_card(data):
    difficulty = data.get("difficulty", 3)

    # SM-2 inspired logic (very simplified)
    interval = 1 if difficulty < 3 else (3 if difficulty == 3 else 7)

    next_review = datetime.now() + timedelta(days=interval)

    return {
        "next_review": next_review.isoformat(),
        "interval_days": interval
    }