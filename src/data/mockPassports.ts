// Mock Passport Data for Scanner Simulation

import type { Pilgrim, Organizer, Campaign } from '../types/passport';

export interface MockPassportScanResult {
  passportNumber: string;
  visaNumber: string;
  photo?: string;
  name: string;
  nationality: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  age: number;
  phone?: string;
  email?: string;
  organizer: Organizer;
  campaign?: Campaign;
  serviceCenterId: string;
  serviceCenterName: string;
  preArrivalData?: {
    groupNumber: string;
    groupName: string;
    arrivalDate: string;
    flightNumber?: string;
  };
}

// Mock passport data pool
const mockPassports: MockPassportScanResult[] = [
  {
    passportNumber: 'A12345678',
    visaNumber: 'V98765432',
    photo: '/images/male.png',
    name: 'Ahmed Mohammed Ali',
    nationality: 'Pakistani',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    age: 39,
    phone: '+966501234567',
    email: 'ahmed.ali@example.com',
    organizer: {
      id: 'org-001',
      number: 'ORG-001',
      name: 'Al-Hajj Travel Services',
      company: 'Al-Hajj Travel Services Co.',
      phone: '+966501111111',
      email: 'info@alhajj.com'
    },
    campaign: {
      id: 'camp-001',
      campaignNumber: 'CAMP-2024-001',
      campaignName: 'Hajj 2024 - Group A',
      organizerId: 'org-001',
      organizerNumber: 'ORG-001',
      organizerName: 'Al-Hajj Travel Services',
      totalPilgrims: 150,
      registeredPilgrims: 145
    },
    serviceCenterId: 'center-001',
    serviceCenterName: 'Service Center 001',
    preArrivalData: {
      groupNumber: 'GRP-001',
      groupName: 'Group A - Arrival 1',
      arrivalDate: '2024-06-01',
      flightNumber: 'SV-1234'
    }
  },
  {
    passportNumber: 'B23456789',
    visaNumber: 'V87654321',
    photo: '/images/female.png',
    name: 'Fatima Hassan',
    nationality: 'Egyptian',
    dateOfBirth: '1990-08-22',
    gender: 'female',
    age: 34,
    phone: '+966502345678',
    email: 'fatima.hassan@example.com',
    organizer: {
      id: 'org-002',
      number: 'ORG-002',
      name: 'Mecca Tours',
      company: 'Mecca Tours International',
      phone: '+966502222222',
      email: 'contact@meccatours.com'
    },
    campaign: {
      id: 'camp-002',
      campaignNumber: 'CAMP-2024-002',
      campaignName: 'Hajj 2024 - Group B',
      organizerId: 'org-002',
      organizerNumber: 'ORG-002',
      organizerName: 'Mecca Tours',
      totalPilgrims: 200,
      registeredPilgrims: 195
    },
    serviceCenterId: 'center-001',
    serviceCenterName: 'Service Center 001',
    preArrivalData: {
      groupNumber: 'GRP-002',
      groupName: 'Group B - Arrival 2',
      arrivalDate: '2024-06-02',
      flightNumber: 'SV-5678'
    }
  },
  {
    passportNumber: 'C34567890',
    visaNumber: 'V76543210',
    photo: '/images/male.png',
    name: 'Mohammed Abdullah',
    nationality: 'Indian',
    dateOfBirth: '1978-12-10',
    gender: 'male',
    age: 46,
    phone: '+966503456789',
    organizer: {
      id: 'org-003',
      number: 'ORG-003',
      name: 'Sacred Journey Tours',
      company: 'Sacred Journey Tours Ltd.',
      phone: '+966503333333',
      email: 'info@sacredjourney.com'
    },
    campaign: {
      id: 'camp-003',
      campaignNumber: 'CAMP-2024-003',
      campaignName: 'Hajj 2024 - Group C',
      organizerId: 'org-003',
      organizerNumber: 'ORG-003',
      organizerName: 'Sacred Journey Tours',
      totalPilgrims: 180,
      registeredPilgrims: 175
    },
    serviceCenterId: 'center-002',
    serviceCenterName: 'Service Center 002',
    preArrivalData: {
      groupNumber: 'GRP-003',
      groupName: 'Group C - Arrival 3',
      arrivalDate: '2024-06-03',
      flightNumber: 'SV-9012'
    }
  },
  {
    passportNumber: 'D45678901',
    visaNumber: 'V65432109',
    photo: '/images/female.png',
    name: 'Aisha Mohammed',
    nationality: 'Bangladeshi',
    dateOfBirth: '1992-03-25',
    gender: 'female',
    age: 32,
    phone: '+966504567890',
    organizer: {
      id: 'org-001',
      number: 'ORG-001',
      name: 'Al-Hajj Travel Services',
      company: 'Al-Hajj Travel Services Co.',
      phone: '+966501111111',
      email: 'info@alhajj.com'
    },
    campaign: {
      id: 'camp-001',
      campaignNumber: 'CAMP-2024-001',
      campaignName: 'Hajj 2024 - Group A',
      organizerId: 'org-001',
      organizerNumber: 'ORG-001',
      organizerName: 'Al-Hajj Travel Services',
      totalPilgrims: 150,
      registeredPilgrims: 145
    },
    serviceCenterId: 'center-001',
    serviceCenterName: 'Service Center 001'
  },
  {
    passportNumber: 'E56789012',
    visaNumber: 'V54321098',
    photo: '/images/male.png',
    name: 'Ibrahim Khalil',
    nationality: 'Turkish',
    dateOfBirth: '1988-07-18',
    gender: 'male',
    age: 36,
    phone: '+966505678901',
    organizer: {
      id: 'org-004',
      number: 'ORG-004',
      name: 'Holy Land Tours',
      company: 'Holy Land Tours & Travel',
      phone: '+966504444444',
      email: 'info@holylandtours.com'
    },
    serviceCenterId: 'center-001',
    serviceCenterName: 'Service Center 001'
  }
];

/**
 * Simulate scanning a passport
 * Returns a random passport from the mock pool
 */
export const simulatePassportScan = (): Promise<MockPassportScanResult> => {
  return new Promise((resolve) => {
    // Simulate scanning delay (700-1200ms)
    const delay = 700 + Math.random() * 500;
    
    setTimeout(() => {
      // Return a random passport from the pool
      const randomIndex = Math.floor(Math.random() * mockPassports.length);
      const scannedPassport = { ...mockPassports[randomIndex] };
      resolve(scannedPassport);
    }, delay);
  });
};

/**
 * Search for a passport by number
 */
export const searchPassportByNumber = (
  passportNumber: string,
  visaNumber?: string
): Promise<MockPassportScanResult | null> => {
  return new Promise((resolve) => {
    // Simulate search delay
    setTimeout(() => {
      const found = mockPassports.find(
        p => 
          p.passportNumber.toLowerCase() === passportNumber.toLowerCase() ||
          (visaNumber && p.visaNumber.toLowerCase() === visaNumber.toLowerCase())
      );
      resolve(found ? { ...found } : null);
    }, 300);
  });
};

/**
 * Get all mock passports (for testing)
 */
export const getAllMockPassports = (): MockPassportScanResult[] => {
  return [...mockPassports];
};

