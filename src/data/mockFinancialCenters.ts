import { mockCenters } from './mockCenters';

export interface CenterBudget {
  salaries: number;
  rent: number;
  furniture: number;
  cars: number;
  other: number;
}

export interface CenterFinancialData {
  centerId: string;
  centerNumber: string;
  centerName: string;
  totalBudget: number;
  reservedAmount: number;
  remainingBudget: number;
  budgetDetails: CenterBudget;
}

// Initial mock financial data based on centers
export const mockFinancialCenters: CenterFinancialData[] = mockCenters.slice(0, 10).map((center, index) => {
  const baseBudget = (index + 1) * 500000; // 500K, 1M, 1.5M, etc.
  const salaries = Math.floor(baseBudget * 0.4);
  const rent = Math.floor(baseBudget * 0.25);
  const furniture = Math.floor(baseBudget * 0.15);
  const cars = Math.floor(baseBudget * 0.1);
  const other = Math.floor(baseBudget * 0.1);
  const reservedAmount = Math.floor(baseBudget * 0.7); // 70% reserved

  return {
    centerId: center.id,
    centerNumber: center.number,
    centerName: `مركز ${index + 1}`,
    totalBudget: baseBudget,
    reservedAmount: reservedAmount,
    remainingBudget: baseBudget - reservedAmount,
    budgetDetails: {
      salaries,
      rent,
      furniture,
      cars,
      other
    }
  };
});

