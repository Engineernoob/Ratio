const CACHE_NAME = "ratio-mobile-v1";
const OFFLINE_CACHE = "ratio-offline-v1";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/oikos",
  "/bibliotheca",
  "/memoria",
  "/mentor",
  "/scholarivm",
  "/manifest.json",
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/memoria\/cards/,
  /\/api\/books\/.*/,
  /\/api\/feed\/.*/,
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== OFFLINE_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Try network with timeout
      return Promise.race([
        fetch(request),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 5000)
        ),
      ])
        .then((response) => {
          // Clone response for caching
          const responseToCache = response.clone();

          // Cache API responses for memoria and books
          if (
            API_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))
          ) {
            caches.open(OFFLINE_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          // Network failed - try offline cache
          if (request.destination === "document") {
            return caches.match("/");
          }
          return new Response("Offline", { status: 503 });
        });
    })
  );
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-memoria") {
    event.waitUntil(syncMemoria());
  }
});

async function syncMemoria() {
  // Sync memoria cards when back online
  try {
    const response = await fetch("/api/memoria/cards");
    if (response.ok) {
      const cache = await caches.open(OFFLINE_CACHE);
      await cache.put(new Request("/api/memoria/cards"), response.clone());
    }
  } catch (error) {
    console.error("Failed to sync memoria:", error);
  }
}
