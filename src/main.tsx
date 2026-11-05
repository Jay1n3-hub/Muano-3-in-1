import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { LogoProvider } from "./context/LogoContext";
import { DesignProvider } from "./context/DesignContext";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LogoProvider>
          <DesignProvider>
            <App />
          </DesignProvider>
        </LogoProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
