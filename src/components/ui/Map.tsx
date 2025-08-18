import { MapContainer, TileLayer, GeoJSON, Marker } from "react-leaflet";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { center, bbox } from "@turf/turf";
import chroma from "chroma-js";
import React, { useRef, useMemo, useEffect, useContext } from "react";
import type {
  Feature,
  FeatureCollection,
  MultiLineString,
  MultiPolygon,
  Polygon,
} from "geojson";
import { GeoDataContext } from "../../contexts/GeoDataContext";
import * as turf from "@turf/turf";

function getParcelCentroid(geojson: FeatureCollection<Polygon>): Array<any> {
  const centroids = geojson.features.map((feature) => {
    return turf.centroid(feature);
  });
  return centroids;
}

export default function Map(): React.JSX.Element {
  const viridisColors = [
    "#440154",
    "#482777",
    "#3E4989",
    "#31688E",
    "#26828E",
    "#1F9E89",
    "#35B779",
    "#6CCE59",
    "#B4DE2C",
    "#FDE725",
  ];

  const mapRef = useRef<L.Map | null>(null);
  // const [centroidFeatures, setCentroidFeatures] = useState<Array<
  //   Feature<Point>
  // > | null>(null);

  const { geojson, selectedWardId, mapLoading, setMapLoading, propertyStats } =
    useContext(GeoDataContext);

  const scale = useMemo(() => {
    if (
      propertyStats?.minFrontage != null &&
      propertyStats?.maxFrontage != null
    ) {
      return chroma
        .scale(viridisColors)
        .domain([propertyStats.minFrontage, propertyStats.maxFrontage]);
    }
    return null;
  }, [propertyStats, viridisColors]);

  useEffect(() => {
    if (mapRef.current && geojson) {
      const bounds = bbox(geojson[selectedWardId]);
      mapRef.current.fitBounds([
        [bounds[1], bounds[0]],
        [bounds[3], bounds[2]],
      ]);
    }
    if (geojson) {
      // getParcelCentroid(geojson);
      setMapLoading(false);
    } else {
      setMapLoading(true);
    }
  }, [geojson, setMapLoading, selectedWardId]);

  return (
    <MapContainer
      bounds={[
        [43.574851, -79.643047],
        [43.861975, -79.113387],
      ]}
      maxBounds={[
        [43.574851, -79.643047],
        [43.861975, -79.113387],
      ]}
      maxBoundsViscosity={1.0}
      zoom={10}
      ref={mapRef}
      style={{ height: "auto", width: "100%", backgroundColor: "gray" }}
    >
      <TileLayer
        key={Date.now()}
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
      />
      {mapLoading && (
        <Box pos="absolute" inset="0" bg="bg/80">
          <Center h="full">
            <Spinner color="teal.500" />
          </Center>
        </Box>
      )}
      {geojson && (
        <>
          {Object.entries(geojson).map(([wardId, featData]) => (
            <GeoJSON
              key={wardId}
              data={
                featData as FeatureCollection<
                  MultiLineString | Polygon | MultiPolygon
                >
              }
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
              style={(feature) => {
                const frontage = feature?.properties?.FRONTAGE;
                const color =
                  typeof frontage === "number" && scale
                    ? scale(frontage).hex()
                    : "#3e3e3eff";

                return {
                  color,
                  fillColor: color,
                  weight: 1,
                  fillOpacity: 0.4,
                };
              }}
            />
          ))}
        </>
      )}
    </MapContainer>
  );
}
