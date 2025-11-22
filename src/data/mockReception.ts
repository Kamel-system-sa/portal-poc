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
    name: 'Al-Sheikh Travel & Tourism',
    company: 'Al-Sheikh Group',
    phone: '+966501234567',
    email: 'contact@alsheikh-travel.com'
  },
  {
    id: 'org-2',
    number: 'ORG-002',
    name: 'Makkah Tours International',
    company: 'Makkah Tours Co.',
    phone: '+966502345678',
    email: 'info@makkah-tours.com'
  },
  {
    id: 'org-3',
    number: 'ORG-003',
    name: 'Hajj & Umrah Services',
    company: 'Hajj Services Ltd.',
    phone: '+966503456789',
    email: 'support@hajj-services.com'
  },
  {
    id: 'org-4',
    number: 'ORG-004',
    name: 'Al-Haramain Pilgrimage',
    company: 'Al-Haramain Co.',
    phone: '+966504567890',
    email: 'contact@haramain-pilgrimage.com'
  },
  {
    id: 'org-5',
    number: 'ORG-005',
    name: 'Saudi Pilgrimage Services',
    company: 'SPS Group',
    phone: '+966505678901',
    email: 'info@sps-group.com'
  }
];

// Mock Accommodations
export const mockAccommodations: Accommodation[] = [
  {
    id: 'acc-1',
    name: 'Grand Makkah Hotel',
    type: 'hotel',
    location: 'Makkah, Near Haram',
    capacity: 500,
    occupied: 380,
    available: 120
  },
  {
    id: 'acc-2',
    name: 'Al-Safa Towers',
    type: 'hotel',
    location: 'Makkah, Al-Safa District',
    capacity: 400,
    occupied: 320,
    available: 80
  },
  {
    id: 'acc-3',
    name: 'Pilgrim Residence Complex A',
    type: 'building',
    location: 'Makkah, Al-Aziziyah',
    capacity: 600,
    occupied: 450,
    available: 150
  },
  {
    id: 'acc-4',
    name: 'Mina Camp Alpha',
    type: 'tent',
    location: 'Mashair Mina, Section 1',
    capacity: 800,
    occupied: 600,
    available: 200
  },
  {
    id: 'acc-5',
    name: 'Arafat Camp Beta',
    type: 'tent',
    location: 'Mashair Arafat, Section 2',
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
    groupName: 'Al-Sheikh Group A',
    arrivalDate: generateDate(0), // Today
    arrivalTime: '14:30',
    flightNumber: 'SV-1234',
    pilgrimsCount: 180,
    arrivedCount: 180,
    destination: 'makkah',
    organizer: mockOrganizers[0],
    accommodations: [
      { accommodationId: 'acc-1', accommodationName: 'Grand Makkah Hotel', pilgrimsAssigned: 120 },
      { accommodationId: 'acc-3', accommodationName: 'Pilgrim Residence Complex A', pilgrimsAssigned: 60 }
    ],
    status: 'arrived',
    campaignNumber: 'CAMP-2024-001',
    createdAt: generateDate(-5),
    rawPassengerData: generateRawPassengerData(180, 'group-1')
  },
  {
    id: 'group-2',
    groupNumber: 'GRP-002',
    groupName: 'Makkah Tours Group B',
    arrivalDate: generateDate(0), // Today
    arrivalTime: '18:45',
    flightNumber: 'SV-5678',
    pilgrimsCount: 250,
    arrivedCount: 0,
    destination: 'makkah',
    organizer: mockOrganizers[1],
    accommodations: [
      { accommodationId: 'acc-2', accommodationName: 'Al-Safa Towers', pilgrimsAssigned: 150 },
      { accommodationId: 'acc-3', accommodationName: 'Pilgrim Residence Complex A', pilgrimsAssigned: 100 }
    ],
    status: 'scheduled',
    campaignNumber: 'CAMP-2024-002',
    createdAt: generateDate(-4),
    rawPassengerData: generateRawPassengerData(250, 'group-2')
  },
  {
    id: 'group-3',
    groupNumber: 'GRP-003',
    groupName: 'Hajj Services Group C',
    arrivalDate: generateDate(1), // Tomorrow
    arrivalTime: '10:15',
    flightNumber: 'SV-9012',
    pilgrimsCount: 320,
    arrivedCount: 0,
    destination: 'madinah',
    organizer: mockOrganizers[2],
    accommodations: [
      { accommodationId: 'acc-1', accommodationName: 'Grand Makkah Hotel', pilgrimsAssigned: 200 },
      { accommodationId: 'acc-4', accommodationName: 'Mina Camp Alpha', pilgrimsAssigned: 120 }
    ],
    status: 'scheduled',
    campaignNumber: 'CAMP-2024-003',
    createdAt: generateDate(-3),
    rawPassengerData: generateRawPassengerData(320, 'group-3')
  },
  {
    id: 'group-4',
    groupNumber: 'GRP-004',
    groupName: 'Al-Haramain Group D',
    arrivalDate: generateDate(1),
    arrivalTime: '16:20',
    tripNumber: 'TRIP-0045',
    pilgrimsCount: 150,
    arrivedCount: 0,
    destination: 'makkah',
    organizer: mockOrganizers[3],
    accommodations: [
      { accommodationId: 'acc-2', accommodationName: 'Al-Safa Towers', pilgrimsAssigned: 150 }
    ],
    status: 'scheduled',
    campaignNumber: 'CAMP-2024-004',
    createdAt: generateDate(-2),
    rawPassengerData: generateRawPassengerData(150, 'group-4')
  },
  {
    id: 'group-5',
    groupNumber: 'GRP-005',
    groupName: 'SPS Group E',
    arrivalDate: generateDate(2),
    arrivalTime: '08:30',
    flightNumber: 'SV-3456',
    pilgrimsCount: 280,
    arrivedCount: 0,
    destination: 'mina',
    organizer: mockOrganizers[4],
    accommodations: [
      { accommodationId: 'acc-4', accommodationName: 'Mina Camp Alpha', pilgrimsAssigned: 180 },
      { accommodationId: 'acc-5', accommodationName: 'Arafat Camp Beta', pilgrimsAssigned: 100 }
    ],
    status: 'scheduled',
    campaignNumber: 'CAMP-2024-005',
    createdAt: generateDate(-6),
    rawPassengerData: generateRawPassengerData(280, 'group-5')
  },
  {
    id: 'group-6',
    groupNumber: 'GRP-006',
    groupName: 'Al-Sheikh Group F',
    arrivalDate: generateDate(2),
    arrivalTime: '20:00',
    flightNumber: 'SV-7890',
    pilgrimsCount: 200,
    arrivedCount: 0,
    destination: 'arafat',
    organizer: mockOrganizers[0],
    accommodations: [
      { accommodationId: 'acc-5', accommodationName: 'Arafat Camp Beta', pilgrimsAssigned: 200 }
    ],
    status: 'scheduled',
    campaignNumber: 'CAMP-2024-006',
    createdAt: generateDate(-5),
    rawPassengerData: generateRawPassengerData(200, 'group-6')
  },
  {
    id: 'group-7',
    groupNumber: 'GRP-007',
    groupName: 'Makkah Tours Group G',
    arrivalDate: generateDate(-1), // Yesterday - completed
    arrivalTime: '12:00',
    flightNumber: 'SV-2468',
    pilgrimsCount: 175,
    arrivedCount: 175,
    destination: 'makkah',
    organizer: mockOrganizers[1],
    accommodations: [
      { accommodationId: 'acc-1', accommodationName: 'Grand Makkah Hotel', pilgrimsAssigned: 175 }
    ],
    status: 'completed',
    campaignNumber: 'CAMP-2024-007',
    createdAt: generateDate(-7),
    rawPassengerData: generateRawPassengerData(175, 'group-7')
  },
  {
    id: 'group-8',
    groupNumber: 'GRP-008',
    groupName: 'Hajj Services Group H',
    arrivalDate: generateDate(-2), // 2 days ago - completed
    arrivalTime: '15:30',
    tripNumber: 'TRIP-0032',
    pilgrimsCount: 220,
    arrivedCount: 220,
    destination: 'madinah',
    organizer: mockOrganizers[2],
    accommodations: [
      { accommodationId: 'acc-3', accommodationName: 'Pilgrim Residence Complex A', pilgrimsAssigned: 220 }
    ],
    status: 'completed',
    campaignNumber: 'CAMP-2024-008',
    createdAt: generateDate(-8),
    rawPassengerData: generateRawPassengerData(220, 'group-8')
  },
  {
    id: 'group-9',
    groupNumber: 'GRP-009',
    groupName: 'Al-Haramain Group I',
    arrivalDate: generateDate(3),
    arrivalTime: '11:45',
    flightNumber: 'SV-1357',
    pilgrimsCount: 190,
    arrivedCount: 0,
    destination: 'makkah',
    organizer: mockOrganizers[3],
    accommodations: [
      { accommodationId: 'acc-1', accommodationName: 'Grand Makkah Hotel', pilgrimsAssigned: 100 },
      { accommodationId: 'acc-2', accommodationName: 'Al-Safa Towers', pilgrimsAssigned: 90 }
    ],
    status: 'scheduled',
    campaignNumber: 'CAMP-2024-009',
    createdAt: generateDate(-4),
    rawPassengerData: generateRawPassengerData(190, 'group-9')
  },
  {
    id: 'group-10',
    groupNumber: 'GRP-010',
    groupName: 'SPS Group J',
    arrivalDate: generateDate(3),
    arrivalTime: '19:15',
    flightNumber: 'SV-9753',
    pilgrimsCount: 310,
    arrivedCount: 0,
    destination: 'mina',
    organizer: mockOrganizers[4],
    accommodations: [
      { accommodationId: 'acc-4', accommodationName: 'Mina Camp Alpha', pilgrimsAssigned: 200 },
      { accommodationId: 'acc-5', accommodationName: 'Arafat Camp Beta', pilgrimsAssigned: 110 }
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
    carrier: 'Al-Najm Transport',
    driverName: 'Ahmed Mohammed Al-Saud',
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
    driverName: 'Khalid Abdullah Al-Rashid',
    driverPhone: '+966502222222',
    capacity: 50,
    passengers: 45,
    groupId: 'group-2',
    status: 'assigned'
  },
  {
    id: 'bus-3',
    number: 'BUS-003',
    carrier: 'Saudi Bus Company',
    driverName: 'Mohammed Ali Al-Otaibi',
    driverPhone: '+966503333333',
    capacity: 45,
    passengers: 0,
    status: 'available'
  },
  {
    id: 'bus-4',
    number: 'BUS-004',
    carrier: 'Hajj Transport Services',
    driverName: 'Salman Ibrahim Al-Ghamdi',
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
    driverName: 'Fahd Saad Al-Mutairi',
    driverPhone: '+966505555555',
    capacity: 45,
    passengers: 0,
    status: 'available'
  },
  {
    id: 'bus-6',
    number: 'BUS-006',
    carrier: 'Saudi Bus Company',
    driverName: 'Omar Hassan Al-Zahrani',
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
    title: 'Group GRP-001 arrived',
    description: '180 pilgrims arrived at Jeddah Airport',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    groupId: 'group-1',
    userId: 'user-1',
    userName: 'Ahmed Al-Saud'
  },
  {
    id: 'activity-2',
    type: 'accommodation-assigned',
    title: 'Accommodations assigned to GRP-002',
    description: '250 pilgrims assigned to Al-Safa Towers and Pilgrim Residence',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    groupId: 'group-2',
    userId: 'user-2',
    userName: 'Fatima Al-Mansouri'
  },
  {
    id: 'activity-3',
    type: 'bus-dispatched',
    title: 'Bus BUS-002 dispatched',
    description: 'Bus dispatched for Group GRP-002',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    groupId: 'group-2',
    userId: 'user-3',
    userName: 'Khalid Al-Rashid'
  },
  {
    id: 'activity-4',
    type: 'group-created',
    title: 'New group GRP-010 created',
    description: '310 pilgrims scheduled for arrival on Day 3',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    groupId: 'group-10',
    userId: 'user-1',
    userName: 'Ahmed Al-Saud'
  },
  {
    id: 'activity-5',
    type: 'port-arrival',
    title: 'Group GRP-007 confirmed arrival',
    description: '175 pilgrims confirmed at King Abdulaziz Airport',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    groupId: 'group-7',
    userId: 'user-4',
    userName: 'Salman Al-Ghamdi'
  }
];

// Mock Port Activities
export const mockPortActivities: PortActivity[] = [
  {
    id: 'port-1',
    type: 'airport-arrival',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    groupId: 'group-1',
    groupName: 'Al-Sheikh Group A',
    flightNumber: 'SV-1234',
    pilgrimCount: 180,
    status: 'confirmed'
  },
  {
    id: 'port-2',
    type: 'land-port-passage',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    groupId: 'group-4',
    groupName: 'Al-Haramain Group D',
    busNumber: 'BUS-004',
    pilgrimCount: 150,
    status: 'confirmed'
  }
];
