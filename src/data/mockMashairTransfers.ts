import type { MashairTransfer, MashairTransferBus, MashairRoute } from '../types/transport';

const hotelsMina = [
  'فندق منى 1', 'فندق منى 2', 'فندق منى 3', 'فندق منى 4'
];

const hotelsArafat = [
  'فندق عرفات 1', 'فندق عرفات 2', 'فندق عرفات 3'
];

const hotelsMuzdalifah = [
  'فندق مزدلفة 1', 'فندق مزدلفة 2', 'فندق مزدلفة 3'
];

const generateMashairBuses = (
  count: number,
  startBusNumber: number,
  route: MashairRoute,
  hotelName: string
): MashairTransferBus[] => {
  const buses: MashairTransferBus[] = [];
  let destinationLocation: 'Mina' | 'Arafat' | 'Muzdalifah';
  let hotels: string[];
  
  if (route === 'Mina → Arafat') {
    destinationLocation = 'Arafat';
    hotels = hotelsArafat;
  } else if (route === 'Arafat → Muzdalifah') {
    destinationLocation = 'Muzdalifah';
    hotels = hotelsMuzdalifah;
  } else {
    destinationLocation = 'Mina';
    hotels = hotelsMina;
  }
  
  for (let i = 0; i < count; i++) {
    buses.push({
      id: `mashair-bus-${startBusNumber + i}`,
      busNumber: `BUS-${String(startBusNumber + i).padStart(3, '0')}`,
      passengerCount: Math.floor(Math.random() * 45) + 10,
      driverName: `Driver ${startBusNumber + i}`,
      driverPhone: `+9665${String(10000000 + startBusNumber + i).slice(-8)}`,
      guideName: `Guide ${startBusNumber + i}`,
      guidePhone: `+9665${String(20000000 + startBusNumber + i).slice(-8)}`,
      destinationHotel: hotels[Math.floor(Math.random() * hotels.length)],
      destinationLocation,
      arrivalStatus: Math.random() > 0.5 ? 'arrived' : 'not_arrived' as 'arrived' | 'not_arrived'
    });
  }
  
  return buses;
};

export const mockMashairTransfers: MashairTransfer[] = [
  // Mina → Arafat
  {
    id: 'mashair-001',
    hotelName: 'فندق منى 1',
    date: '2024-01-20',
    time: '08:00',
    busesCount: 3,
    route: 'Mina → Arafat',
    buses: generateMashairBuses(3, 1, 'Mina → Arafat', 'فندق منى 1'),
    createdAt: new Date().toISOString()
  },
  {
    id: 'mashair-002',
    hotelName: 'فندق منى 2',
    date: '2024-01-20',
    time: '09:00',
    busesCount: 2,
    route: 'Mina → Arafat',
    buses: generateMashairBuses(2, 4, 'Mina → Arafat', 'فندق منى 2'),
    createdAt: new Date().toISOString()
  },
  {
    id: 'mashair-003',
    hotelName: 'فندق منى 3',
    date: '2024-01-20',
    time: '10:00',
    busesCount: 4,
    route: 'Mina → Arafat',
    buses: generateMashairBuses(4, 6, 'Mina → Arafat', 'فندق منى 3'),
    createdAt: new Date().toISOString()
  },
  // Arafat → Muzdalifah
  {
    id: 'mashair-004',
    hotelName: 'فندق عرفات 1',
    date: '2024-01-20',
    time: '18:00',
    busesCount: 3,
    route: 'Arafat → Muzdalifah',
    buses: generateMashairBuses(3, 10, 'Arafat → Muzdalifah', 'فندق عرفات 1'),
    createdAt: new Date().toISOString()
  },
  {
    id: 'mashair-005',
    hotelName: 'فندق عرفات 2',
    date: '2024-01-20',
    time: '19:00',
    busesCount: 1,
    route: 'Arafat → Muzdalifah',
    buses: generateMashairBuses(1, 13, 'Arafat → Muzdalifah', 'فندق عرفات 2'),
    createdAt: new Date().toISOString()
  },
  {
    id: 'mashair-006',
    hotelName: 'فندق عرفات 3',
    date: '2024-01-20',
    time: '20:00',
    busesCount: 2,
    route: 'Arafat → Muzdalifah',
    buses: generateMashairBuses(2, 14, 'Arafat → Muzdalifah', 'فندق عرفات 3'),
    createdAt: new Date().toISOString()
  },
  // Muzdalifah → Mina
  {
    id: 'mashair-007',
    hotelName: 'فندق مزدلفة 1',
    date: '2024-01-21',
    time: '06:00',
    busesCount: 4,
    route: 'Muzdalifah → Mina',
    buses: generateMashairBuses(4, 16, 'Muzdalifah → Mina', 'فندق مزدلفة 1'),
    createdAt: new Date().toISOString()
  },
  {
    id: 'mashair-008',
    hotelName: 'فندق مزدلفة 2',
    date: '2024-01-21',
    time: '07:00',
    busesCount: 2,
    route: 'Muzdalifah → Mina',
    buses: generateMashairBuses(2, 20, 'Muzdalifah → Mina', 'فندق مزدلفة 2'),
    createdAt: new Date().toISOString()
  },
  {
    id: 'mashair-009',
    hotelName: 'فندق مزدلفة 3',
    date: '2024-01-21',
    time: '08:00',
    busesCount: 3,
    route: 'Muzdalifah → Mina',
    buses: generateMashairBuses(3, 22, 'Muzdalifah → Mina', 'فندق مزدلفة 3'),
    createdAt: new Date().toISOString()
  }
];

