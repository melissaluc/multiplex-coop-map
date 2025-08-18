import { Alert, CloseButton } from "@chakra-ui/react";

export const FailureAlert = ({ handleSetShowFailureAlert }) => {
  const onClose = () => {
    handleSetShowFailureAlert(false);
  };
  return (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Failed to Generate Results</Alert.Title>
        <Alert.Description>
          An error occurred while generating the results. Please try again
          later. If the problem persists, contact support.
        </Alert.Description>
      </Alert.Content>
      <CloseButton pos="relative" top="-2" insetEnd="-2" onClick={onClose} />
    </Alert.Root>
  );
};
