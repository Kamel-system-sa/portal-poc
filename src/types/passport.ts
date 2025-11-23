// Passport Module Types

export interface Pilgrim {
  id: string;
  name: string;
  passportNumber: string;
  visaNumber: string;
  nationality: string;
  gender: 'male' | 'female';
  age: number;
  phone?: string;
  email?: string;
  photo?: string;
  serviceCenterId?: string;
  serviceCenterName?: string;
  organizerId?: string;
  organizerNumber?: string;
  organizerName?: string;
  organizerCompany?: string;
  campaignId?: string;
  campaignNumber?: string;
  campaignName?: string;
  preArrivalData?: PreArrivalData;
  serviceProvided: boolean;
  serviceProvidedAt?: string;
  serviceProvidedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PreArrivalData {
  groupNumber?: string;
  groupName?: string;
  arrivalDate?: string;
  arrivalTime?: string;
  flightNumber?: string;
  destination?: string;
}

export interface Organizer {
  id: string;
  number: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
}

export interface Campaign {
  id: string;
  campaignNumber: string;
  campaignName: string;
  organizerId: string;
  organizerNumber: string;
  organizerName: string;
  totalPilgrims: number;
  registeredPilgrims: number;
}

export interface ServiceProof {
  id: string;
  pilgrimId: string;
  pilgrimName: string;
  passportNumber: string;
  visaNumber: string;
  serviceCenterId: string;
  serviceCenterName: string;
  providedAt: string;
  providedBy: string;
  notes?: string;
}

export interface TransferRequest {
  id: string;
  pilgrimId: string;
  pilgrimName: string;
  passportNumber: string;
  fromCenterId: string;
  fromCenterName: string;
  toCenterId: string;
  toCenterName: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  requestedBy: string;
  processedAt?: string;
  processedBy?: string;
}

// Storage Types
export interface StorageLayout {
  id: string;
  name: string;
  cabinets: Cabinet[];
  createdAt: string;
  updatedAt: string;
}

export interface Cabinet {
  id: string;
  number: string;
  name?: string;
  drawers: Drawer[];
}

export interface Drawer {
  id: string;
  number: string;
  name?: string;
  boxes: Box[];
}

export interface Box {
  id: string;
  number: string;
  name?: string;
  capacity: number;
  passports: StoredPassport[];
}

export interface StoredPassport {
  id: string;
  pilgrimId: string;
  pilgrimName: string;
  passportNumber: string;
  visaNumber: string;
  nationality: string;
  storedAt: string;
  storedBy: string;
  cabinetId: string;
  drawerId: string;
  boxId: string;
}

// Dashboard KPI Types
export interface PassportKPI {
  totalReceivedToday: number;
  totalInStorage: number;
  totalServiceProvided: number;
  pendingTransfers: number;
  distributionByNationality: Record<string, number>;
  distributionByCampaign: Record<string, number>;
  distributionByCenter?: Record<string, number>; // Only visible to company users
}

// Search and Scan Types
export interface PassportSearchResult {
  pilgrim: Pilgrim;
  matchType: 'passport' | 'visa' | 'name';
  confidence: number;
}

export interface ScanResult {
  passportNumber?: string;
  visaNumber?: string;
  name?: string;
  nationality?: string;
  dateOfBirth?: string;
  expiryDate?: string;
  rawData?: any;
}

