import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { WebSocketProvider } from "./shared/context/WebSocketContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  </ThemeProvider>
);
