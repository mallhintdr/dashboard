import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import LocateControl from "./LocateControl";
import LayerControl from "./LayerControl";
import DrawControl from "./DrawControl";
import GeoJsonLoader from "./Map/GeoJsonLoader";
import './css/GeoJsonLoader.css';
import './css/DrawControl.css';
import './css/MapComponent.css';
import './css/LayerControl.css';
import Compass from './CompassControl';

import L from 'leaflet';

// Custom icon for markers
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [35, 35], // Adjust size as needed
  iconAnchor: [17, 35], // Center point
  tooltipAnchor: [0, -35],
});

const MapComponent = ({ geoJsonUrl, mapCenter, goToMarkers, onClearMarkers }) => {
  const [showMenu, setShowMenu] = useState(false);
  const handleMenuToggle = () => setShowMenu(!showMenu);
  const mustateelLayers = useRef([]);

  // Custom hook to recenter the map
  const MapUpdater = ({ mapCenter }) => {
    const map = useMap();

    useEffect(() => {
      if (mapCenter) {
        map.setView(mapCenter, map.getZoom()); // Update map center
      }
    }, [mapCenter, map]);

    return null; // This component doesn't render anything
  };

  return (
    <>
      <div className="map-container" style={{ height: "90vh", width: "100%" }}>
        <MapContainer center={[30, 71]} zoom={5} style={{ height: "100%", width: "100%" }} maxZoom={21}>
          <MapUpdater mapCenter={mapCenter} /> {/* Recenter map dynamically */}
          <LocateControl />
          <LayerControl />
          <DrawControl />
          <GeoJsonLoader geoJsonUrl={geoJsonUrl} mustateelLayers={mustateelLayers} />
          <TileLayer
            url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
            attribution="Map data &copy; Google"
            maxZoom={21}
          />
          {goToMarkers.map((marker, index) => (
          <Marker key={index} position={marker} icon={customIcon}>
          <Tooltip permanent>{`Lat: ${marker[0]}, Lng: ${marker[1]}`}</Tooltip> {/* Tooltip always visible */}
        </Marker>
          ))}
          <Compass />
        </MapContainer>
        </div>
    </>
  );
};

export default MapComponent;
