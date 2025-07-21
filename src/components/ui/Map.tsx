import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import PropertyBoundaries from "/Users/mom/multiplex-coop-map/server/data/sample_data/filtered_data/PropertyBoundaries_Result.json";
import { center, bbox } from "@turf/turf";
import React, { useRef, useState, useEffect } from "react";
import type { FeatureCollection, Geometry } from "geojson";

export default function Map(): React.JSX.Element {
  const mapRef = useRef<L.Map | null>(null);
  const [propertyParcelsData, setPropertyParcelData] = useState(
    PropertyBoundaries as FeatureCollection<Geometry>
  );
  const mapCenter = center(propertyParcelsData);
  const [longitude, latitude] = mapCenter.geometry.coordinates;

  useEffect(() => {
    if (mapRef.current) {
      const bounds = bbox(propertyParcelsData);
      mapRef.current.fitBounds([
        [bounds[1], bounds[0]],
        [bounds[3], bounds[2]],
      ]);
    }
  }, [propertyParcelsData]);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={10}
      ref={mapRef}
      style={{ height: "auto", width: "100%", backgroundColor: "gray" }}
    >
      <TileLayer
        key={Date.now()} // Force reload of the tile layer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
      />
      {PropertyBoundaries && (
        <GeoJSON
          data={propertyParcelsData}
          onEachFeature={(feature, layer) => {
            const address = feature.properties?.ADDRESS_NUMBER
              ? feature.properties?.ADDRESS_NUMBER +
                " " +
                feature.properties?.LINEAR_NAME_FULL
              : null;
            const safeAddress = address || "No address";
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              safeAddress + ", Toronto, Ontario, Canada"
            )}`;
            layer.on("click", () => {
              window.open(googleMapsUrl, "_blank");
            });

            layer.bindTooltip(safeAddress, { sticky: true });
            const tooltipContent = safeAddress;
            layer.bindTooltip(tooltipContent, {
              sticky: true, // follows the cursor
              direction: "top",
              opacity: 0.9,
            });
          }}
          style={() => ({
            color: "#870AE0",
            fillColor: "#870AE0",
            weight: 1,
            fillOpacity: 0.4,
          })}
        />
      )}
    </MapContainer>
  );
}
