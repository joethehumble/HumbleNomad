import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Initialize the map without zoom controls
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false, // Disable zoom control
        center: [37.7749, -122.4194], // Default view (San Francisco)
        zoom: 10, // Default zoom level
        preferCanvas: true, // Use canvas renderer for better performance
        dragging: true, // Enable drag
        inertia: true, // Enable inertia for smoother movement
        zoomAnimation: true, // Enable zoom animation
        fadeAnimation: true, // Enable fade animation
      });

      // Add a tile layer to the map (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19, // Set maximum zoom level
        minZoom: 5, // Set minimum zoom level
        tileSize: 256, // Use default tile size for OSM
        detectRetina: true, // Use higher resolution tiles for retina displays
        unloadInvisibleTiles: true, // Only load visible tiles
        reuseTiles: true, // Reuse tiles to improve performance
      }).addTo(mapInstanceRef.current);

      // Create a custom icon for the user's location marker with the static circle and pulse effect
      const userLocation = L.latLng(37.7749, -122.4194); // Example user location (San Francisco)
      const userLocationIcon = L.divIcon({
        className: 'user-location-marker', // Apply the custom class
        html: `
          <div class="pulse"></div>  <!-- Pulse effect -->
          <div class="pulse-static"></div>  <!-- Static blue circle -->
        `,
        iconSize: [60, 60], // Larger size to fit both the circle and the pulse effect
        iconAnchor: [30, 30], // Center the icon on the map
      });

      // Create the marker and add it to the map
      L.marker(userLocation, { icon: userLocationIcon }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div id="map" ref={mapContainerRef} style={{ height: "100vh", width: "100%" }} />;
};

export default Map;
