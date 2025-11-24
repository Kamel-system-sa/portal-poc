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

