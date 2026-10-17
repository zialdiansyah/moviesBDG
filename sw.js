const CACHE_NAME = 'bioskop-v2';

const PRECACHE_URLS = [
  './',
  './index.html',
  './bioskop.html',
  './manifest.json',
  './css/style.css',
  './css/map.css',
  './js/data.js',
  './js/state.js',
  './js/tmdb.js',
  './js/ui.js',
  './js/pwa.js',
  './js/home.js',
  './js/cinema.js',
  './img/empire.jpg',
  './img/ciwalk.jpg',
  './img/btc.jpg',
  './img/braga.jpg',
  './img/fcl.jpg',
  './img/icon-192x192.png',
  './img/icon-512x512.png',
  './favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // TMDB, map tiles, and CDN assets are cross-origin: let the browser handle them.
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }
  event.respondWith(cacheFirst(request));
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = (await cache.match(request)) || (await cache.match('./index.html'));
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) {
    refreshCache(cache, request);
    return cached;
  }
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

function refreshCache(cache, request) {
  fetch(request)
    .then((response) => {
      if (response.ok) return cache.put(request, response);
    })
    .catch(() => {
      // Offline: keep serving the cached copy.
    });
}
