import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { handleMurabbaClick } from "./geoJsonTransform";
import { bindMurabbaTooltip } from "./bindTooltips";
import './GeoJsonLoader.css';
const GeoJsonLoader = ({ geoJsonUrl, mustateelLayers }) => {
  const map = useMap();
  const geoJsonLayerRef = useRef(null); // Use a ref to track the current GeoJSON layer

  useEffect(() => {
    const loadGeoJsonLayer = async () => {
      // Clear existing Mustateel layers
      mustateelLayers.current.forEach(layer => map.removeLayer(layer));
      mustateelLayers.current = [];
  
      // Clear existing Murabba layer
      if (geoJsonLayerRef.current) {
        map.removeLayer(geoJsonLayerRef.current);
      }
  
      try {
        const response = await fetch(geoJsonUrl);
        const geoJsonData = await response.json();
        const newGeoJsonLayer = L.geoJSON(geoJsonData, {
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.Murabba_No) {
              bindMurabbaTooltip(feature, layer, map);
              layer.on("click", (e) => {
                e.originalEvent.stopPropagation();
                handleMurabbaClick(feature, map, mustateelLayers);
              });
            }
          },
          style: {
            fillColor: "#000000",
            fillOpacity: 0,
            color: "#ff0c04",
            weight: 3,
          },
        });
  
        newGeoJsonLayer.addTo(map);
        geoJsonLayerRef.current = newGeoJsonLayer;
        map.fitBounds(newGeoJsonLayer.getBounds());
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
      }
    };
  
    if (geoJsonUrl) {
      loadGeoJsonLayer();
    }
  
    return () => {
      mustateelLayers.current.forEach(layer => map.removeLayer(layer)); // Cleanup on unmount
      mustateelLayers.current = [];
      if (geoJsonLayerRef.current) {
        map.removeLayer(geoJsonLayerRef.current);
      }
    };
  }, [geoJsonUrl, map, mustateelLayers]);

  return null;
};

export default GeoJsonLoader;
