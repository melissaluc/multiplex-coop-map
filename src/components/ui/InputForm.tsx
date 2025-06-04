import {
  Button,
  Field,
  Fieldset,
  For,
  Input,
  NativeSelect,
  Stack,
} from "@chakra-ui/react";

export default function InputForm(): React.JSX.Element {
  return (
    <Fieldset.Root size="lg" maxW="md">
      <Stack>
        <Fieldset.Legend>Filter Property Boundaries</Fieldset.Legend>
        <Fieldset.HelperText>
          Use the form to filter property boundaries satisfying zoning by-laws
          based on multiplex housing attributes
        </Fieldset.HelperText>
      </Stack>

      <Fieldset.Content>
        <Field.Root>
          <Field.Label>Zoning Category</Field.Label>
          <Input name="zn_zone" />
        </Field.Root>

        <Field.Root>
          {/* Meet minimum lot area */}
          <Field.Label>Lot Area</Field.Label>
          <Input name="zn_area" />
        </Field.Root>
        <Field.Root>
          {/* Meet minimum lot area */}
          <Field.Label>Height</Field.Label>
          <Input name="height" />
        </Field.Root>

        <Field.Root>
          <Field.Label>Stories</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field name="country">
              <For each={[2, 3, 4, 5, 6]}>
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
      </Fieldset.Content>

      <Button type="submit" alignSelf="flex-start">
        Filter
      </Button>
    </Fieldset.Root>
  );
}
