import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/ui/HousingComponent/GlassCard';
import { RoomBedVisualizer } from '../../components/ui/HousingComponent/RoomBedVisualizer';
import { Room3DViewer } from '../../components/ui/HousingComponent/Room3DViewer';
import { HousingStatsCard } from '../../components/ui/HousingComponent/HousingStatsCard';
import { Input, Select, Button } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { mockBuildings } from '../../data/mockHousing';
import { getBuildingsWithRecords } from '../../data/housingStorage';
import type { Room } from '../../types/housing';

const { Option } = Select;

const BuildingHousingPage: React.FC = () => {
  const { t } = useTranslation('common');
  const buildings = getBuildingsWithRecords();
  const [selectedBuilding, setSelectedBuilding] = useState<string>(buildings[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    emptyRooms: false,
    gender: '' as '' | 'male' | 'female' | 'mixed',
    capacity: '' as '' | '2' | '3' | '4',
    floor: '' as string
  });
  const [selectedRoom3D, setSelectedRoom3D] = useState<Room | null>(null);

  const currentBuilding = buildings.find(b => b.id === selectedBuilding);
  const allRooms = currentBuilding?.rooms || [];
  const floors = currentBuilding?.floors || 0;

  const filteredRooms = useMemo(() => {
    return allRooms.filter((room: Room) => {
      // Search filter
      if (searchTerm && !room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Empty rooms filter
      if (filters.emptyRooms && room.beds.filter(b => b.occupied).length > 0) {
        return false;
      }

      // Gender filter
      if (filters.gender && room.gender !== filters.gender && room.gender !== 'mixed') {
        return false;
      }

      // Capacity filter
      if (filters.capacity && room.totalBeds !== parseInt(filters.capacity)) {
        return false;
      }

      // Floor filter
      if (filters.floor && room.floor?.toString() !== filters.floor) {
        return false;
      }

      return true;
    });
  }, [allRooms, searchTerm, filters]);

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('housing.buildings')}
          </h1>
          <p className="text-customgray">
            {t('housing.manageBuildingRooms')}
          </p>
        </div>

        {/* Building Selector */}
        <div className="mb-6">
          <Select
            value={selectedBuilding}
            onChange={setSelectedBuilding}
            className="w-full md:w-64"
            size="large"
          >
            {buildings.map(building => (
              <Option key={building.id} value={building.id}>
                {building.name} - {building.location}
              </Option>
            ))}
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <HousingStatsCard
            title={t('housing.totalRooms')}
            value={stats.totalRooms}
            color="mainColor"
          />
          <HousingStatsCard
            title={t('housing.occupiedRooms')}
            value={stats.occupiedRooms}
            color="primaryColor"
          />
          <HousingStatsCard
            title={t('housing.totalBeds')}
            value={stats.totalBeds}
            color="secondaryColor"
          />
          <HousingStatsCard
            title={t('housing.occupiedBeds')}
            value={stats.occupiedBeds}
            color="success"
          />
        </div>

        {/* Filters */}
        <GlassCard className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder={t('housing.searchRooms')}
              prefix={<SearchOutlined className="text-customgray" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
              size="large"
            />
            <Select
              placeholder={t('housing.filterByFloor')}
              value={filters.floor}
              onChange={(value) => setFilters(prev => ({ ...prev, floor: value }))}
              allowClear
              className="w-full md:w-32"
              size="large"
            >
              {Array.from({ length: floors }, (_, i) => (
                <Option key={i + 1} value={(i + 1).toString()}>
                  {t('housing.floor')} {i + 1}
                </Option>
              ))}
            </Select>
            <Select
              placeholder={t('housing.filterByGender')}
              value={filters.gender}
              onChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}
              allowClear
              className="w-full md:w-48"
              size="large"
            >
              <Option value="male">{t('housing.male')}</Option>
              <Option value="female">{t('housing.female')}</Option>
              <Option value="mixed">{t('housing.mixed')}</Option>
            </Select>
            <Select
              placeholder={t('housing.filterByCapacity')}
              value={filters.capacity}
              onChange={(value) => setFilters(prev => ({ ...prev, capacity: value }))}
              allowClear
              className="w-full md:w-48"
              size="large"
            >
              <Option value="2">2 {t('housing.beds')}</Option>
              <Option value="3">3 {t('housing.beds')}</Option>
              <Option value="4">4 {t('housing.beds')}</Option>
            </Select>
            <Button
              type={filters.emptyRooms ? 'primary' : 'default'}
              onClick={() => setFilters(prev => ({ ...prev, emptyRooms: !prev.emptyRooms }))}
              size="large"
            >
              {t('housing.emptyRoomsOnly')}
            </Button>
          </div>
        </GlassCard>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <GlassCard key={room.id} className="p-5 cursor-pointer hover:shadow-xl transition-all" onClick={() => setSelectedRoom3D(room)}>
              <RoomBedVisualizer
                beds={room.beds}
                roomNumber={room.roomNumber}
                totalBeds={room.totalBeds}
              />
              <div className="mt-4 pt-4 border-t border-bordergray">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-customgray">{t('housing.floor')}:</span>
                  <span className="font-semibold text-gray-800">{room.floor || t('housing.unknown')}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-customgray">{t('housing.gender')}:</span>
                  <span className="font-semibold text-gray-800 capitalize">{room.gender}</span>
                </div>
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRoom3D(room);
                  }}
                >
                  {t('housing.view3D')}
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-customgray text-lg">
              {t('housing.noRoomsFound')}
            </p>
          </div>
        )}

        {/* 3D Room Viewer */}
        {selectedRoom3D && (
          <Room3DViewer
            roomNumber={selectedRoom3D.roomNumber}
            beds={selectedRoom3D.beds}
            totalBeds={selectedRoom3D.totalBeds}
            onClose={() => setSelectedRoom3D(null)}
          />
        )}
      </div>
    </div>
  );
};

export default BuildingHousingPage;

