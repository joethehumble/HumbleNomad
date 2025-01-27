import React, { useEffect, useRef } from "react";
import L from "leaflet"; // Assuming you're using Leaflet
import "leaflet/dist/leaflet.css";

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null); // To track the map instance

  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Initialize the map only if it hasn't been initialized
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([37.7749, -122.4194], 10); // Example: SF coords

      // Add a tile layer to the map (use your preferred tile provider)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }

    // Cleanup when the component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null; // Reset the map instance
      }
    };
  }, []);

  return <div id="map" ref={mapContainerRef} style={{ height: "100vh", width: "100%" }} />;
};

export default Map;
