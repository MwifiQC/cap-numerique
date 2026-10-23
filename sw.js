// Service Worker Cap Numérique v2 - Cache hors-ligne pour fonctionnement PWA
const CACHE_NAME = 'cap-numerique-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './blog.html',
  './site.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        if (event.request.url.includes('blog')) {
          return caches.match('./blog.html');
        }
        return caches.match('./index.html');
      });
    })
  );
});
