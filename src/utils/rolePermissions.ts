import type { UserRole } from "../contexts/UserRoleContext";

export type MenuKey = 
  | "home"
  | "service-centers"
  | "organizers"
  | "organizers-list"
  | "organizers-campaigns"
  | "hr"
  | "hr-dashboard"
  | "hr-shift-schedules"
  | "hr-attendance"
  | "hr-leaves"
  | "hr-employees"
  | "hr-reports"
  | "housing"
  | "housing-dashboard"
  | "housing-hotels"
  | "housing-buildings"
  | "housing-mina"
  | "housing-arafat"
  | "housing-reports"
  | "mashair"
  | "mashair-dashboard"
  | "mashair-mina"
  | "mashair-arafat"
  | "reception"
  | "reception-dashboard"
  | "reception-pre-arrival-arrivals"
  | "reception-pre-arrival-departures"
  | "reception-ports"
  | "reception-reports"
  | "organizers-campaigns"
  | "reception-centers-dashboard"
  | "public-affairs"
  | "public-affairs-dashboard"
  | "public-affairs-deaths"
  | "public-affairs-hospitalized"
  | "public-affairs-other"
  | "finance"
  | "test";

// Define which menu items each role can access
const rolePermissions: Record<UserRole, MenuKey[]> = {
  "main-admin": [
    "home",
    "service-centers",
    "organizers",
    "organizers-list",
    "organizers-campaigns",
    "hr",
    "hr-dashboard",
    "hr-shift-schedules",
    "hr-attendance",
    "hr-leaves",
    "hr-employees",
    "hr-reports",
    "housing",
    "housing-dashboard",
    "housing-hotels",
    "housing-buildings",
    "housing-reports",
    "mashair",
    "mashair-dashboard",
    "mashair-mina",
    "mashair-arafat",

    // reception permissions
    "reception",
    "reception-dashboard",
    "reception-pre-arrival-arrivals",
    "reception-pre-arrival-departures",
    "reception-ports",
    "reception-reports",
    "organizers-campaigns",
    "reception-centers-dashboard",

    // public affairs permissions
    "public-affairs",
    "public-affairs-dashboard",
    "public-affairs-deaths",
    "public-affairs-hospitalized",
    "public-affairs-other",

    // finance permissions
    "finance",

    "test",
  ],
  "housing-user": [
    "home",
    "housing",
    "housing-dashboard",
    "housing-hotels",
    "housing-buildings",
    "housing-reports",
    "mashair",
    "mashair-dashboard",
    "mashair-mina",
    "mashair-arafat",
  ],
  "company-user": [
    "home",
    "organizers",
    "organizers-list",
    "organizers-campaigns",
  ],
  "service-center-user": [
    "home",
    "service-centers",
  ],
  "department-user": [
    "home",
    "hr",
    "hr-dashboard",
    "hr-shift-schedules",
    "hr-attendance",
    "hr-leaves",
    "hr-employees",
    "hr-reports",
  ],
  "pmo-user": [
    "home",
    "service-centers",
    "organizers",
    "organizers-list",
    "organizers-campaigns",
    "hr",
    "hr-dashboard",
    "hr-shift-schedules",
    "hr-attendance",
    "hr-leaves",
    "hr-employees",
    "hr-reports",
  ],
};

export const hasPermission = (role: UserRole, menuKey: MenuKey): boolean => {
  const permissions = rolePermissions[role] || [];
  return permissions.includes(menuKey);
};

export const getRoleDisplayName = (role: UserRole): string => {
  const displayNames: Record<UserRole, string> = {
    "main-admin": "Main Admin",
    "housing-user": "Housing User",
    "company-user": "Company User",
    "service-center-user": "Service Center User",
    "department-user": "Department User",
    "pmo-user": "PMO User",
  };
  return displayNames[role];
};
