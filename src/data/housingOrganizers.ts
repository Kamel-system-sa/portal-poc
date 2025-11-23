import type { Organizer } from '../types/housing';

// Mock Organizers for Housing module
export const allOrganizers: Organizer[] = [
  {
    id: 'org-1',
    organizerNumber: '12345',
    name: 'Ahmed Al-Saud',
    company: 'Al-Rajhi Hajj Services',
    phone: '0501234567',
    groupSize: 150,
    campaignNumber: 'CAM-2024-001',
    contact1: '0501234567',
    contact2: '0501234568'
  },
  {
    id: 'org-2',
    organizerNumber: '23456',
    name: 'Fatima Al-Zahra',
    company: 'Makkah Tours & Travel',
    phone: '0502345678',
    groupSize: 200,
    campaignNumber: 'CAM-2024-002',
    contact1: '0502345678',
    contact2: '0502345679'
  },
  {
    id: 'org-3',
    organizerNumber: '34567',
    name: 'Mohammed Hassan',
    company: 'Al-Haramain Services',
    phone: '0503456789',
    groupSize: 100,
    contact1: '0503456789',
    contact2: '0503456790'
  },
  {
    id: 'org-4',
    organizerNumber: '45678',
    name: 'Sara Al-Mansouri',
    company: 'Premium Hajj Group',
    phone: '0504567890',
    groupSize: 300,
    campaignNumber: 'CAM-2024-003',
    contact1: '0504567890',
    contact2: '0504567891'
  },
  {
    id: 'org-5',
    organizerNumber: '56789',
    name: 'Khalid Al-Otaibi',
    company: 'Royal Hajj Services',
    phone: '0505678901',
    groupSize: 250,
    contact1: '0505678901'
  },
  {
    id: 'org-6',
    organizerNumber: '67890',
    name: 'Noura Al-Ghamdi',
    company: 'Elite Travel Services',
    phone: '0506789012',
    groupSize: 180,
    campaignNumber: 'CAM-2024-004',
    contact1: '0506789012',
    contact2: '0506789013'
  },
  {
    id: 'org-7',
    organizerNumber: '78901',
    name: 'Omar Al-Shammari',
    company: 'Al-Madinah Tours',
    phone: '0507890123',
    groupSize: 120,
    contact1: '0507890123'
  },
  {
    id: 'org-8',
    organizerNumber: '89012',
    name: 'Layla Al-Qasimi',
    company: 'Golden Hajj Services',
    phone: '0508901234',
    groupSize: 400,
    campaignNumber: 'CAM-2024-005',
    contact1: '0508901234',
    contact2: '0508901235'
  }
];

// Generate additional random organizers for searchable dropdown
export const generateRandomOrganizers = (count: number): Organizer[] => {
  const companies = [
    'Al-Rajhi Hajj Services',
    'Makkah Tours & Travel',
    'Al-Haramain Services',
    'Premium Hajj Group',
    'Royal Hajj Services',
    'Elite Travel Services',
    'Al-Madinah Tours',
    'Golden Hajj Services',
    'Al-Noor Travel',
    'Al-Safa Tours',
    'Al-Marwa Services',
    'Al-Kaaba Travel'
  ];
  
  const firstNames = ['Ahmed', 'Mohammed', 'Khalid', 'Omar', 'Ali', 'Hassan', 'Ibrahim', 'Yusuf', 'Fatima', 'Sara', 'Noura', 'Layla', 'Aisha', 'Maryam'];
  const lastNames = ['Al-Saud', 'Al-Zahra', 'Al-Mansouri', 'Al-Otaibi', 'Al-Ghamdi', 'Al-Shammari', 'Al-Qasimi', 'Al-Harbi', 'Al-Mutairi', 'Al-Dosari', 'Al-Anzi', 'Al-Subaie'];
  
  return Array.from({ length: count }, (_, i) => {
    const orgNum = String(10000 + i).padStart(5, '0');
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const phone = `05${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`;
    
    return {
      id: `org-${10000 + i}`,
      organizerNumber: orgNum,
      name: `${firstName} ${lastName}`,
      company,
      phone,
      groupSize: Math.floor(Math.random() * 400) + 50,
      campaignNumber: Math.random() > 0.3 ? `CAM-2024-${String(i + 100).padStart(3, '0')}` : undefined,
      contact1: phone,
      contact2: Math.random() > 0.5 ? `05${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}` : undefined
    };
  });
};

// Combined list of all organizers
export const allOrganizersWithGenerated = [
  ...allOrganizers,
  ...generateRandomOrganizers(50)
];

