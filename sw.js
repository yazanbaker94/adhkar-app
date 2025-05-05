// Add background fetch support
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
            .catch(function() {
                return new Response('Offline');
            })
    );
});

// Add periodic sync for background updates
self.addEventListener('periodicsync', function(event) {
    if (event.tag === 'prayer-times-sync') {
        event.waitUntil(syncPrayerTimes());
    }
});

async function syncPrayerTimes() {
    try {
        const response = await fetch('https://api.aladhan.com/v1/timingsByAddress/' + 
            new Date().toISOString().split('T')[0].split('-').reverse().join('-') + 
            '?address=Amman');
        const data = await response.json();
        
        if (data.code === 200) {
            const timings = data.data.timings;
            const now = new Date();
            
            // Check each prayer time
            for (const [prayer, time] of Object.entries(timings)) {
                const prayerTime = new Date(`${now.toDateString()} ${time}`);
                const timeUntilPrayer = prayerTime - now;
                
                // If prayer time is within 5 minutes
                if (timeUntilPrayer > 0 && timeUntilPrayer <= 5 * 60 * 1000) {
                    const options = {
                        body: `${prayer} prayer time is approaching`,
                        icon: 'icon1.png',
                        badge: 'icon1.png',
                        silent: false,
                        requireInteraction: true,
                        tag: `prayer-${prayer}`,
                        renotify: true
                    };

                    // Add vibrate only for non-iOS devices
                    if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                        options.vibrate = [200, 100, 200];
                    }

                    await self.registration.showNotification('Prayer Time', options);
                }
            }
        }
    } catch (error) {
        console.error('Error syncing prayer times:', error);
    }
}

// Handle push notifications
self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: 'icon1.png',
            badge: 'icon1.png',
            silent: false,
            requireInteraction: true,
            tag: data.tag || 'prayer-notification',
            renotify: true,
            data: {
                url: data.url
            }
        };

        // Add vibrate only for non-iOS devices
        if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            options.vibrate = [200, 100, 200];
        }

        event.waitUntil(
            self.registration.showNotification(data.title, options)
                .then(() => {
                    // Play adhan sound
                    return new Promise((resolve) => {
                        const audio = new Audio('adhan.mp3');
                        audio.play().then(resolve).catch(resolve);
                    });
                })
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.notification.data && event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

// Handle service worker installation
self.addEventListener('install', function(event) {
    event.waitUntil(
        Promise.all([
            self.skipWaiting(),
            caches.open('prayer-times-v1').then(function(cache) {
                return cache.addAll([
                    'index.html',
                    'sw.js',
                    'icon1.png',
                    'icon2.png',
                    'adhan.mp3'
                ]);
            })
        ])
    );
});

// Handle service worker activation
self.addEventListener('activate', function(event) {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        if (cacheName !== 'prayer-times-v1') {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
}); 