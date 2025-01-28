import React, { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const initializeMap = useCallback(() => {
    if (!mapInstanceRef.current) {
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

      const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 5,
      });

      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: '&copy; <a href="https://www.esri.com/">Esri</a>' }
      );

      const terrainLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
        { attribution: '&copy; <a href="https://www.esri.com/">Esri</a>' }
      );

      const usfsLayer = L.tileLayer("USFS_LAYER_URL", { attribution: 'USFS Attribution' });
      const blmLayer = L.tileLayer("BLM_LAYER_URL", { attribution: 'BLM Attribution' });

      mapInstanceRef.current.layers = {
        osm: osmLayer,
        satellite: satelliteLayer,
        terrain: terrainLayer,
        usfs: usfsLayer,
        blm: blmLayer,
      };

      mapInstanceRef.current.addLayer(osmLayer);
    }
  }, []);

  useEffect(() => {
    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initializeMap]);

  const handleLocationClick = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          mapInstanceRef.current.flyTo([latitude, longitude], 15, { animate: true });

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
  }, []);

  const handleLayersClick = () => {
    setIsLayerMenuOpen((prev) => !prev);
  };

  const handleLayerToggle = (layer) => {
    const selectedLayer = mapInstanceRef.current.layers[layer];
    const currentLayer = mapInstanceRef.current.hasLayer(selectedLayer);

    if (currentLayer) {
      mapInstanceRef.current.removeLayer(selectedLayer);
    } else {
      mapInstanceRef.current.addLayer(selectedLayer);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsLayerMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div id="map" ref={mapContainerRef} style={{ height: "100vh", width: "100%" }} />
      <button onClick={handleLocationClick} className="location-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 L19 21 L12 17 L5 21 Z" />
        </svg>
      </button>

      <button onClick={handleLayersClick} className="layers-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 5l10 5v6l-10 5-10-5v-6l10-5z" />
        </svg>
      </button>

      <div ref={menuRef} className={`layer-menu ${isLayerMenuOpen ? "open" : ""}`}>
        <p className="layer-menu-title">Layers</p>
        <div className="category">
          {/* Layer toggle buttons */}
          {["BLM", "USFS", "VERIZON", "ATT", "TMOBILE", "SPRINT"].map((layer, index) => (
            <div key={index} className="layer-icon-container">
              <img
                src={`images/layersmenu/${layer}.PNG`}
                alt={`${layer} Land`}
                onClick={() => handleLayerToggle(layer.toLowerCase())}
                className="layer-icon"
              />
              <p className="layer-icon-text">{layer} Land</p>
            </div>
          ))}
        </div>
      </div>

      {userLocation && (
        <div style={{
          position: "absolute", bottom: "30px", left: "20px",
          background: "rgba(255, 255, 255, 0.7)", padding: "5px 15px",
          borderRadius: "8px", fontSize: "16px", color: "#333", fontWeight: "bold",
        }}>
          Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
};

export default Map;