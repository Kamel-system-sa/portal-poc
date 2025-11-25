import type { ArrivalGroup } from '../types/reception';

// Local storage keys
const PRE_ARRIVAL_KEY = 'reception_pre_arrival';
const PORT_ENTRY_KEY = 'reception_port_entry';
const DEPARTURE_KEY = 'reception_departure';

// Pre-Arrival Groups
export const getPreArrivalGroups = (): ArrivalGroup[] => {
  try {
    const stored = localStorage.getItem(PRE_ARRIVAL_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const savePreArrivalGroup = (group: ArrivalGroup): void => {
  const groups = getPreArrivalGroups();
  const existingIndex = groups.findIndex(g => g.id === group.id);
  
  if (existingIndex >= 0) {
    groups[existingIndex] = group;
  } else {
    groups.push(group);
  }
  
  localStorage.setItem(PRE_ARRIVAL_KEY, JSON.stringify(groups));
};

export const deletePreArrivalGroup = (id: string): void => {
  const groups = getPreArrivalGroups();
  const filtered = groups.filter(g => g.id !== id);
  localStorage.setItem(PRE_ARRIVAL_KEY, JSON.stringify(filtered));
};

// Port Entry Records
export const getPortEntryRecords = (): any[] => {
  try {
    const stored = localStorage.getItem(PORT_ENTRY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const savePortEntryRecord = (record: any): void => {
  const records = getPortEntryRecords();
  const existingIndex = records.findIndex(r => r.id === record.id);
  
  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }
  
  localStorage.setItem(PORT_ENTRY_KEY, JSON.stringify(records));
};

export const deletePortEntryRecord = (id: string): void => {
  const records = getPortEntryRecords();
  const filtered = records.filter(r => r.id !== id);
  localStorage.setItem(PORT_ENTRY_KEY, JSON.stringify(filtered));
};

// Departure Records
export const getDepartureRecords = (): any[] => {
  try {
    const stored = localStorage.getItem(DEPARTURE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveDepartureRecord = (record: any): void => {
  const records = getDepartureRecords();
  const existingIndex = records.findIndex(r => r.id === record.id);
  
  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }
  
  localStorage.setItem(DEPARTURE_KEY, JSON.stringify(records));
};

export const deleteDepartureRecord = (id: string): void => {
  const records = getDepartureRecords();
  const filtered = records.filter(r => r.id !== id);
  localStorage.setItem(DEPARTURE_KEY, JSON.stringify(filtered));
};

