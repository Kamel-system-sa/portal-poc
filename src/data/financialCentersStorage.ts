import type { CenterFinancialData } from './mockFinancialCenters';
import { mockFinancialCenters } from './mockFinancialCenters';
import { getCenters } from './centersStorage';

// Local storage key
const STORAGE_KEY = 'financial_centers';

// Get all financial centers from localStorage, merge with mock data
export const getFinancialCenters = (): CenterFinancialData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const storedCenters: CenterFinancialData[] = JSON.parse(stored);
      // Create a map to merge stored centers with mock data (stored centers have priority)
      const centersMap = new Map<string, CenterFinancialData>();
      
      // First, add all mock centers
      mockFinancialCenters.forEach(center => {
        centersMap.set(center.centerId, center);
      });
      
      // Then, override with stored centers (stored centers have priority)
      storedCenters.forEach(center => {
        centersMap.set(center.centerId, center);
      });
      
      return Array.from(centersMap.values());
    }
    return mockFinancialCenters;
  } catch {
    return mockFinancialCenters;
  }
};

// Save financial center to localStorage
export const saveFinancialCenter = (financialCenter: CenterFinancialData): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let storedCenters: CenterFinancialData[] = stored ? JSON.parse(stored) : [];
    
    const existingIndex = storedCenters.findIndex(c => c.centerId === financialCenter.centerId);
    
    if (existingIndex >= 0) {
      // Update existing center
      storedCenters[existingIndex] = financialCenter;
    } else {
      // Add new center
      storedCenters.push(financialCenter);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedCenters));
  } catch (error) {
    console.error('Error saving financial center:', error);
  }
};

// Create a new financial center if it doesn't exist
const createFinancialCenter = (centerId: string): CenterFinancialData | null => {
  const centers = getCenters();
  const center = centers.find(c => c.id === centerId);
  
  if (!center) {
    console.warn(`Center with id ${centerId} not found`);
    return null;
  }
  
  const newFinancialCenter: CenterFinancialData = {
    centerId: center.id,
    centerNumber: center.number,
    centerName: `مركز ${center.number}`,
    totalBudget: 0,
    reservedAmount: 0,
    remainingBudget: 0,
    budgetDetails: {
      salaries: 0,
      rent: 0,
      furniture: 0,
      cars: 0,
      other: 0
    }
  };
  
  return newFinancialCenter;
};

// Update budget for a center (adds to existing budget)
export const updateCenterBudget = (centerId: string, budget: {
  salaries: number;
  rent: number;
  furniture: number;
  cars: number;
  other: number;
}): void => {
  let center = getFinancialCenters().find(c => c.centerId === centerId);
  
  // If center doesn't exist, create a new one
  if (!center) {
    center = createFinancialCenter(centerId);
    if (!center) return; // Center not found in centers list
  }
  
  const totalBudget = budget.salaries + budget.rent + budget.furniture + budget.cars + budget.other;
  const updatedCenter: CenterFinancialData = {
    ...center,
    totalBudget: center.totalBudget + totalBudget,
    reservedAmount: center.reservedAmount + totalBudget,
    remainingBudget: (center.totalBudget + totalBudget) - (center.reservedAmount + totalBudget),
    budgetDetails: {
      salaries: center.budgetDetails.salaries + budget.salaries,
      rent: center.budgetDetails.rent + budget.rent,
      furniture: center.budgetDetails.furniture + budget.furniture,
      cars: center.budgetDetails.cars + budget.cars,
      other: center.budgetDetails.other + budget.other
    }
  };
  saveFinancialCenter(updatedCenter);
};

// Replace budget for a center (replaces existing budget)
export const replaceCenterBudget = (centerId: string, budget: {
  salaries: number;
  rent: number;
  furniture: number;
  cars: number;
  other: number;
}): void => {
  let center = getFinancialCenters().find(c => c.centerId === centerId);
  
  // If center doesn't exist, create a new one
  if (!center) {
    center = createFinancialCenter(centerId);
    if (!center) return; // Center not found in centers list
  }
  
  const totalBudget = budget.salaries + budget.rent + budget.furniture + budget.cars + budget.other;
  const updatedCenter: CenterFinancialData = {
    ...center,
    totalBudget: totalBudget,
    reservedAmount: totalBudget,
    remainingBudget: 0,
    budgetDetails: {
      salaries: budget.salaries,
      rent: budget.rent,
      furniture: budget.furniture,
      cars: budget.cars,
      other: budget.other
    }
  };
  saveFinancialCenter(updatedCenter);
};

// Delete financial center from localStorage
export const deleteFinancialCenter = (centerId: string): void => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const storedCenters: CenterFinancialData[] = JSON.parse(stored);
    const filtered = storedCenters.filter(c => c.centerId !== centerId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};

