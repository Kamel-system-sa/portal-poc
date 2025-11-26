import type { CityTransfer, MashairTransfer } from '../types/transport';

// Helper function to generate hotel names (simplified to "Hotel")
const generateHotelName = (index: number): string => {
  return `Hotel ${index + 1}`;
};

// Helper function to generate driver names
const generateDriverName = (index: number): string => {
  return `Driver ${index}`;
};

// Helper function to generate guide names
const generateGuideName = (index: number): string => {
  return `Guide ${index}`;
};

// Generate phone numbers
const generatePhone = (index: number): string => {
  return `+96650${String(1000000 + index).slice(-7)}`;
};

// Mock data for City Transfers (Inter-city transfers)
export const mockCityTransfers: CityTransfer[] = [
  {
    id: 'city-transfer-001',
    hotelName: generateHotelName(0),
    date: '2024-01-20',
    time: '08:00',
    busesCount: 2,
    city: 'Makkah',
    fromCity: 'Jeddah',
    toCity: 'Makkah',
    buses: [
      {
        id: 'bus-city-001-1',
        busNumber: '1',
        passengerCount: 45,
        driverName: generateDriverName(1),
        driverPhone: generatePhone(1),
        guideName: generateGuideName(1),
        guidePhone: generatePhone(101),
        destinationHotel: generateHotelName(0),
        destinationCity: 'Makkah',
        arrivalStatus: 'not_arrived'
      },
      {
        id: 'bus-city-001-2',
        busNumber: '2',
        passengerCount: 42,
        driverName: generateDriverName(1),
        driverPhone: generatePhone(1),
        guideName: generateGuideName(1),
        guidePhone: generatePhone(101),
        destinationHotel: generateHotelName(0),
        destinationCity: 'Makkah',
        arrivalStatus: 'arrived'
      }
    ],
    createdAt: '2024-01-20T08:00:00Z'
  },
  {
    id: 'city-transfer-002',
    hotelName: generateHotelName(1),
    date: '2024-01-20',
    time: '09:30',
    busesCount: 3,
    city: 'Madinah',
    fromCity: 'Jeddah',
    toCity: 'Madinah',
    buses: [
      {
        id: 'bus-city-002-1',
        busNumber: '1',
        passengerCount: 38,
        driverName: generateDriverName(2),
        driverPhone: generatePhone(2),
        guideName: generateGuideName(2),
        guidePhone: generatePhone(102),
        destinationHotel: generateHotelName(1),
        destinationCity: 'Madinah',
        arrivalStatus: 'not_arrived'
      },
      {
        id: 'bus-city-002-2',
        busNumber: '2',
        passengerCount: 40,
        driverName: generateDriverName(2),
        driverPhone: generatePhone(2),
        guideName: generateGuideName(2),
        guidePhone: generatePhone(102),
        destinationHotel: generateHotelName(1),
        destinationCity: 'Madinah',
        arrivalStatus: 'not_arrived'
      },
      {
        id: 'bus-city-002-3',
        busNumber: '3',
        passengerCount: 35,
        driverName: generateDriverName(2),
        driverPhone: generatePhone(2),
        guideName: generateGuideName(2),
        guidePhone: generatePhone(102),
        destinationHotel: generateHotelName(1),
        destinationCity: 'Madinah',
        arrivalStatus: 'arrived'
      }
    ],
    createdAt: '2024-01-20T09:30:00Z'
  },
  {
    id: 'city-transfer-003',
    hotelName: generateHotelName(2),
    date: '2024-01-20',
    time: '11:00',
    busesCount: 1,
    city: 'Makkah',
    fromCity: 'Jeddah',
    toCity: 'Makkah',
    buses: [
      {
        id: 'bus-city-003-1',
        busNumber: '1',
        passengerCount: 50,
        driverName: generateDriverName(6),
        driverPhone: generatePhone(6),
        guideName: generateGuideName(6),
        guidePhone: generatePhone(106),
        destinationHotel: generateHotelName(2),
        destinationCity: 'Makkah',
        arrivalStatus: 'not_arrived'
      }
    ],
    createdAt: '2024-01-20T11:00:00Z'
  },
  {
    id: 'city-transfer-004',
    hotelName: generateHotelName(3),
    date: '2024-01-20',
    time: '14:00',
    busesCount: 4,
    city: 'Makkah',
    fromCity: 'Madinah',
    toCity: 'Makkah',
    buses: [
      {
        id: 'bus-city-004-1',
        busNumber: '1',
        passengerCount: 43,
        driverName: generateDriverName(3),
        driverPhone: generatePhone(3),
        guideName: generateGuideName(3),
        guidePhone: generatePhone(103),
        destinationHotel: generateHotelName(3),
        destinationCity: 'Makkah',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-city-004-2',
        busNumber: '2',
        passengerCount: 41,
        driverName: generateDriverName(3),
        driverPhone: generatePhone(3),
        guideName: generateGuideName(3),
        guidePhone: generatePhone(103),
        destinationHotel: generateHotelName(3),
        destinationCity: 'Makkah',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-city-004-3',
        busNumber: '3',
        passengerCount: 39,
        driverName: generateDriverName(3),
        driverPhone: generatePhone(3),
        guideName: generateGuideName(3),
        guidePhone: generatePhone(103),
        destinationHotel: generateHotelName(3),
        destinationCity: 'Makkah',
        arrivalStatus: 'not_arrived'
      },
      {
        id: 'bus-city-004-4',
        busNumber: '4',
        passengerCount: 44,
        driverName: generateDriverName(3),
        driverPhone: generatePhone(3),
        guideName: generateGuideName(3),
        guidePhone: generatePhone(103),
        destinationHotel: generateHotelName(3),
        destinationCity: 'Makkah',
        arrivalStatus: 'not_arrived'
      }
    ],
    createdAt: '2024-01-20T14:00:00Z'
  },
  {
    id: 'city-transfer-005',
    hotelName: generateHotelName(4),
    date: '2024-01-21',
    time: '07:00',
    busesCount: 2,
    city: 'Madinah',
    fromCity: 'Makkah',
    toCity: 'Madinah',
    buses: [
      {
        id: 'bus-city-005-1',
        busNumber: '1',
        passengerCount: 47,
        driverName: generateDriverName(4),
        driverPhone: generatePhone(4),
        guideName: generateGuideName(4),
        guidePhone: generatePhone(104),
        destinationHotel: generateHotelName(4),
        destinationCity: 'Madinah',
        arrivalStatus: 'not_arrived'
      },
      {
        id: 'bus-city-005-2',
        busNumber: '2',
        passengerCount: 36,
        driverName: generateDriverName(4),
        driverPhone: generatePhone(4),
        guideName: generateGuideName(4),
        guidePhone: generatePhone(104),
        destinationHotel: generateHotelName(4),
        destinationCity: 'Madinah',
        arrivalStatus: 'arrived'
      }
    ],
    createdAt: '2024-01-21T07:00:00Z'
  },
  {
    id: 'city-transfer-006',
    hotelName: generateHotelName(5),
    date: '2024-01-21',
    time: '10:00',
    busesCount: 3,
    city: 'Jeddah',
    fromCity: 'Makkah',
    toCity: 'Jeddah',
    buses: [
      {
        id: 'bus-city-006-1',
        busNumber: '1',
        passengerCount: 48,
        driverName: generateDriverName(10),
        driverPhone: generatePhone(10),
        guideName: generateGuideName(10),
        guidePhone: generatePhone(110),
        destinationHotel: 'المطار',
        destinationCity: 'Jeddah',
        arrivalStatus: 'not_arrived'
      },
      {
        id: 'bus-city-006-2',
        busNumber: '2',
        passengerCount: 44,
        driverName: generateDriverName(10),
        driverPhone: generatePhone(10),
        guideName: generateGuideName(10),
        guidePhone: generatePhone(110),
        destinationHotel: 'المطار',
        destinationCity: 'Jeddah',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-city-006-3',
        busNumber: '3',
        passengerCount: 39,
        driverName: generateDriverName(10),
        driverPhone: generatePhone(10),
        guideName: generateGuideName(10),
        guidePhone: generatePhone(110),
        destinationHotel: 'المطار',
        destinationCity: 'Jeddah',
        arrivalStatus: 'not_arrived'
      }
    ],
    createdAt: '2024-01-21T10:00:00Z'
  },
  {
    id: 'city-transfer-007',
    hotelName: generateHotelName(6),
    date: '2024-01-21',
    time: '14:30',
    busesCount: 2,
    city: 'Jeddah',
    fromCity: 'Madinah',
    toCity: 'Jeddah',
    buses: [
      {
        id: 'bus-city-007-1',
        busNumber: '1',
        passengerCount: 42,
        driverName: generateDriverName(11),
        driverPhone: generatePhone(11),
        guideName: generateGuideName(11),
        guidePhone: generatePhone(111),
        destinationHotel: 'المطار',
        destinationCity: 'Jeddah',
        arrivalStatus: 'not_arrived'
      },
      {
        id: 'bus-city-007-2',
        busNumber: '2',
        passengerCount: 46,
        driverName: generateDriverName(11),
        driverPhone: generatePhone(11),
        guideName: generateGuideName(11),
        guidePhone: generatePhone(111),
        destinationHotel: 'المطار',
        destinationCity: 'Jeddah',
        arrivalStatus: 'arrived'
      }
    ],
    createdAt: '2024-01-21T14:30:00Z'
  },
  {
    id: 'city-transfer-008',
    hotelName: generateHotelName(7),
    date: '2024-01-21',
    time: '16:00',
    busesCount: 3,
    city: 'Makkah',
    fromCity: 'Madinah',
    toCity: 'Makkah',
    buses: [
      {
        id: 'bus-city-008-1',
        busNumber: '1',
        passengerCount: 40,
        driverName: generateDriverName(12),
        driverPhone: generatePhone(12),
        guideName: generateGuideName(12),
        guidePhone: generatePhone(112),
        destinationHotel: generateHotelName(7),
        destinationCity: 'Makkah',
        arrivalStatus: 'not_arrived'
      },
      {
        id: 'bus-city-008-2',
        busNumber: '2',
        passengerCount: 38,
        driverName: generateDriverName(12),
        driverPhone: generatePhone(12),
        guideName: generateGuideName(12),
        guidePhone: generatePhone(112),
        destinationHotel: generateHotelName(7),
        destinationCity: 'Makkah',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-city-008-3',
        busNumber: '3',
        passengerCount: 35,
        driverName: generateDriverName(12),
        driverPhone: generatePhone(12),
        guideName: generateGuideName(12),
        guidePhone: generatePhone(112),
        destinationHotel: generateHotelName(7),
        destinationCity: 'Makkah',
        arrivalStatus: 'not_arrived'
      }
    ],
    createdAt: '2024-01-21T16:00:00Z'
  },
  {
    id: 'city-transfer-009',
    hotelName: generateHotelName(8),
    date: '2024-01-22',
    time: '08:30',
    busesCount: 2,
    city: 'Madinah',
    fromCity: 'Makkah',
    toCity: 'Madinah',
    buses: [
      {
        id: 'bus-city-009-1',
        busNumber: '1',
        passengerCount: 43,
        driverName: generateDriverName(13),
        driverPhone: generatePhone(13),
        guideName: generateGuideName(13),
        guidePhone: generatePhone(113),
        destinationHotel: generateHotelName(8),
        destinationCity: 'Madinah',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-city-009-2',
        busNumber: '2',
        passengerCount: 41,
        driverName: generateDriverName(13),
        driverPhone: generatePhone(13),
        guideName: generateGuideName(13),
        guidePhone: generatePhone(113),
        destinationHotel: generateHotelName(8),
        destinationCity: 'Madinah',
        arrivalStatus: 'not_arrived'
      }
    ],
    createdAt: '2024-01-22T08:30:00Z'
  },
  {
    id: 'city-transfer-010',
    hotelName: generateHotelName(9),
    date: '2024-01-22',
    time: '12:00',
    busesCount: 2,
    city: 'Makkah',
    fromCity: 'Jeddah',
    toCity: 'Makkah',
    buses: [
      {
        id: 'bus-city-010-1',
        busNumber: '1',
        passengerCount: 46,
        driverName: generateDriverName(14),
        driverPhone: generatePhone(14),
        guideName: generateGuideName(14),
        guidePhone: generatePhone(114),
        destinationHotel: generateHotelName(9),
        destinationCity: 'Makkah',
        arrivalStatus: 'not_arrived'
      },
      {
        id: 'bus-city-010-2',
        busNumber: '2',
        passengerCount: 44,
        driverName: generateDriverName(14),
        driverPhone: generatePhone(14),
        guideName: generateGuideName(14),
        guidePhone: generatePhone(114),
        destinationHotel: generateHotelName(9),
        destinationCity: 'Makkah',
        arrivalStatus: 'arrived'
      }
    ],
    createdAt: '2024-01-22T12:00:00Z'
  }
];

// Mock data for Mashair Transfers (Holy Sites transfers)
export const mockMashairTransfers: MashairTransfer[] = [
  {
    id: 'mashair-transfer-001',
    hotelName: generateHotelName(0),
    date: '2024-01-22',
    time: '06:00',
    busesCount: 4,
    route: 'Mina → Arafat',
    buses: [
      {
        id: 'bus-mashair-001-1',
        busNumber: '1',
        responseNumber: '1',
        passengerCount: 45,
        driverName: generateDriverName(5),
        driverPhone: generatePhone(5),
        guideName: generateGuideName(5),
        guidePhone: generatePhone(105),
        destinationHotel: generateHotelName(0),
        destinationLocation: 'Arafat',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-001-2',
        busNumber: '1',
        responseNumber: '2',
        passengerCount: 42,
        driverName: generateDriverName(5),
        driverPhone: generatePhone(5),
        guideName: generateGuideName(5),
        guidePhone: generatePhone(105),
        destinationHotel: generateHotelName(0),
        destinationLocation: 'Arafat',
        arrivalStatus: 'not_arrived'
      },
      {
        id: 'bus-mashair-001-3',
        busNumber: '2',
        responseNumber: '1',
        passengerCount: 40,
        driverName: generateDriverName(5),
        driverPhone: generatePhone(5),
        guideName: generateGuideName(5),
        guidePhone: generatePhone(105),
        destinationHotel: generateHotelName(1),
        destinationLocation: 'Arafat',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-001-4',
        busNumber: '2',
        responseNumber: '2',
        passengerCount: 38,
        driverName: generateDriverName(5),
        driverPhone: generatePhone(5),
        guideName: generateGuideName(5),
        guidePhone: generatePhone(105),
        destinationHotel: generateHotelName(1),
        destinationLocation: 'Arafat',
        arrivalStatus: 'arrived'
      }
    ],
    createdAt: '2024-01-22T06:00:00Z'
  },
  {
    id: 'mashair-transfer-002',
    hotelName: generateHotelName(1),
    date: '2024-01-22',
    time: '07:30',
    busesCount: 2,
    route: 'Mina → Arafat',
    buses: [
      {
        id: 'bus-mashair-002-1',
        busNumber: '3',
        responseNumber: '1',
        passengerCount: 38,
        driverName: generateDriverName(6),
        driverPhone: generatePhone(6),
        guideName: generateGuideName(6),
        guidePhone: generatePhone(106),
        destinationHotel: generateHotelName(1),
        destinationLocation: 'Arafat',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-002-2',
        busNumber: '3',
        responseNumber: '2',
        passengerCount: 35,
        driverName: generateDriverName(6),
        driverPhone: generatePhone(6),
        guideName: generateGuideName(6),
        guidePhone: generatePhone(106),
        destinationHotel: generateHotelName(2),
        destinationLocation: 'Arafat',
        arrivalStatus: 'not_arrived'
      }
    ],
    createdAt: '2024-01-22T07:30:00Z'
  },
  {
    id: 'mashair-transfer-003',
    hotelName: generateHotelName(2),
    date: '2024-01-22',
    time: '18:00',
    busesCount: 2,
    route: 'Arafat → Muzdalifah',
    buses: [
      {
        id: 'bus-mashair-003-1',
        busNumber: '4',
        responseNumber: '1',
        passengerCount: 50,
        driverName: generateDriverName(18),
        driverPhone: generatePhone(18),
        guideName: generateGuideName(18),
        guidePhone: generatePhone(118),
        destinationHotel: generateHotelName(2),
        destinationLocation: 'Muzdalifah',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-003-2',
        busNumber: '4',
        responseNumber: '2',
        passengerCount: 48,
        driverName: generateDriverName(18),
        driverPhone: generatePhone(18),
        guideName: generateGuideName(18),
        guidePhone: generatePhone(118),
        destinationHotel: generateHotelName(3),
        destinationLocation: 'Muzdalifah',
        arrivalStatus: 'not_arrived'
      }
    ],
    createdAt: '2024-01-22T18:00:00Z'
  },
  {
    id: 'mashair-transfer-004',
    hotelName: generateHotelName(3),
    date: '2024-01-22',
    time: '19:30',
    busesCount: 4,
    route: 'Arafat → Muzdalifah',
    buses: [
      {
        id: 'bus-mashair-004-1',
        busNumber: '5',
        responseNumber: '1',
        passengerCount: 43,
        driverName: generateDriverName(7),
        driverPhone: generatePhone(7),
        guideName: generateGuideName(7),
        guidePhone: generatePhone(107),
        destinationHotel: generateHotelName(3),
        destinationLocation: 'Muzdalifah',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-004-2',
        busNumber: '5',
        responseNumber: '2',
        passengerCount: 41,
        driverName: generateDriverName(7),
        driverPhone: generatePhone(7),
        guideName: generateGuideName(7),
        guidePhone: generatePhone(107),
        destinationHotel: generateHotelName(4),
        destinationLocation: 'Muzdalifah',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-004-3',
        busNumber: '6',
        responseNumber: '1',
        passengerCount: 39,
        driverName: generateDriverName(7),
        driverPhone: generatePhone(7),
        guideName: generateGuideName(7),
        guidePhone: generatePhone(107),
        destinationHotel: generateHotelName(5),
        destinationLocation: 'Muzdalifah',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-004-4',
        busNumber: '6',
        responseNumber: '2',
        passengerCount: 37,
        driverName: generateDriverName(7),
        driverPhone: generatePhone(7),
        guideName: generateGuideName(7),
        guidePhone: generatePhone(107),
        destinationHotel: generateHotelName(6),
        destinationLocation: 'Muzdalifah',
        arrivalStatus: 'not_arrived'
      }
    ],
    createdAt: '2024-01-22T19:30:00Z'
  },
  {
    id: 'mashair-transfer-005',
    hotelName: generateHotelName(4),
    date: '2024-01-23',
    time: '05:00',
    busesCount: 4,
    route: 'Muzdalifah → Mina',
    buses: [
      {
        id: 'bus-mashair-005-1',
        busNumber: '8',
        responseNumber: '1',
        passengerCount: 47,
        driverName: generateDriverName(8),
        driverPhone: generatePhone(8),
        guideName: generateGuideName(8),
        guidePhone: generatePhone(108),
        destinationHotel: generateHotelName(4),
        destinationLocation: 'Mina',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-005-2',
        busNumber: '8',
        responseNumber: '2',
        passengerCount: 36,
        driverName: generateDriverName(8),
        driverPhone: generatePhone(8),
        guideName: generateGuideName(8),
        guidePhone: generatePhone(108),
        destinationHotel: generateHotelName(5),
        destinationLocation: 'Mina',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-005-3',
        busNumber: '9',
        responseNumber: '1',
        passengerCount: 44,
        driverName: generateDriverName(8),
        driverPhone: generatePhone(8),
        guideName: generateGuideName(8),
        guidePhone: generatePhone(108),
        destinationHotel: generateHotelName(6),
        destinationLocation: 'Mina',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-005-4',
        busNumber: '9',
        responseNumber: '2',
        passengerCount: 38,
        driverName: generateDriverName(8),
        driverPhone: generatePhone(8),
        guideName: generateGuideName(8),
        guidePhone: generatePhone(108),
        destinationHotel: generateHotelName(7),
        destinationLocation: 'Mina',
        arrivalStatus: 'not_arrived'
      }
    ],
    createdAt: '2024-01-23T05:00:00Z'
  },
  {
    id: 'mashair-transfer-006',
    hotelName: generateHotelName(5),
    date: '2024-01-23',
    time: '06:30',
    busesCount: 2,
    route: 'Muzdalifah → Mina',
    buses: [
      {
        id: 'bus-mashair-006-1',
        busNumber: '10',
        responseNumber: '1',
        passengerCount: 45,
        driverName: generateDriverName(9),
        driverPhone: generatePhone(9),
        guideName: generateGuideName(9),
        guidePhone: generatePhone(109),
        destinationHotel: generateHotelName(5),
        destinationLocation: 'Mina',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-006-2',
        busNumber: '10',
        responseNumber: '2',
        passengerCount: 43,
        driverName: generateDriverName(9),
        driverPhone: generatePhone(9),
        guideName: generateGuideName(9),
        guidePhone: generatePhone(109),
        destinationHotel: generateHotelName(8),
        destinationLocation: 'Mina',
        arrivalStatus: 'not_arrived'
      }
    ],
    createdAt: '2024-01-23T06:30:00Z'
  },
  {
    id: 'mashair-transfer-007',
    hotelName: generateHotelName(6),
    date: '2024-01-22',
    time: '08:00',
    busesCount: 1,
    route: 'Mina → Arafat',
    buses: [
      {
        id: 'bus-mashair-007-1',
        busNumber: '4',
        responseNumber: '3',
        passengerCount: 47,
        driverName: generateDriverName(14),
        driverPhone: generatePhone(14),
        guideName: generateGuideName(14),
        guidePhone: generatePhone(114),
        destinationHotel: generateHotelName(6),
        destinationLocation: 'Arafat',
        arrivalStatus: 'arrived'
      }
    ],
    createdAt: '2024-01-22T08:00:00Z'
  },
  {
    id: 'mashair-transfer-010',
    hotelName: generateHotelName(9),
    date: '2024-01-24',
    time: '08:00',
    busesCount: 4,
    route: 'Mina → Makkah',
    buses: [
      {
        id: 'bus-mashair-010-1',
        busNumber: '11',
        responseNumber: '1',
        passengerCount: 45,
        driverName: generateDriverName(17),
        driverPhone: generatePhone(17),
        guideName: generateGuideName(17),
        guidePhone: generatePhone(117),
        destinationHotel: generateHotelName(9),
        destinationLocation: 'Makkah',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-010-2',
        busNumber: '11',
        responseNumber: '2',
        passengerCount: 42,
        driverName: generateDriverName(17),
        driverPhone: generatePhone(17),
        guideName: generateGuideName(17),
        guidePhone: generatePhone(117),
        destinationHotel: generateHotelName(10),
        destinationLocation: 'Makkah',
        arrivalStatus: 'not_arrived'
      },
      {
        id: 'bus-mashair-010-3',
        busNumber: '12',
        responseNumber: '1',
        passengerCount: 41,
        driverName: generateDriverName(17),
        driverPhone: generatePhone(17),
        guideName: generateGuideName(17),
        guidePhone: generatePhone(117),
        destinationHotel: generateHotelName(11),
        destinationLocation: 'Makkah',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-010-4',
        busNumber: '12',
        responseNumber: '2',
        passengerCount: 39,
        driverName: generateDriverName(17),
        driverPhone: generatePhone(17),
        guideName: generateGuideName(17),
        guidePhone: generatePhone(117),
        destinationHotel: generateHotelName(12),
        destinationLocation: 'Makkah',
        arrivalStatus: 'arrived'
      }
    ],
    createdAt: '2024-01-24T08:00:00Z'
  },
  {
    id: 'mashair-transfer-011',
    hotelName: generateHotelName(10),
    date: '2024-01-24',
    time: '09:30',
    busesCount: 2,
    route: 'Mina → Makkah',
    buses: [
      {
        id: 'bus-mashair-011-1',
        busNumber: '13',
        responseNumber: '1',
        passengerCount: 40,
        driverName: generateDriverName(18),
        driverPhone: generatePhone(18),
        guideName: generateGuideName(18),
        guidePhone: generatePhone(118),
        destinationHotel: generateHotelName(11),
        destinationLocation: 'Makkah',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-011-2',
        busNumber: '13',
        responseNumber: '2',
        passengerCount: 38,
        driverName: generateDriverName(18),
        driverPhone: generatePhone(18),
        guideName: generateGuideName(18),
        guidePhone: generatePhone(118),
        destinationHotel: generateHotelName(12),
        destinationLocation: 'Makkah',
        arrivalStatus: 'not_arrived'
      }
    ],
    createdAt: '2024-01-24T09:30:00Z'
  },
  {
    id: 'mashair-transfer-012',
    hotelName: generateHotelName(11),
    date: '2024-01-24',
    time: '14:00',
    busesCount: 2,
    route: 'Makkah → Mina',
    buses: [
      {
        id: 'bus-mashair-012-1',
        busNumber: '14',
        responseNumber: '1',
        passengerCount: 47,
        driverName: generateDriverName(19),
        driverPhone: generatePhone(19),
        guideName: generateGuideName(19),
        guidePhone: generatePhone(119),
        destinationHotel: generateHotelName(0),
        destinationLocation: 'Mina',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-012-2',
        busNumber: '14',
        responseNumber: '2',
        passengerCount: 45,
        driverName: generateDriverName(19),
        driverPhone: generatePhone(19),
        guideName: generateGuideName(19),
        guidePhone: generatePhone(119),
        destinationHotel: generateHotelName(1),
        destinationLocation: 'Mina',
        arrivalStatus: 'not_arrived'
      }
    ],
    createdAt: '2024-01-24T14:00:00Z'
  },
  {
    id: 'mashair-transfer-013',
    hotelName: generateHotelName(12),
    date: '2024-01-24',
    time: '15:30',
    busesCount: 4,
    route: 'Makkah → Mina',
    buses: [
      {
        id: 'bus-mashair-013-1',
        busNumber: '15',
        responseNumber: '1',
        passengerCount: 44,
        driverName: generateDriverName(20),
        driverPhone: generatePhone(20),
        guideName: generateGuideName(20),
        guidePhone: generatePhone(120),
        destinationHotel: generateHotelName(1),
        destinationLocation: 'Mina',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-013-2',
        busNumber: '15',
        responseNumber: '2',
        passengerCount: 41,
        driverName: generateDriverName(20),
        driverPhone: generatePhone(20),
        guideName: generateGuideName(20),
        guidePhone: generatePhone(120),
        destinationHotel: generateHotelName(2),
        destinationLocation: 'Mina',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-013-3',
        busNumber: '16',
        responseNumber: '1',
        passengerCount: 43,
        driverName: generateDriverName(20),
        driverPhone: generatePhone(20),
        guideName: generateGuideName(20),
        guidePhone: generatePhone(120),
        destinationHotel: generateHotelName(3),
        destinationLocation: 'Mina',
        arrivalStatus: 'arrived'
      },
      {
        id: 'bus-mashair-013-4',
        busNumber: '16',
        responseNumber: '2',
        passengerCount: 40,
        driverName: generateDriverName(20),
        driverPhone: generatePhone(20),
        guideName: generateGuideName(20),
        guidePhone: generatePhone(120),
        destinationHotel: generateHotelName(4),
        destinationLocation: 'Mina',
        arrivalStatus: 'not_arrived'
      }
    ],
    createdAt: '2024-01-24T15:30:00Z'
  }
];
