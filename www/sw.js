const CACHE_NAME = 'toponote-v00';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/vendor/tailwind.js',
  '/vendor/leaflet/leaflet.js',
  '/vendor/leaflet/leaflet.css',
  '/vendor/jszip.min.js',
  '/vendor/pdfjs/pdf.min.js',
  '/vendor/fontawesome/css/all.min.css'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of ASSETS_TO_CACHE) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn('Cache ignorou:', asset, err);
        }
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put('/', copy.clone());
              cache.put('/index.html', copy.clone());
              cache.put(event.request, copy);
            });
          }
          return response;
        })
        .catch(async () => {
          return (await caches.match(event.request)) ||
                 (await caches.match('/')) ||
                 (await caches.match('/index.html')) ||
                 new Response('<!DOCTYPE html><html><body style="background:#09090b;color:#f4f4f5;font-family:sans-serif;padding:2rem;"><h2>TopoNote Offline</h2><p>Abra com internet uma vez para salvar o cache local.</p></body></html>', {
                   headers: { 'Content-Type': 'text/html; charset=utf-8' }
                 });
        })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        });
      })
    );
  }
});
