# Background Notifications Guide

## 🚨 **The Problem:**
When you close the app, notifications stop working because:

### **Web Browser (PWA):**
- JavaScript execution stops when tab is closed
- `setTimeout` and `setInterval` are cancelled
- Service Worker has limited background capabilities
- No persistent background processing

### **Android APK:**
- App process might be killed by Android
- Battery optimization kills background tasks
- Background app refresh might be disabled
- Local notifications should work but need proper setup

## ✅ **Solutions:**

### **1. For Web (PWA) - Push Notifications:**
```javascript
// Register service worker for push notifications
if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            // Subscribe to push notifications
            return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'YOUR_VAPID_KEY'
            });
        });
}
```

### **2. For Android APK - Background Service:**
```xml
<!-- Add to AndroidManifest.xml -->
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />

<service
    android:name=".PrayerNotificationService"
    android:enabled="true"
    android:exported="false" />
```

### **3. Current Implementation Issue:**
Your current code uses:
```javascript
// This stops when app is closed
setTimeout(() => {
    showNotification();
}, timeUntilPrayer);
```

**Should use:**
```javascript
// Capacitor Local Notifications (works in background)
await LocalNotifications.schedule({
    notifications: [{
        id: 1,
        title: 'Prayer Time',
        body: 'Time for Fajr prayer',
        schedule: { at: new Date(prayerTime) }
    }]
});
```

## 🔧 **Immediate Fixes:**

### **1. Battery Optimization (Android):**
```javascript
// Request battery optimization exemption
if (window.Capacitor?.isNativePlatform()) {
    // Ask user to disable battery optimization for the app
    const alert = await AlertController.create({
        header: 'Battery Optimization',
        message: 'Please disable battery optimization for this app to receive prayer notifications',
        buttons: ['OK']
    });
    await alert.present();
}
```

### **2. Foreground Service (Android):**
```javascript
// Keep app alive in background
if (window.Capacitor?.isNativePlatform()) {
    // Start foreground service for prayer notifications
    await BackgroundMode.enable();
}
```

### **3. Persistent Notifications:**
```javascript
// Use persistent local notifications instead of setTimeout
async function scheduleAllPrayerNotifications() {
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const notifications = [];
    
    prayers.forEach((prayer, index) => {
        const prayerTime = getPrayerTime(prayer);
        notifications.push({
            id: index + 1,
            title: 'Prayer Time',
            body: `Time for ${prayer} prayer`,
            schedule: { at: new Date(prayerTime) },
            sound: 'adhan.wav',
            ongoing: true // Keep notification persistent
        });
    });
    
    await LocalNotifications.schedule({ notifications });
}
```

## 📋 **Testing Steps:**

### **Web Browser:**
1. Open app in browser
2. Enable notifications
3. Close tab/browser
4. **Result**: Notifications won't work (expected)
5. **Solution**: Need push notification server

### **Android APK:**
1. Install APK
2. Enable notifications
3. Close app completely
4. **If notifications work**: ✅ Good
5. **If notifications don't work**: Need battery optimization fix

## 🛠️ **Required Changes:**

### **1. Add Background Plugin:**
```bash
npm install @capacitor/background-mode
```

### **2. Update Capacitor Config:**
```json
{
    "plugins": {
        "LocalNotifications": {
            "smallIcon": "ic_stat_icon_config_sample",
            "iconColor": "#488AFF",
            "sound": "adhan.wav"
        },
        "BackgroundMode": {
            "enabled": true,
            "title": "Prayer Times",
            "text": "Monitoring prayer times in background"
        }
    }
}
```

### **3. Android Permissions:**
```xml
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />
```

## 🎯 **Current Status:**
- ✅ **Testing**: Works great for testing
- ❌ **Production**: Won't work when app is closed
- 🔄 **Solution**: Need proper background service implementation

## 📱 **Real-World Prayer Apps:**
Most Islamic apps solve this by:
1. **Scheduling all notifications at once** (not using setTimeout)
2. **Asking users to disable battery optimization**
3. **Using foreground services** for critical notifications
4. **Rescheduling notifications daily** at app startup

## 🚀 **Next Steps:**
1. Test current implementation with APK
2. Add battery optimization request
3. Implement proper background service
4. Add push notification server for web version 