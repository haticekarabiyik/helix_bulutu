import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { FreighterProvider } from "./hooks/useFreighter";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FreighterProvider>
      <App />
    </FreighterProvider>
  </React.StrictMode>,
);