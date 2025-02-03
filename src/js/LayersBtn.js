import React, { useState } from "react";
import '../styles/App.css'; // Global app-wide CSS

const Layers = ({ mapInstance }) => {
  const [activeLayer, setActiveLayer] = useState(null);

  const handleLayerToggle = (layerName) => {
    const selectedLayer = mapInstance.current.layers[layerName];

    if (!selectedLayer) return;

    if (["street", "satellite", "terrain", "hybrid"].includes(layerName)) {
      // Remove existing layers
      Object.keys(mapInstance.current.layers).forEach((key) => {
        if (["street", "satellite", "terrain", "hybrid"].includes(key)) {
          mapInstance.current.removeLayer(mapInstance.current.layers[key]);
        }
      });

      // Add the selected layer
      mapInstance.current.addLayer(selectedLayer);
      setActiveLayer(layerName);
    }
  };

  return (
    <div className="layer-menu">
      <div className="layer-menu-title">Map Views</div>
      <div className="layer-grid">
        {[
          { key: 'street', name: 'Default View', img: 'images/layersmenu/street-view.PNG' },
          { key: 'satellite', name: 'Satellite', img: 'images/layersmenu/satellite.PNG' },
          { key: 'terrain', name: 'Terrain', img: 'images/layersmenu/terrain.PNG' },
          { key: 'hybrid', name: 'Hybrid', img: 'images/layersmenu/hybrid.PNG' },
        ].map(({ key, name, img }) => (
          <div key={key} className="layer-icon-container" onClick={() => handleLayerToggle(key)}>
            <img
              src={img}
              alt={name}
              className={`layer-icon ${key === activeLayer ? 'selected' : ''}`}
            />
            <p className="layer-icon-text">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Layers;
