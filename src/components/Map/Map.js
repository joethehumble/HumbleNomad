import React, { useState, useEffect, useRef, useCallback } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css"

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState(null);

  const initializeMap = useCallback(() => {
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        center: [37.7749, -122.4194],
        zoom: 18,
        preferCanvas: true,
        dragging: true,
        inertia: true,
        zoomAnimation: true,
        fadeAnimation: true,
        maxZoom: 18,
        minZoom: 3,
        zoomSnap: 0.5,
        zoomDelta: 1,
        wheelDebounceTime: 100,
        doubleClickZoom: true,
        tap: true,
        touchZoom: true,
        tapTolerance: 15,
      });

      const street = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        { keepBuffer: 5 }
      );

      const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { keepBuffer: 5 }
      );

      const hybrid = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { keepBuffer: 5 }
      );

      mapInstanceRef.current.layers = { street, satellite, hybrid };
      street.addTo(mapInstanceRef.current);
    }
  }, []);

  useEffect(() => {
    initializeMap();

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initializeMap]);

  const fetchUserLocation = useCallback(async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15, { animate: true, duration: 0.1 });

          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
          }

          const userLocationIcon = L.divIcon({
            className: "user-location-marker",
            html: `<div class="pulse-glow"></div><div class="pulse-ring"></div><div class="pulse"></div><div class="pulse-static"></div><div class="arrow-wrapper"><div class="arrow"></div></div>`,
            iconSize: [50, 50],
            iconAnchor: [25, 25],
          });

          markerRef.current = L.marker([latitude, longitude], {
            icon: userLocationIcon,
          }).addTo(mapInstanceRef.current);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const handleDeviceOrientation = (event) => {
      if (event.alpha !== null) {
        if (markerRef.current) {
          const rotationAngle = event.alpha;
          const arrowElement = markerRef.current.getElement().querySelector('.arrow');
          if (arrowElement) {
            arrowElement.style.transform = `rotate(${rotationAngle}deg) translate(-50%, -50%)`;
          }
        }
      }
    };

    window.addEventListener("deviceorientation", handleDeviceOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);

  const handleLayersClick = () => {
    setIsLayerMenuOpen((prev) => !prev);
  };

  const handleLayerToggle = (layerName) => {
    const selectedLayer = mapInstanceRef.current.layers[layerName];

    if (!selectedLayer) return;

    if (["street", "satellite", "hybrid"].includes(layerName)) {
      Object.keys(mapInstanceRef.current.layers).forEach((key) => {
        if (["street", "satellite", "hybrid"].includes(key)) {
          mapInstanceRef.current.removeLayer(mapInstanceRef.current.layers[key]);
        }
      });

      mapInstanceRef.current.addLayer(selectedLayer);
      setActiveLayer(layerName);
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

      <button onClick={fetchUserLocation} className="location-button">
        <img src="images/mapmarkers/blue-gps-icon.png" alt="Location Icon" width="40" height="40" />
      </button>

      <button onClick={handleLayersClick} className="layers-button">
        <img src="images/layersmenu/blue-layers-icon.png" alt="Layers Icon" width="40" height="40" />
      </button>

      <div ref={menuRef} className={`layer-menu ${isLayerMenuOpen ? "open" : ""}`}>
        <div className="layer-menu-title">Map Views</div>
        <div className="layer-grid">
          {[{ key: "street", name: "Default View", img: "images/layersmenu/street-view.PNG" }, { key: "satellite", name: "Satellite", img: "images/layersmenu/satellite.PNG" }, { key: "hybrid", name: "Hybrid", img: "images/layersmenu/hybrid.PNG" }].map(({ key, name, img }) => (
            <div key={key} className="layer-icon-container" onClick={() => handleLayerToggle(key)}>
              <img src={img} alt={name} className={`layer-icon ${key === activeLayer ? "selected" : ""}`} />
              <p className="layer-icon-text">{name}</p>
            </div>
          ))}
        </div>
      </div>

      {userLocation && (
        <div className="location-info">
          Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
};

export default Map;
