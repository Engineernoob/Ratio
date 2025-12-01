const BASE_URL = process.env.NEXT_PUBLIC_RATIO_BACKEND!;

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store", // important for SSR freshness
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ------------------------------
// Books
// ------------------------------
export const BooksAPI = {
  list: () => request("/books/list"),
  get: (id: string) => request(`/books/${id}`),
  chapters: (id: string) => request(`/books/${id}/chapters`),
  chapter: (id: string, num: number) => request(`/books/${id}/${num}`),
};

// ------------------------------
// Memoria (Personal Memory Engine)
// ------------------------------
export const MemoriaAPI = {
  next: () => request("/memoria/next"),
  grade: (card_id: string, difficulty: number) =>
    request("/memoria/grade", {
      method: "POST",
      body: JSON.stringify({ card_id, difficulty }),
    }),
  create: (concept: string, question: string, answer: string) =>
    request("/memoria/create", {
      method: "POST",
      body: JSON.stringify({ concept, question, answer }),
    }),
};

// ------------------------------
// Progress
// ------------------------------
export const ProgressAPI = {
  log: (type: string, score = 0, duration = 0) =>
    request("/progress/log", {
      method: "POST",
      body: JSON.stringify({ session_type: type, score, duration }),
    }),
  daily: () => request("/progress/daily"),
  streak: () => request("/progress/streak"),
};

// ------------------------------
// ML Engine
// ------------------------------
export const MLAPI = {
  embed: (text: string) =>
    request("/ml/embed", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  embedChapter: (chapter_id: string, text: string, save = false) =>
    request("/ml/embed-chapter", {
      method: "POST",
      body: JSON.stringify({ chapter_id, text, save }),
    }),
};
