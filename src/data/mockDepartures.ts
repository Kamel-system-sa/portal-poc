import type { DepartureDashboardKPI, DepartureGroup } from '../types/reception';
import { mockOrganizers } from './mockReception';
import { mockCampaigns } from './mockCampaigns';
import { mockAccommodations } from './mockReception';

// Mock Departure Dashboard KPI
export const mockDepartureKPI: DepartureDashboardKPI = {
  registeredPilgrimsInCenter: 5000,
  arrivedPilgrimsCount: 4200,
  arrivedPilgrimsPercentage: 84,
  organizersCount: 15,
  pilgrimsInMakkah: 2800,
  registeredCampaigns: 12,
  pilgrimsInMadinah: 1400,
  expectedArrivalsCount: 4500,
  expectedArrivalsPercentage: 90,
  departedPilgrimsCount: 190,
  departedPilgrimsPercentage: 3.8
};

// Helper to generate date
const today = new Date();
const generateDate = (daysFromNow: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// Mock Departure Groups
export const mockDepartureGroups: DepartureGroup[] = [
  {
    id: 'dep-1',
    organizerId: 'org-1',
    organizerNumber: 'ORG-001',
    organizerName: 'Al-Sheikh Travel & Tourism',
    organizerCompany: 'Al-Sheikh Group',
    organizerNationality: 'saudi',
    organizerPhone: '+966501234567',
    organizerEmail: 'contact@alsheikh-travel.com',
    campaignNumber: 'CAMP-2024-001',
    campaignManagerPhone: '+966501111111',
    departurePoint: 'makkah',
    arrivalDestination: 'jeddah',
    departureDate: generateDate(1),
    departureTime: '14:30',
    pilgrimsCount: 180,
    accommodations: [
      {
        accommodationId: 'acc-1',
        accommodationName: 'Grand Makkah Hotel',
        contractNumber: 'CNT-2024-001',
        pilgrimsDeparting: 120
      },
      {
        accommodationId: 'acc-3',
        accommodationName: 'Pilgrim Residence Complex A',
        contractNumber: 'CNT-2024-002',
        pilgrimsDeparting: 60
      }
    ],
    arrivalAccommodations: [
      {
        accommodationId: 'acc-5',
        accommodationName: 'Jeddah Airport Hotel',
        contractNumber: 'CNT-2024-003',
        contractStartDate: generateDate(1),
        pilgrimsArriving: 180
      }
    ],
    status: 'scheduled',
    createdAt: generateDate(-5)
  },
  {
    id: 'dep-2',
    organizerId: 'org-2',
    organizerNumber: 'ORG-002',
    organizerName: 'Makkah Tours International',
    organizerCompany: 'Makkah Tours Co.',
    organizerNationality: 'saudi',
    organizerPhone: '+966502345678',
    organizerEmail: 'info@makkah-tours.com',
    campaignNumber: 'CAMP-2024-002',
    campaignManagerPhone: '+966502222222',
    departurePoint: 'madinah',
    arrivalDestination: 'madinah-airport',
    departureDate: generateDate(2),
    departureTime: '10:00',
    pilgrimsCount: 250,
    accommodations: [
      {
        accommodationId: 'acc-2',
        accommodationName: 'Al-Safa Towers',
        contractNumber: 'CNT-2024-004',
        pilgrimsDeparting: 250
      }
    ],
    arrivalAccommodations: [
      {
        accommodationId: 'acc-6',
        accommodationName: 'Madinah Airport Residence',
        contractNumber: 'CNT-2024-005',
        contractStartDate: generateDate(2),
        pilgrimsArriving: 250
      }
    ],
    status: 'departed',
    createdAt: generateDate(-4)
  },
  {
    id: 'dep-3',
    organizerId: 'org-3',
    organizerNumber: 'ORG-003',
    organizerName: 'Hajj & Umrah Services',
    organizerCompany: 'Hajj Services Ltd.',
    organizerNationality: 'saudi',
    organizerPhone: '+966503456789',
    organizerEmail: 'support@hajj-services.com',
    campaignNumber: 'CAMP-2024-003',
    campaignManagerPhone: '+966503333333',
    departurePoint: 'makkah',
    arrivalDestination: 'jeddah',
    departureDate: generateDate(0),
    departureTime: '18:00',
    pilgrimsCount: 320,
    accommodations: [
      {
        accommodationId: 'acc-1',
        accommodationName: 'Grand Makkah Hotel',
        contractNumber: 'CNT-2024-006',
        pilgrimsDeparting: 200
      },
      {
        accommodationId: 'acc-4',
        accommodationName: 'Mina Camp Alpha',
        contractNumber: 'CNT-2024-007',
        pilgrimsDeparting: 120
      }
    ],
    arrivalAccommodations: [
      {
        accommodationId: 'acc-7',
        accommodationName: 'King Abdulaziz Airport Hotel',
        contractNumber: 'CNT-2024-008',
        contractStartDate: generateDate(0),
        pilgrimsArriving: 320
      }
    ],
    status: 'scheduled',
    createdAt: generateDate(-3)
  },
  {
    id: 'dep-4',
    organizerId: 'org-4',
    organizerNumber: 'ORG-004',
    organizerName: 'Al-Haramain Pilgrimage',
    organizerCompany: 'Al-Haramain Co.',
    organizerNationality: 'saudi',
    organizerPhone: '+966504567890',
    organizerEmail: 'contact@haramain-pilgrimage.com',
    campaignNumber: 'CAMP-2024-004',
    campaignManagerPhone: '+966504444444',
    departurePoint: 'madinah',
    arrivalDestination: 'jeddah',
    departureDate: generateDate(-1),
    departureTime: '12:00',
    pilgrimsCount: 150,
    accommodations: [
      {
        accommodationId: 'acc-2',
        accommodationName: 'Al-Safa Towers',
        contractNumber: 'CNT-2024-009',
        pilgrimsDeparting: 150
      }
    ],
    arrivalAccommodations: [
      {
        accommodationId: 'acc-8',
        accommodationName: 'Jeddah Grand Hotel',
        contractNumber: 'CNT-2024-010',
        contractStartDate: generateDate(-1),
        pilgrimsArriving: 150
      }
    ],
    status: 'arrived',
    createdAt: generateDate(-7)
  },
  {
    id: 'dep-5',
    organizerId: 'org-5',
    organizerNumber: 'ORG-005',
    organizerName: 'Saudi Pilgrimage Services',
    organizerCompany: 'SPS Group',
    organizerNationality: 'saudi',
    organizerPhone: '+966505678901',
    organizerEmail: 'info@sps-group.com',
    campaignNumber: 'CAMP-2024-005',
    campaignManagerPhone: '+966505555555',
    departurePoint: 'makkah',
    arrivalDestination: 'madinah',
    departureDate: generateDate(3),
    departureTime: '08:30',
    pilgrimsCount: 280,
    accommodations: [
      {
        accommodationId: 'acc-4',
        accommodationName: 'Mina Camp Alpha',
        contractNumber: 'CNT-2024-011',
        pilgrimsDeparting: 180
      },
      {
        accommodationId: 'acc-5',
        accommodationName: 'Arafat Camp Beta',
        contractNumber: 'CNT-2024-012',
        pilgrimsDeparting: 100
      }
    ],
    arrivalAccommodations: [
      {
        accommodationId: 'acc-9',
        accommodationName: 'Madinah Central Hotel',
        contractNumber: 'CNT-2024-013',
        contractStartDate: generateDate(3),
        pilgrimsArriving: 280
      }
    ],
    status: 'scheduled',
    createdAt: generateDate(-6)
  },
  {
    id: 'dep-6',
    organizerId: 'org-1',
    organizerNumber: 'ORG-001',
    organizerName: 'Al-Sheikh Travel & Tourism',
    organizerCompany: 'Al-Sheikh Group',
    organizerNationality: 'saudi',
    organizerPhone: '+966501234567',
    organizerEmail: 'contact@alsheikh-travel.com',
    campaignNumber: 'CAMP-2024-006',
    campaignManagerPhone: '+966501111111',
    departurePoint: 'madinah',
    arrivalDestination: 'madinah-airport',
    departureDate: generateDate(-2),
    departureTime: '15:00',
    pilgrimsCount: 200,
    accommodations: [
      {
        accommodationId: 'acc-3',
        accommodationName: 'Pilgrim Residence Complex A',
        contractNumber: 'CNT-2024-014',
        pilgrimsDeparting: 200
      }
    ],
    arrivalAccommodations: [
      {
        accommodationId: 'acc-10',
        accommodationName: 'Prince Mohammad Bin Abdulaziz Airport Hotel',
        contractNumber: 'CNT-2024-015',
        contractStartDate: generateDate(-2),
        pilgrimsArriving: 200
      }
    ],
    status: 'completed',
    createdAt: generateDate(-8)
  },
  {
    id: 'dep-7',
    organizerId: 'org-2',
    organizerNumber: 'ORG-002',
    organizerName: 'Makkah Tours International',
    organizerCompany: 'Makkah Tours Co.',
    organizerNationality: 'saudi',
    organizerPhone: '+966502345678',
    organizerEmail: 'info@makkah-tours.com',
    campaignNumber: 'CAMP-2024-007',
    campaignManagerPhone: '+966502222222',
    departurePoint: 'makkah',
    arrivalDestination: 'jeddah',
    departureDate: generateDate(4),
    departureTime: '20:00',
    pilgrimsCount: 190,
    accommodations: [
      {
        accommodationId: 'acc-1',
        accommodationName: 'Grand Makkah Hotel',
        contractNumber: 'CNT-2024-016',
        pilgrimsDeparting: 100
      },
      {
        accommodationId: 'acc-2',
        accommodationName: 'Al-Safa Towers',
        contractNumber: 'CNT-2024-017',
        pilgrimsDeparting: 90
      }
    ],
    arrivalAccommodations: [
      {
        accommodationId: 'acc-11',
        accommodationName: 'Jeddah International Hotel',
        contractNumber: 'CNT-2024-018',
        contractStartDate: generateDate(4),
        pilgrimsArriving: 190
      }
    ],
    status: 'scheduled',
    createdAt: generateDate(-2)
  },
  {
    id: 'dep-8',
    organizerId: 'org-3',
    organizerNumber: 'ORG-003',
    organizerName: 'Hajj & Umrah Services',
    organizerCompany: 'Hajj Services Ltd.',
    organizerNationality: 'saudi',
    organizerPhone: '+966503456789',
    organizerEmail: 'support@hajj-services.com',
    campaignNumber: 'CAMP-2024-008',
    campaignManagerPhone: '+966503333333',
    departurePoint: 'madinah',
    arrivalDestination: 'makkah',
    departureDate: generateDate(5),
    departureTime: '11:15',
    pilgrimsCount: 310,
    accommodations: [
      {
        accommodationId: 'acc-3',
        accommodationName: 'Pilgrim Residence Complex A',
        contractNumber: 'CNT-2024-019',
        pilgrimsDeparting: 310
      }
    ],
    arrivalAccommodations: [
      {
        accommodationId: 'acc-12',
        accommodationName: 'Makkah Grand Hotel',
        contractNumber: 'CNT-2024-020',
        contractStartDate: generateDate(5),
        pilgrimsArriving: 310
      }
    ],
    status: 'scheduled',
    createdAt: generateDate(-1)
  }
];

