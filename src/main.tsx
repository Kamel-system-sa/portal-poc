import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "antd/dist/reset.css";
import "./i18n";

import PortalLayout from "./layouts/PortalLayout";
import HomePage from "./pages/HomePage";
import TestPage from "./pages/TestPage";
import ServiceCentersPage from "./pages/ServiceCentersPage";
import HRDashboardPage from "./pages/HRDashboardPage";
import HousingDashboardPage from "./pages/HousingPages/HousingDashboardPage";
import HotelHousingPage from "./pages/HousingPages/HotelHousingPage";
import BuildingHousingPage from "./pages/HousingPages/BuildingHousingPage";
import MinaHousingPage from "./pages/HousingPages/MinaHousingPage";
import ArafatHousingPage from "./pages/HousingPages/ArafatHousingPage";
import PilgrimsListPage from "./pages/HousingPages/PilgrimsListPage";
import PilgrimDetailsPage from "./pages/HousingPages/PilgrimDetailsPage";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PortalLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "test", element: <TestPage /> },
      { path: "service-centers", element: <ServiceCentersPage /> },
      { path: "hr", element: <HRDashboardPage /> },
      { path: "housing", element: <HousingDashboardPage /> },
      { path: "housing/hotels", element: <HotelHousingPage /> },
      { path: "housing/buildings", element: <BuildingHousingPage /> },
      { path: "housing/mina", element: <MinaHousingPage /> },
      { path: "housing/arafat", element: <ArafatHousingPage /> },
      { path: "housing/pilgrims", element: <PilgrimsListPage /> },
      { path: "housing/pilgrims/:id", element: <PilgrimDetailsPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
