import { Field, For, Input, NativeSelect } from "@chakra-ui/react";
import {
  FieldPickControl,
  type FieldPickControlProps,
} from "./FieldPickControl";
import React, { useState } from "react";

export type FieldPickControlFieldProps = FieldPickControlProps & {
  fieldName: string | undefined;
  fieldLabel: string;
};

export type DropDownFieldProps = {
  optionsList: Array<
    | string
    | number
    | boolean
    | { show: string; value: string | number | boolean }
  >;
  fieldLabel: string;
  fieldName?: string;
};
export type TextFieldProps = {
  fieldLabel: string;
  fieldName?: string;
};

export type GetInputTypeProps = {
  inputType: string;
  optionsList?: Array<
    | string
    | number
    | boolean
    | { show: string; value: string | number | boolean }
  >;
  fieldLabel?: string;
  fieldName?: string;
  selectValue?: number | string | null;
  handleChangeValue?: (value: string) => void;
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

  // Normalize options to { label, value } and filter out booleans
  const normalizedOptions = optionsList
    .filter((opt) => typeof opt !== "boolean")
    .map((opt) =>
      typeof opt === "object" && "show" in opt
        ? { label: opt.show, value: String(opt.value) }
        : { label: String(opt), value: String(opt) }
    );

  return (
    <Field.Root>
      <Field.Label>{fieldLabel}</Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field name={field_Name}>
          <For each={normalizedOptions}>
            {(item) => (
              <option key={item.value} value={item.value}>
                {item.label}
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

function normalizeOptions(
  rawOptions: Array<
    | string
    | number
    | boolean
    | { show: string; value: string | number | boolean }
  >
): { label: string; value: string }[] {
  return rawOptions.map((opt) =>
    typeof opt === "object" && "show" in opt
      ? { label: opt.show, value: String(opt.value) }
      : { label: String(opt), value: String(opt) }
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
        optionsList={normalizeOptions(optionsList)}
        selectValue={selectValue ?? undefined}
        handleChangeValue={handleChangeValue}
      />
    </Field.Root>
  );
}

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
          selectValue={selectValue ?? undefined}
          handleChangeValue={handleChangeValue}
        />
      );
    default:
      return <></>;
  }
}
