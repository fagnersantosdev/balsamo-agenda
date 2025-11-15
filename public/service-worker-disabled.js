// ✅ service-worker.js — cache básico do PWA Bálsamo Massoterapia

const CACHE_NAME = "balsamo-cache-v1";
const URLS_TO_CACHE = [
  "/", // página inicial
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// Instala o service worker e armazena os arquivos no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// Ativa o SW e remove caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Intercepta requisições e serve conteúdo do cache quando offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) => response || fetch(event.request)
    )
  );
});
