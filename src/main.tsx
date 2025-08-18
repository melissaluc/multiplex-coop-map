import { Provider } from "./components/ui/provider";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GeoDataProvider } from "./contexts/GeoDataContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <GeoDataProvider>
        <App />
      </GeoDataProvider>
    </Provider>
  </React.StrictMode>
);
