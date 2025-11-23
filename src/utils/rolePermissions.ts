import type { UserRole } from "../contexts/UserRoleContext";

export type MenuKey = 
  | "home"
  | "service-centers"
  | "organizers"
  | "hr"
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
  | "reception-campaigns"
  | "reception-centers-dashboard"
  | "public-affairs"
  | "public-affairs-dashboard"
  | "public-affairs-deaths"
  | "public-affairs-hospitalized"
  | "public-affairs-other"
  | "test";

// Define which menu items each role can access
const rolePermissions: Record<UserRole, MenuKey[]> = {
  "main-admin": [
    "home",
    "service-centers",
    "organizers",
    "hr",
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
    "reception-campaigns",
    "reception-centers-dashboard",

    // public affairs permissions
    "public-affairs",
    "public-affairs-dashboard",
    "public-affairs-deaths",
    "public-affairs-hospitalized",
    "public-affairs-other",

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
  ],
  "service-center-user": [
    "home",
    "service-centers",
  ],
  "department-user": [
    "home",
    "hr",
  ],
  "pmo-user": [
    "home",
    "service-centers",
    "organizers",
    "hr",
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
