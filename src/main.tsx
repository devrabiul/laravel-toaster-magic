import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/components.css";
import "toaster-magic/css";

// import.meta.env.BASE_URL is "/laravel-toaster-magic/" in the GitHub Pages
// build and "/" in dev; strip the trailing slash for React Router's basename.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
