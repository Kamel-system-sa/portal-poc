import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '../../components/TransportComponent/ProtectedRoute';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { HousingStatsCard } from '../../components/HousingComponent/HousingStatsCard';
import { AddBusModal } from '../../components/TransportComponent/AddBusModal';
import { ExportImport } from '../../components/TransportComponent/ExportImport';
import { BusCard } from '../../components/TransportComponent/BusCard';
import { PassengersPopup } from '../../components/TransportComponent/PassengersPopup';
import { PassengerDetailModal } from '../../components/TransportComponent/PassengerDetailModal';
import type { Bus, Passenger } from '../../types/transport';
import { 
  CarOutlined, 
  DashboardOutlined, 
  UserOutlined, 
  ClockCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { 
  getTotalBuses, 
  getTotalTripsToday, 
  getTotalPassengers, 
  getActiveTrips,
  addBus,
  mockTransportData
} from '../../data/mockTransport';

const TransportDashboardPage: React.FC = () => {
  const { t } = useTranslation('Transport');
  const [isAddBusModalOpen, setIsAddBusModalOpen] = useState(false);
  const [passengersPopupOpen, setPassengersPopupOpen] = useState(false);
  const [passengerDetailModalOpen, setPassengerDetailModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [buses, setBuses] = useState<Bus[]>(() => {
    // Initialize with mock data
    try {
      return [...mockTransportData];
    } catch (error) {
      console.error('Error loading transport data:', error);
      return [];
    }
  });

  const handleAddBus = (newBus: Omit<Bus, 'id' | 'createdAt'>) => {
    // TODO: Replace with backend API call
    const addedBus = addBus(newBus);
    setBuses([...buses, addedBus]);
    setIsAddBusModalOpen(false);
  };

  const handleDataImported = (importedBuses: Bus[]) => {
    // TODO: Replace with backend API call
    setBuses(importedBuses);
  };

  const latestBuses = buses.length > 0 
    ? [...buses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
    : [];

  const handlePassengerClick = (bus: Bus) => {
    setSelectedBus(bus);
    setPassengersPopupOpen(true);
  };

  const handlePassengerDetailClick = (passenger: Passenger) => {
    setSelectedPassenger(passenger);
    setPassengerDetailModalOpen(true);
  };

  return (
    <ProtectedRoute requiredPermission="transport-dashboard">
      <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 overflow-x-hidden">
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Header */}
          <div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 break-words">
                  {t('dashboardTitle')}
                </h1>
                <p className="text-customgray text-sm sm:text-base break-words">
                  {t('dashboardSubtitle')}
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

          {/* Statistics Cards */}
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


          {/* Latest Records */}
          <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
            <div className="flex items-center gap-2 mb-4">
              <ClockCircleOutlined className="text-primaryColor text-xl" />
              <h3 className="text-xl font-bold text-gray-800">
                {t('latestRecords')}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestBuses.map((bus) => (
                <BusCard
                  key={bus.id}
                  bus={bus}
                  onPassengerClick={handlePassengerClick}
                />
              ))}
              {latestBuses.length === 0 && (
                <div className="col-span-full text-center py-8 text-customgray">
                  {t('noBuses')}
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Add Bus Modal */}
        <AddBusModal
          open={isAddBusModalOpen}
          onClose={() => setIsAddBusModalOpen(false)}
          onSubmit={handleAddBus}
        />

        {/* Passengers Popup */}
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

        {/* Passenger Detail Modal */}
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

export default TransportDashboardPage;

