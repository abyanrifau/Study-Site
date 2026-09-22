/*
 * Offline support.
 *
 * Strategy:
 *   - Pages and data: network first, fall back to the cache. So you always get
 *     fresh content when online, and everything you have opened before still
 *     works on a plane or with no signal.
 *   - Build assets and icons: cache first, because their names change when they
 *     change.
 *   - Past paper PDFs: cache first once opened, so a paper you have read is
 *     available offline. They are big, so they are only cached on first open,
 *     never pre-cached.
 */
const VERSION = "ial-revision-v2";
const CORE = `${VERSION}-core`;
const PAGES = `${VERSION}-pages`;
const ASSETS = `${VERSION}-assets`;
const PDFS = `${VERSION}-pdfs`;

const CORE_URLS = [
  "/",
  "/units",
  "/practice",
  "/papers",
  "/progress",
  "/plan",
  "/settings",
  "/search",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CORE)
      .then((cache) => cache.addAll(CORE_URLS).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".svg")
  );
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone());
  return res;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(request);
    if (hit) return hit;
    // A navigation with nothing cached: fall back to the home page shell.
    if (request.mode === "navigate") {
      const core = await caches.open(CORE);
      const home = await core.match("/");
      if (home) return home;
    }
    throw err;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isAsset(url)) {
    event.respondWith(cacheFirst(request, ASSETS));
    return;
  }
  if (url.pathname.startsWith("/papers/") && url.pathname.endsWith(".pdf")) {
    event.respondWith(cacheFirst(request, PDFS));
    return;
  }
  if (url.pathname.startsWith("/data/")) {
    event.respondWith(networkFirst(request, PAGES));
    return;
  }
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(networkFirst(request, PAGES));
  }
});
