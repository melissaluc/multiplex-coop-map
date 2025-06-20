# Objective

Geospatial query for property boundaries that meet multiplex coop building's requirements:

# Methodology

HOLDING = Y: The parcel has a Holding Zone designation. Development is not allowed until specific conditions are met or the holding provision is lifted.

HOLDING = N: The parcel is not under a holding designation and is free to develop according to the applicable zoning by-law regulations.

## Key Zoning Considerations for Multiplex Housing:

### Zoning Category (ZN_ZONE):

- Residential Zones: Properties zoned for residential use are most likely to permit multiplex housing. Look for properties in these zones:

  - Residential (0): Generally allows for low-density housing, but multiplexes may be allowed with proper approval or in specific sub-zones.

  - Residential Apartment (101): Typically allows for higher-density residential housing, which is ideal for multiplexes.

  - Commercial Residential (6): This mixed-use zone may also allow for residential development, including multiplex housing, especially in urban areas.

### Minimum Lot Area (ZN_AREA)[Units = sq metres]:

- A multiplex building typically requires a larger lot area to accommodate multiple dwelling units while ensuring compliance with other zoning restrictions (such as lot coverage and open space requirements).

- Check the required minimum lot area for the zoning: For example, if the zone requires 400 m² per dwelling unit (a400), and you plan for a 4-unit multiplex, the total lot area should be at least 1,600 m².

### Lot Frontage (FRONTAGE) [Unit = metres]:

- Some residential zones require a minimum frontage along a street for access. Ensure that the lot has sufficient frontage to accommodate the planned multiplex design.

- Look for zones with a larger required frontage (e.g., 15 meters or more) to ensure the property can meet the access and layout requirements for multiplex units.

### Maximum Density (DENSITY or FSI_TOTAL):

- FSI (Floor Space Index): This is one of the most important factors for multiplex housing. FSI indicates how much floor space is allowed relative to the lot size. For example, if the FSI is 1.0 and your lot is 1,000 m², the maximum allowed floor area for the multiplex is 1,000 m².

- Look for zones that permit a higher FSI (e.g., greater than 1.0), as these will allow for more floor space to accommodate multiple units.

### Building Coverage (PRCNT_CVER):

- Lot coverage restrictions determine the maximum percentage of the lot that can be covered by buildings. For multiplex housing, you'll need to ensure that the total building footprint does not exceed this coverage limit.

- For example, if the zone allows for 40% lot coverage, on a 1,000 m² lot, the total building footprint must be 400 m² or less.

### Height and Stories (HT_HEIGHT[Unit = metres], HT_STORIES[Unit = Storeys, Negative values = 0]):

- Multiplex housing usually consists of 2–4 stories. Ensure that the height and number of stories permitted in the zone are suitable for your building’s design.

- For example, if the zoning allows for a maximum of 10 meters (about 3 stories) and you plan for a 3-story building, this zone is likely a good match.

### Parking Requirements:

- Many zoning bylaws will have parking requirements for residential properties, particularly for higher-density developments like multiplex housing. Check the by-law for required parking spaces per unit, as this could influence the feasibility of your design.

## Data Sources & Data Inventory

Toronto OpenData Portal

- [Property Boundary or Parcel](https://open.toronto.ca/dataset/property-boundaries/)
- [Zoning By-laws](https://open.toronto.ca/dataset/zoning-by-law/)
  - [Meta data](https://ckan0.cf.opendata.inter.prod-toronto.ca/dataset/34927e44-fc11-4336-a8aa-a0dfb27658b7/resource/aa11a6f1-17fd-49b7-bbe4-f381bbc36f94/download/Zoning_readme.txt)
- [Address Points](https://open.toronto.ca/dataset/address-points-municipal-toronto-one-address-repository/)
- Ward Boundary (?)

OpenStreetMap

- GTHA Boundary
