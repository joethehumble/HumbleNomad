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
      }).setView([37.7749, -122.4194], 10);

      // Add a tile layer to the map
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
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
