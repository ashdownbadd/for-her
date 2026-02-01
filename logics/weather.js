export async function initWeather() {
    const elements = {
        city: document.getElementById('weather-city'),
        temp: document.getElementById('weather-temp'),
        condition: document.getElementById('weather-condition'),
        range: document.getElementById('weather-range'),
        icon: document.getElementById('weather-icon')
    };

    if (!elements.city) return;

    const updateUI = async (lat, lon) => {
        try {
            // 1. Get City Name (Reverse Geocoding)
            let cityName = "Porto";
            try {
                const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
                const geoData = await geoRes.json();
                cityName = geoData.city || geoData.locality || "Current Location";
            } catch (e) { console.warn("Naming fetch failed"); }

            // 2. Get Weather
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
            const response = await fetch(url);
            const data = await response.json();

            const { current_weather: current, daily } = data;

            elements.city.textContent = cityName;
            elements.temp.textContent = `${Math.round(current.temperature)}°`;
            elements.range.textContent = `H:${Math.round(daily.temperature_2m_max[0])}° L:${Math.round(daily.temperature_2m_min[0])}°`;

            const weatherMapping = {
                0: { label: 'Clear', icon: 'sun.max.fill.svg' },
                1: { label: 'Mostly Clear', icon: 'sun.max.fill.svg' },
                2: { label: 'Partly Cloudy', icon: 'cloud.sun.fill.svg' },
                3: { label: 'Cloudy', icon: 'cloud.fill.svg' },
                45: { label: 'Foggy', icon: 'cloud.fog.fill.svg' },
                61: { label: 'Rainy', icon: 'cloud.rain.fill.svg' },
                95: { label: 'Stormy', icon: 'cloud.bolt.fill.svg' }
            };

            const state = weatherMapping[current.weathercode] || { label: 'Cloudy', icon: 'cloud.fill.svg' };
            elements.condition.textContent = state.label;
            elements.icon.src = `assets/svg/sf-symbols/${state.icon}`;

        } catch (err) {
            console.error("Weather update failed:", err);
            elements.city.textContent = "Error";
        }
    };

    // 3. Optimized Geolocation Call
    const geoOptions = {
        enableHighAccuracy: false, // Set to false to speed up the lock
        timeout: 5000,             // Wait 5 seconds max
        maximumAge: 30000          // Use a cached position if available
    };

    navigator.geolocation.getCurrentPosition(
        (pos) => updateUI(pos.coords.latitude, pos.coords.longitude),
        (err) => {
            console.warn("Geolocation error/timeout, using Porto fallback.");
            updateUI(41.15, -8.62); // Fallback to Porto immediately
        },
        geoOptions
    );
}