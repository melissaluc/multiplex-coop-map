import { createContext, useEffect, useState } from "react";
import { DuckDBClient } from "../data/DuckDBClient";
import pLimit from "p-limit";
import type { Table } from "apache-arrow";
import { parse as parseWKT } from "terraformer-wkt-parser";
import * as turf from "@turf/turf";
import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import type { FeatureCollection } from "geojson";

export const GeoDataContext = createContext(null);

export const GeoDataProvider = ({ children }) => {
  const [geojson, setGeojson] = useState<Record<
    number,
    GeoJSON.FeatureCollection
  > | null>(null);
  const [filterData, setFilterData] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [propertyStats, setPropertyStats] = useState<{
    maxFrontage: number;
    minFrontage: number;
  } | null>(null);
  const [selectedWardId, setSelectedWardId] = useState<number>(1);
  const baseURL = import.meta.env.VITE_HF_BASE_URL;

  async function loadResults(): Promise<void> {
    setMapLoading(true);
    const client = new DuckDBClient();
    await client.initDuckDB();
    const conn = client.getConnection();
    await registerFiles(client);

    if (!conn) throw new Error("DuckDB connection is not initialized");

    // const limit = pLimit(1);

    // progressive loading into indexdb
    // const wardTasks = Array.from({ length: 2 }, (_, i) => {
    //   const wardId = i + 1;
    //   return limit(async () => {
    //     const geoJSON = await loadResultGeoJSON(conn, wardId);
    //     if (geoJSON) {
    //       setGeojson((prev) => ({ ...prev, [wardId]: geoJSON }));
    //     }
    //   });
    // });

    // void Promise.all(wardTasks);
    for (let wardId = 1; wardId <= 25; wardId++) {
      await loadResultGeoJSON(conn, wardId);
    }
    const propertyStats = await getMaxMinPropertyValues(conn);
    setPropertyStats(propertyStats);
    const retrievedGeojson =
      await retrieveWardLandlotsFromIndexedDB(selectedWardId);
    if (retrievedGeojson) {
      setGeojson((prev) => ({ ...prev, [selectedWardId]: retrievedGeojson }));
    }
  }

  async function loadResultGeoJSON(
    conn: AsyncDuckDBConnection,
    wardId: number
  ) {
    const geojsonData = await (async () => {
      const result = await conn.query(`
          SELECT *
          FROM 'PropertyBoundaries_WARD-${wardId}_Result.parquet'
      `);
      const convertedGeojsonData = toGeoJSONFeatCollection(result);
      return convertedGeojsonData;
    })();
    await new Promise((r) => setTimeout(r, 0));
    console.log(`Storing data for ward ${wardId}`);
    await storeToIndexedDB(geojsonData, wardId);

    return geojsonData;
  }

  async function storeToIndexedDB(data: FeatureCollection, wardId: number) {
    const request = indexedDB.open("GeoDataDB", 1);

    request.onupgradeneeded = (event) => {
      const db = (event?.target as IDBOpenDBRequest)?.result;
      if (!db.objectStoreNames.contains("landLots")) {
        db.createObjectStore("landLots", {
          keyPath: "wardId",
          autoIncrement: false,
        });
      }
    };

    request.onsuccess = function (event) {
      const db = (event?.target as IDBOpenDBRequest)?.result;
      const transaction = db.transaction(["landLots"], "readwrite");
      const objectStore = transaction.objectStore("landLots");

      const addRequest = objectStore.put({ wardId, geojson: data });
      addRequest.onsuccess = function () {
        console.log(`Ward ${wardId} added to IndexedDB`);
      };
      addRequest.onerror = function () {
        console.log(`Error adding landLots for ${wardId} to IndexedDB`);
      };
      transaction.oncomplete = function () {
        db.close();
      };
      request.onerror = function (event) {
        console.error(
          "IndexedDB error: ",
          (event.target as IDBOpenDBRequest).error
        );
      };
    };
  }

  async function retrieveWardLandlotsFromIndexedDB(
    wardId: number
  ): Promise<FeatureCollection | null> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("GeoDataDB", 1);
      request.onsuccess = (event) => {
        const db = (event?.target as IDBOpenDBRequest)?.result;
        const transaction = db.transaction(["landLots"], "readonly");
        const objectStore = transaction.objectStore("landLots");
        const getRequest = objectStore.get(wardId);
        getRequest.onsuccess = (event) => {
          const record = (event?.target as IDBOpenDBRequest)?.result;
          resolve(record?.geojson || null);
        };
        getRequest.onerror = () => {
          console.error();
        };
      };
    });
  }

  async function getMaxMinPropertyValues(
    conn: AsyncDuckDBConnection | null = null
  ): Promise<{ maxFrontage: number; minFrontage: number }> {
    let connection = conn;
    if (!conn) {
      const client = new DuckDBClient();
      await client.initDuckDB();
      const newConn = client.getConnection();
      if (!newConn) throw new Error("DuckDB connection is not initialized");
      connection = newConn;
    }
    if (!connection) throw new Error("DuckDB connection is not initialized");

    const result = await connection
      .query(
        `
  SELECT 
    MAX(FRONTAGE) AS max_frontage,
    MIN(FRONTAGE) AS min_frontage
  FROM 'PropertyBoundaries_WARD-*_Result.parquet'
`
      )
      .then((res) => {
        connection.close();
        return res.toArray();
      });

    return {
      maxFrontage: result[0].max_frontage || null,
      minFrontage: result[0].min_frontage || null,
    };
  }

  async function registerFiles(client: DuckDBClient) {
    for (let i = 1; i <= 25; i++) {
      const wardId = i.toString();
      const fileName = `PropertyBoundaries_WARD-${wardId}_Result.parquet`;
      const fileURL = `${baseURL}/Result/resolve/main/${fileName}`;
      await client.registerFile(fileName, fileURL);
    }
    const wardBoundaryFileName = `City Wards Data - 4326.parquet`;
    const wardBoundaryFileURL = `${baseURL}/WardBoundaries/resolve/main/${wardBoundaryFileName}`;
    await client.registerFile(wardBoundaryFileName, wardBoundaryFileURL);
  }

  function toGeoJSONFeatCollection(
    result: Table<any>
  ): GeoJSON.FeatureCollection {
    const rows = result.toArray();
    const features = rows.reduce<GeoJSON.Feature[]>((acc, obj) => {
      const feature: GeoJSON.Feature = {
        type: "Feature",
        geometry: parseWKT(obj.geometry),
        properties: Object.fromEntries(
          Object.entries(obj).filter(
            ([key]) =>
              key !== "geojson_geom" &&
              key !== "geometry" &&
              key !== "ST_AsGeoJSON" &&
              key !== "geometry_type" &&
              key !== "geometry_srid" &&
              key !== "geometry_type_id"
          )
        ),
      };
      acc.push(feature);
      return acc;
    }, []);

    return {
      type: "FeatureCollection",
      features,
    };
  }

  useEffect(() => {
    console.log(propertyStats);
    if (geojson) {
      setMapLoading(false);
    } else {
      setMapLoading(true);
    }
  }, [geojson, propertyStats]);

  useEffect(() => {
    if (geojson) {
      setMapLoading(false);
    } else {
      setMapLoading(true);
    }
  }, [filterData]);

  return (
    <GeoDataContext.Provider
      value={{
        geojson,
        setGeojson,
        mapLoading,
        setMapLoading,
        filterData,
        setFilterData,
        propertyStats,
        setPropertyStats,
        loadResults,
        selectedWardId,
        setSelectedWardId,
      }}
    >
      {children}
    </GeoDataContext.Provider>
  );
};
