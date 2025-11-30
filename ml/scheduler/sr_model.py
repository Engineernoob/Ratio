# Placeholder for long-term SR engine
class SpacingModel:
    def schedule(self, difficulty):
        if difficulty < 3:
            return 1
        elif difficulty == 3:
            return 3
        return 7