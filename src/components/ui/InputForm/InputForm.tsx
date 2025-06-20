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
import ExportDataButton from "../ExportDataButton";
import { fields } from "./fieldsCOnfig";
import RenderField from "./FormFields";
import RenderGroup from "./FieldGroup";

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
          {fields.map((item) => {
            if (item.fieldName) {
              return (
                <RenderField
                  key={item.fieldName}
                  inputType={item.inputType}
                  optionsList={item.optionsList}
                  fieldLabel={item.fieldLabel}
                  fieldName={item.fieldName}
                  selectValue={item.selectValue}
                  handleChangeValue={item.handleChangeValue}
                />
              );
            }
            if (item.groupName) {
              return (
                <RenderGroup
                  key={item.groupName}
                  groupName={item.groupName}
                  groupFields={item.groupFields}
                />
              );
            }
            return null;
          })}
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
          <ExportDataButton />
        </Box>
      </Fieldset.Root>
    </form>
  );
}
