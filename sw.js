const OFFLINE_VERSION = 1;
const CACHE_NAME = 'wetonku';
// Customize this with a different URL if needed.
const OFFLINE_URL = 'index.html';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());

  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {

        console.log('Fetch failed; returning offline page instead.', error);

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })());
  }

});

self.addEventListener('notificationclick', event => {
  event.waitUntil(self.clients.openWindow('/'));
});

self.addEventListener('notificationclick', event => {
  event.waitUntil(self.clients.matchAll().then(clients => {
    if (clients.length){ // check if at least one tab is already open
      clients[0].focus();
    } else {
      self.clients.openWindow('/');
    }
  }));
});

self.addEventListener('notificationclick', event => {
  if (event.action === 'close') {
    event.notification.close();
  } else {
    self.clients.openWindow('/');
  }
});

self.addEventListener('notificationclick', event => {
  event.waitUntil(self.clients.matchAll().then(clients => {
    if(clients.length){ // check if at least one tab is already open
      clients[0].focus();
      clients[0].postMessage('Push notification clicked!');
    } else {
      self.clients.openWindow('/');
    }
  }));
});
