import { useState } from 'react';
import { getRandomPassport, type MockPassportData } from '../../data/mockPassports';

interface UsePassportScannerReturn {
  scan: () => Promise<MockPassportData>;
  isScanning: boolean;
  error: string | null;
}

export const usePassportScanner = (): UsePassportScannerReturn => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = async (): Promise<MockPassportData> => {
    setIsScanning(true);
    setError(null);

    try {
      // Random delay between 700-1200ms
      const delay = Math.floor(Math.random() * 500) + 700;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Return random passport from mock data
      const passport = getRandomPassport();
      setIsScanning(false);
      return passport;
    } catch (err) {
      setIsScanning(false);
      const errorMessage = err instanceof Error ? err.message : 'Scan failed';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    scan,
    isScanning,
    error
  };
};

