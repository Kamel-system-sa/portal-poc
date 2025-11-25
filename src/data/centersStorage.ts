import type { Center } from './mockCenters';
import { mockCenters } from './mockCenters';

// Local storage key
const STORAGE_KEY = 'service_centers';

// Get all centers from localStorage, merge with mock data
export const getCenters = (): Center[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const storedCenters: Center[] = JSON.parse(stored);
      // Merge with mock data, avoiding duplicates by ID
      const mockIds = new Set(mockCenters.map(c => c.id));
      const storedOnly = storedCenters.filter(c => !mockIds.has(c.id));
      return [...mockCenters, ...storedOnly];
    }
    return mockCenters;
  } catch {
    return mockCenters;
  }
};

// Save center to localStorage
export const saveCenter = (center: Center): void => {
  const allCenters = getCenters();
  const existingIndex = allCenters.findIndex(c => c.id === center.id);
  
  let updatedCenters: Center[];
  if (existingIndex >= 0) {
    updatedCenters = allCenters.map(c => (c.id === center.id ? center : c));
  } else {
    updatedCenters = [...allCenters, center];
  }
  
  // Save only non-mock centers to localStorage
  const mockIds = new Set(mockCenters.map(c => c.id));
  const toStore = updatedCenters.filter(c => !mockIds.has(c.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
};

// Delete center from localStorage
export const deleteCenter = (id: string): void => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const storedCenters: Center[] = JSON.parse(stored);
    const filtered = storedCenters.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};

