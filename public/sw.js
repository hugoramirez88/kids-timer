// Kids Timer Service Worker
// NOTE: Bump version on each deployment to clear old caches
// Consider using vite-plugin-pwa for automatic versioning in production
const CACHE_NAME = 'kids-timer-v3';

// Detect if running in Capacitor (native) or web
// In Capacitor, the app runs on https://localhost or capacitor:// scheme
const isCapacitor = self.location.hostname === 'localhost'
  || self.location.protocol === 'capacitor:';

// Base path: empty for Capacitor, /kids-timer for GitHub Pages
const BASE_PATH = isCapacitor ? '' : '/kids-timer';

// App shell files to cache (core files for basic offline support)
// JS/CSS bundles are cached dynamically on first fetch via network-first strategy
const APP_SHELL = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icon-192.png`,
  `${BASE_PATH}/icon-512.png`,
  `${BASE_PATH}/favicon.ico`
];

// Install event - cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use individual puts to avoid failing all if one file missing
      return Promise.allSettled(
        APP_SHELL.map(url => cache.add(url))
      );
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests (fonts, CDNs, etc.)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response before caching
        const responseClone = response.clone();

        // Cache successful responses
        if (response.ok) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // If request is for navigation, return cached index.html
          if (event.request.mode === 'navigate') {
            return caches.match(`${BASE_PATH}/index.html`);
          }

          // Return empty response for other failed requests
          return new Response('', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});
