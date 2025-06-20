import { createDuckDB } from "./DuckDBClient";

const connection = await createDuckDB();

const basePath = "src/data/sample_data";
const resultsBasePath = `${basePath}/filtered_data`;
const noParking = false;
const filteredPropertyBoundariesPath = `${resultsBasePath}/PropertyBoundaries.parquet`;

// TODO: Find out how to get GDAL and automatically handle CRS conversions
// const refData = gdal.open(filteredPropertyBoundariesPath)
// const layer = refData.layers.get(0)
// const refCRS = layer.srs;

async function getCommonPropertyBoundaries() {
  // reduce property boundaries records by filtering for FEATURE_TYPE=COMMON for land that can be developed on
  await connection.run(`
        CREATE TEMP TABLE filtered_pb AS 
        SELECT "STATEDAREA", "PLAN_NAME", "PLAN_TYPE", "ADDRESS_NUMBER", "LINEAR_NAME_FULL", "geometry", "FEATURE_TYPE" 
        FROM read_parquet('${basePath}/Property_Boundaries_4326.parquet')
        WHERE FEATURE_TYPE = 'COMMON'
    `);

  await connection.run(`
      COPY filtered_pb TO '${filteredPropertyBoundariesPath}' (FORMAT 'parquet')
      `);
}

const overlayData = [
  {
    name: "Parking Zone Overlay - 4326",
    shortName: "pzo",
    newName: "ParkingZoneOverlay",
    returnFields: ["ZN_PARKZONE", "geometry"],
    skipDataset: noParking,
  },
  {
    name: "Zoning Building Setback Overlay - 4326",
    shortName: "zbso",
    newName: "ZoningBuildingSetbackOverlay",
    returnFields: ["BYLAW_SECTIONLINK", "geometry"],
  },
  {
    name: "Zoning Height Overlay - 4326",
    shortName: "zho",
    newName: "ZoningHeightOverlay",
    returnFields: ["geometry", "HT_STORIES", "HT_LABEL"],
    queryValues: [
      {
        field: "HT_STORIES",
        value: 6,
        filterCondition: "<=",
      },
      {
        field: "HT_STORIES",
        value: 0,
        filterCondition: ">",
      },
      {
        field: "HT_LABEL",
        value: null,
        filterCondition: null,
      },
    ],
  },
  {
    name: "Zoning Lot Coverage Overlay - 4326",
    shortName: "zlco",
    newName: "ZoningLotCoverageOverlay",
    returnFields: ["PRCNT_CVER", "geometry"],
    queryValues: [
      {
        field: "PRCNT_CVER",
        value: null,
        filterCondition: null,
      },
    ],
  },
  {
    name: "Zoning Policy Area Overlay - 4326",
    shortName: "zpao",
    newName: "ZoningPolicyAreaOverlay",
    returnFields: ["POLICY_ID", "CHAPT_200", "geometry"],
  },
  {
    name: "Zoning_Area_4326",
    shortName: "za",
    newName: "ZoningArea",
    returnFields: [
      "geometry",
      "ZN_HOLDING",
      "GEN_ZONE",
      "FRONTAGE",
      "FSI_TOTAL",
      "ZN_AREA",
      "AREA_UNITS",
      "PRCNT_RES",
      "UNITS",
    ],
    queryValues: [
      { field: "ZN_HOLDING", value: "N", filterCondition: "=" },
      { field: "GEN_ZONE", value: [0, 101], filterCondition: "IN" }, // add  202, 6 zones for mixed-use buildings
      { field: "FRONTAGE", value: 10, filterCondition: ">=" },
      { field: "FSI_TOTAL", value: null, filterCondition: null }, // data set shows some with FSI_TOTAL = -1
      { field: "ZN_AREA", value: 190, filterCondition: ">=" },
      { field: "UNITS", value: 6, filterCondition: ">=" }, // not sure if you want more or less units
      { field: "UNITS", value: 0, filterCondition: ">" }, // not sure if you want more or less units
      { field: "AREA_UNITS", value: null, filterCondition: null },
      { field: "PRCNT_RES", value: null, filterCondition: null },
    ],
  },
]; //SQL injection

async function processOverlayData(): Promise<Array<string>> {
  const processedFiles = [];

  for (const overlay of overlayData) {
    if (overlay.skipDataset) {
      console.log("Skipping processing for overlay:", overlay.name);
      continue;
    }

    console.log("Processing overlay:", overlay.name);
    const filePath = `${basePath}/${overlay.name}.parquet`;
    const resultPath = `${resultsBasePath}/${overlay.newName}.parquet`;

    // Determine if there are valid filters
    const hasValidFilters = (overlay.queryValues ?? []).some(
      (query) => query.value !== null && query.filterCondition !== null
    );

    // Adjust WHERE clause logic: if no filters exist, skip WHERE entirely
    const filterConditions =
      hasValidFilters && overlay.queryValues
        ? overlay.queryValues
            .filter(
              (query) => query.value !== null && query.filterCondition !== null
            )
            .map((query) =>
              getWhereValueQuery(
                query.field,
                query.value,
                query.filterCondition
              )
            )
            .join(" AND ")
        : null;

    // Construct dynamic query
    const query = `
      CREATE TEMP TABLE filtered_${overlay.shortName} AS
      SELECT ${overlay.returnFields.map((field) => `"${field}"`).join(", ")}
      FROM read_parquet('${filePath}')
      ${filterConditions ? `WHERE ${filterConditions}` : ""}
    `;
    console.log(query);

    await connection.run(query);
    await connection.run(`
      COPY filtered_${overlay.shortName} TO '${resultPath}' (FORMAT 'parquet')
    `);

    processedFiles.push(resultPath);
    console.log("Appending file processed:", resultPath);
  }

  return processedFiles;
}

function getWhereValueQuery(
  field: string,
  value: string | number | Array<string | number> | null | undefined,
  filterCondition: string | null
): string {
  // Build out various querying conditions here, not all cases are covered at the moment
  if (Array.isArray(value)) {
    const formattedCondition = value
      .map((queryValue) =>
        typeof queryValue === "string" ? `'${queryValue}'` : queryValue
      )
      .join(", ");
    return `${field} ${filterCondition} (${formattedCondition})`;
  }
  if (value === null || value === undefined) {
    return `${field} IS NULL`;
  }
  if (typeof value === "string") {
    return `${field} ${filterCondition} '${value}'`;
  }
  if (typeof value === "number") {
    return `${field} ${filterCondition} ${value}`;
  }
  return "";
}

// Set to EPSG:4326 (WGS 84 or CRS84)
// async function handleFileCRS(crs: string | number, filePath: string) {
//   // handle projection of processed geospatial parquet files by reprojecting
//   //construct SELECT statement on dataset

//   const result = await connection.run(`
// SELECT GEOMETRY ST_GeomFromWKB ('geometry' WKB_BLOB)
// FROM read_parquet('${filePath}');

//   `);
//   // const result = await connection.run(`
//   // SHOW show_parquet_metadata('${filePath}')
//   // `);

//   const fileCRS = await result.getRowObjectsJson();
//   console.log("results crs:", fileCRS);

//   if (fileCRS) {
//     // Transform geometries to the desired CRS
//     await connection.run(`
//       CREATE TEMP TABLE reprojected_data AS
//       SELECT ST_Transform(geometry, '${fileCRS}', '${crs}') AS geometry, *
//       FROM read_parquet('${filePath}');
//     `);

//     await connection.run(`
//       COPY reprojected_data TO '${filePath}' (FORMAT 'parquet');
//     `);

//     console.log(`CRS transformed and saved to ${filePath}`);
//   } else {
//     console.log("CRS already matches");
//   }
// }

async function getPropertyBoundariesOnSpatialJoin(
  // crs: number | string,
  overlayFilePaths: Array<string>,
  propertyBoundariesPath: string
): Promise<void> {
  // pass an array of files to overlay
  // await Promise.all(
  //   overlayFilePaths.map((filePath) => handleFileCRS(crs, filePath))
  // );
  const overlayJoinConditions = overlayFilePaths
    .map(
      (file, idx) =>
        `LEFT JOIN read_parquet('${file}') AS overlay_${idx} ON ST_Intersects(pb.geometry, overlay_${idx}.geometry)`
    )
    .join("\n");

  const overlayColumns = overlayFilePaths.map(
    (_, index) => `overlay_${index}.* EXCLUDE overlay_${index}.geometry`
  );

  const selectedColumns = ["pb.*", ...overlayColumns].join(", ");

  const queryStrSpatialJoin = `
        CREATE TEMP TABLE spatial_join AS
        SELECT DISTINCT ${selectedColumns}
        FROM read_parquet('${propertyBoundariesPath}') AS pb
        ${overlayJoinConditions}
    `;
  console.log(queryStrSpatialJoin);
  await connection.run(queryStrSpatialJoin);

  const columnsToCheck = [
    "ZN_AREA",
    // "FSI_TOTAL",
    // "PRCNT_CVER",
    // "HT_STORIES",
    "GEN_ZONE",
    "FRONTAGE",
    // "AREA_UNITS",
    // "UNITS",
  ] as const;

  const whereNotNullClause = columnsToCheck
    .map((col) => `${col} IS NOT NULL`)
    .join(" AND ");

  const queryOutNull = `
    CREATE TEMP TABLE spatial_join_cleaned AS
    SELECT * 
    FROM spatial_join
    WHERE ${whereNotNullClause};
    `;
  console.log(queryOutNull);
  await connection.run(queryOutNull);
  await connection.run(`
    COPY spatial_join_cleaned TO '${resultsBasePath}/PropertyBoundaries_Result.parquet' (FORMAT 'parquet')
    `);
}

await getCommonPropertyBoundaries();
console.log("Joining overlay & property boundaries");
const processedOverlayDataFiles = await processOverlayData();
await getPropertyBoundariesOnSpatialJoin(
  // crs,
  processedOverlayDataFiles,
  filteredPropertyBoundariesPath
);
console.log("Finished spatial join");

// Export file to csv
await connection.run(`
COPY (
    SELECT * FROM read_parquet('${resultsBasePath}/PropertyBoundaries_Result.parquet')
) TO '${resultsBasePath}/PropertyBoundaries_Result.csv' (FORMAT 'csv', HEADER);

`);

// Close single connection but keep db running
// connection.disconnectSync();
// Shutdown DuckDB
connection.closeSync();

// console.log(rows);
