# future: integrate Qdrant / Pinecone
class VectorDB:
    def __init__(self):
        self.storage = {}

    def add(self, key, vector):
        self.storage[key] = vector

    def get(self, key):
        return self.storage.get(key)

    def delete(self, key):
        if key in self.storage:
            del self.storage[key]