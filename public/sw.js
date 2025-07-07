// Service Worker para PWA - PharmaNet Brasil
const CACHE_NAME = 'pharmanet-v1.0.0';
const API_CACHE = 'pharmanet-api-v1';

// Recursos essenciais para cache
const ESSENTIAL_RESOURCES = [
  '/',
  '/auth',
  '/dashboard',
  '/network',
  '/marketplace',
  '/mentorship',
  '/forums',
  '/knowledge',
  '/analytics',
  '/reports',
  '/notifications',
  '/manifest.json',
  '/favicon.ico'
];

// URLs de API para cache estratégico
const API_ENDPOINTS = [
  '/api/profiles',
  '/api/notifications',
  '/api/companies',
  '/api/laboratories',
  '/api/consultants'
];

// Install - Cachear recursos essenciais
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching essential resources');
        return cache.addAll(ESSENTIAL_RESOURCES);
      })
      .then(() => {
        console.log('[SW] Install complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Install failed:', error);
      })
  );
});

// Activate - Limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch - Estratégia de cache inteligente
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar extensões do browser e requests externos não relacionados
  if (
    !url.origin.includes('localhost') && 
    !url.origin.includes('lovableproject.com') &&
    !url.origin.includes('supabase.co')
  ) {
    return;
  }

  // Estratégia para recursos estáticos
  if (request.method === 'GET' && isStaticResource(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Estratégia para API calls do Supabase
  if (url.origin.includes('supabase.co')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Estratégia para páginas da aplicação
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // Default: network first
  event.respondWith(networkFirstStrategy(request));
});

// Cache First - Para recursos estáticos
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return new Response('Offline - recurso não disponível', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network First - Para dados dinâmicos
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache API responses se forem bem sucedidas
    if (networkResponse.ok && isApiRequest(request.url)) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(JSON.stringify({ 
      error: 'Offline - dados não disponíveis',
      offline: true 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Network First com Fallback Offline
async function networkFirstWithOfflineFallback(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('[SW] Navigation offline, serving cached page');
    
    // Tentar servir a página cached
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para página offline personalizada
    const offlineResponse = await caches.match('/');
    return offlineResponse || new Response('App offline', { 
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Helpers
function isStaticResource(pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

function isApiRequest(url) {
  return url.includes('supabase.co') || API_ENDPOINTS.some(endpoint => url.includes(endpoint));
}

// Background Sync para when online
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  try {
    console.log('[SW] Syncing notifications...');
    // Implementar sync de notificações quando voltar online
  } catch (error) {
    console.error('[SW] Notification sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do PharmaNet',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Detalhes',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('PharmaNet Brasil', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/notifications')
    );
  }
});

console.log('[SW] Service Worker registered successfully');