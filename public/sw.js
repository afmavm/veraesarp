// Vera Eşarp Admin - Service Worker
// Caches admin routes for offline resilience and enables push notifications

const CACHE_NAME = 'vera-admin-v2';
const ADMIN_ROUTES = ['/admin', '/admin/', '/favicon.ico', '/logo.png', '/apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ADMIN_ROUTES).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle same-origin navigation requests for admin
  if (
    event.request.mode === 'navigate' &&
    event.request.url.includes('/admin')
  ) {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/admin').then((cached) => cached || Response.error())
      )
    );
  }
});

// Push Notification handler
self.addEventListener('push', (event) => {
  const data = event.data?.json?.() ?? { title: 'Vera Admin', body: 'Yeni bildirim var' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/apple-touch-icon.png',
      badge: '/favicon.ico',
      tag: data.tag || 'vera-admin',
      requireInteraction: data.requireInteraction ?? false,
      data: data,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const adminClient = clientList.find((c) => c.url.includes('/admin'));
      if (adminClient) return adminClient.focus();
      return clients.openWindow('/admin');
    })
  );
});
