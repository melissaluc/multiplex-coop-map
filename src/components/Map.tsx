import {MapContainer, TileLayer, GeoJSON} from 'react-leaflet'
// import PropertyBoundary from '../database/sample_data/PropertyBoundaries.geojson' assert { type: 'json' }
import 'leaflet/dist/leaflet.css';


export default function Map() {
    const longitude =  -79.440028
    const latitude = 43.770141

  return (
    <MapContainer center={[latitude, longitude]} zoom={10} style={{ height: "100vh", width: "100%" }}>
      <TileLayer 
      url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains= 'abcd'
        // maxZoom= {20}
        />
      {/* <GeoJSON data={PropertyBoundary}/> */}
    </MapContainer>
  );
}
