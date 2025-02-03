import { useEffect } from 'react';
import L from 'leaflet';

const Location = ({ mapInstance }) => {
  useEffect(() => {
    if (mapInstance.current) {
      const button = L.control({ position: 'topright' });

      button.onAdd = function () {
        const div = L.DomUtil.create('div', 'location-button');
        div.innerHTML = '<img src="../mapmarkers/blue-gps-icon.png" alt="Locate Me" />';
        div.onclick = function () {
          if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
          }

          const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          };

          navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              mapInstance.current.setView([latitude, longitude], 15);

              if (!mapInstance.current.userLocationMarker) {
                const userLocationIcon = L.divIcon({
                  className: 'user-location-marker',
                  html: `<div class="pulse-glow"></div><div class="pulse-ring"></div><div class="pulse"></div><div class="pulse-static"></div><div class="arrow-wrapper"><div class="arrow"></div></div>`,
                  iconSize: [50, 50],
                  iconAnchor: [25, 25],
                });

                mapInstance.current.userLocationMarker = L.marker([latitude, longitude], {
                  icon: userLocationIcon,
                }).addTo(mapInstance.current);
              } else {
                mapInstance.current.userLocationMarker.setLatLng([latitude, longitude]);
              }
            },
            () => {
              alert('Unable to retrieve your location.');
            },
            options
          );
        };
        return div;
      };

      button.addTo(mapInstance.current);
    }
  }, [mapInstance]);

  return null;
};

export default Location;
