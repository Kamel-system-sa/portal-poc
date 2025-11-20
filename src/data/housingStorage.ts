import type { HousingRecord, Hotel, Building, Tent, Room, Bed } from '../types/housing';
import { mockHotels, mockBuildings, mockMinaTents, mockArafatTents } from './mockHousing';

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

// Local storage key
const STORAGE_KEY = 'housing_records';

// Get all housing records from localStorage
export const getHousingRecords = (): HousingRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save housing record to localStorage
export const saveHousingRecord = (record: HousingRecord): void => {
  const records = getHousingRecords();
  const existingIndex = records.findIndex(r => r.id === record.id);
  
  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

// Delete housing record
export const deleteHousingRecord = (id: string): void => {
  const records = getHousingRecords();
  const filtered = records.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// Convert HousingRecord to Hotel/Building/Tent and merge with existing mock data
export const getHotelsWithRecords = (): Hotel[] => {
  const records = getHousingRecords().filter(r => r.type === 'hotel');
  const hotels: Hotel[] = [...mockHotels];
  
  records.forEach(record => {
    const totalRooms = record.reservedRoomsBeforeHajj || Math.floor(record.housingCapacity / 3);
    const rooms: Room[] = Array.from({ length: totalRooms }, (_, i) => ({
      id: `${record.id}-room-${i + 1}`,
      roomNumber: `${i + 1}`,
      totalBeds: Math.floor(Math.random() * 3) + 2, // 2-4 beds
      beds: generateRoomBeds(
        Math.floor(Math.random() * 3) + 2,
        Math.floor(Math.random() * 3) + 1,
        `${record.id}-room-${i + 1}`
      ),
      gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'mixed',
      floor: record.numberOfFloors ? Math.floor(i / (totalRooms / record.numberOfFloors)) + 1 : undefined,
      hotelId: record.id
    }));

    const occupiedCapacity = rooms.reduce((sum, r) => sum + r.beds.filter(b => b.occupied).length, 0);

    const hotel: Hotel = {
      id: record.id,
      name: record.housingName,
      location: `${record.city === 'makkah' ? 'Makkah' : 'Madinah'}, ${record.district}`,
      totalRooms,
      totalCapacity: record.housingCapacity,
      occupiedCapacity,
      rooms,
      housingRecordId: record.id
    };
    hotels.push(hotel);
  });
  
  return hotels;
};

export const getBuildingsWithRecords = (): Building[] => {
  const records = getHousingRecords().filter(r => r.type === 'building');
  const buildings: Building[] = [...mockBuildings];
  
  records.forEach(record => {
    const totalRooms = record.reservedRoomsBeforeHajj || Math.floor(record.housingCapacity / 3);
    const floors = record.numberOfFloors || 1;
    const roomsPerFloor = Math.ceil(totalRooms / floors);
    
    const rooms: Room[] = Array.from({ length: totalRooms }, (_, i) => {
      const floor = Math.floor(i / roomsPerFloor) + 1;
      const roomOnFloor = (i % roomsPerFloor) + 1;
      return {
        id: `${record.id}-room-${i + 1}`,
        roomNumber: `${floor}${String(roomOnFloor).padStart(2, '0')}`,
        totalBeds: Math.floor(Math.random() * 3) + 2, // 2-4 beds
        beds: generateRoomBeds(
          Math.floor(Math.random() * 3) + 2,
          Math.floor(Math.random() * 3) + 1,
          `${record.id}-room-${i + 1}`
        ),
        gender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'mixed',
        floor,
        buildingId: record.id
      };
    });

    const occupiedCapacity = rooms.reduce((sum, r) => sum + r.beds.filter(b => b.occupied).length, 0);

    const building: Building = {
      id: record.id,
      name: record.housingName,
      location: `${record.city === 'makkah' ? 'Makkah' : 'Madinah'}, ${record.district}`,
      totalRooms,
      totalCapacity: record.housingCapacity,
      occupiedCapacity,
      rooms,
      floors,
      housingRecordId: record.id
    };
    buildings.push(building);
  });
  
  return buildings;
};

export const getMinaTentsWithRecords = (): Tent[] => {
  const records = getHousingRecords().filter(r => r.type === 'mina');
  const tents: Tent[] = [...mockMinaTents];
  
  // For now, we'll keep the existing mock tents
  // In a real system, you'd convert records to tents with proper bed generation
  return tents;
};

export const getArafatTentsWithRecords = (): Tent[] => {
  const records = getHousingRecords().filter(r => r.type === 'arafat');
  const tents: Tent[] = [...mockArafatTents];
  
  // For now, we'll keep the existing mock tents
  return tents;
};

