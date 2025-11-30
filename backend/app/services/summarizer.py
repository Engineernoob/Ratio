from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def generate_micro_lessons(topic: str):
    summary = summarizer(topic, max_length=120, min_length=40, do_sample=False)
    return {
        "topic": topic,
        "summary": summary[0]["summary_text"],
        "steps": [
            "Definition",
            "Core Idea",
            "Example",
            "Counter Example",
            "Memory Hook"
        ]
    }