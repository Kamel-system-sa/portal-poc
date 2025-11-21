import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { RoomBedVisualizer } from '../../components/HousingComponent/RoomBedVisualizer';
import { Room3DViewer } from '../../components/HousingComponent/Room3DViewer';
import { HousingStatsCard } from '../../components/HousingComponent/HousingStatsCard';
import { PilgrimDetailsModal } from '../../components/HousingComponent/PilgrimDetailsModal';
import { MiniChartsSection } from '../../components/HousingComponent/MiniChartsSection';
import { UnifiedFilters } from '../../components/HousingComponent/UnifiedFilters';
import type { UnifiedFilterState } from '../../components/HousingComponent/UnifiedFilters';
import { HousingActionsMenu } from '../../components/HousingMenu';
import { Input, Select, Button, Modal } from 'antd';
import { EyeOutlined, HomeOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { FaBed } from 'react-icons/fa';
import { mockHotels, mockPilgrims } from '../../data/mockHousing';
import { getHotelsWithRecords } from '../../data/housingStorage';
import type { Room, Bed } from '../../types/housing';

const { Option } = Select;

const HotelHousingPage: React.FC = () => {
  const { t } = useTranslation('common');
  const hotels = getHotelsWithRecords();
  const [selectedHotel, setSelectedHotel] = useState<string>(hotels[0]?.id || '');
  const [selectedRoom3D, setSelectedRoom3D] = useState<Room | null>(null);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [selectedBedRoomInfo, setSelectedBedRoomInfo] = useState<{ type: 'room' | 'tent'; number: string; location?: string } | null>(null);
  const [showAllHotelsModal, setShowAllHotelsModal] = useState(false);
  const [unifiedFilters, setUnifiedFilters] = useState<UnifiedFilterState>({
    searchTerm: '',
    gender: 'all',
    capacity: 'all',
    emptyRooms: false,
    pilgrimName: '',
    roomNumber: '',
    nationality: 'all',
    passportNumber: '',
    organizerNumber: '',
    mobileNumber: '',
    visaNumber: '',
    enabledAdvancedFilters: {
      pilgrimName: false,
      roomNumber: false,
      nationality: false,
      passportNumber: false,
      organizerNumber: false,
      mobileNumber: false,
      visaNumber: false,
    }
  });

  const currentHotel = hotels.find(h => h.id === selectedHotel);
  const [roomsState, setRoomsState] = useState<Room[]>(currentHotel?.rooms || []);
  
  // Update rooms state when hotel changes
  useEffect(() => {
    if (currentHotel?.rooms) {
      setRoomsState(currentHotel.rooms);
    }
  }, [selectedHotel, currentHotel]);

  const allRooms = roomsState;

  const filteredRooms = useMemo(() => {
    return allRooms.filter((room: Room) => {
      // Basic search filter
      if (unifiedFilters.searchTerm && !room.roomNumber.toLowerCase().includes(unifiedFilters.searchTerm.toLowerCase())) {
        return false;
      }

      // Advanced filters - Room number
      if (unifiedFilters.enabledAdvancedFilters.roomNumber && unifiedFilters.roomNumber) {
        if (!room.roomNumber.toLowerCase().includes(unifiedFilters.roomNumber.toLowerCase())) {
          return false;
        }
      }

      // Advanced filters - Pilgrim name, nationality, gender, etc.
      if (unifiedFilters.enabledAdvancedFilters.pilgrimName || 
          unifiedFilters.enabledAdvancedFilters.nationality || 
          unifiedFilters.enabledAdvancedFilters.passportNumber ||
          unifiedFilters.enabledAdvancedFilters.organizerNumber ||
          unifiedFilters.enabledAdvancedFilters.mobileNumber ||
          unifiedFilters.enabledAdvancedFilters.visaNumber) {
        // Get pilgrims in this room
        const roomPilgrims = room.beds
          .filter(b => b.occupied && b.pilgrimId)
          .map(b => mockPilgrims.find(p => p.id === b.pilgrimId))
          .filter(Boolean);

        if (roomPilgrims.length === 0) {
          // If no pilgrims and we're filtering by pilgrim attributes, exclude this room
          if (unifiedFilters.enabledAdvancedFilters.pilgrimName || 
              unifiedFilters.enabledAdvancedFilters.nationality || 
              unifiedFilters.enabledAdvancedFilters.passportNumber ||
              unifiedFilters.enabledAdvancedFilters.organizerNumber ||
              unifiedFilters.enabledAdvancedFilters.mobileNumber ||
              unifiedFilters.enabledAdvancedFilters.visaNumber) {
            return false;
          }
        } else {
          // Check if any pilgrim matches the advanced filters
          const matchesAdvancedFilters = roomPilgrims.some(pilgrim => {
            if (!pilgrim) return false;

            if (unifiedFilters.enabledAdvancedFilters.pilgrimName && unifiedFilters.pilgrimName) {
              if (!pilgrim.name.toLowerCase().includes(unifiedFilters.pilgrimName.toLowerCase())) {
                return false;
              }
            }

            if (unifiedFilters.enabledAdvancedFilters.nationality && unifiedFilters.nationality !== 'all') {
              if (pilgrim.nationality !== unifiedFilters.nationality) {
                return false;
              }
            }

            if (unifiedFilters.enabledAdvancedFilters.mobileNumber && unifiedFilters.mobileNumber) {
              if (!pilgrim.phone?.includes(unifiedFilters.mobileNumber)) {
                return false;
              }
            }

            if (unifiedFilters.enabledAdvancedFilters.organizerNumber && unifiedFilters.organizerNumber) {
              if (!pilgrim.organizer?.toLowerCase().includes(unifiedFilters.organizerNumber.toLowerCase())) {
                return false;
              }
            }

            return true;
          });

          if (!matchesAdvancedFilters) {
            return false;
          }
        }
      }

      // Empty rooms filter
      if (unifiedFilters.emptyRooms && room.beds.filter(b => b.occupied).length > 0) {
        return false;
      }

      // Gender filter
      if (unifiedFilters.gender && unifiedFilters.gender !== 'all' && room.gender !== unifiedFilters.gender && room.gender !== 'mixed') {
        return false;
      }

      // Capacity filter
      if (unifiedFilters.capacity && unifiedFilters.capacity !== 'all' && room.totalBeds !== parseInt(unifiedFilters.capacity)) {
        return false;
      }

      return true;
    });
  }, [allRooms, unifiedFilters]);

  const stats = useMemo(() => {
    const totalRooms = allRooms.length;
    const occupiedRooms = allRooms.filter(r => r.beds.some(b => b.occupied)).length;
    const totalBeds = allRooms.reduce((sum, r) => sum + r.totalBeds, 0);
    const occupiedBeds = allRooms.reduce((sum, r) => sum + r.beds.filter(b => b.occupied).length, 0);
    return { totalRooms, occupiedRooms, totalBeds, occupiedBeds };
  }, [allRooms]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t('housing.hotels')} — {t('housing.managementAndBedAssignment')}
            </h1>
            <p className="text-customgray">
              {t('housing.manageHotelRooms')}
            </p>
          </div>
          <HousingActionsMenu type="hotel" />
        </div>

        {/* Hotel Selector */}
        <GlassCard className="p-5 mb-6 border-2 border-bordergray/50">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t('housing.selectHotel')}
              </label>
              <Select
                value={selectedHotel}
                onChange={setSelectedHotel}
                className="w-full"
                size="large"
                placeholder={t('housing.selectHotel')}
                style={{ 
                  borderColor: '#E5E7EB',
                }}
              >
                {hotels.map(hotel => (
                  <Option key={hotel.id} value={hotel.id}>
                    {hotel.name} - {hotel.location}
                  </Option>
                ))}
              </Select>
            </div>
            <button
              type="button"
              className="h-10 px-4 rounded-lg bg-primaryColor text-white hover:bg-primaryColor/90 border-2 border-primaryColor font-medium transition-all duration-200 flex items-center gap-2"
              onClick={() => setShowAllHotelsModal(true)}
            >
              <UnorderedListOutlined />
              {t('housing.showAllHotels')}
            </button>
          </div>
        </GlassCard>

        {/* Stats Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <HousingStatsCard
            title={t('housing.totalRooms')}
            value={stats.totalRooms}
            color="mainColor"
            icon={<HomeOutlined />}
          />
          <HousingStatsCard
            title={t('housing.occupiedRooms')}
            value={stats.occupiedRooms}
            color="primaryColor"
            icon={<HomeOutlined />}
          />
          <HousingStatsCard
            title={t('housing.totalBeds')}
            value={stats.totalBeds}
            color="secondaryColor"
            icon={<FaBed />}
          />
          <HousingStatsCard
            title={t('housing.occupiedBeds')}
            value={stats.occupiedBeds}
            color="success"
            icon={<UserOutlined />}
          />
        </div>

        {/* Mini Charts Section */}
        <MiniChartsSection type="hotel" roomsOrTents={allRooms} />

        {/* Unified Filters */}
        <UnifiedFilters type="hotel" onFilterChange={setUnifiedFilters} />

        {/* Rooms Grid */}
        {filteredRooms.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-customgray">
              {t('housing.showingResults')} {filteredRooms.length} {t('housing.of')} {allRooms.length} {t('housing.totalRooms')}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <GlassCard key={room.id} className="p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[420px]">
              <div className="flex-1 flex flex-col">
                <RoomBedVisualizer
                  beds={room.beds}
                  roomNumber={room.roomNumber}
                  totalBeds={room.totalBeds}
                  onBedClick={(bed) => {
                    setSelectedBed(bed);
                    setSelectedBedRoomInfo({
                      type: 'room',
                      number: room.roomNumber,
                      location: currentHotel?.name
                    });
                  }}
                />
                <div className="mt-4 pt-4 border-t border-bordergray flex-1 flex flex-col">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-customgray">{t('housing.roomNumber')}:</span>
                      <span className="font-semibold text-gray-800">{room.roomNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-customgray">{t('housing.floor')}:</span>
                      <span className="font-semibold text-gray-800">{room.floor || t('housing.unknown')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-customgray">{t('housing.gender')}:</span>
                      <span className="font-semibold text-gray-800 capitalize">{t(`housing.${room.gender}`)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-customgray">{t('housing.capacity')}:</span>
                      <span className="font-semibold text-gray-800">{room.totalBeds} {t('housing.beds')}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-primaryColor to-secondaryColor text-white hover:from-primaryColor/90 hover:to-secondaryColor/90 border-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoom3D(room);
                    }}
                  >
                    <EyeOutlined />
                    {t('housing.view3D')}
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* 3D Room Viewer */}
        {selectedRoom3D && (
          <Room3DViewer
            roomNumber={selectedRoom3D.roomNumber}
            beds={selectedRoom3D.beds}
            totalBeds={selectedRoom3D.totalBeds}
            onClose={() => setSelectedRoom3D(null)}
          />
        )}

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-customgray text-lg">
              {t('housing.noRoomsFound')}
            </p>
          </div>
        )}

        {/* Show All Hotels Modal */}
        <Modal
          title={t('housing.showAllHotels')}
          open={showAllHotelsModal}
          onCancel={() => setShowAllHotelsModal(false)}
          footer={null}
          width={800}
          className="housing-modal"
        >
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {hotels.map((hotel) => (
              <GlassCard
                key={hotel.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => {
                  setSelectedHotel(hotel.id);
                  setShowAllHotelsModal(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{hotel.name}</h3>
                    <p className="text-sm text-customgray">{hotel.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{hotel.rooms?.length || 0} {t('housing.totalRooms')}</p>
                    <p className="text-xs text-customgray">{hotel.totalCapacity || 0} {t('housing.totalBeds')}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </Modal>
      </div>

      {/* Pilgrim Details Modal */}
      <PilgrimDetailsModal
        bed={selectedBed}
        open={!!selectedBed}
        onClose={() => {
          setSelectedBed(null);
          setSelectedBedRoomInfo(null);
        }}
        onAssign={(bed, pilgrimId) => {
          // Update the bed in the rooms state
          const pilgrim = mockPilgrims.find(p => p.id === pilgrimId);
          if (pilgrim && selectedBedRoomInfo) {
            setRoomsState(prevRooms => 
              prevRooms.map(room => {
                if (room.roomNumber === selectedBedRoomInfo.number) {
                  return {
                    ...room,
                    beds: room.beds.map(b => 
                      b.id === bed.id 
                        ? {
                            ...b,
                            occupied: true,
                            pilgrimId: pilgrim.id,
                            pilgrimName: pilgrim.name,
                            pilgrimGender: pilgrim.gender
                          }
                        : b
                    )
                  };
                }
                return room;
              })
            );
          }
        }}
        roomOrTentInfo={selectedBedRoomInfo || undefined}
      />
    </div>
  );
};

export default HotelHousingPage;

