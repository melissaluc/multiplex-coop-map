import { RenderField } from "./FormFields";
import React, { useState } from "react";
import {
  FieldPickControl,
  type FieldPickControlProps,
} from "./FieldPickControl";

export default function RenderGroup(): React.JSX.Element {
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
