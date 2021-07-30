//
const RES_CACHE_NAME = "data-cache-v1";
const API_CACHE_NAME = "api-cache-v1";
const RES_CACHE_FILES = [
  "/",
  "/index.html",
  "/dist/assets/js/app.bundle.js",
  "/dist/assets/js/chart.bundle.js",
  "/dist/assets/js/dom.bundle.js",
  "/dist/assets/js/db.bundle.js",
  "/dist/assets/css/styles.css",
  "/dist/assets/icons/icon_192x192.png",
  "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
];
//
// Install the service worker - Cache files
//
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(RES_CACHE_NAME)
      .then((cache) => cache.addAll(RES_CACHE_FILES))
      .then(self.skipWaiting())
  );
});
//
// Activate the service worker - Take care of cleaning up old caches
//
self.addEventListener("activate", (event) => {
  const currentCaches = [RES_CACHE_NAME, API_CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((keyList) => {
        return keyList.filter((key) => !currentCaches.includes(key));
      })
      .then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            return caches.delete(key);
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
  // Cache requests to the API
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches
        .open(API_CACHE_NAME)
        .then((cache) => {
          return fetch(event.request)
            .then((response) => {
              // Clone and store the response in the cache
              if (response.status === 200) {
                cache.put(event.request.url, response.clone());
              }
              return response;
            })
            .catch((error) => {
              // Try to get the response from the cache
              return cache.match(event.request);
            });
        })
        .catch((error) => console.log(error))
    );

    return;
  }
  // Cache requests to resources
  event.respondWith(
    caches.match(event.request).then((response) => {
      //return response || fetch(event.request);
      if (response) {
        return response;
      }

      return caches
        .open(API_CACHE_NAME)
        .then((cache) =>
          fetch(event.request).then((response) =>
            cache.put(event.request, response.clone()).then(() => response)
          )
        );
    })
  );
});
