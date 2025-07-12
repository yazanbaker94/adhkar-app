# Geolocation & Notifications Setup for Android APK

## Changes Made

### 1. Android Permissions Added
- `ACCESS_COARSE_LOCATION` - For network-based location
- `ACCESS_FINE_LOCATION` - For GPS-based location
- Location hardware features (optional)

### 2. Capacitor Plugins
- Installed `@capacitor/geolocation` plugin for location services
- Installed `@capacitor/local-notifications` plugin for prayer notifications
- Added proper permission handling for both
- Fallback to web APIs for browsers

### 3. Code Changes
- Created universal `getCurrentPosition()` function for geolocation
- Created universal notification functions for prayer alerts
- Handles both mobile app and web browser scenarios
- Added user-friendly error messages in Arabic and English
- Added debug functions `testGeolocation()` and `testNotifications()` for testing

## Building the App

1. **Sync the changes to Android:**
   ```bash
   npm run build:android
   ```

2. **Open Android Studio:**
   ```bash
   npm run open:android
   ```

3. **Build APK in Android Studio:**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)

## Testing Features

### Testing Geolocation

#### In Browser (Web)
- Open developer console
- Run: `testGeolocation()`
- Should show location coordinates

#### In Android APK
- Install the APK on device
- Open the app
- Go to Qibla tab
- Tap "Start Compass" button
- Should request location permission
- After granting permission, location should be detected

### Testing Notifications

#### In Browser (Web)
- Open developer console
- Run: `testNotifications()`
- Should schedule a test notification in 5 seconds

#### In Android APK
- Install the APK on device
- Open the app
- Go to Prayer Times tab
- Toggle "Prayer Time Notifications" ON
- Should request notification permission
- After granting permission, prayer notifications will be scheduled

## Troubleshooting

### Permission Denied
- Check Android app settings
- Ensure location permissions are granted
- Try restarting the app

### Location Timeout
- Ensure GPS is enabled on device
- Try moving to an area with better GPS signal
- Check if location services are enabled system-wide

### Notifications Not Working
- Check Android notification settings for the app
- Ensure "Do Not Disturb" mode is off
- Check that notifications are enabled system-wide
- Try restarting the app after granting permissions

### Debug Commands
```javascript
// Test geolocation
testGeolocation()

// Test notifications
testNotifications()

// Check if running in Capacitor
console.log('Capacitor:', window.Capacitor)

// Check available plugins
console.log('Plugins:', window.Capacitor?.Plugins)

// Check notification permissions
window.Capacitor?.Plugins?.LocalNotifications?.checkPermissions()
```

## Features Working
- **Prayer Times**: Will detect your location automatically
- **Qibla Compass**: Will get your coordinates for accurate direction
- **Prayer Notifications**: Will schedule local notifications for each prayer time
- **Location Display**: Shows your current location in Arabic/English
- **Cross-Platform**: Works in both web browsers and Android APK

## Files Modified

1. `android/app/src/main/AndroidManifest.xml` - Added location and notification permissions
2. `capacitor.config.json` - Added geolocation and local notifications plugin config
3. `www/index.html` - Added Capacitor imports for both plugins
4. `www/js/main.js` - Added universal geolocation and notification functions
5. `package.json` - Added build scripts and dependencies 