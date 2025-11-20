import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/ui/HousingComponent/GlassCard';
import { HousingStatsCard } from '../../components/ui/HousingComponent/HousingStatsCard';
import { AddHousingForm } from '../../components/ui/HousingComponent/AddHousingForm';
import { 
  HomeOutlined, 
  BuildOutlined, 
  ApartmentOutlined,
  TeamOutlined,
  UserOutlined,
  PlusOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { mockHotels, mockBuildings, mockMinaTents, mockArafatTents, mockPilgrims } from '../../data/mockHousing';
import { getHotelsWithRecords, getBuildingsWithRecords, saveHousingRecord } from '../../data/housingStorage';
import type { HousingRecord } from '../../types/housing';

const HousingDashboardPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Get hotels and buildings with records
  const hotels = getHotelsWithRecords();
  const buildings = getBuildingsWithRecords();

  // Calculate stats
  const totalHotels = hotels.length;
  const totalBuildings = buildings.length;
  const totalMinaTents = mockMinaTents.length;
  const totalArafatTents = mockArafatTents.length;
  
  const totalCapacity = 
    hotels.reduce((sum, h) => sum + h.totalCapacity, 0) +
    buildings.reduce((sum, b) => sum + b.totalCapacity, 0) +
    mockMinaTents.reduce((sum, t) => sum + t.totalBeds, 0) +
    mockArafatTents.reduce((sum, t) => sum + t.totalBeds, 0);
  
  const totalOccupied = 
    hotels.reduce((sum, h) => sum + h.occupiedCapacity, 0) +
    buildings.reduce((sum, b) => sum + b.occupiedCapacity, 0) +
    mockMinaTents.reduce((sum, t) => sum + t.beds.filter(b => b.occupied).length, 0) +
    mockArafatTents.reduce((sum, t) => sum + t.beds.filter(b => b.occupied).length, 0);

  const handleAddHousing = (record: HousingRecord) => {
    saveHousingRecord(record);
    setIsAddFormOpen(false);
    // Force re-render by navigating away and back, or use state management
    window.location.reload();
  };
  
  const availableBeds = totalCapacity - totalOccupied;

  const housingOptions = [
    {
      id: 'hotels',
      title: t('housing.hotels'),
      subtitle: `${totalHotels} ${t('housing.hotels')}`,
      icon: <HomeOutlined />,
      color: 'mainColor' as const,
      route: '/housing/hotels',
      description: t('housing.hotelsDescription')
    },
    {
      id: 'buildings',
      title: t('housing.buildings'),
      subtitle: `${totalBuildings} ${t('housing.buildings')}`,
      icon: <BuildOutlined />,
      color: 'primaryColor' as const,
      route: '/housing/buildings',
      description: t('housing.buildingsDescription')
    },
    {
      id: 'mina',
      title: t('housing.mina'),
      subtitle: `${totalMinaTents} ${t('housing.tents')}`,
      icon: <ApartmentOutlined />,
      color: 'secondaryColor' as const,
      route: '/housing/mina',
      description: t('housing.minaDescription')
    },
    {
      id: 'arafat',
      title: t('housing.arafat'),
      subtitle: `${totalArafatTents} ${t('housing.tents')}`,
      icon: <ApartmentOutlined />,
      color: 'success' as const,
      route: '/housing/arafat',
      description: t('housing.arafatDescription')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('housing.dashboardTitle')}
          </h1>
          <p className="text-customgray">
            {t('housing.dashboardSubtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <HousingStatsCard
            title={t('housing.totalHoused')}
            value={totalOccupied}
            subtitle={`of ${totalCapacity} capacity`}
            icon={<UserOutlined />}
            color="mainColor"
          />
          <HousingStatsCard
            title={t('housing.availableBeds')}
            value={availableBeds}
            subtitle={t('housing.readyForAssignment')}
            icon={<TeamOutlined />}
            color="success"
          />
          <HousingStatsCard
            title={t('housing.occupancyRate')}
            value={`${Math.round((totalOccupied / totalCapacity) * 100)}%`}
            subtitle={t('housing.currentUtilization')}
            icon={<HomeOutlined />}
            color="primaryColor"
          />
          <HousingStatsCard
            title={t('housing.totalPilgrims')}
            value={mockPilgrims.length}
            subtitle={t('housing.registeredPilgrims')}
            icon={<TeamOutlined />}
            color="secondaryColor"
          />
        </div>

        {/* Housing Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {housingOptions.map((option) => (
            <GlassCard
              key={option.id}
              onClick={() => navigate(option.route)}
              className="p-6 group"
            >
              <div className="flex items-start gap-4">
                <div className={`
                  w-16 h-16 rounded-2xl 
                  bg-gradient-to-br 
                  ${option.color === 'mainColor' ? 'from-mainColor to-primaryColor' : ''}
                  ${option.color === 'primaryColor' ? 'from-primaryColor to-secondaryColor' : ''}
                  ${option.color === 'secondaryColor' ? 'from-secondaryColor to-primaryColor' : ''}
                  ${option.color === 'success' ? 'from-success to-green-600' : ''}
                  flex items-center justify-center
                  shadow-lg
                  transform group-hover:scale-110 group-hover:rotate-3
                  transition-all duration-300
                `}
                style={{
                  transformStyle: 'preserve-3d',
                }}
                >
                  <div className="text-white text-2xl">
                    {option.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {option.title}
                  </h3>
                  <p className="text-sm text-customgray mb-2">
                    {option.subtitle}
                  </p>
                  <p className="text-xs text-customgray">
                    {option.description}
                  </p>
                </div>
                <div className="text-primaryColor transform group-hover:translate-x-2 transition-transform duration-300">
                  →
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t('housing.quickActions')}
            </h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsAddFormOpen(true)}
                className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors flex items-center gap-2"
              >
                <PlusOutlined />
                {t('housing.addHousingRecord')}
              </button>
              <button
                onClick={() => navigate('/housing/pilgrims')}
                className="px-4 py-2 bg-secondaryColor text-white rounded-lg hover:bg-secondaryColor/90 transition-colors"
              >
                {t('housing.viewPilgrims')}
              </button>
              <button
                onClick={() => navigate('/housing/hotels')}
                className="px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors"
              >
                {t('housing.manageHotels')}
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Add Housing Form Modal */}
      {isAddFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddFormOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <div className="flex items-center justify-between p-6 border-b border-bordergray bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                {t('housing.addHousingRecord')}
              </h2>
              <button
                onClick={() => setIsAddFormOpen(false)}
                className="p-2 text-customgray hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
              <AddHousingForm
                onCancel={() => setIsAddFormOpen(false)}
                onSubmit={handleAddHousing}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HousingDashboardPage;

