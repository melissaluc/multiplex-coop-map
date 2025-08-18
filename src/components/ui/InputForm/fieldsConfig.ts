// Option List
export interface FieldOption {
  show: string;
  value: string | number | boolean;
}

export interface BaseField {
  fieldName: string;
  fieldLabel: string;
  inputType?: string;
  valueType: string;
  isRequired?: boolean;
  uom?: string;
}

// Field with options
export interface OptionField extends BaseField {
  options: Array<FieldOption | string | number | boolean>;
}

// Field with subfields
export interface Subfield extends BaseField {
  inputType?: string;
}

export interface FieldWithSubfields extends BaseField {
  isRequired?: boolean;
  subfields: Subfield[];
}

// Group of fields
export interface FieldGroup {
  groupName: string;
  groupLabel: string;
  exclusive?: boolean;
  fields: FieldType[];
}

export type FieldType =
  | OptionField
  | FieldWithSubfields
  | BaseField
  | FieldGroup;

export const fields: FieldType[] = [
  {
    fieldName: "site_parking",
    fieldLabel: "Site Parking",
    inputType: "fieldpick",
    valueType: "boolean",
    options: [
      { show: "no", value: false },
      { show: "yes", value: true },
    ],
    isRequired: true,
  },
  {
    groupName: "density_group",
    groupLabel: "Density (FSI) or Number of Units",
    exclusive: true,
    fields: [
      {
        fieldName: "fsi_total",
        fieldLabel: "Total FSI (Floor Space Index)",
        inputType: "text",
        valueType: "number",
        isRequired: true,
      },
      {
        fieldName: "number_of_units_block",
        fieldLabel: "Estimate FSI by Unit Count",
        valueType: "number",
        isRequired: true,
        subfields: [
          {
            fieldName: "number_of_units",
            fieldLabel: "Number of Units",
            valueType: "number",
            inputType: "textbox",
          },
          {
            fieldName: "minimum_unit_size",
            fieldLabel: "Minimum Dwelling Unit Size in Sq-Metres",
            valueType: "number",
            inputType: "textbox",
          },
        ],
      },
    ],
  },
  {
    groupName: "buildingArea",
    groupLabel: "Building Area",
    exclusive: true,
    fields: [
      {
        fieldName: "building_footprint_area",
        fieldLabel: "Building Footprint Area in Sq-Metres",
        uom: "m²",
        valueType: "number",
        inputType: "textbox",
        isRequired: true,
      },
      {
        fieldName: "lot_coverage_percent",
        fieldLabel: "Lot Coverage %",
        valueType: "number",
        inputType: "textbox",
        isRequired: true,
      },
    ],
  },
  {
    fieldName: "zone_type",
    fieldLabel: "Zone Type",
    inputType: "dropdown",
    valueType: "string",
    options: [
      "All Zones (0, 101)",
      "Residential (0)",
      "Residential Apartment (101)",
    ],
    isRequired: true,
  },
  {
    groupName: "building_height",
    groupLabel: "Building Height",
    exclusive: true,
    fields: [
      {
        fieldName: "ht_height",
        fieldLabel: "Building Height in Metres",
        inputType: "text",
        valueType: "number",
        isRequired: true,
      },
      {
        fieldName: "ht_stories",
        fieldLabel: "Building Stories",
        inputType: "dropdown",
        valueType: "number",
        options: ["No Selection", 1, 2, 3, 4, 5, 6],
        isRequired: true,
      },
    ],
  },
  {
    fieldName: "frontage",
    fieldLabel: "Frontage in Metres",
    inputType: "text",
    valueType: "number",
    isRequired: true,
  },
];
