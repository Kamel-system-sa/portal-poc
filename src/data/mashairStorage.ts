import type { MashairTent, MashairTentAssignment } from '../types/housing';

// Local storage keys
const MINA_TENTS_KEY = 'mashair_mina_tents';
const MINA_ASSIGNMENTS_KEY = 'mashair_mina_assignments';
const ARAFAT_TENTS_KEY = 'mashair_arafat_tents';
const ARAFAT_ASSIGNMENTS_KEY = 'mashair_arafat_assignments';

// Mina Tents
export const getMinaTents = (): MashairTent[] => {
  try {
    const stored = localStorage.getItem(MINA_TENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveMinaTent = (tent: MashairTent): void => {
  const tents = getMinaTents();
  const existingIndex = tents.findIndex(t => t.id === tent.id);
  
  if (existingIndex >= 0) {
    tents[existingIndex] = tent;
  } else {
    tents.push(tent);
  }
  
  localStorage.setItem(MINA_TENTS_KEY, JSON.stringify(tents));
};

export const saveMinaTents = (tents: MashairTent[]): void => {
  localStorage.setItem(MINA_TENTS_KEY, JSON.stringify(tents));
};

export const deleteMinaTent = (id: string): void => {
  const tents = getMinaTents();
  const filtered = tents.filter(t => t.id !== id);
  localStorage.setItem(MINA_TENTS_KEY, JSON.stringify(filtered));
};

// Mina Assignments
export const getMinaAssignments = (): MashairTentAssignment[] => {
  try {
    const stored = localStorage.getItem(MINA_ASSIGNMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveMinaAssignment = (assignment: MashairTentAssignment): void => {
  const assignments = getMinaAssignments();
  const existingIndex = assignments.findIndex(a => a.id === assignment.id);
  
  if (existingIndex >= 0) {
    assignments[existingIndex] = assignment;
  } else {
    assignments.push(assignment);
  }
  
  localStorage.setItem(MINA_ASSIGNMENTS_KEY, JSON.stringify(assignments));
};

export const saveMinaAssignments = (assignments: MashairTentAssignment[]): void => {
  localStorage.setItem(MINA_ASSIGNMENTS_KEY, JSON.stringify(assignments));
};

export const deleteMinaAssignment = (id: string): void => {
  const assignments = getMinaAssignments();
  const filtered = assignments.filter(a => a.id !== id);
  localStorage.setItem(MINA_ASSIGNMENTS_KEY, JSON.stringify(filtered));
};

// Arafat Tents
export const getArafatTents = (): MashairTent[] => {
  try {
    const stored = localStorage.getItem(ARAFAT_TENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveArafatTent = (tent: MashairTent): void => {
  const tents = getArafatTents();
  const existingIndex = tents.findIndex(t => t.id === tent.id);
  
  if (existingIndex >= 0) {
    tents[existingIndex] = tent;
  } else {
    tents.push(tent);
  }
  
  localStorage.setItem(ARAFAT_TENTS_KEY, JSON.stringify(tents));
};

export const saveArafatTents = (tents: MashairTent[]): void => {
  localStorage.setItem(ARAFAT_TENTS_KEY, JSON.stringify(tents));
};

export const deleteArafatTent = (id: string): void => {
  const tents = getArafatTents();
  const filtered = tents.filter(t => t.id !== id);
  localStorage.setItem(ARAFAT_TENTS_KEY, JSON.stringify(filtered));
};

// Arafat Assignments
export const getArafatAssignments = (): MashairTentAssignment[] => {
  try {
    const stored = localStorage.getItem(ARAFAT_ASSIGNMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveArafatAssignment = (assignment: MashairTentAssignment): void => {
  const assignments = getArafatAssignments();
  const existingIndex = assignments.findIndex(a => a.id === assignment.id);
  
  if (existingIndex >= 0) {
    assignments[existingIndex] = assignment;
  } else {
    assignments.push(assignment);
  }
  
  localStorage.setItem(ARAFAT_ASSIGNMENTS_KEY, JSON.stringify(assignments));
};

export const saveArafatAssignments = (assignments: MashairTentAssignment[]): void => {
  localStorage.setItem(ARAFAT_ASSIGNMENTS_KEY, JSON.stringify(assignments));
};

export const deleteArafatAssignment = (id: string): void => {
  const assignments = getArafatAssignments();
  const filtered = assignments.filter(a => a.id !== id);
  localStorage.setItem(ARAFAT_ASSIGNMENTS_KEY, JSON.stringify(filtered));
};

// Initialize mock data
const initializeMockData = (): void => {
  // Check if data already exists
  if (localStorage.getItem(MINA_TENTS_KEY) || 
      localStorage.getItem(MINA_ASSIGNMENTS_KEY) ||
      localStorage.getItem(ARAFAT_TENTS_KEY) ||
      localStorage.getItem(ARAFAT_ASSIGNMENTS_KEY)) {
    return; // Data already exists, don't initialize
  }

  // Mock Mina Tents
  const mockMinaTents: MashairTent[] = [
    {
      id: 'mina-tent-1',
      tentNameOrNumber: 'خيمة منى 1',
      area: 120,
      capacity: 50,
      location: 'mina',
      createdAt: new Date('2024-01-15').toISOString()
    },
    {
      id: 'mina-tent-2',
      tentNameOrNumber: 'خيمة منى 2',
      area: 150,
      capacity: 60,
      location: 'mina',
      createdAt: new Date('2024-01-16').toISOString()
    },
    {
      id: 'mina-tent-3',
      tentNameOrNumber: 'خيمة منى 3',
      area: 100,
      capacity: 40,
      location: 'mina',
      createdAt: new Date('2024-01-17').toISOString()
    },
    {
      id: 'mina-tent-4',
      tentNameOrNumber: 'خيمة منى 4',
      area: 180,
      capacity: 75,
      location: 'mina',
      createdAt: new Date('2024-01-18').toISOString()
    },
    {
      id: 'mina-tent-5',
      tentNameOrNumber: 'خيمة منى 5',
      area: 130,
      capacity: 55,
      location: 'mina',
      createdAt: new Date('2024-01-19').toISOString()
    },
    {
      id: 'mina-tent-6',
      tentNameOrNumber: 'خيمة منى 6',
      area: 160,
      capacity: 65,
      location: 'mina',
      createdAt: new Date('2024-01-20').toISOString()
    },
    {
      id: 'mina-tent-7',
      tentNameOrNumber: 'خيمة منى 7',
      area: 110,
      capacity: 45,
      location: 'mina',
      createdAt: new Date('2024-01-21').toISOString()
    },
    {
      id: 'mina-tent-8',
      tentNameOrNumber: 'خيمة منى 8',
      area: 140,
      capacity: 58,
      location: 'mina',
      createdAt: new Date('2024-01-22').toISOString()
    }
  ];

  // Mock Mina Assignments
  const mockMinaAssignments: MashairTentAssignment[] = [
    {
      id: 'mina-assignment-1',
      tentNameOrNumber: 'خيمة منى 1',
      campaign: 'office',
      location: 'mina',
      createdAt: new Date('2024-01-20').toISOString()
    },
    {
      id: 'mina-assignment-2',
      tentNameOrNumber: 'خيمة منى 2',
      campaign: 'kitchen',
      location: 'mina',
      createdAt: new Date('2024-01-21').toISOString()
    },
    {
      id: 'mina-assignment-3',
      tentNameOrNumber: 'خيمة منى 3',
      campaign: 'campaignNumber',
      campaignNumber: '2024-001',
      location: 'mina',
      createdAt: new Date('2024-01-22').toISOString()
    },
    {
      id: 'mina-assignment-4',
      tentNameOrNumber: 'خيمة منى 4',
      campaign: 'campaignNumber',
      campaignNumber: '2024-002',
      location: 'mina',
      createdAt: new Date('2024-01-23').toISOString()
    },
    {
      id: 'mina-assignment-5',
      tentNameOrNumber: 'خيمة منى 5',
      campaign: 'other',
      otherCampaignName: 'حملة الخير',
      location: 'mina',
      createdAt: new Date('2024-01-24').toISOString()
    },
    {
      id: 'mina-assignment-6',
      tentNameOrNumber: 'خيمة منى 6',
      campaign: 'office',
      location: 'mina',
      createdAt: new Date('2024-01-25').toISOString()
    }
  ];

  // Mock Arafat Tents
  const mockArafatTents: MashairTent[] = [
    {
      id: 'arafat-tent-1',
      tentNameOrNumber: 'خيمة عرفات 1',
      area: 200,
      capacity: 80,
      location: 'arafat',
      createdAt: new Date('2024-01-15').toISOString()
    },
    {
      id: 'arafat-tent-2',
      tentNameOrNumber: 'خيمة عرفات 2',
      area: 180,
      capacity: 70,
      location: 'arafat',
      createdAt: new Date('2024-01-16').toISOString()
    },
    {
      id: 'arafat-tent-3',
      tentNameOrNumber: 'خيمة عرفات 3',
      area: 220,
      capacity: 90,
      location: 'arafat',
      createdAt: new Date('2024-01-17').toISOString()
    },
    {
      id: 'arafat-tent-4',
      tentNameOrNumber: 'خيمة عرفات 4',
      area: 160,
      capacity: 65,
      location: 'arafat',
      createdAt: new Date('2024-01-18').toISOString()
    },
    {
      id: 'arafat-tent-5',
      tentNameOrNumber: 'خيمة عرفات 5',
      area: 190,
      capacity: 75,
      location: 'arafat',
      createdAt: new Date('2024-01-19').toISOString()
    },
    {
      id: 'arafat-tent-6',
      tentNameOrNumber: 'خيمة عرفات 6',
      area: 210,
      capacity: 85,
      location: 'arafat',
      createdAt: new Date('2024-01-20').toISOString()
    },
    {
      id: 'arafat-tent-7',
      tentNameOrNumber: 'خيمة عرفات 7',
      area: 170,
      capacity: 68,
      location: 'arafat',
      createdAt: new Date('2024-01-21').toISOString()
    },
    {
      id: 'arafat-tent-8',
      tentNameOrNumber: 'خيمة عرفات 8',
      area: 240,
      capacity: 100,
      location: 'arafat',
      createdAt: new Date('2024-01-22').toISOString()
    },
    {
      id: 'arafat-tent-9',
      tentNameOrNumber: 'خيمة عرفات 9',
      area: 150,
      capacity: 60,
      location: 'arafat',
      createdAt: new Date('2024-01-23').toISOString()
    }
  ];

  // Mock Arafat Assignments
  const mockArafatAssignments: MashairTentAssignment[] = [
    {
      id: 'arafat-assignment-1',
      tentNameOrNumber: 'خيمة عرفات 1',
      campaign: 'office',
      location: 'arafat',
      createdAt: new Date('2024-01-20').toISOString()
    },
    {
      id: 'arafat-assignment-2',
      tentNameOrNumber: 'خيمة عرفات 2',
      campaign: 'kitchen',
      location: 'arafat',
      createdAt: new Date('2024-01-21').toISOString()
    },
    {
      id: 'arafat-assignment-3',
      tentNameOrNumber: 'خيمة عرفات 3',
      campaign: 'campaignNumber',
      campaignNumber: '2024-001',
      location: 'arafat',
      createdAt: new Date('2024-01-22').toISOString()
    },
    {
      id: 'arafat-assignment-4',
      tentNameOrNumber: 'خيمة عرفات 4',
      campaign: 'campaignNumber',
      campaignNumber: '2024-003',
      location: 'arafat',
      createdAt: new Date('2024-01-23').toISOString()
    },
    {
      id: 'arafat-assignment-5',
      tentNameOrNumber: 'خيمة عرفات 5',
      campaign: 'other',
      otherCampaignName: 'حملة البركة',
      location: 'arafat',
      createdAt: new Date('2024-01-24').toISOString()
    },
    {
      id: 'arafat-assignment-6',
      tentNameOrNumber: 'خيمة عرفات 6',
      campaign: 'kitchen',
      location: 'arafat',
      createdAt: new Date('2024-01-25').toISOString()
    },
    {
      id: 'arafat-assignment-7',
      tentNameOrNumber: 'خيمة عرفات 7',
      campaign: 'campaignNumber',
      campaignNumber: '2024-002',
      location: 'arafat',
      createdAt: new Date('2024-01-26').toISOString()
    }
  ];

  // Save mock data to localStorage
  localStorage.setItem(MINA_TENTS_KEY, JSON.stringify(mockMinaTents));
  localStorage.setItem(MINA_ASSIGNMENTS_KEY, JSON.stringify(mockMinaAssignments));
  localStorage.setItem(ARAFAT_TENTS_KEY, JSON.stringify(mockArafatTents));
  localStorage.setItem(ARAFAT_ASSIGNMENTS_KEY, JSON.stringify(mockArafatAssignments));
};

// Initialize mock data on module load (only if no data exists)
if (typeof window !== 'undefined') {
  initializeMockData();
}

