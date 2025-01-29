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

  // Initialize map function with optimizations
  const initializeMap = useCallback(() => {
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        center: [37.7749, -122.4194], // Default to San Francisco
        zoom: 12,
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

      // Tile layers
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

      mapInstanceRef.current.layers = {
        osm: osmLayer,
        satellite: satelliteLayer,
        terrain: terrainLayer,
      };

      mapInstanceRef.current.addLayer(osmLayer); // Default to OSM layer
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

  // Fetch user location with async/await
  const fetchUserLocation = useCallback(async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        mapInstanceRef.current.flyTo([latitude, longitude], 15, { animate: true });

        if (markerRef.current) {
          mapInstanceRef.current.removeLayer(markerRef.current);
        }

        const userLocationIcon = L.divIcon({
          className: "user-location-marker",
          html: `
            <div class="pulse-glow"></div>
            <div class="pulse"></div>
            <div class="pulse-static"></div>
            <div class="arrow-wrapper">
              <div class="arrow"></div>
            </div>
          `,
          iconSize: [50, 50],
          iconAnchor: [25, 25],
        });

        markerRef.current = L.marker([latitude, longitude], {
          icon: userLocationIcon,
        }).addTo(mapInstanceRef.current);

      } catch (error) {
        console.error("Error fetching location:", error);
      }
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Device orientation listener to update heading and rotate the marker
  useEffect(() => {
    const handleDeviceOrientation = (event) => {
      if (event.alpha !== null) {
        if (markerRef.current) {
          markerRef.current.setRotationAngle(event.alpha); // Rotate the marker based on device heading
        }
      }
    };

    window.addEventListener("deviceorientation", handleDeviceOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);

  // Toggle Layer Menu visibility
  const handleLayersClick = () => {
    setIsLayerMenuOpen((prev) => !prev);
  };

  // Handle layer toggling
  const handleLayerToggle = (layerName) => {
    const selectedLayer = mapInstanceRef.current.layers[layerName];
    if (!selectedLayer) return;

    const currentLayer = mapInstanceRef.current.hasLayer(selectedLayer);
    if (currentLayer) {
      mapInstanceRef.current.removeLayer(selectedLayer);
    } else {
      mapInstanceRef.current.addLayer(selectedLayer);
    }
  };

  // Close Layer Menu if clicked outside
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

      {/* Location Button */}
      <button onClick={fetchUserLocation} className="location-button">
        <img src="images/mapmarkers/blue-gps-icon.png" alt="Location Icon" width="40" height="40" />
      </button>

      {/* Layers Button */}
      <button onClick={handleLayersClick} className="layers-button">
        <img src="images/layersmenu/blue-layers-icon.png" alt="Layers Icon" width="40" height="40" />
      </button>

      {/* Layer Menu */}
      <div ref={menuRef} className={`layer-menu ${isLayerMenuOpen ? "open" : ""}`}>
        <div className="layer-menu-title">LAYERS</div>
        <div className="layer-grid">
          {[{
            key: "blm", name: "BLM Land", img: "images/layersmenu/blm.PNG", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }, {
            key: "usfa", name: "USFS Land", img: "images/layersmenu/usfs.PNG", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          }, {
            key: "satellite", name: "Satellite", img: "images/layersmenu/satellite.PNG", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
         }, {
            key: "terrain", name: "Terrain", img: "images/layersmenu/terrain.PNG", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}"
          }, {
            key: "firesmoke", name: "Smoke & Fire", img: "images/layersmenu/firesmoke.PNG", url: "https://server.arcgisonline.com/ArcGIS/rest/services/USFS/MapServer/tile/{z}/{y}/{x}"
          }, {
            key: "firehazzard", name: "Fire Hazzard ", img: "images/layersmenu/firehazzard.PNG", url: "https://server.arcgisonline.com/ArcGIS/rest/services/Verizon/MapServer/tile/{z}/{y}/{x}"
          }, {
            key: "verizon", name: "Verizon", img: "images/layersmenu/VERIZON.PNG", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}"
          }, {
            key: "tmobile", name: "T-Mobile", img: "images/layersmenu/TMOBILE.PNG", url: "https://server.arcgisonline.com/ArcGIS/rest/services/USFS/MapServer/tile/{z}/{y}/{x}"
          }, {
            key: "att", name: "AT&T ", img: "images/layersmenu/ATT.PNG", url: "https://server.arcgisonline.com/ArcGIS/rest/services/Verizon/MapServer/tile/{z}/{y}/{x}"
         
         
         
          }].map(({ key, name, img, url }) => (
            <div key={key} className="layer-icon-container">
              <img
                src={img}
                alt={name}
                onClick={() => handleLayerToggle(key)}
                className="layer-icon"
              />
              <p className="layer-icon-text">{name}</p>
            </div>
          ))}
        </div>
      </div>

      {userLocation && (
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "20px",
            background: "rgba(255, 255, 255, 0.7)",
            padding: "5px 15px",
            borderRadius: "8px",
            fontSize: "16px",
            color: "#333",
            fontWeight: "bold",
          }}
        >
          Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
};

export default Map;
