// Passport Scanner Hook - Simulates Hardware Scanner

import { useState, useCallback } from 'react';
import { simulatePassportScan, searchPassportByNumber, type MockPassportScanResult } from '../../data/mockPassports';

interface UsePassportScannerReturn {
  scan: () => Promise<MockPassportScanResult | null>;
  search: (passportNumber: string, visaNumber?: string) => Promise<MockPassportScanResult | null>;
  isScanning: boolean;
  error: string | null;
  clearError: () => void;
}

export const usePassportScanner = (): UsePassportScannerReturn => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async (): Promise<MockPassportScanResult | null> => {
    setIsScanning(true);
    setError(null);

    try {
      const result = await simulatePassportScan();
      setIsScanning(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan passport';
      setError(errorMessage);
      setIsScanning(false);
      return null;
    }
  }, []);

  const search = useCallback(async (
    passportNumber: string,
    visaNumber?: string
  ): Promise<MockPassportScanResult | null> => {
    if (!passportNumber && !visaNumber) {
      setError('Please enter passport or visa number');
      return null;
    }

    setIsScanning(true);
    setError(null);

    try {
      const result = await searchPassportByNumber(passportNumber, visaNumber);
      setIsScanning(false);
      
      if (!result) {
        setError('Passport not found');
        return null;
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search passport';
      setError(errorMessage);
      setIsScanning(false);
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    scan,
    search,
    isScanning,
    error,
    clearError
  };
};

