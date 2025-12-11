/**
 * Fernando Ferreyra
 * CNumber: C0943320
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styling

// AG Grid Community setup
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

// Register all AG Grid Community modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Create root and render the App
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
