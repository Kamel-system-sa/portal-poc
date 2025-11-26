export interface VerifiedPilgrim {
  id: string;
  name: string;
  passportNumber: string;
  nationality: string;
  verifiedAt: string; // ISO date string
  verifiedBy: string; // Operator name
  centerName: string;
  organizer: {
    id: string;
    number: string;
    name: string;
    company: string;
  };
}

export const mockVerifiedPilgrims: VerifiedPilgrim[] = [
  {
    id: 'vp-1',
    name: 'Ahmed Mohammed Ali',
    passportNumber: 'A12345678',
    nationality: 'Egyptian',
    verifiedAt: '2024-01-15T10:30:00Z',
    verifiedBy: 'Mohammed Al-Saud',
    centerName: 'Service Center 001',
    organizer: {
      id: 'org-1',
      number: 'ORG-001',
      name: 'Al-Sheikh Travel & Tourism',
      company: 'Al-Sheikh Group'
    }
  },
  {
    id: 'vp-2',
    name: 'Fatima Khalid Hassan',
    passportNumber: 'B98765432',
    nationality: 'Pakistani',
    verifiedAt: '2024-01-15T11:15:00Z',
    verifiedBy: 'Sara Ahmed',
    centerName: 'Service Center 002',
    organizer: {
      id: 'org-2',
      number: 'ORG-002',
      name: 'Makkah Tours International',
      company: 'Makkah Tours Co.'
    }
  },
  {
    id: 'vp-3',
    name: 'Mohammed Abdullah Al-Rashid',
    passportNumber: 'C11223344',
    nationality: 'Saudi',
    verifiedAt: '2024-01-15T12:00:00Z',
    verifiedBy: 'Khalid Bin Saad',
    centerName: 'Service Center 001',
    organizer: {
      id: 'org-1',
      number: 'ORG-001',
      name: 'Al-Sheikh Travel & Tourism',
      company: 'Al-Sheikh Group'
    }
  },
  {
    id: 'vp-4',
    name: 'Sara Ahmed Ibrahim',
    passportNumber: 'D55667788',
    nationality: 'Jordanian',
    verifiedAt: '2024-01-15T13:45:00Z',
    verifiedBy: 'Nora Hassan',
    centerName: 'Service Center 003',
    organizer: {
      id: 'org-3',
      number: 'ORG-003',
      name: 'Hajj & Umrah Services',
      company: 'Hajj Services Ltd.'
    }
  },
  {
    id: 'vp-5',
    name: 'Khalid Bin Saad Al-Mutairi',
    passportNumber: 'E99887766',
    nationality: 'Saudi',
    verifiedAt: '2024-01-15T14:20:00Z',
    verifiedBy: 'Mohammed Al-Saud',
    centerName: 'Service Center 002',
    organizer: {
      id: 'org-2',
      number: 'ORG-002',
      name: 'Makkah Tours International',
      company: 'Makkah Tours Co.'
    }
  },
  {
    id: 'vp-6',
    name: 'Nora Hassan Al-Zahrani',
    passportNumber: 'F44556677',
    nationality: 'Saudi',
    verifiedAt: '2024-01-15T15:10:00Z',
    verifiedBy: 'Sara Ahmed',
    centerName: 'Service Center 001',
    organizer: {
      id: 'org-1',
      number: 'ORG-001',
      name: 'Al-Sheikh Travel & Tourism',
      company: 'Al-Sheikh Group'
    }
  }
];

// Helper to group by organizer
export const groupByOrganizer = (pilgrims: VerifiedPilgrim[]): Record<string, VerifiedPilgrim[]> => {
  return pilgrims.reduce((acc, pilgrim) => {
    const key = pilgrim.organizer.id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(pilgrim);
    return acc;
  }, {} as Record<string, VerifiedPilgrim[]>);
};

