import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // Import Tailwind CSS

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element with id 'app' not found!");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
