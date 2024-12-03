import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const LayerControl = () => {
  const map = useMap();

  useEffect(() => {
    const streetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 21,
      attribution: "&copy; OpenStreetMap contributors",
    });

    const hybridMap = L.tileLayer("https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      maxZoom: 21,
      attribution: "Map data &copy; Google",
    });

    const satelliteMap = L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      maxZoom: 21,
      attribution: "Map data &copy; Google",
    });

    hybridMap.addTo(map);

    const baseMaps = {
      "Street Map": streetMap,
      "Hybrid Satellite": hybridMap,
      "Satellite Imagery": satelliteMap,
    };

    const layerControl = L.control.layers(baseMaps, null, {
      position: "bottomright",
      collapsed: false,
    });

    layerControl.addTo(map);

    return () => {
      map.removeControl(layerControl);
    };
  }, [map]);

  return null;
};

export default LayerControl;
