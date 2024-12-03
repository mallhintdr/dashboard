import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import './css/CompassControl.css';
import compassIcon from './images/north-static.png';
import northStaticIcon from './images/north-static.png'; // Added path for the static north icon

const CompassControl = L.Control.extend({
  onAdd: function (map) {
    const compassDiv = L.DomUtil.create('div', 'leaflet-compass-icon');
    compassDiv.style.width = '60px'; // Increased size
    compassDiv.style.height = '60px'; // Increased size
    compassDiv.style.backgroundColor = '#fff';
    compassDiv.style.borderRadius = '50%';
    compassDiv.style.border = '2px solid #ccc';
    compassDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    compassDiv.style.cursor = 'pointer';
    compassDiv.style.backgroundSize = 'cover';
    compassDiv.style.backgroundPosition = 'center';
    compassDiv.style.backgroundImage = `url('${northStaticIcon}')`; // Set initial image to north-static

    let isActive = false;

    const updateCompass = (event) => {
      if (isActive && event.alpha !== null) {
        const rotation = event.alpha;
        compassDiv.style.transform = `rotate(${rotation}deg)`;
      }
    };

    compassDiv.addEventListener('click', () => {
      isActive = !isActive;
      if (isActive) {
        compassDiv.style.backgroundImage = `url('${compassIcon}')`; // Active compass icon
        window.addEventListener('deviceorientation', updateCompass);
      } else {
        window.removeEventListener('deviceorientation', updateCompass);
        compassDiv.style.transform = 'rotate(0deg)'; // Reset to north
        compassDiv.style.backgroundImage = `url('${northStaticIcon}')`; // Static north icon when inactive
      }
    });

    return compassDiv;
  },
});

const Compass = () => {
  const map = useMap();

  useEffect(() => {
    const compass = new CompassControl({ position: 'topright' });
    map.addControl(compass);

    return () => {
      map.removeControl(compass);
    };
  }, [map]);

  return null;
};

export default Compass;
