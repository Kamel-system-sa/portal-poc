// Removed Firebase dependency
import type { Organizer } from "./types";

export const saveToLocalStorage = (data: Organizer[], storageKey: string) => {
  try {
    const dataToSave = data.map((org) => ({
      ...org,
      createdAt: org.createdAt instanceof Date 
        ? org.createdAt.toISOString() 
        : typeof org.createdAt === 'string' 
          ? org.createdAt 
          : new Date().toISOString()
    }));
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const loadFromLocalStorage = (storageKey: string): Organizer[] => {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((org: any) => {
        let createdAt: string | Date = new Date();
        if (org.createdAt) {
          if (typeof org.createdAt === 'string') {
            createdAt = org.createdAt;
          } else if (org.createdAt.seconds) {
            // Handle legacy Firebase Timestamp format
            createdAt = new Date(org.createdAt.seconds * 1000).toISOString();
          } else if (typeof org.createdAt === 'number') {
            createdAt = new Date(org.createdAt).toISOString();
          } else if (org.createdAt instanceof Date) {
            createdAt = org.createdAt.toISOString();
          }
        }
        return {
          ...org,
          createdAt
        };
      });
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }
  return [];
};

