import "./App.css";
import React from "react";
import { AspectRatio, Heading, Box } from "@chakra-ui/react";
import Map from "./components/ui/Map";
import InputForm from "./components/ui/InputForm";

function App() {
  return (
    <React.Fragment>
      <Heading as="h2" size="md" mb={4}>
        Multiplex Coop Housing - Potential Property Sites
      </Heading>
      <Box>
        <Box
          flexDir={{ base: "column", md: "row-reverse" }}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={"4vw"}
        >
          <InputForm />
          <Box width={"90vw"}>
            <AspectRatio ratio={{ base: 1, md: 16 / 9 }}>
              <Map />
            </AspectRatio>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default App;
