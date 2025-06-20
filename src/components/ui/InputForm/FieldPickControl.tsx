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
import React, { useState } from "react";

export type FieldPickControlProps = {
  optionsList: Array<string | number>;
  selectValue?: string | number | null;
  handleChangeValue?: (value: string) => void;
};

export function FieldPickControl({
  optionsList,
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
      <For each={optionsList}>
        {(option) => (
          <VStack key={option} align="flex-start">
            <SegmentGroup.Root
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
