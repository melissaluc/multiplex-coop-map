"use client";

import { Button } from "@chakra-ui/react";
import { toaster } from "./toaster";
import { useState } from "react";

type ExportDataButtonProps = {
  setUnhide?: boolean;
};

export default function ExportDataButton({}: ExportDataButtonProps): React.JSX.Element {
  // TODO: Figure out where to trigger disabled on the entire form element
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  return (
    <Button
      hidden={setUnhide}
      variant="outline"
      size="sm"
      disabled={isDisabled}
      onClick={() => {
        const promise = new Promise<void>((resolve) => {
          setIsDisabled(true);
          setTimeout(() => resolve(), 5000);
        });

        toaster.promise(promise, {
          success: {
            title: "Successfully exported filtered data view!",
            description: "File downloaded as GeoJSON",
          },
          error: {
            title: "Export failed",
            description: "Something went wrong with the export",
          },
          loading: {
            title: "Exporting data to GeoJSON...",
            description: "Please wait",
          },
        });
      }}
    >
      Export Data
    </Button>
  );
}
