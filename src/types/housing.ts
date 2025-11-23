export interface Bed {
  id: string;
  occupied: boolean;
  pilgrimId?: string;
  pilgrimName?: string;
  pilgrimGender?: 'male' | 'female';
}

export interface Room {
  id: string;
  roomNumber: string;
  totalBeds: number; // 2-4 for hotels/buildings
  beds: Bed[];
  gender: 'male' | 'female' | 'mixed';
  floor?: number;
  buildingId?: string;
  hotelId?: string;
}

export interface Tent {
  id: string;
  tentNumber: string;
  totalBeds: number; // 10-50 for tents
  beds: Bed[];
  location: 'mina' | 'arafat';
  section?: string;
}

export interface Organizer {
  id: string;
  organizerNumber: string;
  name: string;
  company: string;
  phone: string;
  groupSize: number;
  campaignNumber?: string;
  contact1: string;
  contact2?: string;
}

export interface HousingRecord {
  id: string;
  type: 'hotel' | 'building' | 'mina' | 'arafat';
  organizer: Organizer;
  housingName: string;
  licenseNumber: string;
  classificationLevel: 1 | 2 | 3 | 4 | 5;
  ministryRegistrationNumber: string;
  city: 'makkah' | 'madinah';
  district: string;
  fullAddress: string;
  googleMapsUrl?: string;
  housingCapacity: number;
  numberOfElevators?: number;
  numberOfFireExtinguishers?: number;
  numberOfEmergencyExits?: number;
  numberOfFloors?: number;
  reservedRoomsBeforeHajj?: number;
  reservedRoomsAfterHajj?: number;
  checkInDate?: string;
  checkOutDate?: string;
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  totalRooms: number;
  rooms: Room[];
  totalCapacity: number;
  occupiedCapacity: number;
  housingRecordId?: string;
}

export interface Building {
  id: string;
  name: string;
  location: string;
  totalRooms: number;
  rooms: Room[];
  totalCapacity: number;
  occupiedCapacity: number;
  floors?: number;
  housingRecordId?: string;
}

export interface Pilgrim {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  nationality: string;
  bravoCode?: string;
  hawiya?: string;
  phone?: string;
  email?: string;
  serviceCenter?: string;
  organizer?: string;
  group?: string;
  passportNumber?: string;
  visaNumber?: string;
  photo?: string;
  assignedRoom?: {
    type: 'hotel' | 'building';
    hotelId?: string;
    buildingId?: string;
    roomId: string;
    roomNumber: string;
    bedId: string;
  };
  assignedTent?: {
    location: 'mina' | 'arafat';
    tentId: string;
    tentNumber: string;
    bedId: string;
  };
}

export interface HousingStats {
  totalHoused: number;
  totalCapacity: number;
  availableBeds: number;
  hotelsCount: number;
  buildingsCount: number;
  minaTentsCount: number;
  arafatTentsCount: number;
}

// Mashair Section Types
export interface MashairTent {
  id: string;
  tentNameOrNumber: string;
  area: number; // in m²
  capacity: number;
  location: 'mina' | 'arafat';
  pdfFile?: File | string;
  createdAt: string;
}

export interface MashairTentAssignment {
  id: string;
  tentNameOrNumber: string;
  campaign: 'office' | 'kitchen' | 'campaignNumber' | 'other';
  campaignNumber?: string;
  otherCampaignName?: string;
  location: 'mina' | 'arafat';
  pdfFile?: File | string;
  createdAt: string;
}

