// Prayer times update function
async function updatePrayerTimes() {
    try {
        console.log('Updating prayer times with current location...');
        
        if (userLocation && userLocation.latitude && userLocation.longitude) {
            console.log('Using stored user location:', userLocation);
            
            // Get city name from coordinates
            const cityName = await getCityFromCoordinates(userLocation.latitude, userLocation.longitude);
            currentCity = cityName || "Current Location";
            
            // Fetch prayer times using coordinates
            await fetchPrayerTimesFromCoordinates(userLocation.latitude, userLocation.longitude, currentCity);
            
            console.log('Prayer times updated successfully with user location');
        } else {
            console.log('No user location available, getting fresh location...');
            
            // Get fresh location
            const position = await getCurrentPosition();
            
            // This will trigger the location update in getCurrentPosition function
            console.log('Fresh location obtained, prayer times should be updated');
        }
    } catch (error) {
        console.error('Error updating prayer times:', error);
        
        // Fallback to default location
        console.log('Falling back to default location');
        await fetchPrayerTimesFromCity(currentCity || "Amman");
    }
}