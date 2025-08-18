import {
  Button,
  Fieldset,
  Stack,
  Box,
  Field,
  FieldRoot,
  VStack,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import ExportDataButton from "../ExportDataButton";
import { fields } from "./fieldsConfig";
import type {
  FieldGroup,
  BaseField,
  FieldType,
  OptionField,
} from "./fieldsConfig";
import RenderField from "./FormFields";
import type { GetInputTypeProps } from "./FormFields";
import { FailureAlert } from "../Alert";
import { toaster } from "../toaster";
import { GeoDataContext } from "../../../contexts/GeoDataContext";
type RenderFieldType = BaseField & GetInputTypeProps;
type RenderGroupType = FieldGroup & GetInputTypeProps;

function isBaseField(item: FieldType): item is RenderFieldType {
  return "fieldName" in item;
}

function isGroupField(item: FieldType): item is RenderGroupType {
  return "groupName" in item && "fields" in item;
}

export default function InputForm(): React.JSX.Element {
  const {
    mapLoading,
    setMapLoading,
    setGeojson,
    filterData,
    setFilterData,
    setPropertyStats,
    loadResults,
  } = useContext(GeoDataContext);
  const [showFailureAlert, setShowFailureAlert] = useState<boolean>(false);
  const [unhideExportBtn, setUnhideExportBtn] = useState<boolean>(true);
  const [heightFieldPick, setHeightFieldPick] = useState<string>("Height");
  const [disableFilter, setDisableFilter] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    filters: {
      ParkingZoneOverlay: false,
    },
    queries: {
      ZoningHeightOverlay: {
        HT_STORIES: 6,
        HT_LABEL: null,
      },
      ZoningArea: {
        GEN_ZONE: [0, 101],
        FRONTAGE: 10,
        ZN_AREA: 190,
        UNITS: 6,
        FSI_TOTAL: null,
        AREA_UNITS: null,
        PRCNT_RES: null,
      },
    },
  });

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUnhideExportBtn(false);
    setDisableFilter(true);
    setFilterData(true);
    console.log("Running overlay analysis");
    setShowFailureAlert(true);

    (async () => {
      await loadResults();
      setDisableFilter(false);
      setFilterData(false);
      // try {
      //   const response = await fetch(
      //     `${import.meta.env.VITE_API_BASE_URL}/filter-properties`,
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(formData),
      //     }
      //   );
      //   console.log(await response.json());
      //   console.log("Property boundaries filtered successfully");
      // } catch (error) {
      //   console.error("Error filtering property boundaries:", error);
      //   setShowFailureAlert(true);
      // } finally {
      //   setDisableFilter(false);
      // }
    })();
  };

  const handleOnChangeHeightFieldPick = (value: string) => {
    setHeightFieldPick(value);
  };

  const handleSetShowFailureAlert = (value: boolean) => {
    setShowFailureAlert(value);
  };
  return (
    <>
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
            <VStack spaceY={10}>
              {fields.map((item) => {
                if (isBaseField(item)) {
                  return (
                    <RenderField
                      key={item.fieldName}
                      inputType={item.inputType || ""}
                      optionsList={((item as OptionField).options ?? []).filter(
                        (opt): opt is string | number =>
                          typeof opt === "string" || typeof opt === "number"
                      )}
                      fieldLabel={item.fieldLabel}
                      fieldName={item.fieldName}
                      selectValue={item.selectValue || ""}
                      handleChangeValue={item.handleChangeValue}
                    />
                  );
                }

                if (isGroupField(item)) {
                  return (
                    <Field.Root key={item.groupName}>
                      <Box
                        border={"1px solid"}
                        borderColor="gray.200"
                        p={4}
                        width={"100%"}
                      >
                        <Field.Label color={"gray.600"}>
                          {item.groupLabel}
                        </Field.Label>
                        {item.fields.map((subItem) => {
                          if (isBaseField(subItem)) {
                            return (
                              <RenderField
                                key={subItem.fieldName}
                                inputType={subItem.inputType || ""}
                                optionsList={(
                                  (subItem as OptionField).options ?? []
                                ).filter(
                                  (opt): opt is string | number =>
                                    typeof opt === "string" ||
                                    typeof opt === "number"
                                )}
                                fieldLabel={subItem.fieldLabel}
                                fieldName={subItem.fieldName}
                                selectValue={subItem.selectValue || ""}
                                handleChangeValue={subItem.handleChangeValue}
                              />
                            );
                          }
                          return null;
                        })}
                      </Box>
                    </Field.Root>
                  );
                }
              })}
            </VStack>
          </Fieldset.Content>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            gap={2}
            mt={4}
          >
            <Button
              disabled={disableFilter}
              loading={disableFilter}
              loadingText={
                mapLoading & filterData ? "Loading..." : "Filtering..."
              }
              type="submit"
              alignSelf="flex-start"
            >
              Filter
            </Button>

            {/* TODO: Add export data (GeoJSON first then add options in future) feature */}
            <ExportDataButton />
          </Box>
          {showFailureAlert && (
            <FailureAlert
              handleSetShowFailureAlert={handleSetShowFailureAlert}
            />
          )}
        </Fieldset.Root>
      </form>
      {/* {showFailureAlert &&
        toaster.create({
          title: `Error filtering property boundaries`,
          type: "error",
        })} */}
    </>
  );
}
