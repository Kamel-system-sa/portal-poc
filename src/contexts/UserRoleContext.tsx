import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = 
  | "main-admin"
  | "housing-user"
  | "company-user"
  | "service-center-user"
  | "department-user"
  | "pmo-user";

interface UserRoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  availableRoles: UserRole[];
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

const STORAGE_KEY = "portal_user_role";

const availableRoles: UserRole[] = [
  "main-admin",
  "housing-user",
  "company-user",
  "service-center-user",
  "department-user",
  "pmo-user",
];

interface UserRoleProviderProps {
  children: ReactNode;
}

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    // Load from localStorage or default to main-admin
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && availableRoles.includes(stored as UserRole)) {
      return stored as UserRole;
    }
    return "main-admin";
  });

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    localStorage.setItem(STORAGE_KEY, role);
  };

  // Sync with localStorage changes (for multi-tab support)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        if (availableRoles.includes(e.newValue as UserRole)) {
          setCurrentRoleState(e.newValue as UserRole);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <UserRoleContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        availableRoles,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
};

