class LessonGenerator:
    def decompose_topic(self, topic):
        return [
            "Definition",
            "Core Principle",
            "Key Example",
            "Counterexample",
            "Memory Hook",
        ]

    def generate_lesson(self, topic):
        decomposed_topic = self.decompose_topic(topic)
        lesson = {}
        for sub_topic in decomposed_topic:
            lesson[sub_topic] = ""
        return lesson