export interface Member {
  id: string;
  section: string;
  name: string;
  role?: string;
  phone: string;
  email?: string;
  bravoCode?: string;
  hawiya?: string;
}

export interface Center {
  id: string;
  number: string;
  serviceType: 'B2B' | 'B2C' | 'B2G';
  serviceDetail?: '' | 'سياحة' | 'بعثة';   // <-- بدل الحقل القديم وجعلناه optional
  missionNationality?: string;              // <-- الحقل الجديد للبعثة
  capacity: number;
  locations: {
    mecca: boolean;
    mina: boolean;
    arafat: boolean;
    muzdalifah: boolean;
    customMinaSites: string[];
    meccaUrl?: string;
    minaUrls?: string[];
    arafatUrls?: string[];
    muzdalifahUrls?: string[];
  };
  responsible: {
    name: string;
    email: string;
    mobile: string;
    age: string;
    bravoCode: string;
    hawiya: string;
    deputy: string;
    gender?: 'male' | 'female' | '';
    photo?: string;
  };
  firstDeputy?: {
    name: string;
    email: string;
    mobile: string;
    age: string;
    bravoCode: string;
    hawiya: string;
  };
  secondDeputy?: {
    name: string;
    email: string;
    mobile: string;
    age: string;
    bravoCode: string;
    hawiya: string;
  };
  members: Member[];
  createdAt: string;
  status: 'active' | 'inactive';
}


export const mockCenters: Center[] = [
  {
    id: 'C-1',
    number: '001',
    serviceType: 'B2B',
    serviceDetail: 'سياحة',
    missionNationality: 'سعودية',
    capacity: 2500,
    locations: {
      mecca: true,
      mina: true,
      arafat: true,
      muzdalifah: false,
      customMinaSites: ['مخيم 12', 'مخيم 15']
    },
    responsible: {
      name: 'مسؤول 1',
      email: 'ahmed@example.com',
      mobile: '0501234567',
      age: '45',
      bravoCode: 'BR001',
      hawiya: '1234567890',
      deputy: 'نائب 15'
    },
    members: [
      {
        id: 'M-1',
        section: 'الاستقبال',
        name: 'عضو 1',
        role: 'منسق',
        phone: '0509876543'
      }
    ],
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: 'C-2',
    number: '002',
    serviceType: 'B2C',
    missionNationality: 'أردنية',
    capacity: 1500,
    locations: {
      mecca: true,
      mina: false,
      arafat: true,
      muzdalifah: true,
      customMinaSites: []
    },
    responsible: {
      name: 'مسؤول 2',
      email: 'fatima@example.com',
      mobile: '0501112233',
      age: '38',
      bravoCode: 'BR002',
      hawiya: '0987654321',
      deputy: 'نائب 15'
    },
    members: [],
    createdAt: '2024-02-20',
    status: 'active'
  },
  {
    id: 'C-3',
    number: '003',
    serviceType: 'B2B',
    serviceDetail: 'بعثة',
    missionNationality: 'مصرية',
    capacity: 3200,
    locations: {
      mecca: true,
      mina: true,
      arafat: true,
      muzdalifah: true,
      customMinaSites: ['مخيم 5', 'مخيم 8', 'مخيم 10']
    },
    responsible: {
      name: 'مسؤول 3',
      email: 'abdullah@example.com',
      mobile: '0502223344',
      age: '42',
      bravoCode: 'BR003',
      hawiya: '1122334455',
      deputy: 'نائب 15'
    },
    members: [
      {
        id: 'M-3-1',
        section: 'الاستقبال',
        name: 'عضو 1',
        role: 'منسق رئيسي',
        phone: '0503334455',
        email: 'nora@example.com'
      },
      {
        id: 'M-3-2',
        section: 'الإسكان',
        name: 'عضو 2',
        role: 'منسق إسكان',
        phone: '0504445566'
      }
    ],
    createdAt: '2024-01-10',
    status: 'active'
  },
  {
    id: 'C-4',
    number: '004',
    serviceType: 'B2G',
    missionNationality: 'سعودية',
    capacity: 5000,
    locations: {
      mecca: true,
      mina: true,
      arafat: true,
      muzdalifah: true,
      customMinaSites: ['مخيم 1', 'مخيم 2', 'مخيم 3', 'مخيم 4']
    },
    responsible: {
      name: 'مسؤول 4',
      email: 'khalid@example.com',
      mobile: '0505556677',
      age: '50',
      bravoCode: 'BR004',
      hawiya: '2233445566',
      deputy: 'نائب 15'
    },
    members: [
      {
        id: 'M-4-1',
        section: 'الاستقبال',
        name: 'عضو 2',
        role: 'مدير',
        phone: '0506667788',
        email: 'mariam@example.com'
      },
      {
        id: 'M-4-2',
        section: 'الخدمات الميدانية',
        name: 'عضو 3',
        role: 'منسق ميداني',
        phone: '0507778899'
      }
    ],
    createdAt: '2024-01-05',
    status: 'active'
  },
  {
    id: 'C-5',
    number: '005',
    serviceType: 'B2C',
    missionNationality: 'لبنانية',
    capacity: 1800,
    locations: {
      mecca: true,
      mina: true,
      arafat: false,
      muzdalifah: false,
      customMinaSites: ['مخيم 20']
    },
    responsible: {
      name: 'مسؤول 5',
      email: 'lina@example.com',
      mobile: '0508889900',
      age: '35',
      bravoCode: 'BR005',
      hawiya: '3344556677',
      deputy: 'نائب 15'
    },
    members: [],
    createdAt: '2024-02-15',
    status: 'active'
  },
  {
    id: 'C-6',
    number: '006',
    serviceType: 'B2B',
    serviceDetail: 'سياحة',
    missionNationality: 'سورية',
    capacity: 2800,
    locations: {
      mecca: true,
      mina: true,
      arafat: true,
      muzdalifah: false,
      customMinaSites: ['مخيم 7', 'مخيم 9']
    },
    responsible: {
      name: 'مسؤول 6',
      email: 'tariq@example.com',
      mobile: '0509990011',
      age: '40',
      bravoCode: 'BR006',
      hawiya: '4455667788',
      deputy: 'نائب 15'
    },
    members: [
      {
        id: 'M-6-1',
        section: 'الإسكان',
        name: 'عضو 4',
        role: 'منسق',
        phone: '0501112233',
        email: 'huda@example.com'
      }
    ],
    createdAt: '2024-01-25',
    status: 'active'
  },
  {
    id: 'C-7',
    number: '007',
    serviceType: 'B2G',
    missionNationality: 'عراقية',
    capacity: 4500,
    locations: {
      mecca: true,
      mina: true,
      arafat: true,
      muzdalifah: true,
      customMinaSites: ['مخيم 11', 'مخيم 13', 'مخيم 14']
    },
    responsible: {
      name: 'مسؤول 7',
      email: 'saad@example.com',
      mobile: '0502223344',
      age: '48',
      bravoCode: 'BR007',
      hawiya: '5566778899',
      deputy: 'نائب 15'
    },
    members: [
      {
        id: 'M-7-1',
        section: 'الاستقبال',
        name: 'مسؤول 16',
        role: 'منسق',
        phone: '0503334455'
      },
      {
        id: 'M-7-2',
        section: 'الإسكان',
        name: 'عضو 3',
        role: 'منسق',
        phone: '0504445566'
      },
      {
        id: 'M-7-3',
        section: 'الخدمات الميدانية',
        name: 'عضو 5',
        role: 'منسق',
        phone: '0505556677'
      }
    ],
    createdAt: '2024-01-12',
    status: 'active'
  },
  {
    id: 'C-8',
    number: '008',
    serviceType: 'B2B',
    serviceDetail: 'بعثة',
    missionNationality: 'باكستانية',
    capacity: 2100,
    locations: {
      mecca: true,
      mina: false,
      arafat: true,
      muzdalifah: false,
      customMinaSites: []
    },
    responsible: {
      name: 'مسؤول 8',
      email: 'mohammed@example.com',
      mobile: '0506667788',
      age: '44',
      bravoCode: 'BR008',
      hawiya: '6677889900',
      deputy: 'نائب 15'
    },
    members: [
      {
        id: 'M-8-1',
        section: 'الاستقبال',
        name: 'عضو 6',
        role: 'منسق',
        phone: '0507778899'
      }
    ],
    createdAt: '2024-02-10',
    status: 'inactive'
  },
  {
    id: 'C-9',
    number: '009',
    serviceType: 'B2C',
    missionNationality: 'يمنية',
    capacity: 1200,
    locations: {
      mecca: true,
      mina: true,
      arafat: false,
      muzdalifah: true,
      customMinaSites: ['مخيم 16']
    },
    responsible: {
      name: 'مسؤول 9',
      email: 'salma@example.com',
      mobile: '0508889900',
      age: '32',
      bravoCode: 'BR009',
      hawiya: '7788990011',
      deputy: 'نائب 15'
    },
    members: [],
    createdAt: '2024-02-25',
    status: 'active'
  },
  {
    id: 'C-10',
    number: '010',
    serviceType: 'B2B',
    serviceDetail: 'سياحة',
    missionNationality: 'تونسية',
    capacity: 3000,
    locations: {
      mecca: true,
      mina: true,
      arafat: true,
      muzdalifah: true,
      customMinaSites: ['مخيم 6', 'مخيم 17', 'مخيم 18']
    },
    responsible: {
      name: 'مسؤول 10',
      email: 'youssef@example.com',
      mobile: '0509990011',
      age: '39',
      bravoCode: 'BR010',
      hawiya: '8899001122',
      deputy: 'نائب 15'
    },
    members: [
      {
        id: 'M-10-1',
        section: 'الاستقبال',
        name: 'عضو 4',
        role: 'منسق رئيسي',
        phone: '0501112233',
        email: 'fatima2@example.com'
      },
      {
        id: 'M-10-2',
        section: 'الإسكان',
        name: 'عضو 7',
        role: 'منسق',
        phone: '0502223344'
      }
    ],
    createdAt: '2024-01-20',
    status: 'active'
  },
  {
    id: 'C-11',
    number: '011',
    serviceType: 'B2G',
    missionNationality: 'مغربية',
    capacity: 3800,
    locations: {
      mecca: true,
      mina: true,
      arafat: true,
      muzdalifah: false,
      customMinaSites: ['مخيم 19', 'مخيم 21']
    },
    responsible: {
      name: 'مسؤول 11',
      email: 'abdullah2@example.com',
      mobile: '0503334455',
      age: '46',
      bravoCode: 'BR011',
      hawiya: '9900112233',
      deputy: 'نائب 15'
    },
    members: [
      {
        id: 'M-11-1',
        section: 'الخدمات الميدانية',
        name: 'عضو 8',
        role: 'منسق ميداني',
        phone: '0504445566',
        email: 'nora2@example.com'
      }
    ],
    createdAt: '2024-01-18',
    status: 'active'
  },
  {
    id: 'C-12',
    number: '012',
    serviceType: 'B2C',
    missionNationality: 'جزائرية',
    capacity: 1600,
    locations: {
      mecca: true,
      mina: false,
      arafat: true,
      muzdalifah: true,
      customMinaSites: []
    },
    responsible: {
      name: 'مسؤول 12',
      email: 'mariam2@example.com',
      mobile: '0505556677',
      age: '36',
      bravoCode: 'BR012',
      hawiya: '0011223344',
      deputy: 'نائب 15'
    },
    members: [],
    createdAt: '2024-02-28',
    status: 'inactive'
  },
  {
    id: 'C-13',
    number: '013',
    serviceType: 'B2B',
    serviceDetail: 'بعثة',
    missionNationality: 'تركية',
    capacity: 2400,
    locations: {
      mecca: true,
      mina: true,
      arafat: false,
      muzdalifah: false,
      customMinaSites: ['مخيم 22']
    },
    responsible: {
      name: 'مسؤول 13',
      email: 'ahmed2@example.com',
      mobile: '0506667788',
      age: '41',
      bravoCode: 'BR013',
      hawiya: '1122334455',
      deputy: 'نائب 15'
    },
    members: [
      {
        id: 'M-13-1',
        section: 'الاستقبال',
        name: 'عضو 5',
        role: 'منسق',
        phone: '0507778899'
      },
      {
        id: 'M-13-2',
        section: 'الإسكان',
        name: 'عضو 9',
        role: 'منسق',
        phone: '0508889900'
      }
    ],
    createdAt: '2024-02-05',
    status: 'active'
  },
  {
    id: 'C-14',
    number: '014',
    serviceType: 'B2G',
    missionNationality: 'هندية',
    capacity: 4200,
    locations: {
      mecca: true,
      mina: true,
      arafat: true,
      muzdalifah: true,
      customMinaSites: ['مخيم 23', 'مخيم 24', 'مخيم 25']
    },
    responsible: {
      name: 'مسؤول 14',
      email: 'faisal@example.com',
      mobile: '0509990011',
      age: '49',
      bravoCode: 'BR014',
      hawiya: '2233445566',
      deputy: 'نائب 15'
    },
    members: [
      {
        id: 'M-14-1',
        section: 'الاستقبال',
        name: 'مسؤول 37',
        role: 'مدير',
        phone: '0501112233',
        email: 'hind@example.com'
      },
      {
        id: 'M-14-2',
        section: 'الإسكان',
        name: 'عضو 6',
        role: 'منسق',
        phone: '0502223344'
      },
      {
        id: 'M-14-3',
        section: 'الخدمات الميدانية',
        name: 'عضو 10',
        role: 'منسق ميداني',
        phone: '0503334455'
      }
    ],
    createdAt: '2024-01-08',
    status: 'active'
  },
  {
    id: 'C-15',
    number: '015',
    serviceType: 'B2C',
    missionNationality: 'إندونيسية',
    capacity: 1900,
    locations: {
      mecca: true,
      mina: true,
      arafat: true,
      muzdalifah: false,
      customMinaSites: ['مخيم 26']
    },
    responsible: {
      name: 'مسؤول 15',
      email: 'nora3@example.com',
      mobile: '0504445566',
      age: '33',
      bravoCode: 'BR015',
      hawiya: '3344556677',
      deputy: 'نائب 15'
    },
    members: [],
    createdAt: '2024-02-22',
    status: 'active'
  }
];


