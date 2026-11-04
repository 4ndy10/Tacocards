// ponytail: Simple cache-first static service worker. No build tools needed.
const CACHE_NAME = 'tacocards-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/app.js',
  '/js/router.js',
  '/js/state.js',
  '/js/data/mockData.js',
  '/js/components/Icon.js',
  '/js/components/Button.js',
  '/js/components/TradingCard.js',
  '/js/components/FakeQR.js',
  '/js/components/DevModal.js',
  '/js/views/consumer/ConsumerNav.js',
  '/js/views/consumer/MapView.js',
  '/js/views/consumer/DetailView.js',
  '/js/views/consumer/ScanView.js',
  '/js/views/consumer/AlbumView.js',
  '/js/views/consumer/LoyaltyView.js',
  '/js/views/consumer/ProfileView.js',
  '/js/views/business/BusinessNav.js',
  '/js/views/business/Dashboard.js',
  '/js/views/business/RedeemPage.js',
  '/js/views/business/LoyaltyPage.js',
  '/js/views/business/QrPage.js',
  '/js/views/business/PlanPage.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Pre-cache warning (some files may be cached on demand):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Network-first for HTML, Cache-first for static assets
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((res) => res || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      });
    })
  );
});
