export interface MockPassportData {
  id: string;
  photo: string;
  firstName: string;
  lastName: string;
  fullName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  visaNumber: string;
  organizer: {
    id: string;
    number: string;
    name: string;
    company: string;
  };
  campaign: {
    id: string;
    number: string;
    name: string;
  };
  centerId: string;
  centerName: string;
}

export const mockPassports: MockPassportData[] = [
  {
    id: 'passport-1',
    photo: '/images/male.png',
    firstName: 'Ahmed',
    lastName: 'Mohammed Ali',
    fullName: 'Ahmed Mohammed Ali',
    passportNumber: 'A12345678',
    nationality: 'Egyptian',
    dateOfBirth: '1985-03-15',
    visaNumber: 'V789456123',
    organizer: {
      id: 'org-1',
      number: 'ORG-001',
      name: 'Al-Sheikh Travel & Tourism',
      company: 'Al-Sheikh Group'
    },
    campaign: {
      id: 'camp-1',
      number: 'CAMP-2024-001',
      name: 'Hajj 2024 - Group A'
    },
    centerId: 'center-1',
    centerName: 'Service Center 001'
  },
  {
    id: 'passport-2',
    photo: '/images/female.png',
    firstName: 'Fatima',
    lastName: 'Khalid Hassan',
    fullName: 'Fatima Khalid Hassan',
    passportNumber: 'B98765432',
    nationality: 'Pakistani',
    dateOfBirth: '1990-07-22',
    visaNumber: 'V456789123',
    organizer: {
      id: 'org-2',
      number: 'ORG-002',
      name: 'Makkah Tours International',
      company: 'Makkah Tours Co.'
    },
    campaign: {
      id: 'camp-2',
      number: 'CAMP-2024-002',
      name: 'Hajj 2024 - Group B'
    },
    centerId: 'center-2',
    centerName: 'Service Center 002'
  },
  {
    id: 'passport-3',
    photo: '/images/male.png',
    firstName: 'Mohammed',
    lastName: 'Abdullah Al-Rashid',
    fullName: 'Mohammed Abdullah Al-Rashid',
    passportNumber: 'C11223344',
    nationality: 'Saudi',
    dateOfBirth: '1978-11-08',
    visaNumber: 'V321654987',
    organizer: {
      id: 'org-3',
      number: 'ORG-003',
      name: 'Hajj & Umrah Services',
      company: 'Hajj Services Ltd.'
    },
    campaign: {
      id: 'camp-3',
      number: 'CAMP-2024-003',
      name: 'Hajj 2024 - Group C'
    },
    centerId: 'center-1',
    centerName: 'Service Center 001'
  },
  {
    id: 'passport-4',
    photo: '/images/female.png',
    firstName: 'Sara',
    lastName: 'Ahmed Ibrahim',
    fullName: 'Sara Ahmed Ibrahim',
    passportNumber: 'D55667788',
    nationality: 'Jordanian',
    dateOfBirth: '1992-05-14',
    visaNumber: 'V147258369',
    organizer: {
      id: 'org-4',
      number: 'ORG-004',
      name: 'Al-Haramain Pilgrimage',
      company: 'Al-Haramain Co.'
    },
    campaign: {
      id: 'camp-4',
      number: 'CAMP-2024-004',
      name: 'Hajj 2024 - Group D'
    },
    centerId: 'center-3',
    centerName: 'Service Center 003'
  },
  {
    id: 'passport-5',
    photo: '/images/male.png',
    firstName: 'Khalid',
    lastName: 'Bin Saad Al-Mutairi',
    fullName: 'Khalid Bin Saad Al-Mutairi',
    passportNumber: 'E99887766',
    nationality: 'Saudi',
    dateOfBirth: '1980-09-30',
    visaNumber: 'V258369147',
    organizer: {
      id: 'org-5',
      number: 'ORG-005',
      name: 'Saudi Pilgrimage Services',
      company: 'Saudi Services Co.'
    },
    campaign: {
      id: 'camp-5',
      number: 'CAMP-2024-005',
      name: 'Hajj 2024 - Group E'
    },
    centerId: 'center-2',
    centerName: 'Service Center 002'
  },
  {
    id: 'passport-6',
    photo: '/images/female.png',
    firstName: 'Nora',
    lastName: 'Hassan Al-Zahrani',
    fullName: 'Nora Hassan Al-Zahrani',
    passportNumber: 'F44556677',
    nationality: 'Saudi',
    dateOfBirth: '1988-12-05',
    visaNumber: 'V369147258',
    organizer: {
      id: 'org-1',
      number: 'ORG-001',
      name: 'Al-Sheikh Travel & Tourism',
      company: 'Al-Sheikh Group'
    },
    campaign: {
      id: 'camp-1',
      number: 'CAMP-2024-001',
      name: 'Hajj 2024 - Group A'
    },
    centerId: 'center-1',
    centerName: 'Service Center 001'
  },
  {
    id: 'passport-7',
    photo: '/images/male.png',
    firstName: 'Ibrahim',
    lastName: 'Yusuf Al-Mansouri',
    fullName: 'Ibrahim Yusuf Al-Mansouri',
    passportNumber: 'G33445566',
    nationality: 'Emirati',
    dateOfBirth: '1983-04-18',
    visaNumber: 'V741852963',
    organizer: {
      id: 'org-2',
      number: 'ORG-002',
      name: 'Makkah Tours International',
      company: 'Makkah Tours Co.'
    },
    campaign: {
      id: 'camp-2',
      number: 'CAMP-2024-002',
      name: 'Hajj 2024 - Group B'
    },
    centerId: 'center-2',
    centerName: 'Service Center 002'
  },
  {
    id: 'passport-8',
    photo: '/images/female.png',
    firstName: 'Amina',
    lastName: 'Omar Al-Sayed',
    fullName: 'Amina Omar Al-Sayed',
    passportNumber: 'H22334455',
    nationality: 'Egyptian',
    dateOfBirth: '1995-08-25',
    visaNumber: 'V852963741',
    organizer: {
      id: 'org-3',
      number: 'ORG-003',
      name: 'Hajj & Umrah Services',
      company: 'Hajj Services Ltd.'
    },
    campaign: {
      id: 'camp-3',
      number: 'CAMP-2024-003',
      name: 'Hajj 2024 - Group C'
    },
    centerId: 'center-3',
    centerName: 'Service Center 003'
  }
];

// Helper function to get random passport
export const getRandomPassport = (): MockPassportData => {
  const randomIndex = Math.floor(Math.random() * mockPassports.length);
  return mockPassports[randomIndex];
};

// Helper function to search passport by ID or passport number
export const searchPassportById = (searchTerm: string): MockPassportData | null => {
  const normalizedSearch = searchTerm.trim().toUpperCase();
  const found = mockPassports.find(
    passport => 
      passport.passportNumber.toUpperCase() === normalizedSearch ||
      passport.id.toUpperCase() === normalizedSearch ||
      passport.passportNumber.toUpperCase().includes(normalizedSearch)
  );
  return found || null;
};

