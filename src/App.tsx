import "./App.css";
import React from "react";
import { AspectRatio, Heading, Box } from "@chakra-ui/react";
import Map from "./components/ui/Map";
import InputForm from "./components/ui/InputForm";
import { Toaster } from "./components/ui/toaster";
function App() {
  return (
    <React.Fragment>
      <Heading as="h1" size="md" mb={4}>
        Multiplex Coop Housing
      </Heading>
      <Box>
        <Box
          flexDir={{ base: "column", md: "row-reverse" }}
          display={"flex"}
          alignItems={{ base: "center", md: "flex-start" }}
          justifyContent={"space-between"}
          gap={{ base: "4vh", md: "4vw" }}
        >
          <InputForm />
          <Box width={"90vw"}>
            <AspectRatio ratio={{ base: 1, md: 16 / 9 }}>
              <Map />
            </AspectRatio>
          </Box>
        </Box>
      </Box>
      <Toaster />
    </React.Fragment>
  );
}

export default App;
