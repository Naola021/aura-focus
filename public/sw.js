const CACHE_NAME = "aura-offline-v1";

const PRECACHE_ASSETS = [
  "/",
  "/focus",
  "/manifest.json",
  "/aura-logo.png",
  "/aura-guy.jpg",
];

// Install: Cache core HTML shell and critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Remove stale older caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first for navigation, cache-first for static assets, offline fallback
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension / API requests
  if (request.method !== "GET" || url.pathname.startsWith("/api/")) {
    return;
  }

  // HTML page navigations (opening app offline)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          // Offline navigation fallback: serve cached /focus page
          const cache = await caches.open(CACHE_NAME);
          const cachedFocus = await cache.match("/focus");
          if (cachedFocus) return cachedFocus;
          const cachedHome = await cache.match("/");
          if (cachedHome) return cachedHome;
          return new Response("Aura is ready offline", {
            headers: { "Content-Type": "text/html" },
          });
        })
    );
    return;
  }

  // Static assets (Next.js chunks, fonts, images, css)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Background revalidation
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default: Try network first, then cache
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
