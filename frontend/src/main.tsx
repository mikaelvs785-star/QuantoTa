import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import "./services/interceptors";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider><QueryProvider><AuthProvider><App /><Toaster position="top-right" toastOptions={{ duration: 4000 }} /></AuthProvider></QueryProvider></ThemeProvider>
  </React.StrictMode>
);
