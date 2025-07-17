// Service Worker for Adhkar & Prayer Times App

// Cache name for static assets
const CACHE_NAME = "adhkar-prayer-times-v1";
const API_CACHE_NAME = "api-cache-v1";

// Files to cache
const urlsToCache = [
  "./",
  "./index.html",
  "./adhkar.json",
  "./icon1.png",
  "./icon2.png",
  "./adhan.mp3",
  "./manifest.json",
  "./styles/base.css",
  "./styles/components.css",
  "./styles/animations.css",
  "./styles/responsive.css",
  "./js/main.js"
];

// Install event - cache static assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - handle API requests with network-first strategy
self.addEventListener("fetch", event => {
  const apiUrl = "https://api.aladhan.com";
  const quranApiUrl = "https://api.alquran.cloud";
  
  if (event.request.url.startsWith(apiUrl) || event.request.url.startsWith(quranApiUrl)) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        try {
          // Try network first
          const networkResponse = await fetch(event.request);
          // Clone the response before using it
          const responseToCache = networkResponse.clone();
          // Update cache with fresh response
          await cache.put(event.request, responseToCache);
          return networkResponse;
        } catch (error) {
          // Network failed, try cache
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // If no cache, return error response
          return new Response(JSON.stringify({
            error: "Network failed and no cache available"
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
      })
    );
  } else {
    // For static assets, use cache-first strategy
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((networkResponse) => {
          // Clone the response before caching
          const responseToCache = networkResponse.clone();
          // Cache new responses for static assets
          if (event.request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|mp3)$/)) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
  }
});

// Handle push notifications
self.addEventListener("push", event => {
  const options = {
    body: event.data.text(),
    icon: "icon1.png",
    badge: "icon1.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: "explore",
        title: "View Prayer Times",
        icon: "icon1.png"
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification("Prayer Time", options)
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("./")
  );
});

// Handle background fetch
self.addEventListener("backgroundfetchsuccess", event => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(API_CACHE_NAME);
        const records = await event.registration.matchAll();
        const promises = records.map(async (record) => {
          const response = await record.responseReady;
          await cache.put(record.request, response);
        });
        await Promise.all(promises);
      } catch (error) {
        console.error("Background fetch failed:", error);
      }
    })()
  );
});