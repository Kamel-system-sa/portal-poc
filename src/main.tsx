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
import OrganizersPage from "./pages/OrganizersPage";
import HRDashboardPage from "./pages/HRDashboardPage";
import HousingDashboardPage from "./pages/HousingPages/HousingDashboardPage";
import HotelHousingPage from "./pages/HousingPages/HotelHousingPage";
import BuildingHousingPage from "./pages/HousingPages/BuildingHousingPage";
import MinaHousingPage from "./pages/HousingPages/MinaHousingPage";
import ArafatHousingPage from "./pages/HousingPages/ArafatHousingPage";
import PilgrimsListPage from "./pages/HousingPages/PilgrimsListPage";
import PilgrimDetailsPage from "./pages/HousingPages/PilgrimDetailsPage";
import ReportsPage from "./pages/HousingPages/ReportsPage";
import PreArrivalDashboardPage from "./pages/ReceptionPages/PreArrivalDashboardPage";
import PreDepartureDashboardPage from "./pages/ReceptionPages/PreDepartureDashboardPage";
import ReceptionDashboardPage from "./pages/ReceptionPages/ReceptionDashboardPage";
import PortsListPage from "./pages/ReceptionPages/PortsListPage";
import CampaignsListPage from "./pages/ReceptionPages/CampaignsListPage";
import CampaignsRegistrationPage from "./pages/ReceptionPages/CampaignsRegistrationPage";
import PublicAffairsDashboardPage from "./pages/PublicAffairsPages/PublicAffairsDashboardPage";
import DeathCasesPage from "./pages/PublicAffairsPages/DeathCasesPage";
import HospitalizedCasesPage from "./pages/PublicAffairsPages/HospitalizedCasesPage";
import OtherIncidentsPage from "./pages/PublicAffairsPages/OtherIncidentsPage";
import App from "./App";
import { UserRoleProvider } from "./contexts/UserRoleContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PortalLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "test", element: <TestPage /> },
      { path: "service-centers", element: <ServiceCentersPage /> },
      { path: "organizers", element: <OrganizersPage /> },
      { path: "hr", element: <HRDashboardPage /> },
      { path: "housing", element: <HousingDashboardPage /> },
      { path: "housing/hotels", element: <HotelHousingPage /> },
      { path: "housing/buildings", element: <BuildingHousingPage /> },
      { path: "housing/mina", element: <MinaHousingPage /> },
      { path: "housing/arafat", element: <ArafatHousingPage /> },
      { path: "housing/reports", element: <ReportsPage /> },
      { path: "housing/pilgrims/:id", element: <PilgrimDetailsPage /> },
      { path: "reception", element: <ReceptionDashboardPage /> },
      { path: "reception/dashboard", element: <ReceptionDashboardPage /> },
      { path: "reception/pre-arrival", element: <PreArrivalDashboardPage /> },
      { path: "reception/pre-arrival/list", element: <PreArrivalDashboardPage /> },
      { path: "reception/pre-arrival/departures", element: <PreDepartureDashboardPage /> },
      { path: "reception/ports", element: <PortsListPage /> },
      { path: "reception/ports/airports", element: <PortsListPage /> },
      { path: "reception/ports/land", element: <PortsListPage /> },
      { path: "reception/campaigns", element: <CampaignsListPage /> },
      { path: "reception/campaigns/register", element: <CampaignsRegistrationPage /> },
      { path: "public-affairs", element: <PublicAffairsDashboardPage /> },
      { path: "public-affairs/deaths", element: <DeathCasesPage /> },
      { path: "public-affairs/hospitalized", element: <HospitalizedCasesPage /> },
      { path: "public-affairs/other-incidents", element: <OtherIncidentsPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserRoleProvider>
      <RouterProvider router={router} />
    </UserRoleProvider>
  </React.StrictMode>
);
