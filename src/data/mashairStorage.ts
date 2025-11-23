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

