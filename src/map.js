import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [isSatelliteLayerSelected, setIsSatelliteLayerSelected] = useState(false); // State for Satellite Layer
  const menuRef = useRef(null);

  useEffect(() => {
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
        tileSize: 256,
        detectRetina: true,
        unloadInvisibleTiles: true,
        reuseTiles: true,
      }).addTo(mapInstanceRef.current);

      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", 
        {
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
          maxZoom: 19,
          tileSize: 256,
        }
      );

      mapInstanceRef.current.layers = {
        osm: osmLayer,
        satellite: satelliteLayer,
      };
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          mapInstanceRef.current.flyTo([latitude, longitude], 15, {
            animate: true,
            duration: 2.5,
            easeLinearity: 0.25,
          });

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
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleLayersClick = () => {
    setIsLayerMenuOpen((prev) => !prev);
  };

  const handleLayerToggle = (layer) => {
    if (layer === "satellite") {
      setIsSatelliteLayerSelected((prevState) => !prevState);
      if (!isSatelliteLayerSelected) {
        mapInstanceRef.current.removeLayer(mapInstanceRef.current.layers.osm);
        mapInstanceRef.current.addLayer(mapInstanceRef.current.layers.satellite);
      } else {
        mapInstanceRef.current.removeLayer(mapInstanceRef.current.layers.satellite);
        mapInstanceRef.current.addLayer(mapInstanceRef.current.layers.osm);
      }
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
        <p style={{ margin: "0 0 20px", fontWeight: "bold", fontSize: "18px", color: "#333" }}>Map Layers</p>

        <div style={{ marginBottom: "10px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              color: "#555",
              cursor: "pointer",
            }}
            onClick={() => handleLayerToggle("satellite")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isSatelliteLayerSelected ? "blue" : "black"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 5l10 5v6l-10 5-10-5v-6l10-5z" />
            </svg>
            Satellite View (Layer 1)
          </label>
        </div>

        {/* Add other layers here */}
      </div>

      {userLocation && (
        <div style={{
          position: "absolute",
          bottom: "30px",
          left: "20px",
          background: "rgba(255, 255, 255, 0.7)",
          padding: "5px 15px",
          borderRadius: "8px",
          fontSize: "16px",
          color: "#333",
          fontWeight: "bold",
        }}>
          Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
};

export default Map;
