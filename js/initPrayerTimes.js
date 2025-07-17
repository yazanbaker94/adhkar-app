// Initialize prayer times only when prayer tab is clicked
// No automatic initialization to avoid multiple permission requests

// Enhanced prayer times loading that waits for location
async function loadPrayerTimesWithLocation() {
    try {
        console.log('Loading prayer times with location...');
        
        // First, try to get user's current location
        const position = await getCurrentPosition();
        
        console.log('Location obtained for prayer times:', position.coords);
        
        // Update prayer times with the obtained location
        await updatePrayerTimes();
        
    } catch (error) {
        console.log('Could not get location for prayer times, using default:', error);
        
        // Fallback to default location
        await fetchPrayerTimes("Amman");
    }
}