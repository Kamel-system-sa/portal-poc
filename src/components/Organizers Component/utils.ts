// Removed Firebase dependency
import type { Organizer } from "./types";

export const saveToLocalStorage = (data: Organizer[], storageKey: string) => {
  try {
    const dataToSave = data.map((org) => ({
      ...org,
      createdAt: org.createdAt ? {
        seconds: org.createdAt.seconds || Date.now() / 1000,
        nanoseconds: org.createdAt.nanoseconds || 0
      } : { seconds: Date.now() / 1000, nanoseconds: 0 }
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
        let createdAt = Timestamp.now();
        if (org.createdAt) {
          if (org.createdAt.seconds) {
            createdAt = Timestamp.fromMillis(org.createdAt.seconds * 1000);
          } else if (typeof org.createdAt === 'number') {
            createdAt = Timestamp.fromMillis(org.createdAt);
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

