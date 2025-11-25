// Reception Module Types

export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'building' | 'tent';
  location: string;
  capacity: number;
  occupied: number;
  available: number;
}

export interface Organizer {
  id: string;
  number: string;
  name: string;
  company: string;
  phone: string;
  email: string;
}

export interface ArrivalGroup {
  id: string;
  groupNumber: string;
  groupName: string;
  arrivalDate: string; // YYYY-MM-DD
  arrivalTime: string; // HH:mm
  flightNumber?: string;
  tripNumber?: string;
  pilgrimsCount: number;
  arrivedCount: number;
  destination: 'makkah' | 'madinah' | 'mina' | 'arafat';
  organizer: Organizer;
  accommodations: Array<{
    accommodationId: string;
    accommodationName: string;
    pilgrimsAssigned: number;
    contractNumber?: string;
    campaignNumber?: string;
  }>;
  status: 'scheduled' | 'arrived' | 'completed';
  campaignNumber?: string;
  createdAt: string;
  rawPassengerData?: RawPassengerData[]; // Hidden by default, role-based access
}

export interface RawPassengerData {
  id: string;
  name: string;
  passportNumber: string;
  visaNumber: string;
  nationality: string;
  gender: 'male' | 'female';
  age: number;
  phone?: string;
  email?: string;
}

export interface Bus {
  id: string;
  number: string;
  carrier: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  photo?: string;
  passengers: number;
  groupId?: string;
  status: 'available' | 'assigned' | 'in-transit' | 'arrived';
}

export interface PortActivity {
  id: string;
  type: 'airport-arrival' | 'land-port-passage';
  timestamp: string;
  groupId: string;
  groupName: string;
  flightNumber?: string;
  busNumber?: string;
  pilgrimCount: number;
  status: 'pending' | 'confirmed' | 'completed';
}

export interface PortEntry {
  id: string;
  portType: 'airport' | 'land';
  portName?: string; // اسم المطار أو المنفذ البري
  // Airport fields
  flightNumber?: string;
  groupId?: string;
  groupName?: string;
  groupCount?: number;
  expectedCount?: number;
  // Bus fields (common for both)
  busPhoto?: string;
  carrierName: string;
  busNumber: string;
  driverPhone: string;
  passengersPerBus: number;
  busCapacity?: number;
  // Land port specific
  guidePhone?: string;
  // Status
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
  updatedAt: string;
  confirmedBy?: string;
}

export interface AirportEntryFormData {
  flightNumber: string;
  groupCount: number;
  busPhoto: string;
  carrierName: string;
  busNumber: string;
  driverPhone: string;
  passengersPerBus: number;
}

export interface LandPortEntryFormData {
  busPhoto: string;
  carrierName: string;
  busNumber: string;
  driverPhone: string;
  passengersPerBus: number;
  guidePhone: string;
}

export interface DashboardKPI {
  totalContracted: number;
  totalArrived: number;
  remaining: number;
  todayExpected: number;
  todayArrived: number;
}

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface ActivityTimelineItem {
  id: string;
  type: 'group-created' | 'group-arrived' | 'accommodation-assigned' | 'bus-dispatched' | 'port-arrival';
  title: string;
  description: string;
  timestamp: string;
  groupId?: string;
  userId: string;
  userName: string;
}

// Campaign Types
export interface CampaignPilgrim {
  id: string;
  name: string;
  passportNumber: string;
  primaryPhone: string;
  secondaryPhone?: string;
  homeCountryPhone?: string;
  email?: string;
  gender: 'male' | 'female';
  nationality: string;
}

export interface Campaign {
  id: string;
  campaignNumber: string;
  campaignName: string;
  organizerId: string;
  organizerNumber: string;
  organizerName: string;
  organizerCompany: string;
  organizerPhone: string;
  organizerEmail: string;
  responsiblePerson: string;
  gender: 'male' | 'female';
  totalPilgrims: number;
  registeredPilgrims: number;
  pilgrims: CampaignPilgrim[];
  registrationPercentage: number;
  photo?: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'registered' | 'completed';
}

export interface CampaignRegistrationFormData {
  organizerId?: string;
  organizerNumber?: string;
  organizerName?: string;
  companyName?: string;
  totalPilgrims: number;
  nationality: string;
  phone: string;
  email: string;
}

export interface CampaignFollowUpFormData {
  campaignName: string;
  responsiblePerson: string;
  gender: 'male' | 'female';
  phone: string;
  secondaryPhone?: string;
  email?: string;
  photo?: string;
}

export interface CampaignManager {
  name: string;
  gender: 'male' | 'female';
  phone: string;
  secondaryPhone?: string;
  email?: string;
}

// Departure Types
export interface DepartureGroup {
  id: string;
  organizerId: string;
  organizerNumber: string;
  organizerName: string;
  organizerCompany: string;
  organizerNationality: string;
  organizerPhone: string;
  organizerEmail: string;
  campaignNumber: string;
  campaignManagerPhone: string;
  departurePoint: 'makkah' | 'madinah';
  arrivalDestination: 'makkah' | 'madinah' | 'jeddah' | 'madinah-airport';
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  pilgrimsCount: number;
  accommodations: Array<{
    accommodationId: string;
    accommodationName: string;
    contractNumber: string;
    pilgrimsDeparting: number;
  }>;
  arrivalAccommodations: Array<{
    accommodationId: string;
    accommodationName: string;
    contractNumber: string;
    contractStartDate: string;
    pilgrimsArriving: number;
  }>;
  status: 'scheduled' | 'departed' | 'arrived' | 'completed';
  createdAt: string;
}

export interface DepartureDashboardKPI {
  registeredPilgrimsInCenter: number;
  arrivedPilgrimsCount: number;
  arrivedPilgrimsPercentage: number;
  organizersCount: number;
  pilgrimsInMakkah: number;
  registeredCampaigns: number;
  pilgrimsInMadinah: number;
  expectedArrivalsCount: number;
  expectedArrivalsPercentage: number;
  departedPilgrimsCount: number;
  departedPilgrimsPercentage: number;
}

export interface DepartureFormStep1Data {
  organizerNumber: string;
  campaignNumber: string;
  departurePoint: 'makkah' | 'madinah';
  accommodations: Array<{
    accommodationId: string;
    accommodationName: string;
    contractNumber: string;
    pilgrimsDeparting: number;
  }>;
}

export interface DepartureFormStep2Data {
  arrivalDestination: 'makkah' | 'madinah' | 'jeddah' | 'madinah-airport';
  arrivalAccommodations: Array<{
    accommodationId: string;
    accommodationName: string;
    contractNumber: string;
    contractStartDate: string;
    pilgrimsArriving: number;
  }>;
}

export interface DepartureExcelRow {
  organizerNumber: string;
  organizerName: string;
  organizerCompany: string;
  organizerNationality: string;
  organizerPhone: string;
  campaignNumber: string;
  campaignManagerPhone: string;
  route: string; // مسار الرحلة
  departureDate: string;
  departureTime: string;
  pilgrimsCount: number;
}

