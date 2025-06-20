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
import {
  FieldPickControl,
  type FieldPickControlProps,
} from "./FieldPickControl";
import React, { useState } from "react";

type FieldPickControlFieldProps = FieldPickControlProps & {
  fieldName: string | undefined;
  fieldLabel: string;
};

type DropDownFieldProps = {
  optionsList: Array<string | number>;
  fieldLabel: string;
  fieldName?: string;
};
type TextFieldProps = {
  fieldLabel: string;
  fieldName?: string;
};

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

function TextField({
  fieldLabel,
  fieldName,
}: TextFieldProps): React.JSX.Element {
  return (
    <Field.Root>
      <Field.Label>{fieldLabel}</Field.Label>
      <Input name={fieldName} />
    </Field.Root>
  );
}

function FieldPickControlField({
  fieldLabel,
  fieldName,
  optionsList,
  selectValue,
  handleChangeValue,
}: FieldPickControlFieldProps): React.JSX.Element {
  return (
    <Field.Root>
      <Field.Label>{fieldLabel || fieldName}</Field.Label>
      <FieldPickControl
        optionsList={optionsList}
        selectValue={selectValue}
        handleChangeValue={handleChangeValue}
      />
    </Field.Root>
  );
}

type GetInputTypeProps = {
  inputType: string;
  optionsList?: Array<string | number>;
  fieldLabel?: string;
  fieldName?: string;
  selectValue?: number | string | null;
  handleChangeValue?: (value: string) => void;
};

export default function RenderField({
  inputType,
  optionsList = [],
  fieldLabel = "",
  fieldName,
  selectValue,
  handleChangeValue,
}: GetInputTypeProps): React.JSX.Element {
  switch (inputType) {
    case "dropdown":
      return (
        <DropDownField
          optionsList={optionsList}
          fieldLabel={fieldLabel}
          fieldName={fieldName}
        />
      );
    case "text":
      return <TextField fieldLabel={fieldLabel} fieldName={fieldName} />;
    case "fieldpick":
      return (
        <FieldPickControlField
          fieldLabel={fieldLabel}
          fieldName={fieldName}
          optionsList={optionsList}
          selectValue={selectValue}
          handleChangeValue={handleChangeValue}
        />
      );
    default:
      return <></>;
  }
}
