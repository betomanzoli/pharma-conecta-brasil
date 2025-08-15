
const CACHE_NAME = 'consolidation-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

const API_CACHE_NAME = 'api-cache-v1';
const CACHED_APIS = [
  '/api/dashboard/summary',
  '/api/user/profile',
  '/api/metrics'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with cache-first strategy for GET requests
  if (url.pathname.startsWith('/api/')) {
    if (request.method === 'GET' && CACHED_APIS.some(api => url.pathname.startsWith(api))) {
      event.respondWith(
        caches.open(API_CACHE_NAME).then((cache) => {
          return cache.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              // Serve from cache and update in background
              fetch(request).then((response) => {
                if (response.ok) {
                  cache.put(request, response.clone());
                }
              }).catch(() => {}); // Silent fail for background update
              return cachedResponse;
            }
            
            // Not in cache, fetch and cache
            return fetch(request).then((response) => {
              if (response.ok) {
                cache.put(request, response.clone());
              }
              return response;
            });
          });
        })
      );
    } else {
      // Non-cacheable API requests - network only
      event.respondWith(fetch(request));
    }
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request).then((response) => {
          // Cache successful responses for static assets
          if (response.ok && request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        if (request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Retry failed requests
      self.registration.sync.register('retry-failed-requests')
    );
  }
});
