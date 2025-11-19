import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "antd/dist/reset.css";
import "./i18n";

import PortalLayout from "./layouts/PortalLayout";
import TestPage from "./pages/TestPage";
import ServiceCentersPage from "./pages/ServiceCentersPage";
import HomePage from "./pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PortalLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "test", element: <TestPage /> },
      { path: "service-centers", element: <ServiceCentersPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
