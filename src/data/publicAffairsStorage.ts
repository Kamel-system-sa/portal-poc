import type { DeathCase, HospitalizedCase, OtherIncident } from './mockPublicAffairs';
import { mockDeathCases, mockHospitalizedCases, mockOtherIncidents } from './mockPublicAffairs';

// Local storage keys
const DEATH_CASES_KEY = 'public_affairs_death_cases';
const HOSPITALIZED_CASES_KEY = 'public_affairs_hospitalized_cases';
const OTHER_INCIDENTS_KEY = 'public_affairs_other_incidents';

// Death Cases
export const getDeathCases = (): DeathCase[] => {
  try {
    const stored = localStorage.getItem(DEATH_CASES_KEY);
    if (stored) {
      const storedCases: DeathCase[] = JSON.parse(stored);
      const mockIds = new Set(mockDeathCases.map(c => c.id));
      const storedOnly = storedCases.filter(c => !mockIds.has(c.id));
      return [...mockDeathCases, ...storedOnly];
    }
    return mockDeathCases;
  } catch {
    return mockDeathCases;
  }
};

export const saveDeathCase = (deathCase: DeathCase): void => {
  const allCases = getDeathCases();
  const existingIndex = allCases.findIndex(c => c.id === deathCase.id);
  
  let updatedCases: DeathCase[];
  if (existingIndex >= 0) {
    updatedCases = allCases.map(c => (c.id === deathCase.id ? deathCase : c));
  } else {
    updatedCases = [...allCases, deathCase];
  }
  
  const mockIds = new Set(mockDeathCases.map(c => c.id));
  const toStore = updatedCases.filter(c => !mockIds.has(c.id));
  localStorage.setItem(DEATH_CASES_KEY, JSON.stringify(toStore));
};

export const deleteDeathCase = (id: string): void => {
  const stored = localStorage.getItem(DEATH_CASES_KEY);
  if (stored) {
    const storedCases: DeathCase[] = JSON.parse(stored);
    const filtered = storedCases.filter(c => c.id !== id);
    localStorage.setItem(DEATH_CASES_KEY, JSON.stringify(filtered));
  }
};

// Hospitalized Cases
export const getHospitalizedCases = (): HospitalizedCase[] => {
  try {
    const stored = localStorage.getItem(HOSPITALIZED_CASES_KEY);
    if (stored) {
      const storedCases: HospitalizedCase[] = JSON.parse(stored);
      const mockIds = new Set(mockHospitalizedCases.map(c => c.id));
      const storedOnly = storedCases.filter(c => !mockIds.has(c.id));
      return [...mockHospitalizedCases, ...storedOnly];
    }
    return mockHospitalizedCases;
  } catch {
    return mockHospitalizedCases;
  }
};

export const saveHospitalizedCase = (hospitalizedCase: HospitalizedCase): void => {
  const allCases = getHospitalizedCases();
  const existingIndex = allCases.findIndex(c => c.id === hospitalizedCase.id);
  
  let updatedCases: HospitalizedCase[];
  if (existingIndex >= 0) {
    updatedCases = allCases.map(c => (c.id === hospitalizedCase.id ? hospitalizedCase : c));
  } else {
    updatedCases = [...allCases, hospitalizedCase];
  }
  
  const mockIds = new Set(mockHospitalizedCases.map(c => c.id));
  const toStore = updatedCases.filter(c => !mockIds.has(c.id));
  localStorage.setItem(HOSPITALIZED_CASES_KEY, JSON.stringify(toStore));
};

export const deleteHospitalizedCase = (id: string): void => {
  const stored = localStorage.getItem(HOSPITALIZED_CASES_KEY);
  if (stored) {
    const storedCases: HospitalizedCase[] = JSON.parse(stored);
    const filtered = storedCases.filter(c => c.id !== id);
    localStorage.setItem(HOSPITALIZED_CASES_KEY, JSON.stringify(filtered));
  }
};

// Other Incidents
export const getOtherIncidents = (): OtherIncident[] => {
  try {
    const stored = localStorage.getItem(OTHER_INCIDENTS_KEY);
    if (stored) {
      const storedIncidents: OtherIncident[] = JSON.parse(stored);
      const mockIds = new Set(mockOtherIncidents.map(i => i.id));
      const storedOnly = storedIncidents.filter(i => !mockIds.has(i.id));
      return [...mockOtherIncidents, ...storedOnly];
    }
    return mockOtherIncidents;
  } catch {
    return mockOtherIncidents;
  }
};

export const saveOtherIncident = (incident: OtherIncident): void => {
  const allIncidents = getOtherIncidents();
  const existingIndex = allIncidents.findIndex(i => i.id === incident.id);
  
  let updatedIncidents: OtherIncident[];
  if (existingIndex >= 0) {
    updatedIncidents = allIncidents.map(i => (i.id === incident.id ? incident : i));
  } else {
    updatedIncidents = [...allIncidents, incident];
  }
  
  const mockIds = new Set(mockOtherIncidents.map(i => i.id));
  const toStore = updatedIncidents.filter(i => !mockIds.has(i.id));
  localStorage.setItem(OTHER_INCIDENTS_KEY, JSON.stringify(toStore));
};

export const deleteOtherIncident = (id: string): void => {
  const stored = localStorage.getItem(OTHER_INCIDENTS_KEY);
  if (stored) {
    const storedIncidents: OtherIncident[] = JSON.parse(stored);
    const filtered = storedIncidents.filter(i => i.id !== id);
    localStorage.setItem(OTHER_INCIDENTS_KEY, JSON.stringify(filtered));
  }
};

