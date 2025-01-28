import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Initialize the map
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        center: [37.7749, -122.4194], // Default to San Francisco
        zoom: 10,
        preferCanvas: true,
        dragging: true,
        inertia: true,
        zoomAnimation: true,
        fadeAnimation: true,
        maxZoom: 100,
        minZoom: 1,
      });

      // Base OSM Layer
      const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        minZoom: 5,
      }).addTo(mapInstanceRef.current);

      // Define additional layers
      const layers = {
        satellite: L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
            maxZoom: 19,
          }
        ),
        terrain: L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
          {
            attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
            maxZoom: 19,
          }
        ),
        blm: L.tileLayer(
          "BLM_LAYER_URL", // Replace with the actual BLM layer URL
          { attribution: "BLM Attribution", maxZoom: 19 }
        ),
        usfs: L.tileLayer(
          "USFS_LAYER_URL", // Replace with the actual USFS layer URL
          { attribution: "USFS Attribution", maxZoom: 19 }
        ),
      };

      mapInstanceRef.current.layers = layers;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleLayerToggle = (layer) => {
    const selectedLayer = mapInstanceRef.current.layers[layer];
    if (mapInstanceRef.current.hasLayer(selectedLayer)) {
      mapInstanceRef.current.removeLayer(selectedLayer);
    } else {
      mapInstanceRef.current.addLayer(selectedLayer);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          mapInstanceRef.current.flyTo([latitude, longitude], 15);
          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
          }
          const userLocationIcon = L.divIcon({
            className: "user-location-marker",
            html: `<div class="pulse"></div><div class="pulse-static"></div>`,
            iconSize: [60, 60],
            iconAnchor: [30, 30],
          });
          markerRef.current = L.marker([latitude, longitude], { icon: userLocationIcon }).addTo(mapInstanceRef.current);
        },
        (error) => console.error("Error fetching location:", error)
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <div id="map" ref={mapContainerRef} style={{ height: "100vh", width: "100%" }} />
      <button onClick={handleLocationClick} className="location-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="black" strokeWidth="2">
          <path d="M12 2 L19 21 L12 17 L5 21 Z" />
        </svg>
      </button>
      <button onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)} className="layers-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="black" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 5l10 5v6l-10 5-10-5v-6l10-5z" />
        </svg>
      </button>

      {isLayerMenuOpen && (
        <div className="layer-menu">
          <p className="menu-header">Layers</p>

          {/* Cell Phone Services */}
          <div className="menu-section">
            <p>Cell Phone Services</p>
            <div className="menu-grid">
              <button onClick={() => handleLayerToggle("verizon")}>
                <svg className="menu-icon" />
                <p>Verizon LTE</p>
              </button>
              <button onClick={() => handleLayerToggle("att")}>
                <svg className="menu-icon" />
                <p>AT&T LTE</p>
              </button>
              <button onClick={() => handleLayerToggle("tmobile")}>
                <svg className="menu-icon" />
                <p>T-Mobile LTE</p>
              </button>
              <button onClick={() => handleLayerToggle("sprint")}>
                <svg className="menu-icon" />
                <p>Sprint LTE</p>
              </button>
            </div>
          </div>

          {/* Land Layers */}
          <div className="menu-section">
            <p>Land Layers</p>
            <div className="menu-grid">
              <button onClick={() => handleLayerToggle("blm")}>
                <svg className="menu-icon" />
                <p>BLM Land</p>
              </button>
              <button onClick={() => handleLayerToggle("usfs")}>
                <svg className="menu-icon" />
                <p>USFS Land</p>
              </button>
              <button onClick={() => handleLayerToggle("fire_smoke")}>
                <svg className="menu-icon" />
                <p>Fire Smoke</p>
              </button>
              <button onClick={() => handleLayerToggle("fire_hazards")}>
                <svg className="menu-icon" />
                <p>Fire Hazards</p>
              </button>
              <button onClick={() => handleLayerToggle("elevation")}>
                <svg className="menu-icon" />
                <p>Elevation</p>
              </button>
              <button onClick={() => handleLayerToggle("satellite")}>
                <svg className="menu-icon" />
                <p>Satellite</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
