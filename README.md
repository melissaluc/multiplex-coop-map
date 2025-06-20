# Multiplex Coop Map

- This repo contains the project geospatial analysis and map component
- 🔗 [demo link](https://multiplex-coop-map.onrender.com/)

# Technology Stack

- React
- TypeScript
- DuckDB
- Hugging Face (HF)

## Data Sources & Data Inventory

- Toronto OpenData Portal

  - [Property Boundary or Parcel](https://open.toronto.ca/dataset/property-boundaries/)
  - [Zoning By-laws](https://open.toronto.ca/dataset/zoning-by-law/)
    - [Meta data](https://ckan0.cf.opendata.inter.prod-toronto.ca/dataset/34927e44-fc11-4336-a8aa-a0dfb27658b7/resource/aa11a6f1-17fd-49b7-bbe4-f381bbc36f94/download/Zoning_readme.txt)
    - Ward Zones/Boundaries for spatial indexing?
  - [Address Points](https://open.toronto.ca/dataset/address-points-municipal-toronto-one-address-repository/)

- OpenStreetMap - City Boundaries

  # Methodology

  ## Assumptions

  CRS PROJ 4326
  Parking Zone Overlay - 4326

- Enrich parcels with ZN_PARKZONE
  Zoning Building Setback Overlay - 4326
- Enrich parcels with BYLAW_SECTIONLINK
  Zoning Height Overlay - 4326
- Enrich and query on field HT_STORIES, HT_LABEL
  Zoning Lot Coverage Overlay - 4326
  - Enrich and query on field PRCNT_CVER
    Zoning Policy Area Overlay - 4326
  - Enrich parcels with POLICY_ID, CHAPT_200
    Zoning_Area_4326
  - Query on fields

ZN_HOLDING = N
GEN_ZONE residential only
Ignore FSI_TOTAL
ZN_AREA = NUM_OF_UNITS \* DWELLING_UNIT_AREA

### Processing data for client

STEP 1: Filter PropertyBoundaries for FEATURE_TYPE = COMMON write to disk/HF as parquet

STEP 2: Process overlay data filtering and selecting key columns write to disk/HF as parquet

STEP 3: Perform spatial join LEFT on PropertyBoundaries, handle CRS for overlay layers, filter out resultant table (e.g. remove NULL rows) and export as CSV

STEP 4: Read CSV file in turf convert to lightweight geometry or GeoJSON and read into React-Leaflet

### User input form

Derived fields, alternative input fields for users:

- SITE PARKING
- NUMBER OF UNITS
- BUILDING FOOTPRINT AREA
-

Convert to GeoJSON reduce polygon count
mapbox LOD for optomizing geometry
slippy tiles map tiles divide glob einto square if
BVH (bounded hiearchy a cube divide into 8)
viewport culling frusum cilling chnge keep in memory whst you see on screen

preprocessing step geojson makes it invalid,
Mapbox

leaflet optimize that shit
optimization api from mapbox primitives
decimation in context of geometry
pixar catmal klark sub division
ahow do games do so much grass
dedicated filter
