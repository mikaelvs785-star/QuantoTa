import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryProvider } from "./contexts/QueryProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider><QueryProvider><App /></QueryProvider></ThemeProvider>
  </React.StrictMode>
);
