import { MapContainer, TileLayer } from "react-leaflet";
// import PropertyBoundary from '../database/sample_data/PropertyBoundaries.geojson' assert { type: 'json' }

export default function Map() {
  const longitude = -79.440028;
  const latitude = 43.770141;

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={10}
      style={{ height: "auto", width: "100%", backgroundColor: "gray" }}
    >
      <TileLayer
        key={Date.now()} // Force reload of the tile layer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
      />

      {/* <GeoJSON data={PropertyBoundary}/> */}
    </MapContainer>
  );
}
