import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { HousingStatsCard } from '../../components/HousingComponent/HousingStatsCard';
import { AddHousingForm } from '../../components/HousingComponent/AddHousingForm';
import { 
  HomeOutlined, 
  BuildOutlined, 
  ApartmentOutlined,
  TeamOutlined,
  UserOutlined,
  PlusOutlined,
  CloseOutlined,
  BarChartOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  SafetyOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  AppstoreOutlined,
  CheckSquareOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { FaCampground, FaHotel, FaBuilding } from 'react-icons/fa';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockHotels, mockBuildings, mockMinaTents, mockArafatTents, mockPilgrims } from '../../data/mockHousing';
import { getHotelsWithRecords, getBuildingsWithRecords, saveHousingRecord } from '../../data/housingStorage';
import type { HousingRecord } from '../../types/housing';

const COLORS = {
  primary: '#00796B',
  secondary: '#00A896',
  accent: '#005B4F',
  teal: '#4DB6AC',
  amber: '#FFB74D',
  cyan: '#26A69A',
};

const HousingDashboardPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Get hotels and buildings with records
  const hotels = getHotelsWithRecords();
  const buildings = getBuildingsWithRecords();

  // Calculate Mina stats
  const minaStats = useMemo(() => {
    const totalTents = mockMinaTents.length;
    const totalBeds = mockMinaTents.reduce((sum, t) => sum + t.totalBeds, 0);
    const occupiedBeds = mockMinaTents.reduce((sum, t) => sum + t.beds.filter(b => b.occupied).length, 0);
    const availableBeds = totalBeds - occupiedBeds;
    return { totalTents, totalBeds, occupiedBeds, availableBeds };
  }, []);

  // Calculate Arafat stats
  const arafatStats = useMemo(() => {
    const totalTents = mockArafatTents.length;
    const totalBeds = mockArafatTents.reduce((sum, t) => sum + t.totalBeds, 0);
    const occupiedBeds = mockArafatTents.reduce((sum, t) => sum + t.beds.filter(b => b.occupied).length, 0);
    const availableBeds = totalBeds - occupiedBeds;
    return { totalTents, totalBeds, occupiedBeds, availableBeds };
  }, []);

  // Calculate Hotels stats
  const hotelsStats = useMemo(() => {
    const totalHotels = hotels.length;
    const totalRooms = hotels.reduce((sum, h) => sum + h.totalRooms, 0);
    const totalBeds = hotels.reduce((sum, h) => sum + h.totalCapacity, 0);
    const occupiedBeds = hotels.reduce((sum, h) => sum + h.occupiedCapacity, 0);
    const availableBeds = totalBeds - occupiedBeds;
    return { totalHotels, totalRooms, totalBeds, occupiedBeds, availableBeds };
  }, [hotels]);

  // Calculate Buildings stats
  const buildingsStats = useMemo(() => {
    const totalBuildings = buildings.length;
    const totalRooms = buildings.reduce((sum, b) => sum + b.totalRooms, 0);
    const totalBeds = buildings.reduce((sum, b) => sum + b.totalCapacity, 0);
    const occupiedBeds = buildings.reduce((sum, b) => sum + b.occupiedCapacity, 0);
    const availableBeds = totalBeds - occupiedBeds;
    return { totalBuildings, totalRooms, totalBeds, occupiedBeds, availableBeds };
  }, [buildings]);

  // Makkah vs Madinah stats
  const cityStats = useMemo(() => {
    const makkahHotels = hotels.filter(h => h.location.toLowerCase().includes('makkah')).length;
    const madinahHotels = hotels.filter(h => h.location.toLowerCase().includes('madinah')).length;
    const makkahBuildings = buildings.filter(b => b.location.toLowerCase().includes('makkah')).length;
    const madinahBuildings = buildings.filter(b => b.location.toLowerCase().includes('madinah')).length;
    
    const makkahRooms = hotels
      .filter(h => h.location.toLowerCase().includes('makkah'))
      .reduce((sum, h) => sum + h.totalRooms, 0) +
      buildings
      .filter(b => b.location.toLowerCase().includes('makkah'))
      .reduce((sum, b) => sum + b.totalRooms, 0);
    
    const madinahRooms = hotels
      .filter(h => h.location.toLowerCase().includes('madinah'))
      .reduce((sum, h) => sum + h.totalRooms, 0) +
      buildings
      .filter(b => b.location.toLowerCase().includes('madinah'))
      .reduce((sum, b) => sum + b.totalRooms, 0);

    const makkahOccupied = hotels
      .filter(h => h.location.toLowerCase().includes('makkah'))
      .reduce((sum, h) => sum + h.occupiedCapacity, 0) +
      buildings
      .filter(b => b.location.toLowerCase().includes('makkah'))
      .reduce((sum, b) => sum + b.occupiedCapacity, 0);
    
    const madinahOccupied = hotels
      .filter(h => h.location.toLowerCase().includes('madinah'))
      .reduce((sum, h) => sum + h.occupiedCapacity, 0) +
      buildings
      .filter(b => b.location.toLowerCase().includes('madinah'))
      .reduce((sum, b) => sum + b.occupiedCapacity, 0);

    const makkahAvailable = hotels
      .filter(h => h.location.toLowerCase().includes('makkah'))
      .reduce((sum, h) => sum + (h.totalCapacity - h.occupiedCapacity), 0) +
      buildings
      .filter(b => b.location.toLowerCase().includes('makkah'))
      .reduce((sum, b) => sum + (b.totalCapacity - b.occupiedCapacity), 0);

    const madinahAvailable = hotels
      .filter(h => h.location.toLowerCase().includes('madinah'))
      .reduce((sum, h) => sum + (h.totalCapacity - h.occupiedCapacity), 0) +
      buildings
      .filter(b => b.location.toLowerCase().includes('madinah'))
      .reduce((sum, b) => sum + (b.totalCapacity - b.occupiedCapacity), 0);

    return {
      makkah: { hotels: makkahHotels, buildings: makkahBuildings, rooms: makkahRooms, occupied: makkahOccupied, available: makkahAvailable },
      madinah: { hotels: madinahHotels, buildings: madinahBuildings, rooms: madinahRooms, occupied: madinahOccupied, available: madinahAvailable }
    };
  }, [hotels, buildings]);


  // Pilgrim Preferences mock data (only hotels)
  const pilgrimPreferences = useMemo(() => ({
    totalWithPreferences: 120,
    preferHotels: 20,
    preferHotelsDetails: {
      nearHaram: 8,
      nearSafa: 5,
      luxury: 4,
      budget: 3
    },
    withSpecialNotes: 25
  }), []);

  // Field Inspection Reports mock data
  const inspectionReports = useMemo(() => ({
    noIssues: 34,
    mediumIssues: 12,
    criticalIssues: 4
  }), []);

  // Pilgrim Preferences chart data (only hotels with details)
  const preferencesChartData = useMemo(() => [
    { name: t('housing.preferHotels') + ' - ' + t('housing.nearHaram'), value: pilgrimPreferences.preferHotelsDetails.nearHaram, color: COLORS.primary },
    { name: t('housing.preferHotels') + ' - ' + t('housing.nearSafa'), value: pilgrimPreferences.preferHotelsDetails.nearSafa, color: COLORS.secondary },
    { name: t('housing.preferHotels') + ' - ' + t('housing.luxury'), value: pilgrimPreferences.preferHotelsDetails.luxury, color: COLORS.teal },
    { name: t('housing.preferHotels') + ' - ' + t('housing.budget'), value: pilgrimPreferences.preferHotelsDetails.budget, color: COLORS.amber },
  ], [pilgrimPreferences, t]);

  // Inspection Reports chart data
  const inspectionChartData = useMemo(() => [
    { name: t('housing.noIssues'), value: inspectionReports.noIssues, color: COLORS.secondary },
    { name: t('housing.mediumIssues'), value: inspectionReports.mediumIssues, color: COLORS.amber },
    { name: t('housing.criticalIssues'), value: inspectionReports.criticalIssues, color: '#EF4444' },
  ], [inspectionReports, t]);

  // Chart data for Mina
  const minaChartData = useMemo(() => [
    { name: t('housing.occupiedBeds'), value: minaStats.occupiedBeds, color: COLORS.primary },
    { name: t('housing.availableBeds'), value: minaStats.availableBeds, color: COLORS.secondary },
  ], [minaStats, t]);

  // Chart data for Arafat
  const arafatChartData = useMemo(() => [
    { name: t('housing.occupiedBeds'), value: arafatStats.occupiedBeds, color: COLORS.primary },
    { name: t('housing.availableBeds'), value: arafatStats.availableBeds, color: COLORS.secondary },
  ], [arafatStats, t]);

  // Chart data for Hotels
  const hotelsChartData = useMemo(() => [
    { name: t('housing.occupiedBeds'), value: hotelsStats.occupiedBeds, color: COLORS.primary },
    { name: t('housing.availableBeds'), value: hotelsStats.availableBeds, color: COLORS.secondary },
  ], [hotelsStats, t]);

  // Chart data for Buildings
  const buildingsChartData = useMemo(() => [
    { name: t('housing.occupiedBeds'), value: buildingsStats.occupiedBeds, color: COLORS.primary },
    { name: t('housing.availableBeds'), value: buildingsStats.availableBeds, color: COLORS.secondary },
  ], [buildingsStats, t]);

  // City comparison chart data
  const cityChartData = useMemo(() => [
    { name: t('housing.makkah'), occupied: cityStats.makkah.occupied, available: cityStats.makkah.available, color: COLORS.primary },
    { name: t('housing.madinah'), occupied: cityStats.madinah.occupied, available: cityStats.madinah.available, color: COLORS.secondary },
  ], [cityStats, t]);

  const handleAddHousing = (record: HousingRecord) => {
    saveHousingRecord(record);
    setIsAddFormOpen(false);
    window.location.reload();
  };

  // Improved Section Component
  const SectionCard = ({ 
    title, 
    stats, 
    chartData, 
    icon, 
    route,
    type 
  }: { 
    title: string; 
    stats: any; 
    chartData: any[]; 
    icon: React.ReactNode;
    route: string;
    type: 'hotel' | 'building' | 'mina' | 'arafat';
  }) => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col" onClick={() => navigate(route)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {icon}
            {title}
          </h3>
          <span className="text-primaryColor transform hover:translate-x-1 transition-transform text-xl">→</span>
        </div>

        {/* KPIs Row */}
        <div className={`grid gap-3 mb-4 ${type === 'hotel' || type === 'building' ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {type === 'hotel' || type === 'building' ? (
            <>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-bordergray">
                <div className="text-xl font-bold text-primaryColor">{stats.totalHotels || stats.totalBuildings}</div>
                <div className="text-xs text-customgray mt-1">{type === 'hotel' ? t('housing.hotels') : t('housing.buildings')}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-bordergray">
                <div className="text-xl font-bold text-primaryColor">{stats.totalRooms}</div>
                <div className="text-xs text-customgray mt-1">{t('housing.totalRooms')}</div>
              </div>
            </>
          ) : (
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-bordergray">
              <div className="text-xl font-bold text-primaryColor">{stats.totalTents}</div>
              <div className="text-xs text-customgray mt-1">{t('housing.totalTents')}</div>
            </div>
          )}
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-bordergray">
            <div className="text-xl font-bold text-primaryColor">{stats.totalBeds}</div>
            <div className="text-xs text-customgray mt-1">{t('housing.totalBeds')}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-bordergray">
            <div className="text-xl font-bold text-secondaryColor">{stats.occupiedBeds}</div>
            <div className="text-xs text-customgray mt-1">{t('housing.occupiedBeds')}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-bordergray">
            <div className="text-xl font-bold text-success">{stats.availableBeds}</div>
            <div className="text-xs text-customgray mt-1">{t('housing.availableBeds')}</div>
          </div>
        </div>

        {/* Chart with Legend */}
        <div className="flex gap-4 items-center flex-1">
          <div className="flex-1" style={{ height: '200px', minHeight: '200px' }}>
            <ResponsiveContainer width="100%" height={200} minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={65}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {chartData.map((item, index) => {
              const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: item.color }}></div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-700">{item.name}</div>
                    <div className="text-xs text-customgray">{item.value} ({percentage}%)</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 overflow-x-hidden">
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 break-words">
                {t('housing.dashboardTitle')}
              </h1>
              <p className="text-customgray text-sm sm:text-base break-words">
                {t('housing.dashboardSubtitle')}
              </p>
            </div>
            
            {/* Quick Actions */}
            <GlassCard className="p-3 sm:p-4 lg:p-5 flex-shrink-0 w-full lg:w-auto">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(true)}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-primaryColor to-primaryColor/90 text-white rounded-xl hover:shadow-lg hover:shadow-primaryColor/30 transition-all duration-200 flex items-center gap-2 font-medium text-xs sm:text-sm flex-1 sm:flex-initial"
                >
                  <PlusOutlined />
                  <span className="hidden sm:inline">{t('housing.addHousingRecord')}</span>
                  <span className="sm:hidden">{t('housing.addHousingRecord')}</span>
                </button>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          <HousingStatsCard
            title={t('housing.totalHousing')}
            value={hotelsStats.totalHotels + buildingsStats.totalBuildings}
            icon={<HomeOutlined />}
            color="mainColor"
          />
          <HousingStatsCard
            title={t('housing.totalCapacity')}
            value={hotelsStats.totalBeds + buildingsStats.totalBeds}
            icon={<AppstoreOutlined />}
            color="primaryColor"
          />
          <HousingStatsCard
            title={t('housing.makkah') + ' (' + t('housing.hotels') + ' & ' + t('housing.buildings') + ')'}
            value={cityStats.makkah.hotels + cityStats.makkah.buildings}
            icon={<BuildOutlined />}
            color="secondaryColor"
          />
          <HousingStatsCard
            title={t('housing.madinah') + ' (' + t('housing.hotels') + ' & ' + t('housing.buildings') + ')'}
            value={cityStats.madinah.hotels + cityStats.madinah.buildings}
            icon={<ApartmentOutlined />}
            color="success"
          />
        </div>

        {/* 2x2 Grid: Hotels, Buildings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {/* Row 1: Hotels */}
          <SectionCard
            title={t('housing.hotels')}
            stats={hotelsStats}
            chartData={hotelsChartData}
            icon={<FaHotel className="text-primaryColor text-xl" />}
            route="/housing/hotels"
            type="hotel"
          />

          {/* Row 1: Buildings */}
          <SectionCard
            title={t('housing.buildings')}
            stats={buildingsStats}
            chartData={buildingsChartData}
            icon={<FaBuilding className="text-primaryColor text-xl" />}
            route="/housing/buildings"
            type="building"
          />
        </div>

        {/* Makkah vs Madinah Housing Overview */}
        <div className="mb-8">
          <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChartOutlined className="text-primaryColor text-xl" />
              {t('housing.makkahVsMadinah')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-5 rounded-lg border" style={{ background: 'linear-gradient(to bottom right, rgba(0, 121, 107, 0.1), rgba(0, 121, 107, 0.05))', borderColor: 'rgba(0, 121, 107, 0.2)' }}>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.primary }}></span>
                  {t('housing.makkah')}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-primaryColor">{cityStats.makkah.hotels}</div>
                    <div className="text-xs text-customgray mt-1">{t('housing.hotels')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primaryColor">{cityStats.makkah.buildings}</div>
                    <div className="text-xs text-customgray mt-1">{t('housing.buildings')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primaryColor">{cityStats.makkah.rooms}</div>
                    <div className="text-xs text-customgray mt-1">{t('housing.totalRooms')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondaryColor">{cityStats.makkah.occupied}</div>
                    <div className="text-xs text-customgray mt-1">{t('housing.occupiedBeds')}</div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-lg border" style={{ background: 'linear-gradient(to bottom right, rgba(0, 168, 150, 0.1), rgba(0, 168, 150, 0.05))', borderColor: 'rgba(0, 168, 150, 0.2)' }}>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.secondary }}></span>
                  {t('housing.madinah')}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-secondaryColor">{cityStats.madinah.hotels}</div>
                    <div className="text-xs text-customgray mt-1">{t('housing.hotels')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondaryColor">{cityStats.madinah.buildings}</div>
                    <div className="text-xs text-customgray mt-1">{t('housing.buildings')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondaryColor">{cityStats.madinah.rooms}</div>
                    <div className="text-xs text-customgray mt-1">{t('housing.totalRooms')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primaryColor">{cityStats.madinah.occupied}</div>
                    <div className="text-xs text-customgray mt-1">{t('housing.occupiedBeds')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-6 items-center">
              <div className="flex-1" style={{ height: '250px', minHeight: '250px' }}>
                <ResponsiveContainer width="100%" height={250} minWidth={0} minHeight={0}>
                  <BarChart data={cityChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="occupied" fill={COLORS.primary} name={t('housing.occupiedBeds')} />
                    <Bar dataKey="available" fill={COLORS.secondary} name={t('housing.availableBeds')} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {cityChartData.map((item, index) => {
                  const total = item.occupied + item.available;
                  const occupiedPct = total > 0 ? Math.round((item.occupied / total) * 100) : 0;
                  const availablePct = total > 0 ? Math.round((item.available / total) * 100) : 0;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="text-sm font-semibold text-gray-700 mb-2">{item.name}</div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.primary }}></div>
                        <div className="flex-1">
                          <div className="text-xs text-customgray">{t('housing.occupiedBeds')}: {item.occupied} ({occupiedPct}%)</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.secondary }}></div>
                        <div className="flex-1">
                          <div className="text-xs text-customgray">{t('housing.availableBeds')}: {item.available} ({availablePct}%)</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Pilgrim Preferences & Field Inspection Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pilgrim Preferences Section */}
          <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <HeartOutlined className="text-primaryColor text-xl" />
              {t('housing.pilgrimPreferences')}
            </h3>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-primaryColor/10 to-primaryColor/5 rounded-lg border border-primaryColor/20">
                <div className="text-2xl font-bold text-primaryColor mb-1">{pilgrimPreferences.totalWithPreferences}</div>
                <div className="text-xs text-customgray">{t('housing.pilgrimsWithPreferences')}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-secondaryColor/10 to-secondaryColor/5 rounded-lg border border-secondaryColor/20">
                <div className="text-2xl font-bold text-secondaryColor mb-1">{pilgrimPreferences.withSpecialNotes}</div>
                <div className="text-xs text-customgray">{t('housing.withSpecialNotes')}</div>
              </div>
            </div>

            {/* Chart with Legend */}
            <div className="flex gap-4 items-center">
              <div className="flex-1" style={{ height: '180px', minHeight: '180px' }}>
                <ResponsiveContainer width="100%" height={180} minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie
                      data={preferencesChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      dataKey="value"
                    >
                      {preferencesChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {preferencesChartData.map((item, index) => {
                  const total = preferencesChartData.reduce((sum, d) => sum + d.value, 0);
                  const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-700">{item.name}</div>
                        <div className="text-xs text-customgray">{item.value} ({percentage}%)</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>

          {/* Field Inspection Reports Section */}
          <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <SafetyOutlined className="text-primaryColor text-xl" />
              {t('housing.fieldInspectionReports')}
            </h3>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-4 bg-gradient-to-br from-secondaryColor/10 to-secondaryColor/5 rounded-lg border border-secondaryColor/20 text-center">
                <CheckCircleOutlined className="text-secondaryColor text-2xl mx-auto mb-2" />
                <div className="text-xl font-bold text-secondaryColor mb-1">{inspectionReports.noIssues}</div>
                <div className="text-xs text-customgray">{t('housing.noIssues')}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg border border-amber-200 text-center">
                <WarningOutlined className="text-amber-600 text-2xl mx-auto mb-2" />
                <div className="text-xl font-bold text-amber-600 mb-1">{inspectionReports.mediumIssues}</div>
                <div className="text-xs text-customgray">{t('housing.mediumIssues')}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-100 to-red-50 rounded-lg border border-red-200 text-center">
                <ExclamationCircleOutlined className="text-red-600 text-2xl mx-auto mb-2" />
                <div className="text-xl font-bold text-red-600 mb-1">{inspectionReports.criticalIssues}</div>
                <div className="text-xs text-customgray">{t('housing.criticalIssues')}</div>
              </div>
            </div>

            {/* Chart with Legend */}
            <div className="flex gap-4 items-center">
              <div className="flex-1" style={{ height: '180px', minHeight: '180px' }}>
                <ResponsiveContainer width="100%" height={180} minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie
                      data={inspectionChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      dataKey="value"
                    >
                      {inspectionChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {inspectionChartData.map((item, index) => {
                  const total = inspectionChartData.reduce((sum, d) => sum + d.value, 0);
                  const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-700">{item.name}</div>
                        <div className="text-xs text-customgray">{item.value} ({percentage}%)</div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
          <div className="relative w-full max-w-7xl max-h-[95vh] bg-white rounded-xl shadow-2xl overflow-hidden z-10">
            <div className="flex items-center justify-between p-6 border-b border-bordergray bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-800">
                {t('housing.addHousingRecord')}
              </h2>
              <button
                onClick={() => setIsAddFormOpen(false)}
                className="p-2 text-customgray hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
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
