import { For, Stack, SegmentGroup, VStack } from "@chakra-ui/react";
import React, { useState } from "react";

export type FieldPickControlProps = {
  optionsList: Array<string | number | OptionsListObject>;
  selectValue?: string | number;
  handleChangeValue?: (value: string) => void;
};

type OptionsListObject = {
  show: string;
  value: boolean;
};

export function FieldPickControl({
  optionsList,
  selectValue,
  handleChangeValue,
}: FieldPickControlProps): React.JSX.Element {
  const [fieldValue, setFieldValue] = useState(selectValue ?? optionsList[0]);
  const handleOnValueChange = (e: SegmentGroup.ValueChangeDetails) => {
    const newValue = e.value;
    if (typeof newValue === "string") {
      setFieldValue(newValue);
      handleChangeValue?.(newValue);
    }
  };
  return (
    <Stack gap="5" align="flex-start">
      <For each={optionsList}>
        {() => (
          // change key b/s not unique
          <VStack align="flex-start">
            <SegmentGroup.Root
              value={fieldValue?.toString()} // see how you can manage the types
              onValueChange={(e) => handleOnValueChange(e)}
            >
              <SegmentGroup.Indicator />
              <SegmentGroup.Items
                items={optionsList.map((opt) => opt.show.toString())} // see how you can manage the types
              />
            </SegmentGroup.Root>
          </VStack>
        )}
      </For>
    </Stack>
  );
}
