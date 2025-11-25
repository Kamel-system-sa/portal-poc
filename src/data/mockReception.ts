import type {
  ArrivalGroup,
  Accommodation,
  Organizer,
  Bus,
  DashboardKPI,
  ChartData,
  ActivityTimelineItem,
  PortActivity,
  RawPassengerData
} from '../types/reception';

// Mock Organizers
export const mockOrganizers: Organizer[] = [
  {
    id: 'org-1',
    number: 'ORG-001',
    name: 'منظم 1',
    company: 'شركة 1',
    phone: '+966501234567',
    email: 'organizer1@example.com'
  },
  {
    id: 'org-2',
    number: 'ORG-002',
    name: 'منظم 2',
    company: 'شركة 2',
    phone: '+966502345678',
    email: 'organizer2@example.com'
  },
  {
    id: 'org-3',
    number: 'ORG-003',
    name: 'منظم 3',
    company: 'شركة 3',
    phone: '+966503456789',
    email: 'organizer3@example.com'
  },
  {
    id: 'org-4',
    number: 'ORG-004',
    name: 'منظم 4',
    company: 'شركة 4',
    phone: '+966504567890',
    email: 'organizer4@example.com'
  },
  {
    id: 'org-5',
    number: 'ORG-005',
    name: 'منظم 5',
    company: 'شركة 5',
    phone: '+966505678901',
    email: 'organizer5@example.com'
  }
];

// Mock Accommodations
export const mockAccommodations: Accommodation[] = [
  {
    id: 'acc-1',
    name: 'إسكان 1',
    type: 'hotel',
    location: 'موقع 1',
    capacity: 500,
    occupied: 380,
    available: 120
  },
  {
    id: 'acc-2',
    name: 'إسكان 2',
    type: 'hotel',
    location: 'موقع 2',
    capacity: 400,
    occupied: 320,
    available: 80
  },
  {
    id: 'acc-3',
    name: 'إسكان 3',
    type: 'building',
    location: 'موقع 3',
    capacity: 600,
    occupied: 450,
    available: 150
  },
  {
    id: 'acc-4',
    name: 'إسكان 4',
    type: 'tent',
    location: 'موقع 4',
    capacity: 800,
    occupied: 600,
    available: 200
  },
  {
    id: 'acc-5',
    name: 'إسكان 5',
    type: 'tent',
    location: 'موقع 5',
    capacity: 700,
    occupied: 550,
    available: 150
  }
];

// Helper to generate raw passenger data (hidden by default)
const generateRawPassengerData = (count: number, groupId: string): RawPassengerData[] => {
  const nationalities = ['saudi', 'egyptian', 'pakistani', 'indian', 'indonesian', 'turkish', 'jordanian', 'bangladeshi'];
  const genders: ('male' | 'female')[] = ['male', 'female'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `passenger-${groupId}-${i + 1}`,
    name: `Passenger ${i + 1} Group ${groupId}`,
    passportNumber: `P${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
    visaNumber: `V${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
    nationality: nationalities[i % nationalities.length],
    gender: genders[i % 2],
    age: Math.floor(Math.random() * 50) + 25,
    phone: `05${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    email: `passenger${i + 1}.group${groupId}@example.com`
  }));
};

// Mock Arrival Groups (8-12 groups)
const today = new Date();
const generateDate = (daysFromNow: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

const generateTime = () => {
  const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
  const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  return `${hour}:${minute}`;
};

export const mockArrivalGroups: ArrivalGroup[] = [
  {
    id: 'group-1',
    groupNumber: 'GRP-001',
    groupName: 'مجموعة 1',
    arrivalDate: generateDate(0), // Today
    arrivalTime: '14:30',
    flightNumber: 'SV-1234',
    pilgrimsCount: 180,
    arrivedCount: 180,
    destination: 'makkah',
    organizer: mockOrganizers[0],
    accommodations: [
      { accommodationId: 'acc-1', accommodationName: 'إسكان 1', pilgrimsAssigned: 120 },
      { accommodationId: 'acc-3', accommodationName: 'إسكان 3', pilgrimsAssigned: 60 }
    ],
    status: 'arrived',
    campaignNumber: 'CAMP-2024-001',
    createdAt: generateDate(-5),
    rawPassengerData: generateRawPassengerData(180, 'group-1')
  },
  {
    id: 'group-2',
    groupNumber: 'GRP-002',
    groupName: 'مجموعة 2',
    arrivalDate: generateDate(0), // Today
    arrivalTime: '18:45',
    flightNumber: 'SV-5678',
    pilgrimsCount: 250,
    arrivedCount: 0,
    destination: 'makkah',
    organizer: mockOrganizers[1],
    accommodations: [
      { accommodationId: 'acc-2', accommodationName: 'إسكان 2', pilgrimsAssigned: 150 },
      { accommodationId: 'acc-3', accommodationName: 'إسكان 3', pilgrimsAssigned: 100 }
    ],
    status: 'scheduled',
    campaignNumber: 'CAMP-2024-002',
    createdAt: generateDate(-4),
    rawPassengerData: generateRawPassengerData(250, 'group-2')
  },
  {
    id: 'group-3',
    groupNumber: 'GRP-003',
    groupName: 'مجموعة 3',
    arrivalDate: generateDate(1), // Tomorrow
    arrivalTime: '10:15',
    flightNumber: 'SV-9012',
    pilgrimsCount: 320,
    arrivedCount: 0,
    destination: 'madinah',
    organizer: mockOrganizers[2],
    accommodations: [
      { accommodationId: 'acc-1', accommodationName: 'إسكان 1', pilgrimsAssigned: 200 },
      { accommodationId: 'acc-4', accommodationName: 'إسكان 4', pilgrimsAssigned: 120 }
    ],
    status: 'scheduled',
    campaignNumber: 'CAMP-2024-003',
    createdAt: generateDate(-3),
    rawPassengerData: generateRawPassengerData(320, 'group-3')
  },
  {
    id: 'group-4',
    groupNumber: 'GRP-004',
    groupName: 'مجموعة 4',
    arrivalDate: generateDate(1),
    arrivalTime: '16:20',
    tripNumber: 'TRIP-0045',
    pilgrimsCount: 150,
    arrivedCount: 0,
    destination: 'makkah',
    organizer: mockOrganizers[3],
    accommodations: [
      { accommodationId: 'acc-2', accommodationName: 'إسكان 2', pilgrimsAssigned: 150 }
    ],
    status: 'scheduled',
    campaignNumber: 'CAMP-2024-004',
    createdAt: generateDate(-2),
    rawPassengerData: generateRawPassengerData(150, 'group-4')
  },
  {
    id: 'group-5',
    groupNumber: 'GRP-005',
    groupName: 'مجموعة 5',
    arrivalDate: generateDate(2),
    arrivalTime: '08:30',
    flightNumber: 'SV-3456',
    pilgrimsCount: 280,
    arrivedCount: 0,
    destination: 'mina',
    organizer: mockOrganizers[4],
    accommodations: [
      { accommodationId: 'acc-4', accommodationName: 'إسكان 4', pilgrimsAssigned: 180 },
      { accommodationId: 'acc-5', accommodationName: 'إسكان 5', pilgrimsAssigned: 100 }
    ],
    status: 'scheduled',
    campaignNumber: 'CAMP-2024-005',
    createdAt: generateDate(-6),
    rawPassengerData: generateRawPassengerData(280, 'group-5')
  },
  {
    id: 'group-6',
    groupNumber: 'GRP-006',
    groupName: 'مجموعة 6',
    arrivalDate: generateDate(2),
    arrivalTime: '20:00',
    flightNumber: 'SV-7890',
    pilgrimsCount: 200,
    arrivedCount: 0,
    destination: 'arafat',
    organizer: mockOrganizers[0],
    accommodations: [
      { accommodationId: 'acc-5', accommodationName: 'إسكان 5', pilgrimsAssigned: 200 }
    ],
    status: 'scheduled',
    campaignNumber: 'CAMP-2024-006',
    createdAt: generateDate(-5),
    rawPassengerData: generateRawPassengerData(200, 'group-6')
  },
  {
    id: 'group-7',
    groupNumber: 'GRP-007',
    groupName: 'مجموعة 7',
    arrivalDate: generateDate(-1), // Yesterday - completed
    arrivalTime: '12:00',
    flightNumber: 'SV-2468',
    pilgrimsCount: 175,
    arrivedCount: 175,
    destination: 'makkah',
    organizer: mockOrganizers[1],
    accommodations: [
      { accommodationId: 'acc-1', accommodationName: 'إسكان 1', pilgrimsAssigned: 175 }
    ],
    status: 'completed',
    campaignNumber: 'CAMP-2024-007',
    createdAt: generateDate(-7),
    rawPassengerData: generateRawPassengerData(175, 'group-7')
  },
  {
    id: 'group-8',
    groupNumber: 'GRP-008',
    groupName: 'مجموعة 8',
    arrivalDate: generateDate(-2), // 2 days ago - completed
    arrivalTime: '15:30',
    tripNumber: 'TRIP-0032',
    pilgrimsCount: 220,
    arrivedCount: 220,
    destination: 'madinah',
    organizer: mockOrganizers[2],
    accommodations: [
      { accommodationId: 'acc-3', accommodationName: 'إسكان 3', pilgrimsAssigned: 220 }
    ],
    status: 'completed',
    campaignNumber: 'CAMP-2024-008',
    createdAt: generateDate(-8),
    rawPassengerData: generateRawPassengerData(220, 'group-8')
  },
  {
    id: 'group-9',
    groupNumber: 'GRP-009',
    groupName: 'مجموعة 9',
    arrivalDate: generateDate(3),
    arrivalTime: '11:45',
    flightNumber: 'SV-1357',
    pilgrimsCount: 190,
    arrivedCount: 0,
    destination: 'makkah',
    organizer: mockOrganizers[3],
    accommodations: [
      { accommodationId: 'acc-1', accommodationName: 'إسكان 1', pilgrimsAssigned: 100 },
      { accommodationId: 'acc-2', accommodationName: 'إسكان 2', pilgrimsAssigned: 90 }
    ],
    status: 'scheduled',
    campaignNumber: 'CAMP-2024-009',
    createdAt: generateDate(-4),
    rawPassengerData: generateRawPassengerData(190, 'group-9')
  },
  {
    id: 'group-10',
    groupNumber: 'GRP-010',
    groupName: 'مجموعة 10',
    arrivalDate: generateDate(3),
    arrivalTime: '19:15',
    flightNumber: 'SV-9753',
    pilgrimsCount: 310,
    arrivedCount: 0,
    destination: 'mina',
    organizer: mockOrganizers[4],
    accommodations: [
      { accommodationId: 'acc-4', accommodationName: 'إسكان 4', pilgrimsAssigned: 200 },
      { accommodationId: 'acc-5', accommodationName: 'إسكان 5', pilgrimsAssigned: 110 }
    ],
    status: 'scheduled',
    campaignNumber: 'CAMP-2024-010',
    createdAt: generateDate(-6),
    rawPassengerData: generateRawPassengerData(310, 'group-10')
  }
];

// Mock Buses (5-6 buses)
export const mockBuses: Bus[] = [
  {
    id: 'bus-1',
    number: 'BUS-001',
    carrier: 'شركة نقل 1',
    driverName: 'سائق 1',
    driverPhone: '+966501111111',
    capacity: 50,
    passengers: 50,
    groupId: 'group-1',
    status: 'arrived'
  },
  {
    id: 'bus-2',
    number: 'BUS-002',
    carrier: 'Al-Najm Transport',
    driverName: 'سائق 2',
    driverPhone: '+966502222222',
    capacity: 50,
    passengers: 45,
    groupId: 'group-2',
    status: 'assigned'
  },
  {
    id: 'bus-3',
    number: 'BUS-003',
    carrier: 'شركة نقل 2',
    driverName: 'سائق 3',
    driverPhone: '+966503333333',
    capacity: 45,
    passengers: 0,
    status: 'available'
  },
  {
    id: 'bus-4',
    number: 'BUS-004',
    carrier: 'شركة نقل 3',
    driverName: 'سائق 4',
    driverPhone: '+966504444444',
    capacity: 50,
    passengers: 50,
    groupId: 'group-4',
    status: 'in-transit'
  },
  {
    id: 'bus-5',
    number: 'BUS-005',
    carrier: 'Al-Najm Transport',
    driverName: 'سائق 5',
    driverPhone: '+966505555555',
    capacity: 45,
    passengers: 0,
    status: 'available'
  },
  {
    id: 'bus-6',
    number: 'BUS-006',
    carrier: 'Saudi Bus Company',
    driverName: 'سائق 6',
    driverPhone: '+966506666666',
    capacity: 50,
    passengers: 50,
    groupId: 'group-7',
    status: 'arrived'
  }
];

// Calculate Dashboard KPIs
export const mockDashboardKPI: DashboardKPI = {
  totalContracted: mockArrivalGroups.reduce((sum, g) => sum + g.pilgrimsCount, 0),
  totalArrived: mockArrivalGroups.reduce((sum, g) => sum + g.arrivedCount, 0),
  remaining: mockArrivalGroups.reduce((sum, g) => sum + (g.pilgrimsCount - g.arrivedCount), 0),
  todayExpected: mockArrivalGroups
    .filter(g => g.arrivalDate === generateDate(0))
    .reduce((sum, g) => sum + g.pilgrimsCount, 0),
  todayArrived: mockArrivalGroups
    .filter(g => g.arrivalDate === generateDate(0))
    .reduce((sum, g) => sum + g.arrivedCount, 0)
};

// Mock Chart Data - Arrivals by Destination
export const mockArrivalsByDestination: ChartData = {
  labels: ['Makkah', 'Madinah', 'Mina', 'Arafat'],
  values: [
    mockArrivalGroups.filter(g => g.destination === 'makkah').reduce((sum, g) => sum + g.pilgrimsCount, 0),
    mockArrivalGroups.filter(g => g.destination === 'madinah').reduce((sum, g) => sum + g.pilgrimsCount, 0),
    mockArrivalGroups.filter(g => g.destination === 'mina').reduce((sum, g) => sum + g.pilgrimsCount, 0),
    mockArrivalGroups.filter(g => g.destination === 'arafat').reduce((sum, g) => sum + g.pilgrimsCount, 0)
  ]
};

// Mock Chart Data - Arrivals Trend (last 7 days)
export const mockArrivalsTrend: ChartData = {
  labels: Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - 6 + i);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  }),
  values: [175, 220, 0, 180, 0, 250, 430] // Yesterday to next week
};

// Mock Chart Data - Arrivals by Campaign
export const mockArrivalsByCampaign: ChartData = {
  labels: Array.from(new Set(mockArrivalGroups.map(g => g.campaignNumber))).filter(Boolean) as string[],
  values: Array.from(new Set(mockArrivalGroups.map(g => g.campaignNumber))).map(campaign => {
    return mockArrivalGroups
      .filter(g => g.campaignNumber === campaign)
      .reduce((sum, g) => sum + g.pilgrimsCount, 0);
  })
};

// Mock Activity Timeline
export const mockActivityTimeline: ActivityTimelineItem[] = [
  {
    id: 'activity-1',
    type: 'group-arrived',
    title: 'وصلت المجموعة GRP-001',
    description: 'وصل 180 حاج إلى مطار جدة',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    groupId: 'group-1',
    userId: 'user-1',
    userName: 'مستخدم 1'
  },
  {
    id: 'activity-2',
    type: 'accommodation-assigned',
    title: 'تم تخصيص الإسكان للمجموعة GRP-002',
    description: 'تم تخصيص 250 حاج إلى أبراج الصفا ومقر الحجاج',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    groupId: 'group-2',
    userId: 'user-2',
    userName: 'مستخدم 2'
  },
  {
    id: 'activity-3',
    type: 'bus-dispatched',
    title: 'تم إرسال الحافلة BUS-002',
    description: 'تم إرسال الحافلة للمجموعة GRP-002',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    groupId: 'group-2',
    userId: 'user-3',
    userName: 'مستخدم 3'
  },
  {
    id: 'activity-4',
    type: 'group-created',
    title: 'تم إنشاء مجموعة جديدة GRP-010',
    description: 'تم جدولة 310 حاج للوصول في اليوم الثالث',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    groupId: 'group-10',
    userId: 'user-1',
    userName: 'مستخدم 1'
  },
  {
    id: 'activity-5',
    type: 'port-arrival',
    title: 'تم تأكيد وصول المجموعة GRP-007',
    description: 'تم تأكيد وصول 175 حاج في مطار الملك عبدالعزيز',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    groupId: 'group-7',
    userId: 'user-4',
    userName: 'مستخدم 4'
  }
];

// Mock Port Activities
export const mockPortActivities: PortActivity[] = [
  {
    id: 'port-1',
    type: 'airport-arrival',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    groupId: 'group-1',
    groupName: 'مجموعة 1',
    flightNumber: 'SV-1234',
    pilgrimCount: 180,
    status: 'confirmed'
  },
  {
    id: 'port-2',
    type: 'land-port-passage',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    groupId: 'group-4',
    groupName: 'مجموعة 4',
    busNumber: 'BUS-004',
    pilgrimCount: 150,
    status: 'confirmed'
  }
];

// Mock Nationality Statistics Data
export interface NationalityStatisticsData {
  id: string;
  name: string;
  nameAr: string;
  flag: string;
  arrivals: number;
  departures: number;
}

export const mockNationalityStatistics: NationalityStatisticsData[] = [
  {
    id: 'albania',
    name: 'Albania',
    nameAr: 'ألبانيا',
    flag: '🇦🇱',
    arrivals: 602,
    departures: 602
  },
  {
    id: 'tunisia',
    name: 'Tunisia',
    nameAr: 'تونس',
    flag: '🇹🇳',
    arrivals: 11005,
    departures: 11005
  },
  {
    id: 'tajikistan',
    name: 'Tajikistan',
    nameAr: 'طاجيكستان',
    flag: '🇹🇯',
    arrivals: 6838,
    departures: 6838
  },
  {
    id: 'bangladesh',
    name: 'Bangladesh',
    nameAr: 'بنجلاديش',
    flag: '🇧🇩',
    arrivals: 9802,
    departures: 9802
  },
  {
    id: 'egypt',
    name: 'Egypt',
    nameAr: 'مصر',
    flag: '🇪🇬',
    arrivals: 24520,
    departures: 24520
  },
  {
    id: 'kyrgyzstan',
    name: 'Kyrgyzstan',
    nameAr: 'قيرغستان',
    flag: '🇰🇬',
    arrivals: 6038,
    departures: 6038
  },
  {
    id: 'algeria',
    name: 'Algeria',
    nameAr: 'الجزائر',
    flag: '🇩🇿',
    arrivals: 41274,
    departures: 41274
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    nameAr: 'نيجيريا',
    flag: '🇳🇬',
    arrivals: 20467,
    departures: 20248
  },
  {
    id: 'oman',
    name: 'Oman',
    nameAr: 'عمان',
    flag: '🇴🇲',
    arrivals: 14235,
    departures: 14235
  },
  {
    id: 'mauritania',
    name: 'Mauritania',
    nameAr: 'موريتانيا',
    flag: '🇲🇷',
    arrivals: 3307,
    departures: 3307
  },
  {
    id: 'eritrea',
    name: 'Eritrea',
    nameAr: 'اريتريا',
    flag: '🇪🇷',
    arrivals: 610,
    departures: 610
  },
  {
    id: 'direct-hajj',
    name: 'Direct Hajj',
    nameAr: 'الحج المباشر',
    flag: '🕋',
    arrivals: 2718,
    departures: 2565
  }
];
