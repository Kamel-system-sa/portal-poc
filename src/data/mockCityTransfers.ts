import type { CityTransfer, CityTransferBus } from '../types/transport';

const hotelsMakkah = [
  'فندق الماسة', 'فندق النور', 'فندق الكعبة', 'فندق الحرم',
  'فندق العزيزية', 'فندق العابدية', 'فندق أجياد', 'فندق المشاعر'
];

const hotelsMadinah = [
  'فندق النور', 'فندق الرسول', 'فندق المدينة', 'فندق طيبة',
  'فندق المنورة', 'فندق الحرم النبوي', 'فندق الأنصار', 'فندق الهجرة'
];

const generateBuses = (
  count: number,
  startBusNumber: number,
  city: 'Makkah' | 'Madinah',
  hotelName: string
): CityTransferBus[] => {
  const buses: CityTransferBus[] = [];
  const hotels = city === 'Makkah' ? hotelsMakkah : hotelsMadinah;
  
  for (let i = 0; i < count; i++) {
    buses.push({
      id: `bus-${startBusNumber + i}`,
      busNumber: `BUS-${String(startBusNumber + i).padStart(3, '0')}`,
      passengerCount: Math.floor(Math.random() * 45) + 10,
      driverName: `Driver ${startBusNumber + i}`,
      driverPhone: `+9665${String(10000000 + startBusNumber + i).slice(-8)}`,
      guideName: `Guide ${startBusNumber + i}`,
      guidePhone: `+9665${String(20000000 + startBusNumber + i).slice(-8)}`,
      destinationHotel: hotels[Math.floor(Math.random() * hotels.length)],
      destinationCity: city,
      arrivalStatus: Math.random() > 0.5 ? 'arrived' : 'not_arrived' as 'arrived' | 'not_arrived'
    });
  }
  
  return buses;
};

export const mockCityTransfers: CityTransfer[] = [
  {
    id: 'ct-001',
    hotelName: 'فندق الماسة',
    date: '2024-01-15',
    time: '06:00',
    busesCount: 3,
    city: 'Makkah',
    buses: generateBuses(3, 1, 'Makkah', 'فندق الماسة'),
    createdAt: new Date().toISOString()
  },
  {
    id: 'ct-002',
    hotelName: 'فندق النور',
    date: '2024-01-15',
    time: '08:00',
    busesCount: 2,
    city: 'Makkah',
    buses: generateBuses(2, 4, 'Makkah', 'فندق النور'),
    createdAt: new Date().toISOString()
  },
  {
    id: 'ct-003',
    hotelName: 'فندق الكعبة',
    date: '2024-01-15',
    time: '10:00',
    busesCount: 4,
    city: 'Makkah',
    buses: generateBuses(4, 6, 'Makkah', 'فندق الكعبة'),
    createdAt: new Date().toISOString()
  },
  {
    id: 'ct-004',
    hotelName: 'فندق الرسول',
    date: '2024-01-15',
    time: '07:00',
    busesCount: 2,
    city: 'Madinah',
    buses: generateBuses(2, 10, 'Madinah', 'فندق الرسول'),
    createdAt: new Date().toISOString()
  },
  {
    id: 'ct-005',
    hotelName: 'فندق المدينة',
    date: '2024-01-15',
    time: '09:00',
    busesCount: 3,
    city: 'Madinah',
    buses: generateBuses(3, 12, 'Madinah', 'فندق المدينة'),
    createdAt: new Date().toISOString()
  },
  {
    id: 'ct-006',
    hotelName: 'فندق الحرم',
    date: '2024-01-16',
    time: '06:30',
    busesCount: 1,
    city: 'Makkah',
    buses: generateBuses(1, 15, 'Makkah', 'فندق الحرم'),
    createdAt: new Date().toISOString()
  },
  {
    id: 'ct-007',
    hotelName: 'فندق العزيزية',
    date: '2024-01-16',
    time: '08:30',
    busesCount: 3,
    city: 'Makkah',
    buses: generateBuses(3, 16, 'Makkah', 'فندق العزيزية'),
    createdAt: new Date().toISOString()
  },
  {
    id: 'ct-008',
    hotelName: 'فندق طيبة',
    date: '2024-01-16',
    time: '10:30',
    busesCount: 4,
    city: 'Madinah',
    buses: generateBuses(4, 19, 'Madinah', 'فندق طيبة'),
    createdAt: new Date().toISOString()
  }
];

