import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '../../components/TransportComponent/ProtectedRoute';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { HousingStatsCard } from '../../components/HousingComponent/HousingStatsCard';
import { BusCard } from '../../components/TransportComponent/BusCard';
import { AddBusModal } from '../../components/TransportComponent/AddBusModal';
import { PassengersPopup } from '../../components/TransportComponent/PassengersPopup';
import { PassengerDetailModal } from '../../components/TransportComponent/PassengerDetailModal';
import { ExportImport } from '../../components/TransportComponent/ExportImport';
import { PlusOutlined, CarOutlined, DashboardOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { 
  mockTransportData, 
  addBus,
  getTotalBuses,
  getTotalTripsToday,
  getTotalPassengers,
  getActiveTrips
} from '../../data/mockTransport';
import type { Bus, Passenger } from '../../types/transport';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const TransferInfoPage: React.FC = () => {
  const { t } = useTranslation('Transport');
  const [buses, setBuses] = useState<Bus[]>(() => {
    // Initialize with mock data
    try {
      return [...mockTransportData];
    } catch (error) {
      console.error('Error loading transport data:', error);
      return [];
    }
  });
  const [isAddBusModalOpen, setIsAddBusModalOpen] = useState(false);
  const [passengersPopupOpen, setPassengersPopupOpen] = useState(false);
  const [passengerDetailModalOpen, setPassengerDetailModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);

  const handleAddBus = (newBus: Omit<Bus, 'id' | 'createdAt'>) => {
    // TODO: Replace with backend API call
    const addedBus = addBus(newBus);
    setBuses([...buses, addedBus]);
    setIsAddBusModalOpen(false);
  };

  const handlePassengerClick = (bus: Bus) => {
    setSelectedBus(bus);
    setPassengersPopupOpen(true);
  };

  const handlePassengerDetailClick = (passenger: Passenger) => {
    setSelectedPassenger(passenger);
    setPassengerDetailModalOpen(true);
  };

  const handleDataImported = (importedBuses: Bus[]) => {
    // TODO: Replace with backend API call
    setBuses(importedBuses);
  };

  const handleBusUpdate = (updatedBus: Bus) => {
    // TODO: Replace with backend API call
    const updatedBuses = buses.map(b => b.id === updatedBus.id ? updatedBus : b);
    setBuses(updatedBuses);
  };

  // Chart data for passenger distribution by route
  const chartData = useMemo(() => {
    const routeMap: Record<string, number> = {};
    buses.forEach(bus => {
      if (!routeMap[bus.route]) {
        routeMap[bus.route] = 0;
      }
      routeMap[bus.route] += bus.passengers.length;
    });
    const distribution = Object.entries(routeMap).map(([route, count]) => ({
      route,
      count
    }));
    const COLORS = ['#00796B', '#00A896', '#4DB6AC', '#FFB74D', '#EF4444', '#9C27B0'];
    
    return distribution.map((item, index) => ({
      name: item.route,
      value: item.count,
      fill: COLORS[index % COLORS.length]
    }));
  }, [buses]);


  return (
    <ProtectedRoute requiredPermission="transport-transfer-info">
      <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 overflow-x-hidden">
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Header */}
          <div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 break-words">
                  {t('transferInfo')}
                </h1>
                <p className="text-customgray text-sm sm:text-base break-words">
                  {t('transferInfoSubtitle')}
                </p>
              </div>
              {/* Add Button & Actions */}
              <GlassCard className="p-3 sm:p-4 lg:p-5 flex-shrink-0 w-full lg:w-auto">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddBusModalOpen(true)}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-primaryColor to-primaryColor/90 text-white rounded-xl hover:shadow-lg hover:shadow-primaryColor/30 transition-all duration-200 flex items-center gap-2 font-medium text-xs sm:text-sm flex-1 sm:flex-initial"
                  >
                    <PlusOutlined />
                    <span>{t('addBus')}</span>
                  </button>
                  <ExportImport onDataImported={handleDataImported} />
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Dashboard Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 items-stretch">
            <HousingStatsCard
              title={t('totalBuses')}
              value={getTotalBuses()}
              icon={<CarOutlined />}
              color="mainColor"
            />
            <HousingStatsCard
              title={t('totalTripsToday')}
              value={getTotalTripsToday()}
              icon={<ClockCircleOutlined />}
              color="primaryColor"
            />
            <HousingStatsCard
              title={t('totalPassengers')}
              value={getTotalPassengers()}
              icon={<UserOutlined />}
              color="secondaryColor"
            />
            <HousingStatsCard
              title={t('activeTrips')}
              value={getActiveTrips()}
              icon={<DashboardOutlined />}
              color="success"
            />
          </div>

          {/* Chart Section */}
          <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {t('passengerDistribution')}
            </h3>
            {chartData.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div style={{ height: '300px', minHeight: '300px' }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ percent }: { percent?: number }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {chartData.map((item, index) => {
                    const total = chartData.reduce((sum, d) => sum + d.value, 0);
                    const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: item.fill }}
                          ></div>
                          <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                        </div>
                        <div className="text-sm text-customgray">
                          {item.value} ({percentage}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-customgray">
                {t('noData')}
              </div>
            )}
          </GlassCard>

          {/* Bus Cards Grid */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('allBuses') || 'All Buses'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {buses.map((bus) => (
                <BusCard
                  key={bus.id}
                  bus={bus}
                  onPassengerClick={handlePassengerClick}
                  onBusUpdate={handleBusUpdate}
                />
              ))}
              {buses.length === 0 && (
                <div className="col-span-full text-center py-12 text-customgray">
                  {t('noBuses')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddBusModal
          open={isAddBusModalOpen}
          onClose={() => setIsAddBusModalOpen(false)}
          onSubmit={handleAddBus}
        />

        {selectedBus && (
          <PassengersPopup
            open={passengersPopupOpen}
            onClose={() => {
              setPassengersPopupOpen(false);
              setSelectedBus(null);
            }}
            passengers={selectedBus.passengers}
            onPassengerClick={handlePassengerDetailClick}
          />
        )}

        <PassengerDetailModal
          open={passengerDetailModalOpen}
          onClose={() => {
            setPassengerDetailModalOpen(false);
            setSelectedPassenger(null);
          }}
          passenger={selectedPassenger}
        />
      </div>
    </ProtectedRoute>
  );
};

export default TransferInfoPage;

