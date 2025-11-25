import type { Employee } from './mockEmployees';
import { mockEmployees } from './mockEmployees';

// Local storage key
const STORAGE_KEY = 'hr_employees';

// Get all employees from localStorage, merge with mock data
export const getEmployees = (): Employee[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const storedEmployees: Employee[] = JSON.parse(stored);
      // Merge with mock data, avoiding duplicates by ID
      const mockIds = new Set(mockEmployees.map(e => e.id));
      const storedOnly = storedEmployees.filter(e => !mockIds.has(e.id));
      return [...mockEmployees, ...storedOnly];
    }
    return mockEmployees;
  } catch {
    return mockEmployees;
  }
};

// Save employee to localStorage
export const saveEmployee = (employee: Employee): void => {
  const allEmployees = getEmployees();
  const existingIndex = allEmployees.findIndex(e => e.id === employee.id);
  
  let updatedEmployees: Employee[];
  if (existingIndex >= 0) {
    updatedEmployees = allEmployees.map(e => (e.id === employee.id ? employee : e));
  } else {
    updatedEmployees = [...allEmployees, employee];
  }
  
  // Save only non-mock employees to localStorage
  const mockIds = new Set(mockEmployees.map(e => e.id));
  const toStore = updatedEmployees.filter(e => !mockIds.has(e.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
};

// Delete employee from localStorage
export const deleteEmployee = (id: string): void => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const storedEmployees: Employee[] = JSON.parse(stored);
    const filtered = storedEmployees.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};

