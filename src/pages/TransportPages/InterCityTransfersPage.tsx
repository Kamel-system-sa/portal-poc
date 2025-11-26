import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '../../components/TransportComponent/ProtectedRoute';
import { TransferCard } from '../../components/TransportComponent/TransferCard';
import { BusDetailsModal } from '../../components/TransportComponent/BusDetailsModal';
import { HousingStatsCard } from '../../components/HousingComponent/HousingStatsCard';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { mockCityTransfers } from '../../data/mockTransfers';
import type { CityTransfer, CityTransferBus } from '../../types/transport';
import { UserOutlined, CarOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const InterCityTransfersPage: React.FC = () => {
  const { t } = useTranslation('Transport');
  const [transfers, setTransfers] = useState<CityTransfer[]>(mockCityTransfers);
  const [selectedCity, setSelectedCity] = useState<'all' | 'Makkah' | 'Madinah' | 'Jeddah'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'arrived' | 'not_arrived'>('all');
  const [selectedBus, setSelectedBus] = useState<CityTransferBus | null>(null);
  const [isBusDetailsOpen, setIsBusDetailsOpen] = useState(false);

  // Filter transfers by starting city and arrival status
  const filteredTransfers = useMemo(() => {
    let filtered = transfers;

    // Filter by city
    if (selectedCity !== 'all') {
      filtered = filtered.filter(transfer => transfer.fromCity === selectedCity);
    }

    // Filter by arrival status
    if (selectedStatus !== 'all') {
      filtered = filtered.map(transfer => ({
        ...transfer,
        buses: transfer.buses.filter(bus => bus.arrivalStatus === selectedStatus)
      })).filter(transfer => transfer.buses.length > 0);
    }

    return filtered;
  }, [transfers, selectedCity, selectedStatus]);

  // Calculate statistics
  const stats = useMemo(() => {
    const allBuses = filteredTransfers.flatMap(t => t.buses);
    const totalPassengers = allBuses.reduce((sum, bus) => sum + bus.passengerCount, 0);
    const arrivedPassengers = allBuses
      .filter(bus => bus.arrivalStatus === 'arrived')
      .reduce((sum, bus) => sum + bus.passengerCount, 0);
    const remainingPassengers = totalPassengers - arrivedPassengers;
    
    const totalBuses = allBuses.length;
    const arrivedBuses = allBuses.filter(bus => bus.arrivalStatus === 'arrived').length;
    const remainingBuses = totalBuses - arrivedBuses;

    return {
      totalPassengers,
      arrivedPassengers,
      remainingPassengers,
      totalBuses,
      arrivedBuses,
      remainingBuses
    };
  }, [filteredTransfers]);

  const handleBusDetailsClick = (busId: string) => {
    // Find the bus in all transfers
    for (const transfer of transfers) {
      const bus = transfer.buses.find(b => b.id === busId);
      if (bus) {
        setSelectedBus(bus);
        setIsBusDetailsOpen(true);
        break;
      }
    }
  };

  const handleArrivalClick = (busId: string) => {
    // Update arrival status and trigger re-render
    setTransfers(prevTransfers => 
      prevTransfers.map(transfer => ({
        ...transfer,
        buses: transfer.buses.map(bus => 
          bus.id === busId && bus.arrivalStatus === 'not_arrived'
            ? { ...bus, arrivalStatus: 'arrived' as const }
            : bus
        )
      }))
    );
  };

  return (
    <ProtectedRoute requiredPermission="transport-inter-city">
      <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 overflow-x-hidden">
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 break-words">
              {t('interCityTransfers')}
            </h1>
            <p className="text-customgray text-sm sm:text-base break-words">
              {t('interCityTransfersSubtitle')}
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            <HousingStatsCard
              title={t('arrivedPilgrims')}
              value={stats.arrivedPassengers}
              icon={<UserOutlined />}
              color="success"
            />
            <HousingStatsCard
              title={t('remainingPilgrims')}
              value={stats.remainingPassengers}
              icon={<UserOutlined />}
              color="warning"
            />
            <HousingStatsCard
              title={t('arrivedBuses')}
              value={stats.arrivedBuses}
              icon={<CarOutlined />}
              color="success"
            />
            <HousingStatsCard
              title={t('remainingBuses')}
              value={stats.remainingBuses}
              icon={<CarOutlined />}
              color="warning"
            />
          </div>

          {/* Filter Buttons */}
          <div className="space-y-3">
            {/* Status Filters - Separate Row */}
            <GlassCard className="p-4 border-2 border-bordergray/50 bg-white/90">
              <div className="flex flex-wrap gap-3">
                <Button
                  type={selectedStatus === 'all' ? 'primary' : 'default'}
                  onClick={() => setSelectedStatus('all')}
                  className={
                    selectedStatus === 'all'
                      ? 'bg-primaryColor hover:bg-primaryColor/90'
                      : 'border-primaryColor text-primaryColor hover:bg-primaryColor/10'
                  }
                  size="large"
                >
                  {t('all')}
                </Button>
                <Button
                  type={selectedStatus === 'arrived' ? 'primary' : 'default'}
                  onClick={() => setSelectedStatus('arrived')}
                  className={
                    selectedStatus === 'arrived'
                      ? 'bg-primaryColor hover:bg-primaryColor/90'
                      : 'border-primaryColor text-primaryColor hover:bg-primaryColor/10'
                  }
                  size="large"
                >
                  {t('arrived')}
                </Button>
                <Button
                  type={selectedStatus === 'not_arrived' ? 'primary' : 'default'}
                  onClick={() => setSelectedStatus('not_arrived')}
                  className={
                    selectedStatus === 'not_arrived'
                      ? 'bg-primaryColor hover:bg-primaryColor/90'
                      : 'border-primaryColor text-primaryColor hover:bg-primaryColor/10'
                  }
                  size="large"
                >
                  {t('notArrived')}
                </Button>
              </div>
            </GlassCard>
            
            {/* City Filters - Separate Row */}
            <GlassCard className="p-4 border-2 border-bordergray/50 bg-white/90">
              <div className="flex flex-wrap gap-3">
                <Button
                  type={selectedCity === 'all' ? 'primary' : 'default'}
                  onClick={() => setSelectedCity('all')}
                  className={
                    selectedCity === 'all'
                      ? 'bg-primaryColor hover:bg-primaryColor/90'
                      : 'border-primaryColor text-primaryColor hover:bg-primaryColor/10'
                  }
                  size="large"
                >
                  {t('all')}
                </Button>
                <Button
                  type={selectedCity === 'Makkah' ? 'primary' : 'default'}
                  onClick={() => setSelectedCity('Makkah')}
                  className={
                    selectedCity === 'Makkah'
                      ? 'bg-primaryColor hover:bg-primaryColor/90'
                      : 'border-primaryColor text-primaryColor hover:bg-primaryColor/10'
                  }
                  size="large"
                >
                  {t('makkah')}
                </Button>
                <Button
                  type={selectedCity === 'Madinah' ? 'primary' : 'default'}
                  onClick={() => setSelectedCity('Madinah')}
                  className={
                    selectedCity === 'Madinah'
                      ? 'bg-primaryColor hover:bg-primaryColor/90'
                      : 'border-primaryColor text-primaryColor hover:bg-primaryColor/10'
                  }
                  size="large"
                >
                  {t('madinah')}
                </Button>
                <Button
                  type={selectedCity === 'Jeddah' ? 'primary' : 'default'}
                  onClick={() => setSelectedCity('Jeddah')}
                  className={
                    selectedCity === 'Jeddah'
                      ? 'bg-primaryColor hover:bg-primaryColor/90'
                      : 'border-primaryColor text-primaryColor hover:bg-primaryColor/10'
                  }
                  size="large"
                >
                  {t('jeddah')}
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Transfer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {filteredTransfers.map((transfer) => (
              <TransferCard
                key={transfer.id}
                transfer={transfer}
                onBusDetailsClick={handleBusDetailsClick}
                onArrivalClick={handleArrivalClick}
              />
            ))}
            {filteredTransfers.length === 0 && (
              <div className="col-span-full text-center py-8 text-customgray">
                {t('noTransfers')}
              </div>
            )}
          </div>
        </div>

        {/* Bus Details Modal */}
        <BusDetailsModal
          open={isBusDetailsOpen}
          onClose={() => {
            setIsBusDetailsOpen(false);
            setSelectedBus(null);
          }}
          bus={selectedBus}
          isMashair={false}
        />
      </div>
    </ProtectedRoute>
  );
};

export default InterCityTransfersPage;

