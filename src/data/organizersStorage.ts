import type { Organizer } from '../components/Organizers Component/types';
import { mockOrganizers } from './mockOrganizers';

// Local storage key
const STORAGE_KEY = 'organizers';

// Get all organizers from localStorage, merge with mock data
export const getOrganizers = (): Organizer[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const storedOrganizers: Organizer[] = JSON.parse(stored);
      // Merge with mock data, avoiding duplicates by ID
      const mockIds = new Set(mockOrganizers.map(o => o.id));
      const storedOnly = storedOrganizers.filter(o => !mockIds.has(o.id));
      return [...mockOrganizers, ...storedOnly];
    }
    return mockOrganizers;
  } catch {
    return mockOrganizers;
  }
};

// Save organizer to localStorage
export const saveOrganizer = (organizer: Organizer): void => {
  const allOrganizers = getOrganizers();
  const existingIndex = allOrganizers.findIndex(o => o.id === organizer.id);
  
  let updatedOrganizers: Organizer[];
  if (existingIndex >= 0) {
    updatedOrganizers = allOrganizers.map(o => (o.id === organizer.id ? organizer : o));
  } else {
    updatedOrganizers = [...allOrganizers, organizer];
  }
  
  // Save only non-mock organizers to localStorage
  const mockIds = new Set(mockOrganizers.map(o => o.id));
  const toStore = updatedOrganizers.filter(o => !mockIds.has(o.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
};

// Delete organizer from localStorage
export const deleteOrganizer = (id: string): void => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const storedOrganizers: Organizer[] = JSON.parse(stored);
    const filtered = storedOrganizers.filter(o => o.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};

