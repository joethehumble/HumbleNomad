let userLocation = null; // Store the user's location
let userMarker = null; // Store the user marker
let heading = null; // Store user's heading

document.addEventListener("DOMContentLoaded", function () {
    // List of U.S. cities with their latitudes and longitudes (used for random locations)
    const usLocations = [
        { lat: 40.7128, lon: -74.0060, city: 'New York' },
        { lat: 34.0522, lon: -118.2437, city: 'Los Angeles' },
        { lat: 41.8781, lon: -87.6298, city: 'Chicago' },
        { lat: 29.7604, lon: -95.3698, city: 'Houston' },
        { lat: 33.4484, lon: -112.0740, city: 'Phoenix' },
        { lat: 39.7392, lon: -104.9903, city: 'Denver' },
        { lat: 37.7749, lon: -122.4194, city: 'San Francisco' },
        { lat: 47.6062, lon: -122.3321, city: 'Seattle' }
    ];

    // Randomly pick a location from the array
    const randomLocation = usLocations[Math.floor(Math.random() * usLocations.length)];

    // Initialize the map without the zoom control
    var map = L.map('map', {
        zoomControl: false // Disable default zoom controls
    }).setView([randomLocation.lat, randomLocation.lon], 13); // Set to random location

    // Add the OpenStreetMap tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 30,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Create the zoom-to-user button and add it to the map after the map has been initialized
    const zoomToUserBtn = L.control({ position: 'bottomleft' });

    zoomToUserBtn.onAdd = function () {
        const button = L.DomUtil.create('button', 'zoom-to-user-btn');
        button.innerHTML = '📍'; // Location icon
        button.title = "Tap to view your location";

        button.onclick = () => {
            // Request user's location only when the button is clicked
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        userLocation = position.coords; // Store the user's location
                        const userLat = userLocation.latitude;
                        const userLng = userLocation.longitude;
                        heading = userLocation.heading; // Store heading for compass rotation

                        // Fly to user's location with smooth zoom-in like Google Earth
                        map.flyTo([userLat, userLng], 15, { animate: true, duration: 3 }); // Fly to the user's location with smooth zoom

                        if (!userMarker) {
                            // Create a custom divIcon with pulsing ring
                            const cssIcon = L.divIcon({
                                className: 'css-icon',
                                html: '<div class="gps_ring"></div>',
                                iconSize: [22, 22], // Set marker size
                            });

                            // Add the custom marker to the map
                            userMarker = L.marker([userLat, userLng], { icon: cssIcon }).addTo(map);
                        }

                        // Rotate the button to act as a compass if heading is available
                        if (heading !== null) {
                            button.style.transform = `rotate(${heading}deg)`;
                        }
                    },
                    (error) => {
                        console.error("Geolocation error:", error.message);
                        alert("Unable to retrieve your location.");
                    },
                    { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
                );
            } else {
                console.warn("Geolocation is not supported by your browser.");
                alert("Geolocation is not supported by your browser, showing default view.");
            }
        };

        return button;
    };

    // Add the zoom-to-user button to the map
    zoomToUserBtn.addTo(map);
});
