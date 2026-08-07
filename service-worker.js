"use strict";

const BUILD_VERSION = "36";
const CACHE_NAME = "el-jefe-jacks-trainer-v36";
const APP_SHELL = [
  "./index.html",
  "./styles.css?v=36",
  "./app.js?v=36",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./og-jacks-or-better.png",
  "./favicon-64.png",
  "./jefe-crest.svg",
  "./JacksOrBetterStrategy.json"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", event => {
  const data = event.data || {};
  if (data.type === "GET_VERSION") {
    const port = event.ports && event.ports[0];
    if (port) port.postMessage({ version: BUILD_VERSION });
    return;
  }
  if (data.type === "SKIP_WAITING") self.skipWaiting();
});

function cacheResponse(request, response, cacheKey = request) {
  if (!response || !response.ok) return response;
  const copy = response.clone();
  caches.open(CACHE_NAME).then(cache => cache.put(cacheKey, copy)).catch(() => {});
  return response;
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => cacheResponse(event.request, response, "./index.html"))
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  const url = new URL(event.request.url);
  const isVersionedCode = url.pathname.endsWith("/app.js") || url.pathname.endsWith("/styles.css");
  if (isVersionedCode) {
    event.respondWith(
      fetch(event.request)
        .then(response => cacheResponse(event.request, response))
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached ||
      fetch(event.request).then(response => cacheResponse(event.request, response))
    )
  );
});
