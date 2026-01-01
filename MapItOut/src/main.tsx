import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./pages/App.tsx";
import POI from "./pages/POI.tsx";
import {
  RouteLoaderOverlay,
  RouteLoaderProvider,
} from "./components/Loader/RouteLoader.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <RouteLoaderProvider>
        <RouteLoaderOverlay />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/:modelId" element={<POI />} />
        </Routes>
      </RouteLoaderProvider>
    </BrowserRouter>
  </StrictMode>
);
