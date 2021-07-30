//
const CACHE_NAME = "cache-v1";
const RUNTIME = "runtime";
const CACHE_FILES = [
  "/",
  "/index.html",
  "/dist/assets/js/app.bundle.js",
  "/dist/assets/js/chart.bundle.js",
  "/dist/assets/js/dom.bundle.js",
  "/dist/assets/css/styles.css",
  "/dist/assets/icons/icon_192x192.png",
  "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  //"https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
  //"https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
];
//
// Install the service worker - Cache files
//
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CACHE_FILES))
      .then(self.skipWaiting())
  );
});
//
// Activate the service worker - Take care of cleaning up old caches
//
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});
//
//  Fetch a resource from the server or from cache
//
self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then((cache) => {
          return fetch(event.request).then((response) => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
