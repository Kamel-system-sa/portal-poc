// Transport types
export interface Passenger {
  id: string;
  fullName: string;
  idNumber: string;
  passportNumber: string;
  seatNumber: number;
  phoneNumber: string;
  notes?: string;
  gender?: 'male' | 'female';
}

export interface Bus {
  id: string;
  route: string; // e.g., "Jeddah → Makkah"
  departureTime: string;
  expectedArrival: string;
  transportCompany: string;
  licensePlate: string;
  busNumber: string;
  busId: string;
  driver1Name: string;
  driver1Phone: string;
  driver2Name: string;
  driver2Phone: string;
  passengers: Passenger[];
  capacity: number;
  createdAt: string;
  status: 'active' | 'completed' | 'scheduled';
}

// City Transfer types
export interface CityTransferBus {
  id: string;
  busNumber: string;
  passengerCount: number;
  driverName: string;
  driverPhone: string;
  guideName: string;
  guidePhone: string;
  destinationHotel: string;
  destinationCity: 'Makkah' | 'Madinah' | 'Jeddah';
  arrivalStatus: 'arrived' | 'not_arrived';
}

export interface CityTransfer {
  id: string;
  hotelName: string;
  date: string;
  time: string;
  busesCount: number;
  city: 'Makkah' | 'Madinah' | 'Jeddah';
  fromCity?: string;
  toCity?: string;
  buses: CityTransferBus[];
  createdAt: string;
}

// Mashair Transfer types
export type MashairRoute = 'Mina → Arafat' | 'Arafat → Muzdalifah' | 'Muzdalifah → Mina' | 'Mina → Makkah' | 'Makkah → Mina';

export interface MashairTransferBus {
  id: string;
  busNumber: string;
  responseNumber?: string; // رقم الرد داخل الباص (اختياري للتوافق مع البيانات القديمة)
  passengerCount: number;
  driverName: string;
  driverPhone: string;
  guideName: string;
  guidePhone: string;
  destinationHotel: string;
  destinationLocation: 'Mina' | 'Arafat' | 'Muzdalifah' | 'Makkah';
  arrivalStatus: 'arrived' | 'not_arrived';
}

export interface MashairTransfer {
  id: string;
  hotelName: string;
  date: string;
  time: string;
  busesCount: number;
  route: MashairRoute;
  buses: MashairTransferBus[];
  createdAt: string;
}
