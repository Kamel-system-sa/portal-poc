import type { Hotel, Building, Tent, Pilgrim, Bed } from '../types/housing';

// Generate mock beds for a room
const generateRoomBeds = (totalBeds: number, occupiedCount: number, roomId: string): Bed[] => {
  const beds: Bed[] = [];
  for (let i = 0; i < totalBeds; i++) {
    beds.push({
      id: `${roomId}-bed-${i + 1}`,
      occupied: i < occupiedCount,
      pilgrimId: i < occupiedCount ? `pilgrim-${roomId}-${i + 1}` : undefined,
      pilgrimName: i < occupiedCount ? `Pilgrim ${roomId}-${i + 1}` : undefined,
      pilgrimGender: i < occupiedCount ? (i % 2 === 0 ? 'male' : 'female') : undefined
    });
  }
  return beds;
};

// Generate mock beds for a tent
const generateTentBeds = (totalBeds: number, occupiedCount: number, tentId: string): Bed[] => {
  const beds: Bed[] = [];
  for (let i = 0; i < totalBeds; i++) {
    beds.push({
      id: `${tentId}-bed-${i + 1}`,
      occupied: i < occupiedCount,
      pilgrimId: i < occupiedCount ? `pilgrim-${tentId}-${i + 1}` : undefined,
      pilgrimName: i < occupiedCount ? `Pilgrim ${tentId}-${i + 1}` : undefined,
      pilgrimGender: i < occupiedCount ? (i % 2 === 0 ? 'male' : 'female') : undefined
    });
  }
  return beds;
};

// Mock Hotels
export const mockHotels: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'Grand Makkah Hotel',
    location: 'Makkah, Near Haram',
    totalRooms: 50,
    totalCapacity: 150,
    occupiedCapacity: 120,
    rooms: Array.from({ length: 50 }, (_, i) => ({
      id: `hotel-1-room-${i + 1}`,
      roomNumber: `${i + 1}`,
      totalBeds: Math.floor(Math.random() * 3) + 2, // 2-4 beds
      beds: generateRoomBeds(
        Math.floor(Math.random() * 3) + 2,
        Math.floor(Math.random() * 3) + 1,
        `hotel-1-room-${i + 1}`
      ),
      gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'mixed',
      floor: Math.floor(i / 10) + 1,
      hotelId: 'hotel-1'
    }))
  },
  {
    id: 'hotel-2',
    name: 'Al-Safa Towers',
    location: 'Makkah, Al-Safa District',
    totalRooms: 75,
    totalCapacity: 225,
    occupiedCapacity: 180,
    rooms: Array.from({ length: 75 }, (_, i) => ({
      id: `hotel-2-room-${i + 1}`,
      roomNumber: `${i + 1}`,
      totalBeds: Math.floor(Math.random() * 3) + 2,
      beds: generateRoomBeds(
        Math.floor(Math.random() * 3) + 2,
        Math.floor(Math.random() * 3) + 1,
        `hotel-2-room-${i + 1}`
      ),
      gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'mixed',
      floor: Math.floor(i / 15) + 1,
      hotelId: 'hotel-2'
    }))
  }
];

// Mock Buildings
export const mockBuildings: Building[] = [
  {
    id: 'building-1',
    name: 'Pilgrim Residence Complex A',
    location: 'Makkah, Al-Aziziyah',
    totalRooms: 100,
    totalCapacity: 300,
    occupiedCapacity: 250,
    floors: 5,
    rooms: Array.from({ length: 100 }, (_, i) => ({
      id: `building-1-room-${i + 1}`,
      roomNumber: `${Math.floor(i / 20) + 1}${String((i % 20) + 1).padStart(2, '0')}`,
      totalBeds: Math.floor(Math.random() * 3) + 2,
      beds: generateRoomBeds(
        Math.floor(Math.random() * 3) + 2,
        Math.floor(Math.random() * 3) + 1,
        `building-1-room-${i + 1}`
      ),
      gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'mixed',
      floor: Math.floor(i / 20) + 1,
      buildingId: 'building-1'
    }))
  },
  {
    id: 'building-2',
    name: 'Pilgrim Residence Complex B',
    location: 'Makkah, Al-Shisha',
    totalRooms: 80,
    totalCapacity: 240,
    occupiedCapacity: 200,
    floors: 4,
    rooms: Array.from({ length: 80 }, (_, i) => ({
      id: `building-2-room-${i + 1}`,
      roomNumber: `${Math.floor(i / 20) + 1}${String((i % 20) + 1).padStart(2, '0')}`,
      totalBeds: Math.floor(Math.random() * 3) + 2,
      beds: generateRoomBeds(
        Math.floor(Math.random() * 3) + 2,
        Math.floor(Math.random() * 3) + 1,
        `building-2-room-${i + 1}`
      ),
      gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'mixed',
      floor: Math.floor(i / 20) + 1,
      buildingId: 'building-2'
    }))
  }
];

// Mock Mina Tents
export const mockMinaTents: Tent[] = Array.from({ length: 30 }, (_, i) => ({
  id: `mina-tent-${i + 1}`,
  tentNumber: `M-${String(i + 1).padStart(3, '0')}`,
  totalBeds: Math.floor(Math.random() * 41) + 10, // 10-50 beds
  beds: generateTentBeds(
    Math.floor(Math.random() * 41) + 10,
    Math.floor(Math.random() * 30) + 5,
    `mina-tent-${i + 1}`
  ),
  location: 'mina',
  section: `Section ${Math.floor(i / 10) + 1}`
}));

// Mock Arafat Tents
export const mockArafatTents: Tent[] = Array.from({ length: 25 }, (_, i) => ({
  id: `arafat-tent-${i + 1}`,
  tentNumber: `A-${String(i + 1).padStart(3, '0')}`,
  totalBeds: Math.floor(Math.random() * 41) + 10, // 10-50 beds
  beds: generateTentBeds(
    Math.floor(Math.random() * 41) + 10,
    Math.floor(Math.random() * 30) + 5,
    `arafat-tent-${i + 1}`
  ),
  location: 'arafat',
  section: `Section ${Math.floor(i / 8) + 1}`
}));

// Mock Pilgrims
export const mockPilgrims: Pilgrim[] = Array.from({ length: 200 }, (_, i) => {
  const nationalities = ['saudi', 'egyptian', 'pakistani', 'indian', 'indonesian', 'turkish', 'jordanian'];
  const genders: ('male' | 'female')[] = ['male', 'female'];
  const gender = genders[i % 2];
  const nationality = nationalities[i % nationalities.length];
  
  // Assign some pilgrims to rooms/tents
  let assignedRoom, assignedTent;
  if (i < 100) {
    // Assign to hotel rooms
    const hotel = mockHotels[0];
    const room = hotel.rooms[i % hotel.rooms.length];
    const bed = room.beds.find(b => b.occupied);
    if (bed) {
      assignedRoom = {
        type: 'hotel' as const,
        hotelId: hotel.id,
        roomId: room.id,
        roomNumber: room.roomNumber,
        bedId: bed.id
      };
    }
  } else if (i < 150) {
    // Assign to tents
    const tent = mockMinaTents[(i - 100) % mockMinaTents.length];
    const bed = tent.beds.find(b => b.occupied);
    if (bed) {
      assignedTent = {
        location: 'mina' as const,
        tentId: tent.id,
        tentNumber: tent.tentNumber,
        bedId: bed.id
      };
    }
  }

  return {
    id: `pilgrim-${i + 1}`,
    name: `Pilgrim ${i + 1}`,
    gender,
    age: Math.floor(Math.random() * 50) + 25,
    nationality,
    bravoCode: `BRV${String(i + 1).padStart(6, '0')}`,
    hawiya: `${String(i + 1).padStart(10, '0')}`,
    phone: `05${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    email: `pilgrim${i + 1}@example.com`,
    serviceCenter: `Center ${(i % 10) + 1}`,
    organizer: `Organizer ${(i % 5) + 1}`,
    group: `Group ${(i % 20) + 1}`,
    assignedRoom,
    assignedTent
  };
});

