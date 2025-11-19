import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "antd/dist/reset.css";
import "./i18n";

import PortalLayout from "./layouts/PortalLayout";
import TestPage from "./pages/TestPage";
import OrganizersPage from "./pages/OrganizersPage";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PortalLayout />,
    children: [
      { index: true, element: <App /> },
      { path: "test", element: <TestPage /> },
      { path: "organizers", element: <OrganizersPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
