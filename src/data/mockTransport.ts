// Mock data for Transport section
// TODO: Replace with backend API calls or Firebase integration

import type { Bus, Passenger } from '../types/transport';

// Re-export types for backward compatibility
export type { Bus, Passenger };

// Helper function to generate passengers with generic names
const generatePassengers = (count: number, startId: number, startSeat: number = 1): Passenger[] => {
  const passengers: Passenger[] = [];
  for (let i = 0; i < count; i++) {
    const fullName = `Pilgrim ${startId + i}`;
    const idNumber = String(1000000000 + startId + i);
    const passportNumber = String.fromCharCode(65 + (startId + i) % 26) + String(10000000 + startId + i);
    const phoneNumber = `+96650${String(1000000 + startId + i).slice(-7)}`;
    const seatNumber = startSeat + i;
    // Randomly assign gender (50% male, 50% female)
    const gender: 'male' | 'female' = Math.random() > 0.5 ? 'male' : 'female';
    const notes = i === 0 && Math.random() > 0.7 ? 'VIP passenger' : 
                  i === 1 && Math.random() > 0.8 ? 'Wheelchair assistance needed' : 
                  i === 2 && Math.random() > 0.9 ? 'Special dietary requirements' : undefined;
    
    passengers.push({
      id: `pass-${String(startId + i).padStart(6, '0')}`,
      fullName,
      idNumber,
      passportNumber,
      seatNumber,
      phoneNumber,
      notes,
      gender
    });
  }
  return passengers;
};

// Helper function to generate driver names (generic)
const generateDriverName = (index: number, isPrimary: boolean = true): string => {
  return isPrimary ? `Main Driver ${index}` : `Secondary Driver ${index}`;
};

// Mock transport data with multiple buses, each with 30-45 passengers
export const mockTransportData: Bus[] = [
  {
    id: "bus-001",
    route: "Jeddah → Makkah",
    departureTime: "06:00",
    expectedArrival: "08:00",
    transportCompany: "SAPTCO",
    licensePlate: "ABC-1234",
    busNumber: "BUS-001",
    busId: "T001",
    driver1Name: generateDriverName(1, true),
    driver1Phone: "+966501234567",
    driver2Name: generateDriverName(1, false),
    driver2Phone: "+966507654321",
    capacity: 50,
    passengers: generatePassengers(48, 1), // Full: 96%
    createdAt: "2024-01-15T06:00:00Z",
    status: "active"
  },
  {
    id: "bus-002",
    route: "Jeddah → Makkah",
    departureTime: "08:00",
    expectedArrival: "10:00",
    transportCompany: "SAPTCO",
    licensePlate: "ABC-2345",
    busNumber: "BUS-002",
    busId: "T002",
    driver1Name: generateDriverName(2, true),
    driver1Phone: "+966508888888",
    driver2Name: generateDriverName(2, false),
    driver2Phone: "+966509999999",
    capacity: 50,
    passengers: generatePassengers(35, 49), // Partially Full: 70%
    createdAt: "2024-01-15T08:00:00Z",
    status: "active"
  },
  {
    id: "bus-003",
    route: "Jeddah → Madinah",
    departureTime: "09:30",
    expectedArrival: "13:00",
    transportCompany: "Al-Mutlaq Transport",
    licensePlate: "XYZ-5678",
    busNumber: "BUS-003",
    busId: "T003",
    driver1Name: generateDriverName(3, true),
    driver1Phone: "+966510101010",
    driver2Name: generateDriverName(3, false),
    driver2Phone: "+966511111111",
    capacity: 45,
    passengers: generatePassengers(30, 84), // Partially Full: 67%
    createdAt: "2024-01-15T09:30:00Z",
    status: "active"
  },
  {
    id: "bus-004",
    route: "Makkah → Jeddah",
    departureTime: "10:00",
    expectedArrival: "12:00",
    transportCompany: "SAPTCO",
    licensePlate: "DEF-9012",
    busNumber: "BUS-004",
    busId: "T004",
    driver1Name: generateDriverName(4, true),
    driver1Phone: "+966518181818",
    driver2Name: generateDriverName(4, false),
    driver2Phone: "+966519191919",
    capacity: 50,
    passengers: generatePassengers(50, 114), // Full: 100%
    createdAt: "2024-01-15T10:00:00Z",
    status: "active"
  },
  {
    id: "bus-005",
    route: "Makkah → Jeddah",
    departureTime: "14:00",
    expectedArrival: "16:00",
    transportCompany: "SAPTCO",
    licensePlate: "DEF-3456",
    busNumber: "BUS-005",
    busId: "T005",
    driver1Name: generateDriverName(5, true),
    driver1Phone: "+966523232323",
    driver2Name: generateDriverName(5, false),
    driver2Phone: "+966524242424",
    capacity: 50,
    passengers: generatePassengers(32, 164), // Partially Full: 64%
    createdAt: "2024-01-15T14:00:00Z",
    status: "active"
  },
  {
    id: "bus-006",
    route: "Madinah → Jeddah",
    departureTime: "16:30",
    expectedArrival: "20:00",
    transportCompany: "Al-Mutlaq Transport",
    licensePlate: "GHI-3456",
    busNumber: "BUS-006",
    busId: "T006",
    driver1Name: generateDriverName(6, true),
    driver1Phone: "+966529292929",
    driver2Name: generateDriverName(6, false),
    driver2Phone: "+966530303030",
    capacity: 45,
    passengers: generatePassengers(8, 196), // Almost Empty: 18%
    createdAt: "2024-01-15T16:30:00Z",
    status: "scheduled"
  },
  {
    id: "bus-007",
    route: "Jeddah → Makkah",
    departureTime: "18:00",
    expectedArrival: "20:00",
    transportCompany: "SAPTCO",
    licensePlate: "JKL-7890",
    busNumber: "BUS-007",
    busId: "T007",
    driver1Name: generateDriverName(7, true),
    driver1Phone: "+966501234567",
    driver2Name: generateDriverName(7, false),
    driver2Phone: "+966507654321",
    capacity: 50,
    passengers: generatePassengers(28, 204), // Partially Full: 56%
    createdAt: "2024-01-15T18:00:00Z",
    status: "scheduled"
  },
  {
    id: "bus-008",
    route: "Makkah → Madinah",
    departureTime: "20:00",
    expectedArrival: "23:30",
    transportCompany: "Al-Mutlaq Transport",
    licensePlate: "MNO-2468",
    busNumber: "BUS-008",
    busId: "T008",
    driver1Name: generateDriverName(8, true),
    driver1Phone: "+966508888888",
    driver2Name: generateDriverName(8, false),
    driver2Phone: "+966509999999",
    capacity: 45,
    passengers: generatePassengers(0, 232), // Empty: 0%
    createdAt: "2024-01-15T20:00:00Z",
    status: "scheduled"
  },
  {
    id: "bus-009",
    route: "Jeddah → Makkah",
    departureTime: "22:00",
    expectedArrival: "00:00",
    transportCompany: "SAPTCO",
    licensePlate: "PQR-1357",
    busNumber: "BUS-009",
    busId: "T009",
    driver1Name: generateDriverName(9, true),
    driver1Phone: "+966510101010",
    driver2Name: generateDriverName(9, false),
    driver2Phone: "+966511111111",
    capacity: 50,
    passengers: generatePassengers(47, 232), // Full: 94%
    createdAt: "2024-01-15T22:00:00Z",
    status: "scheduled"
  },
  {
    id: "bus-010",
    route: "Jeddah → Madinah",
    departureTime: "07:00",
    expectedArrival: "10:30",
    transportCompany: "Al-Mutlaq Transport",
    licensePlate: "STU-2468",
    busNumber: "BUS-010",
    busId: "T010",
    driver1Name: generateDriverName(10, true),
    driver1Phone: "+966518181818",
    driver2Name: generateDriverName(10, false),
    driver2Phone: "+966519191919",
    capacity: 45,
    passengers: generatePassengers(25, 279), // Partially Full: 56%
    createdAt: "2024-01-16T07:00:00Z",
    status: "active"
  },
  {
    id: "bus-011",
    route: "Makkah → Jeddah",
    departureTime: "12:00",
    expectedArrival: "14:00",
    transportCompany: "SAPTCO",
    licensePlate: "VWX-3579",
    busNumber: "BUS-011",
    busId: "T011",
    driver1Name: generateDriverName(11, true),
    driver1Phone: "+966523232323",
    driver2Name: generateDriverName(11, false),
    driver2Phone: "+966524242424",
    capacity: 50,
    passengers: generatePassengers(30, 304), // Partially Full: 60%
    createdAt: "2024-01-16T12:00:00Z",
    status: "active"
  },
  {
    id: "bus-012",
    route: "Madinah → Makkah",
    departureTime: "15:00",
    expectedArrival: "18:30",
    transportCompany: "Al-Mutlaq Transport",
    licensePlate: "YZA-4680",
    busNumber: "BUS-012",
    busId: "T012",
    driver1Name: generateDriverName(12, true),
    driver1Phone: "+966529292929",
    driver2Name: generateDriverName(12, false),
    driver2Phone: "+966530303030",
    capacity: 45,
    passengers: generatePassengers(6, 334), // Almost Empty: 13%
    createdAt: "2024-01-16T15:00:00Z",
    status: "active"
  },
  {
    id: "bus-013",
    route: "Jeddah → Makkah",
    departureTime: "11:00",
    expectedArrival: "13:00",
    transportCompany: "SAPTCO",
    licensePlate: "BCD-5791",
    busNumber: "BUS-013",
    busId: "T013",
    driver1Name: generateDriverName(13, true),
    driver1Phone: "+966501234567",
    driver2Name: generateDriverName(13, false),
    driver2Phone: "+966507654321",
    capacity: 50,
    passengers: generatePassengers(49, 340), // Full: 98%
    createdAt: "2024-01-16T11:00:00Z",
    status: "active"
  },
  {
    id: "bus-014",
    route: "Makkah → Madinah",
    departureTime: "13:30",
    expectedArrival: "17:00",
    transportCompany: "Al-Mutlaq Transport",
    licensePlate: "EFG-6802",
    busNumber: "BUS-014",
    busId: "T014",
    driver1Name: generateDriverName(14, true),
    driver1Phone: "+966508888888",
    driver2Name: generateDriverName(14, false),
    driver2Phone: "+966509999999",
    capacity: 45,
    passengers: generatePassengers(27, 389), // Partially Full: 60%
    createdAt: "2024-01-16T13:30:00Z",
    status: "active"
  },
  {
    id: "bus-015",
    route: "Jeddah → Madinah",
    departureTime: "17:00",
    expectedArrival: "20:30",
    transportCompany: "Al-Mutlaq Transport",
    licensePlate: "HIJ-7913",
    busNumber: "BUS-015",
    busId: "T015",
    driver1Name: generateDriverName(15, true),
    driver1Phone: "+966510101010",
    driver2Name: generateDriverName(15, false),
    driver2Phone: "+966511111111",
    capacity: 45,
    passengers: generatePassengers(5, 416), // Almost Empty: 11%
    createdAt: "2024-01-16T17:00:00Z",
    status: "scheduled"
  },
  {
    id: "bus-016",
    route: "Makkah → Jeddah",
    departureTime: "19:00",
    expectedArrival: "21:00",
    transportCompany: "SAPTCO",
    licensePlate: "KLM-8024",
    busNumber: "BUS-016",
    busId: "T016",
    driver1Name: generateDriverName(16, true),
    driver1Phone: "+966518181818",
    driver2Name: generateDriverName(16, false),
    driver2Phone: "+966519191919",
    capacity: 50,
    passengers: generatePassengers(33, 421), // Partially Full: 66%
    createdAt: "2024-01-16T19:00:00Z",
    status: "scheduled"
  },
  {
    id: "bus-017",
    route: "Jeddah → Makkah",
    departureTime: "05:30",
    expectedArrival: "07:30",
    transportCompany: "SAPTCO",
    licensePlate: "NOP-9135",
    busNumber: "BUS-017",
    busId: "T017",
    driver1Name: generateDriverName(17, true),
    driver1Phone: "+966523232323",
    driver2Name: generateDriverName(17, false),
    driver2Phone: "+966524242424",
    capacity: 50,
    passengers: generatePassengers(26, 454), // Partially Full: 52%
    createdAt: "2024-01-17T05:30:00Z",
    status: "active"
  },
  {
    id: "bus-018",
    route: "Madinah → Jeddah",
    departureTime: "08:30",
    expectedArrival: "12:00",
    transportCompany: "Al-Mutlaq Transport",
    licensePlate: "QRS-0246",
    busNumber: "BUS-018",
    busId: "T018",
    driver1Name: generateDriverName(18, true),
    driver1Phone: "+966529292929",
    driver2Name: generateDriverName(18, false),
    driver2Phone: "+966530303030",
    capacity: 45,
    passengers: generatePassengers(22, 480), // Partially Full: 49%
    createdAt: "2024-01-17T08:30:00Z",
    status: "active"
  },
  {
    id: "bus-019",
    route: "Jeddah → Makkah",
    departureTime: "16:00",
    expectedArrival: "18:00",
    transportCompany: "SAPTCO",
    licensePlate: "TUV-1357",
    busNumber: "BUS-019",
    busId: "T019",
    driver1Name: generateDriverName(19, true),
    driver1Phone: "+966501234567",
    driver2Name: generateDriverName(19, false),
    driver2Phone: "+966507654321",
    capacity: 50,
    passengers: generatePassengers(46, 502), // Full: 92%
    createdAt: "2024-01-17T16:00:00Z",
    status: "scheduled"
  },
  {
    id: "bus-020",
    route: "Makkah → Madinah",
    departureTime: "21:30",
    expectedArrival: "01:00",
    transportCompany: "Al-Mutlaq Transport",
    licensePlate: "WXY-2468",
    busNumber: "BUS-020",
    busId: "T020",
    driver1Name: generateDriverName(20, true),
    driver1Phone: "+966508888888",
    driver2Name: generateDriverName(20, false),
    driver2Phone: "+966509999999",
    capacity: 45,
    passengers: generatePassengers(29, 548), // Partially Full: 64%
    createdAt: "2024-01-17T21:30:00Z",
    status: "scheduled"
  }
];

// Helper functions for transport data
export const getTotalBuses = (): number => {
  return mockTransportData.length;
};

export const getTotalTripsToday = (): number => {
  const today = new Date().toISOString().split('T')[0];
  return mockTransportData.filter(bus => 
    bus.createdAt.startsWith(today) && bus.status === 'active'
  ).length;
};

export const getTotalPassengers = (): number => {
  return mockTransportData.reduce((sum, bus) => sum + bus.passengers.length, 0);
};

export const getActiveTrips = (): number => {
  return mockTransportData.filter(bus => bus.status === 'active').length;
};

export const getLatestBuses = (count: number = 5): Bus[] => {
  return [...mockTransportData]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
};

export const getBusById = (id: string): Bus | undefined => {
  return mockTransportData.find(bus => bus.id === id);
};

export const getPassengerDistributionByRoute = () => {
  const routeMap: Record<string, number> = {};
  mockTransportData.forEach(bus => {
    if (!routeMap[bus.route]) {
      routeMap[bus.route] = 0;
    }
    routeMap[bus.route] += bus.passengers.length;
  });
  return Object.entries(routeMap).map(([route, count]) => ({
    route,
    count
  }));
};

// TODO: Replace with backend API calls
export const addBus = (bus: Omit<Bus, 'id' | 'createdAt'>): Bus => {
  const newBus: Bus = {
    ...bus,
    id: `bus-${String(mockTransportData.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString()
  };
  mockTransportData.push(newBus);
  return newBus;
};

// TODO: Replace with backend API calls
export const updateBus = (id: string, updates: Partial<Bus>): Bus | null => {
  const index = mockTransportData.findIndex(bus => bus.id === id);
  if (index === -1) return null;
  mockTransportData[index] = { ...mockTransportData[index], ...updates };
  return mockTransportData[index];
};

// TODO: Replace with backend API calls
export const deleteBus = (id: string): boolean => {
  const index = mockTransportData.findIndex(bus => bus.id === id);
  if (index === -1) return false;
  mockTransportData.splice(index, 1);
  return true;
};
