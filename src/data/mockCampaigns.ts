import type { Campaign, CampaignPilgrim, Organizer } from '../types/reception';

// Organizers are exported from mockReception.ts
// Import here to avoid circular dependency
const mockOrganizers: Organizer[] = [
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

// Export organizers for use in other modules
export const getOrganizers = (): Organizer[] => mockOrganizers;

// Export organizers array
export { mockOrganizers };

// Helper to generate campaign pilgrims
const generateCampaignPilgrims = (count: number, campaignId: string, gender: 'male' | 'female'): CampaignPilgrim[] => {
  const nationalities = ['saudi', 'egyptian', 'pakistani', 'indian', 'indonesian', 'turkish', 'jordanian', 'bangladeshi'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `pilgrim-${campaignId}-${i + 1}`,
    name: `Pilgrim ${i + 1} - Campaign ${campaignId}`,
    passportNumber: `P${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
    primaryPhone: `05${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    secondaryPhone: Math.random() > 0.5 ? `05${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}` : undefined,
    homeCountryPhone: Math.random() > 0.7 ? `+${Math.floor(Math.random() * 999) + 1}${String(Math.floor(Math.random() * 1000000000)).padStart(10, '0')}` : undefined,
    email: Math.random() > 0.3 ? `pilgrim${i + 1}.camp${campaignId}@example.com` : undefined,
    gender,
    nationality: nationalities[i % nationalities.length]
  }));
};

// Mock Campaigns (linked to organizers)
export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    campaignNumber: 'CAMP-2024-001',
    campaignName: 'Al-Sheikh Campaign A',
    organizerId: 'org-1',
    organizerNumber: 'ORG-001',
    organizerName: 'Al-Sheikh Travel & Tourism',
    organizerCompany: 'Al-Sheikh Group',
    organizerPhone: '+966501234567',
    organizerEmail: 'contact@alsheikh-travel.com',
    responsiblePerson: 'Ahmed Al-Saud',
    gender: 'male',
    totalPilgrims: 500,
    registeredPilgrims: 450,
    pilgrims: generateCampaignPilgrims(450, 'camp-1', 'male'),
    registrationPercentage: 90,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    status: 'registered'
  },
  {
    id: 'camp-2',
    campaignNumber: 'CAMP-2024-002',
    campaignName: 'Makkah Tours Campaign B',
    organizerId: 'org-2',
    organizerNumber: 'ORG-002',
    organizerName: 'Makkah Tours International',
    organizerCompany: 'Makkah Tours Co.',
    organizerPhone: '+966502345678',
    organizerEmail: 'info@makkah-tours.com',
    responsiblePerson: 'Fatima Al-Mansouri',
    gender: 'female',
    totalPilgrims: 300,
    registeredPilgrims: 300,
    pilgrims: generateCampaignPilgrims(300, 'camp-2', 'female'),
    registrationPercentage: 100,
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
    status: 'completed'
  },
  {
    id: 'camp-3',
    campaignNumber: 'CAMP-2024-003',
    campaignName: 'Hajj Services Campaign C',
    organizerId: 'org-3',
    organizerNumber: 'ORG-003',
    organizerName: 'Hajj & Umrah Services',
    organizerCompany: 'Hajj Services Ltd.',
    organizerPhone: '+966503456789',
    organizerEmail: 'support@hajj-services.com',
    responsiblePerson: 'Khalid Al-Rashid',
    gender: 'male',
    totalPilgrims: 600,
    registeredPilgrims: 480,
    pilgrims: generateCampaignPilgrims(480, 'camp-3', 'male'),
    registrationPercentage: 80,
    createdAt: '2024-01-17T11:00:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
    status: 'registered'
  },
  {
    id: 'camp-4',
    campaignNumber: 'CAMP-2024-004',
    campaignName: 'Al-Haramain Campaign D',
    organizerId: 'org-4',
    organizerNumber: 'ORG-004',
    organizerName: 'Al-Haramain Pilgrimage',
    organizerCompany: 'Al-Haramain Co.',
    organizerPhone: '+966504567890',
    organizerEmail: 'contact@haramain-pilgrimage.com',
    responsiblePerson: 'Salman Al-Ghamdi',
    gender: 'male',
    totalPilgrims: 400,
    registeredPilgrims: 350,
    pilgrims: generateCampaignPilgrims(350, 'camp-4', 'male'),
    registrationPercentage: 87.5,
    createdAt: '2024-01-18T08:30:00Z',
    updatedAt: '2024-01-21T10:15:00Z',
    status: 'registered'
  },
  {
    id: 'camp-5',
    campaignNumber: 'CAMP-2024-005',
    campaignName: 'SPS Campaign E',
    organizerId: 'org-5',
    organizerNumber: 'ORG-005',
    organizerName: 'Saudi Pilgrimage Services',
    organizerCompany: 'SPS Group',
    organizerPhone: '+966505678901',
    organizerEmail: 'info@sps-group.com',
    responsiblePerson: 'Noura Al-Shehri',
    gender: 'female',
    totalPilgrims: 250,
    registeredPilgrims: 200,
    pilgrims: generateCampaignPilgrims(200, 'camp-5', 'female'),
    registrationPercentage: 80,
    createdAt: '2024-01-19T13:00:00Z',
    updatedAt: '2024-01-22T09:30:00Z',
    status: 'registered'
  }
];

// Helper functions to get campaign statistics for organizers
export const getCampaignStatsForOrganizer = (organizerId: string) => {
  const organizerCampaigns = mockCampaigns.filter(c => c.organizerId === organizerId);
  const totalPilgrims = organizerCampaigns.reduce((sum, c) => sum + c.totalPilgrims, 0);
  const registeredPilgrims = organizerCampaigns.reduce((sum, c) => sum + c.registeredPilgrims, 0);
  const totalCampaigns = organizerCampaigns.length;
  const remainingPilgrims = totalPilgrims - registeredPilgrims;
  const registrationPercentage = totalPilgrims > 0 ? (registeredPilgrims / totalPilgrims) * 100 : 0;

  return {
    totalCampaigns,
    totalPilgrims,
    registeredPilgrims,
    remainingPilgrims,
    registrationPercentage: Math.round(registrationPercentage * 10) / 10
  };
};

// Get campaign by number (for linking with Pre-Arrival)
export const getCampaignByNumber = (campaignNumber: string): Campaign | undefined => {
  return mockCampaigns.find(c => c.campaignNumber === campaignNumber);
};

// Get campaign by organizer ID
export const getCampaignsByOrganizer = (organizerId: string): Campaign[] => {
  return mockCampaigns.filter(c => c.organizerId === organizerId);
};

