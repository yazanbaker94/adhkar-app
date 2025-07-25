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
  let notificationData;
  
  try {
    // Try to parse the data as JSON first
    notificationData = event.data ? JSON.parse(event.data.text()) : {};
  } catch (error) {
    // Fallback to plain text
    notificationData = {
      title: "Prayer Time",
      body: event.data ? event.data.text() : "Time for prayer",
      type: "prayer"
    };
  }
  
  const options = {
    body: notificationData.body || "Time for prayer",
    icon: "icon1.png",
    badge: "icon1.png",
    vibrate: [200, 100, 200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      type: notificationData.type || "prayer",
      ...notificationData.data
    },
    actions: [
      {
        action: "explore",
        title: "View Prayer Times",
        icon: "icon1.png"
      }
    ],
    // iOS-specific options for better audio handling
    silent: false,
    requireInteraction: false,
    tag: notificationData.tag || "prayer-notification"
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title || "Prayer Time", options)
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

// Handle periodic sync for prayer times
self.addEventListener("periodicsync", event => {
  if (event.tag === "prayer-times") {
    event.waitUntil(
      (async () => {
        try {
          // Update prayer times in background
          const response = await fetch("https://api.aladhan.com/v1/timings/" + new Date().toISOString().split('T')[0] + "?latitude=31.9539&longitude=35.9106&method=2");
          const data = await response.json();
          
          // Cache the updated prayer times
          const cache = await caches.open(API_CACHE_NAME);
          await cache.put(
            new Request("https://api.aladhan.com/v1/timings/" + new Date().toISOString().split('T')[0] + "?latitude=31.9539&longitude=35.9106&method=2"),
            new Response(JSON.stringify(data))
          );
        } catch (error) {
          console.error("Periodic sync failed:", error);
        }
      })()
    );
  }
});