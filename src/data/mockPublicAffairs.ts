// Mock data for Public Affairs cases
import { getDeathCases, getHospitalizedCases, getOtherIncidents } from './publicAffairsStorage';

export type DeathCauseType = 'heart_attack' | 'traffic_accident' | 'natural_causes' | 'medical_emergency' | 'other';
export type HospitalStatus = 'stable' | 'critical' | 'improving' | 'discharged';
export type IncidentType = 'missing' | 'arrest' | 'lost_passport' | 'family_separation' | 'medical_issue';

export interface DeathCase {
  id: string;
  name: string; // Will be "Pilgrim 1", "Pilgrim 73", etc.
  passportNumber: string;
  nationality: string;
  causeOfDeath: string;
  causeOfDeathType: DeathCauseType;
  placeOfDeath: string;
  timeOfDeath: string;
  dateOfDeath: string;
  imageUrl?: string;
  nusukCaseNumber: string;
  createdAt: string;
  completed: boolean;
  completedAt?: string;
  burialCompleted?: boolean;
}

export interface HospitalizedCase {
  id: string;
  name: string; // Will be "Pilgrim 1", "Pilgrim 73", etc.
  passportNumber: string;
  nationality: string;
  hospital: string;
  status: string;
  statusType: HospitalStatus;
  contactDelegate: string;
  detailedReport: string;
  nusukCaseNumber: string;
  createdAt: string;
  updatedAt?: string;
  completed: boolean;
  completedAt?: string;
  discharged?: boolean;
}

export interface OtherIncident {
  id: string;
  name: string; // Will be "Pilgrim 1", "Pilgrim 73", etc.
  passportNumber: string;
  nationality: string;
  incidentType: IncidentType;
  organizerNumber: string;
  nusukCaseNumber: string;
  createdAt: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  resolved?: boolean;
}

// Generate random pilgrim names
const generatePilgrimName = (index: number): string => {
  return `Pilgrim ${index}`;
};

// Nationalities list
const nationalities = ['saudi', 'egyptian', 'pakistani', 'indonesian', 'turkish', 'indian', 'bangladeshi', 'nigerian', 'malaysian', 'afghan'];

// Generate mock death cases (25 cases)
export const mockDeathCases: DeathCase[] = Array.from({ length: 25 }, (_, i) => {
  const index = i + 1;
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  const deathTypes: DeathCauseType[] = ['heart_attack', 'traffic_accident', 'natural_causes', 'medical_emergency', 'other'];
  const deathTypeLabels = {
    heart_attack: 'أزمة قلبية',
    traffic_accident: 'حادث مروري',
    natural_causes: 'وفاة طبيعية',
    medical_emergency: 'طوارئ طبية',
    other: 'أخرى'
  };
  const places = ['مكة المكرمة', 'المدينة المنورة', 'مشعر منى', 'مشعر عرفة', 'مزدلفة'];
  const selectedType = deathTypes[Math.floor(Math.random() * deathTypes.length)];
  const isCompleted = index <= 8; // First 8 are completed
  
  return {
    id: `death-${index}`,
    name: generatePilgrimName(index),
    passportNumber: `${String.fromCharCode(65 + (i % 26))}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
    causeOfDeath: deathTypeLabels[selectedType],
    causeOfDeathType: selectedType,
    placeOfDeath: places[Math.floor(Math.random() * places.length)],
    timeOfDeath: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    dateOfDeath: date.toISOString().split('T')[0],
    nusukCaseNumber: `NUS-2024-D-${String(index).padStart(3, '0')}`,
    createdAt: date.toISOString(),
    completed: isCompleted,
    completedAt: isCompleted ? new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString() : undefined,
    burialCompleted: isCompleted
  };
});

// Generate mock hospitalized cases (30 cases)
export const mockHospitalizedCases: HospitalizedCase[] = Array.from({ length: 30 }, (_, i) => {
  const index = i + 1;
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  const hospitals = ['مستشفى الملك فهد', 'مستشفى النور', 'مستشفى الملك عبدالعزيز', 'مستشفى المدينة', 'مستشفى الحرمين'];
  const statusTypes: HospitalStatus[] = ['stable', 'critical', 'improving', 'discharged'];
  const statusLabels = {
    stable: 'مستقر',
    critical: 'حرجة',
    improving: 'تحسن',
    discharged: 'تم الإفاقة'
  };
  const contacts = ['أحمد محمد', 'فاطمة علي', 'خالد حسن', 'مريم أحمد', 'عبدالله سالم'];
  const selectedStatus = statusTypes[Math.floor(Math.random() * statusTypes.length)];
  const isCompleted = index <= 10; // First 10 are completed
  
  return {
    id: `hosp-${index}`,
    name: generatePilgrimName(25 + index), // Continue from death cases
    passportNumber: `${String.fromCharCode(65 + (i % 26))}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
    hospital: hospitals[Math.floor(Math.random() * hospitals.length)],
    status: statusLabels[selectedStatus],
    statusType: selectedStatus,
    contactDelegate: `${contacts[Math.floor(Math.random() * contacts.length)]} - 050${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
    detailedReport: selectedStatus === 'critical' 
      ? 'حالة حرجة، يتطلب مراقبة مستمرة وإجراءات طبية عاجلة'
      : selectedStatus === 'stable'
      ? 'حالة المريض مستقرة، يخضع للمراقبة الدورية'
      : selectedStatus === 'improving'
      ? 'حالة المريض تتحسن تدريجياً، الاستجابة للعلاج إيجابية'
      : 'المريض في حالة جيدة وتم الإفراج عنه',
    nusukCaseNumber: `NUS-2024-H-${String(index).padStart(3, '0')}`,
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
    completed: isCompleted || selectedStatus === 'discharged',
    completedAt: (isCompleted || selectedStatus === 'discharged') ? new Date(date.getTime() + 48 * 60 * 60 * 1000).toISOString() : undefined,
    discharged: isCompleted || selectedStatus === 'discharged'
  };
});

// Generate mock other incidents (20 cases)
export const mockOtherIncidents: OtherIncident[] = Array.from({ length: 20 }, (_, i) => {
  const index = i + 1;
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  const incidentTypes: IncidentType[] = ['missing', 'arrest', 'lost_passport', 'family_separation', 'medical_issue'];
  const selectedType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
  const descriptions = {
    missing: 'فقد الاتصال بالحاج في منطقة عرفات',
    arrest: 'تم توقيف الحاج بسبب مخالفة مرورية',
    lost_passport: 'فقدان جواز السفر في المنطقة المركزية',
    family_separation: 'انفصال العائلة وفقدان الاتصال',
    medical_issue: 'مشكلة صحية طفيفة تحتاج متابعة'
  };
  const isCompleted = index <= 6; // First 6 are completed
  
  return {
    id: `inc-${index}`,
    name: generatePilgrimName(55 + index), // Continue from hospitalized cases
    passportNumber: `${String.fromCharCode(65 + (i % 26))}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
    incidentType: selectedType,
    organizerNumber: `ORG-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
    nusukCaseNumber: `NUS-2024-I-${String(index).padStart(3, '0')}`,
    createdAt: date.toISOString(),
    description: descriptions[selectedType],
    completed: isCompleted,
    completedAt: isCompleted ? new Date(date.getTime() + 12 * 60 * 60 * 1000).toISOString() : undefined,
    resolved: isCompleted
  };
});

// Helper functions - use storage functions to get all cases (mock + stored)
export const getDeathCasesCount = () => getDeathCases().length;
export const getHospitalizedCasesCount = () => getHospitalizedCases().length;
export const getOtherIncidentsCount = () => getOtherIncidents().length;
export const getTotalCasesCount = () => 
  getDeathCases().length + getHospitalizedCases().length + getOtherIncidents().length;

export const getActiveDeathCasesCount = () => getDeathCases().filter(c => !c.completed).length;
export const getActiveHospitalizedCasesCount = () => getHospitalizedCases().filter(c => !c.completed).length;
export const getActiveOtherIncidentsCount = () => getOtherIncidents().filter(c => !c.completed).length;

export const getCompletedDeathCasesCount = () => getDeathCases().filter(c => c.completed).length;
export const getCompletedHospitalizedCasesCount = () => getHospitalizedCases().filter(c => c.completed).length;
export const getCompletedOtherIncidentsCount = () => getOtherIncidents().filter(c => c.completed).length;

export const getTodayDeathCases = () => {
  const today = new Date().toISOString().split('T')[0];
  return getDeathCases().filter(c => c.dateOfDeath === today && !c.completed).length;
};

export const getTodayHospitalizedCases = () => {
  const today = new Date().toISOString().split('T')[0];
  return getHospitalizedCases().filter(c => c.createdAt.startsWith(today) && !c.completed).length;
};

export const getTodayOtherIncidents = () => {
  const today = new Date().toISOString().split('T')[0];
  return getOtherIncidents().filter(c => c.createdAt.startsWith(today) && !c.completed).length;
};

// Get recent cases (last 5)
export const getRecentDeathCases = (limit: number = 5) => {
  return [...getDeathCases()]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getRecentHospitalizedCases = (limit: number = 5) => {
  return [...getHospitalizedCases()]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getRecentOtherIncidents = (limit: number = 5) => {
  return [...getOtherIncidents()]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getRecentAllCases = (limit: number = 10) => {
  const allCases = [
    ...getDeathCases().map(c => ({ ...c, type: 'death' as const })),
    ...getHospitalizedCases().map(c => ({ ...c, type: 'hospitalized' as const })),
    ...getOtherIncidents().map(c => ({ ...c, type: 'other' as const }))
  ];
  
  return allCases
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

// Get completed cases
export const getCompletedDeathCases = () => getDeathCases().filter(c => c.completed);
export const getCompletedHospitalizedCases = () => getHospitalizedCases().filter(c => c.completed);
export const getCompletedOtherIncidents = () => getOtherIncidents().filter(c => c.completed);

// Statistics by nationality
export const getCasesByNationality = () => {
  const allCases = [
    ...getDeathCases().filter(c => !c.completed).map(c => ({ ...c, type: 'death' as const })),
    ...getHospitalizedCases().filter(c => !c.completed).map(c => ({ ...c, type: 'hospitalized' as const })),
    ...getOtherIncidents().filter(c => !c.completed).map(c => ({ ...c, type: 'other' as const }))
  ];

  const nationalityMap: Record<string, number> = {};
  allCases.forEach(c => {
    nationalityMap[c.nationality] = (nationalityMap[c.nationality] || 0) + 1;
  });

  return Object.entries(nationalityMap)
    .map(([nationality, count]) => ({
      nationality,
      count
    }))
    .sort((a, b) => b.count - a.count);
};

// Statistics by location
export const getCasesByLocation = () => {
  const locationMap: Record<string, number> = {};
  
  getDeathCases().filter(c => !c.completed).forEach(c => {
    locationMap[c.placeOfDeath] = (locationMap[c.placeOfDeath] || 0) + 1;
  });
  
  getHospitalizedCases().filter(c => !c.completed).forEach(c => {
    locationMap[c.hospital] = (locationMap[c.hospital] || 0) + 1;
  });

  return Object.entries(locationMap)
    .map(([location, count]) => ({
      location,
      count
    }))
    .sort((a, b) => b.count - a.count);
};

// Get cases by nationality
export const getCasesByNationalityList = (nationality: string) => {
  const allCases = [
    ...getDeathCases().map(c => ({ ...c, type: 'death' as const })),
    ...getHospitalizedCases().map(c => ({ ...c, type: 'hospitalized' as const })),
    ...getOtherIncidents().map(c => ({ ...c, type: 'other' as const }))
  ];
  
  return allCases.filter(c => c.nationality === nationality);
};

// Get cases by location
export const getCasesByLocationList = (location: string) => {
  const allCases: any[] = [];
  
  // Add death cases (location = placeOfDeath)
  getDeathCases().forEach(c => {
    allCases.push({ ...c, type: 'death' as const, location: c.placeOfDeath });
  });
  
  // Add hospitalized cases (location = hospital)
  getHospitalizedCases().forEach(c => {
    allCases.push({ ...c, type: 'hospitalized' as const, location: c.hospital });
  });
  
  return allCases.filter(c => c.location === location);
};
