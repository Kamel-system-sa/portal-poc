import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "antd/dist/reset.css";
import "./i18n";

// Additional React DevTools error suppression (backup)
if (typeof window !== 'undefined') {
  // Suppress console errors from React DevTools
  const originalError = console.error;
  console.error = function(...args: any[]) {
    const message = args[0]?.toString() || '';
    if (message.includes('Invalid argument not valid semver') || 
        message.includes('react_devtools_backend') ||
        message.includes('semver')) {
      return; // Suppress
    }
    originalError.apply(console, args);
  };

  // Global error handler backup
  window.addEventListener('error', function(e) {
    if (e.message && (
        e.message.includes('semver') || 
        e.message.includes('react_devtools_backend') ||
        e.message.includes('Invalid argument not valid semver')
      )) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', function(e) {
    if (e.reason && typeof e.reason === 'object' && e.reason.message) {
      const msg = e.reason.message.toString();
      if (msg.includes('semver') || msg.includes('react_devtools_backend')) {
        e.preventDefault();
        return false;
      }
    }
  });
}

import PortalLayout from "./layouts/PortalLayout";
import HomePage from "./pages/HomePage";
import TestPage from "./pages/TestPage";
import ServiceCentersPage from "./pages/ServiceCentersPage";
import ServiceCenterReportsPage from "./pages/ServiceCentersPages/ReportsPage";
import OrganizersPage from "./pages/OrganizersPage";
import HRDashboardPage from "./pages/HRDashboardPage";
import ShiftSchedulesPage from "./pages/HRPages/ShiftSchedulesPage";
import AttendancePage from "./pages/HRPages/AttendancePage";
import LeavesPage from "./pages/HRPages/LeavesPage";
import EmployeesPage from "./pages/HRPages/EmployeesPage";
import HRReportsPage from "./pages/HRPages/ReportsPage";
import HousingDashboardPage from "./pages/HousingPages/HousingDashboardPage";
import HotelHousingPage from "./pages/HousingPages/HotelHousingPage";
import BuildingHousingPage from "./pages/HousingPages/BuildingHousingPage";
import MinaHousingPage from "./pages/HousingPages/MinaHousingPage";
import ArafatHousingPage from "./pages/HousingPages/ArafatHousingPage";
import PilgrimDetailsPage from "./pages/HousingPages/PilgrimDetailsPage";
import ReportsPage from "./pages/HousingPages/ReportsPage";
import MashairDashboardPage from "./pages/HousingPages/MashairDashboardPage";
import PreArrivalDashboardPage from "./pages/ReceptionPages/PreArrivalDashboardPage";
import PreDepartureDashboardPage from "./pages/ReceptionPages/PreDepartureDashboardPage";
import ReceptionDashboardPage from "./pages/ReceptionPages/ReceptionDashboardPage";
import ReceptionReportsPage from "./pages/ReceptionPages/ReportsPage";
import PortsDashboardPage from "./pages/ReceptionPages/PortsDashboardPage";
import CampaignsListPage from "./pages/OrganizersPages/CampaignsListPage";
import CampaignsRegistrationPage from "./pages/OrganizersPages/CampaignsRegistrationPage";
import CentersDashboardPage from "./pages/ReceptionPages/CentersDashboardPage";
import PublicAffairsDashboardPage from "./pages/PublicAffairsPages/PublicAffairsDashboardPage";
import DeathCasesPage from "./pages/PublicAffairsPages/DeathCasesPage";
import HospitalizedCasesPage from "./pages/PublicAffairsPages/HospitalizedCasesPage";
import OtherIncidentsPage from "./pages/PublicAffairsPages/OtherIncidentsPage";
import PublicAffairsReportsPage from "./pages/PublicAffairsPages/PublicAffairsReportsPage";
import FinancePage from "./pages/FinancePage";
import TransportDashboardPage from "./pages/TransportPages/TransportDashboardPage";
import TransferInfoPage from "./pages/TransportPages/TransferInfoPage";
import InterCityTransfersPage from "./pages/TransportPages/InterCityTransfersPage";
import HolySitesTransfersPage from "./pages/TransportPages/HolySitesTransfersPage";
import NewServiceProofPage from "./pages/Passport/NewServiceProofPage";
import BoxArrangementPage from "./pages/Passport/BoxArrangementPage";
import VerifiedPilgrimsPage from "./pages/Passport/VerifiedPilgrimsPage";
import PassportReportsPage from "./pages/Passport/PassportReportsPage";
import { UserRoleProvider } from "./contexts/UserRoleContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PortalLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "test", element: <TestPage /> },
      { path: "service-centers", element: <ServiceCentersPage /> },
      { path: "service-centers/reports", element: <ServiceCenterReportsPage /> },
      { path: "organizers", element: <OrganizersPage /> },
      { path: "organizers/campaigns", element: <CampaignsListPage /> },
      { path: "organizers/campaigns/register", element: <CampaignsRegistrationPage /> },
      { path: "hr", element: <HRDashboardPage /> },
      { path: "hr/shift-schedules", element: <ShiftSchedulesPage /> },
      { path: "hr/attendance", element: <AttendancePage /> },
      { path: "hr/leaves", element: <LeavesPage /> },
      { path: "hr/employees", element: <EmployeesPage /> },
      { path: "hr/reports", element: <HRReportsPage /> },
      { path: "housing", element: <HousingDashboardPage /> },
      { path: "housing/hotels", element: <HotelHousingPage /> },
      { path: "housing/buildings", element: <BuildingHousingPage /> },
      { path: "housing/mina", element: <MinaHousingPage /> },
      { path: "housing/arafat", element: <ArafatHousingPage /> },
      { path: "housing/reports", element: <ReportsPage /> },
      { path: "housing/mashair", element: <MashairDashboardPage /> },
      { path: "housing/pilgrims/:id", element: <PilgrimDetailsPage /> },
      { path: "reception", element: <ReceptionDashboardPage /> },
      { path: "reception/dashboard", element: <ReceptionDashboardPage /> },
      { path: "reception/pre-arrival", element: <PreArrivalDashboardPage /> },
      { path: "reception/pre-arrival/list", element: <PreArrivalDashboardPage /> },
      { path: "reception/pre-arrival/departures", element: <PreDepartureDashboardPage /> },
      { path: "reception/ports", element: <PortsDashboardPage /> },
      { path: "reception/ports/airports", element: <PortsDashboardPage /> },
      { path: "reception/ports/land", element: <PortsDashboardPage /> },
      { path: "reception/centers-dashboard", element: <CentersDashboardPage /> },
      { path: "reception/reports", element: <ReceptionReportsPage /> },
      { path: "public-affairs", element: <PublicAffairsDashboardPage /> },
      { path: "public-affairs/deaths", element: <DeathCasesPage /> },
      { path: "public-affairs/hospitalized", element: <HospitalizedCasesPage /> },
      { path: "public-affairs/other-incidents", element: <OtherIncidentsPage /> },
      { path: "public-affairs/reports", element: <PublicAffairsReportsPage /> },
      { path: "finance", element: <FinancePage /> },
      { path: "transport", element: <TransportDashboardPage /> },
      { path: "transport/transfer-info", element: <TransferInfoPage /> },
      { path: "transport/inter-city", element: <InterCityTransfersPage /> },
      { path: "transport/holy-sites", element: <HolySitesTransfersPage /> },
      { path: "passport/box-arrangement", element: <BoxArrangementPage /> },
      { path: "passport/service-proof", element: <NewServiceProofPage /> },
      { path: "passport/verified-pilgrims", element: <VerifiedPilgrimsPage /> },
      { path: "passport/reports", element: <PassportReportsPage /> },
      { path: "passport", element: <NewServiceProofPage /> },
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
