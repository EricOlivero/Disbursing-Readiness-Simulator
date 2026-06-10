const CACHE_NAME = "drs-unit-pilot-v2-7-20260609";
const APP_SHELL = [
  "./unit-pilot-v2.html",
  "./unit-pilot-v2.css",
  "./facilitator-runbook.css",
  "./facilitator-assignment-board.css",
  "./facilitator-observation-rubric.css",
  "./pilot-readiness-audit.css",
  "./unit-pilot-polish.css",
  "./pilot-feedback.css",
  "./unit-pilot-v2.js",
  "./facilitator-runbook.js",
  "./facilitator-assignment-board.js",
  "./facilitator-observation-rubric.js",
  "./pilot-readiness-audit.js",
  "./pilot-feedback.js",
  "./manifest-v2.json",
  "./pilot-icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match("./unit-pilot-v2.html")))
  );
});
