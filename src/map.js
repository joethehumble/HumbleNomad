import React, { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [heading, setHeading] = useState(null); // State for device heading
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

  // Device orientation listener to update heading
  useEffect(() => {
    const handleDeviceOrientation = (event) => {
      if (event.alpha !== null) {
        setHeading(event.alpha); // Update heading with alpha value (direction the device is facing)
      }
    };

    window.addEventListener("deviceorientation", handleDeviceOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);
  const handleLocationClick = useCallback(() => {
    if (navigator.geolocation) {
      // Use watchPosition for continuous location tracking
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Fly to user's position with smooth animation
          mapInstanceRef.current.flyTo([latitude, longitude], 15, { animate: true });
    
          // Remove previous marker if it exists
          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
          }
  
          // Custom icon with a semi-transparent arrow
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
    
          // Create or update the marker
          markerRef.current = L.marker([latitude, longitude], {
            icon: userLocationIcon,
          }).addTo(mapInstanceRef.current);
    
          // Apply rotation based on the heading
          if (heading !== null) {
            const arrowElement = document.querySelector(".arrow-wrapper");
            if (arrowElement) {
              arrowElement.style.transform = `rotate(${heading}deg)`;
            }
          }
        },
        (error) => console.error("Error fetching location:", error),
        {
          enableHighAccuracy: true, // High accuracy for GPS
          maximumAge: 10000, // Reuse cached position if available (up to 10 seconds old)
          timeout: 27000, // Timeout for getting location
        }
      );
  
      // Cleanup the watch when the component unmounts
      return () => {
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [heading]);
  
  

  const handleLayersClick = () => {
    setIsLayerMenuOpen((prev) => !prev);
  };

  const handleLayerToggle = (layerName) => {
    const selectedLayer = mapInstanceRef.current.layers[layerName];
    if (!selectedLayer) return; // Early exit if the layer is undefined

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
  
      {/* Location Button */}
      <button onClick={handleLocationClick} className="location-button">
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
          {[ 
            { key: "blm", name: "BLM Land", img: "images/layersmenu/BLM.PNG" },
            { key: "usfs", name: "USFS Land", img: "images/layersmenu/USFS.PNG" },
            { key: "verizon", name: "Verizon", img: "images/layersmenu/VERIZON.PNG" },
            { key: "att", name: "AT&T", img: "images/layersmenu/ATT.PNG" },
            { key: "tmobile", name: "T-Mobile", img: "images/layersmenu/TMOBILE.PNG" },
            { key: "sprint", name: "Sprint", img: "images/layersmenu/SPRINT.PNG" }
          ].map(({ key, name, img }) => (
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


