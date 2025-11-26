export interface Box {
  id: string;
  number: string;
  shelf: string;
  nationality?: string;
  organizer?: {
    id: string;
    number: string;
    name: string;
  };
  passportCount: number;
  maxCapacity: number;
}

export const mockBoxes: Box[] = [
  // Shelf A
  { 
    id: 'box-1', 
    number: 'Box 001', 
    shelf: 'A', 
    nationality: 'Egyptian', 
    organizer: { id: 'org-1', number: 'ORG-001', name: 'Al-Sheikh Travel & Tourism' },
    passportCount: 12, 
    maxCapacity: 50 
  },
  { 
    id: 'box-2', 
    number: 'Box 002', 
    shelf: 'A', 
    nationality: 'Pakistani', 
    organizer: { id: 'org-2', number: 'ORG-002', name: 'Makkah Tours International' },
    passportCount: 8, 
    maxCapacity: 50 
  },
  { 
    id: 'box-3', 
    number: 'Box 003', 
    shelf: 'A', 
    nationality: 'Saudi', 
    organizer: { id: 'org-3', number: 'ORG-003', name: 'Hajj & Umrah Services' },
    passportCount: 15, 
    maxCapacity: 50 
  },
  { 
    id: 'box-4', 
    number: 'Box 004', 
    shelf: 'A', 
    nationality: 'Jordanian', 
    organizer: { id: 'org-4', number: 'ORG-004', name: 'Al-Haramain Pilgrimage' },
    passportCount: 5, 
    maxCapacity: 50 
  },
  // Shelf B
  { 
    id: 'box-5', 
    number: 'Box 005', 
    shelf: 'B', 
    nationality: 'Egyptian', 
    organizer: { id: 'org-1', number: 'ORG-001', name: 'Al-Sheikh Travel & Tourism' },
    passportCount: 20, 
    maxCapacity: 50 
  },
  { 
    id: 'box-6', 
    number: 'Box 006', 
    shelf: 'B', 
    nationality: 'Pakistani', 
    organizer: { id: 'org-2', number: 'ORG-002', name: 'Makkah Tours International' },
    passportCount: 10, 
    maxCapacity: 50 
  },
  { 
    id: 'box-7', 
    number: 'Box 007', 
    shelf: 'B', 
    nationality: 'Saudi', 
    organizer: { id: 'org-5', number: 'ORG-005', name: 'Saudi Pilgrimage Services' },
    passportCount: 18, 
    maxCapacity: 50 
  },
  // Shelf C
  { 
    id: 'box-8', 
    number: 'Box 008', 
    shelf: 'C', 
    nationality: 'Jordanian', 
    organizer: { id: 'org-4', number: 'ORG-004', name: 'Al-Haramain Pilgrimage' },
    passportCount: 7, 
    maxCapacity: 50 
  },
  { 
    id: 'box-9', 
    number: 'Box 009', 
    shelf: 'C', 
    nationality: 'Egyptian', 
    organizer: { id: 'org-1', number: 'ORG-001', name: 'Al-Sheikh Travel & Tourism' },
    passportCount: 14, 
    maxCapacity: 50 
  },
  // Shelf D
  { 
    id: 'box-10', 
    number: 'Box 010', 
    shelf: 'D', 
    nationality: 'Pakistani', 
    organizer: { id: 'org-2', number: 'ORG-002', name: 'Makkah Tours International' },
    passportCount: 9, 
    maxCapacity: 50 
  },
];

// Helper to get boxes by shelf
export const getBoxesByShelf = (shelf: string, boxes: Box[]): Box[] => {
  return boxes.filter(box => box.shelf === shelf);
};

// Helper to get box sorting method from localStorage
export const getBoxSortMethod = (): string => {
  const stored = localStorage.getItem('passport_boxSortMethod');
  return stored || 'nationality'; // Default to nationality
};

// Helper to set box sorting method
export const setBoxSortMethod = (method: string): void => {
  localStorage.setItem('passport_boxSortMethod', method);
};

