import {
  Button,
  Field,
  Fieldset,
  For,
  Input,
  NativeSelect,
  Stack,
  Box,
  SegmentGroup,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import ExportDataButton from "./ExportDataButton";

type DropDownFieldProps = {
  optionsList: Array<string | number>;
  fieldLabel: string;
  fieldName?: string;
};

type FieldPickControlProps = {
  optionsList: Array<string>;
  sizeList: Array<"sm" | "md" | "lg">;
  selectValue?: string | null;
  handleChangeValue?: (value: string) => void;
};

function FieldPickControl({
  optionsList,
  sizeList,
  selectValue,
  handleChangeValue,
}: FieldPickControlProps): React.JSX.Element {
  const [value, setValue] = useState<string>(selectValue ?? optionsList[0]);
  const handleOnValueChange = (e: SegmentGroup.ValueChangeDetails) => {
    const newValue = e.value;
    if (typeof newValue === "string") {
      setValue(newValue);
      handleChangeValue?.(newValue);
    }
  };
  return (
    <Stack gap="5" align="flex-start">
      <For each={sizeList}>
        {(size) => (
          <VStack key={size} align="flex-start">
            <SegmentGroup.Root
              size={size}
              value={value}
              onValueChange={(e) => handleOnValueChange(e)}
            >
              <SegmentGroup.Indicator />
              <SegmentGroup.Items items={optionsList} />
            </SegmentGroup.Root>
          </VStack>
        )}
      </For>
    </Stack>
  );
}

function DropDownField({
  optionsList,
  fieldLabel,
  fieldName,
}: DropDownFieldProps): React.JSX.Element {
  let field_Name = fieldName;
  if (field_Name === undefined) {
    field_Name = fieldLabel.toLowerCase().replace(/\s+/g, "_");
  }
  return (
    <Field.Root>
      <Field.Label>{fieldLabel}</Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field name={field_Name}>
          <For each={optionsList}>
            {(item) => (
              <option key={item} value={item}>
                {item}
              </option>
            )}
          </For>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Field.Root>
  );
}

export default function InputForm(): React.JSX.Element {
  const [unhideExportBtn, setUnhideExportBtn] = useState<boolean>(true);
  const [heightFieldPick, setHeightFieldPick] = useState<string>("Height");
  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUnhideExportBtn(false);
  };

  const handleOnChangeHeightFieldPick = (value: string) => {
    setHeightFieldPick(value);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <Fieldset.Root size="lg" maxW="md">
        <Stack>
          <Fieldset.Legend>Filter Property Boundaries</Fieldset.Legend>
          <Fieldset.HelperText>
            Use the form to filter property boundaries meeting zoning by-laws
            criteria based on multiplex housing attributes
          </Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <DropDownField
            optionsList={[
              "All Resdidential Zoning (0, 101, 6)",
              "Residential (0)",
              "Residential Apartment (101)",
              "Commercial Residential (6)",
            ]}
            fieldLabel="Zoning Type"
            fieldName="zn_type"
          />
          <Field.Root>
            <Field.Label>Lot Area in Sq Metres</Field.Label>
            <Input name="zn_area" />
          </Field.Root>

          <Field.Root>
            <Field.Label>Floor Space Index (FSI) </Field.Label>
            <Input name="fsi_total" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Building Percent Coverage</Field.Label>
            <Input name="prcnt_cver" />
          </Field.Root>

          {/* Allow user to choose between storey or height 
              If storey, then height should be auto-calculated using OBC or a standard value
          */}
          <FieldPickControl
            optionsList={["Height", "Stories"]}
            sizeList={["sm"]}
            selectValue={heightFieldPick}
            handleChangeValue={handleOnChangeHeightFieldPick}
          />
          {heightFieldPick === "Height" ? (
            <Field.Root>
              <Field.Label>Height in Metres</Field.Label>
              <Input
                name="ht_height"
                onChange={(e) => {
                  setHeightFieldPick(e.target.value);
                }}
              />
            </Field.Root>
          ) : (
            <DropDownField
              optionsList={[1, 2, 3, 4, 5, 6]}
              fieldLabel="Stories"
              fieldName="ht_stories"
            />
          )}
        </Fieldset.Content>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          gap={2}
          mt={4}
        >
          <Button type="submit" alignSelf="flex-start">
            Filter
          </Button>
          {/* TODO: Add export data (GeoJSON first then add options in future) feature */}
          <ExportDataButton setUnhide={unhideExportBtn} />
        </Box>
      </Fieldset.Root>
    </form>
  );
}
