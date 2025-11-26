import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '../../components/TransportComponent/ProtectedRoute';
import { TransferCard } from '../../components/TransportComponent/TransferCard';
import { BusDetailsModal } from '../../components/TransportComponent/BusDetailsModal';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { HousingStatsCard } from '../../components/HousingComponent/HousingStatsCard';
import { mockMashairTransfers } from '../../data/mockTransfers';
import type { MashairTransfer, MashairTransferBus, MashairRoute } from '../../types/transport';
import { Button } from 'antd';
import { UserOutlined, CarOutlined } from '@ant-design/icons';

const HolySitesTransfersPage: React.FC = () => {
  const { t } = useTranslation('Transport');
  const [transfers, setTransfers] = useState<MashairTransfer[]>(mockMashairTransfers);
  const [selectedRoute, setSelectedRoute] = useState<MashairRoute | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'arrived' | 'not_arrived'>('all');
  const [selectedBus, setSelectedBus] = useState<MashairTransferBus | null>(null);
  const [isBusDetailsOpen, setIsBusDetailsOpen] = useState(false);

  const filteredTransfers = useMemo(() => {
    let filtered = transfers;

    // Filter by route
    if (selectedRoute !== 'all') {
      filtered = filtered.filter(transfer => transfer.route === selectedRoute);
    }

    return filtered;
  }, [transfers, selectedRoute]);

  // Group buses by route and bus number - all responses for the same bus in the same route in one card
  const groupedBusTransfers = useMemo(() => {
    const busGroups = new Map<string, { transfer: MashairTransfer; bus: MashairTransferBus }[]>();
    
    // Group buses by route and bus number (so each route has its own bus numbers)
    filteredTransfers.forEach(transfer => {
      transfer.buses.forEach(bus => {
        const key = `${transfer.route}-${bus.busNumber}`;
        if (!busGroups.has(key)) {
          busGroups.set(key, []);
        }
        busGroups.get(key)!.push({ transfer, bus });
      });
    });
    
    // Convert to array and create one transfer per bus number with all responses
    return Array.from(busGroups.entries()).map(([busNumber, items]) => {
      // Collect all buses (responses) with the same bus number
      let allBuses = items.map(item => item.bus);
      
      // Filter by status if needed
      if (selectedStatus !== 'all') {
        allBuses = allBuses.filter(bus => bus.arrivalStatus === selectedStatus);
      }
      
      // If no buses after filtering, return null (will be filtered out)
      if (allBuses.length === 0) {
        return null;
      }
      
      // Sort: by responseNumber first (1 before 2), then by arrival status
      allBuses.sort((a, b) => {
        // First sort by responseNumber (1 before 2)
        const aResponse = parseInt(a.responseNumber || '0') || 0;
        const bResponse = parseInt(b.responseNumber || '0') || 0;
        if (aResponse !== bResponse) {
          return aResponse - bResponse;
        }
        // If same response number, sort by arrival status (arrived first)
        if (a.arrivalStatus === 'arrived' && b.arrivalStatus !== 'arrived') return -1;
        if (a.arrivalStatus !== 'arrived' && b.arrivalStatus === 'arrived') return 1;
        return 0;
      });
      
      // Use the first transfer as base (for route, hotelName, etc.)
      const baseTransfer = items[0].transfer;
      
      return {
        ...baseTransfer,
        buses: allBuses,
        busesCount: allBuses.length
      };
    }).filter(transfer => transfer !== null) as MashairTransfer[];
  }, [filteredTransfers, selectedStatus]);


  // Calculate statistics for filtered transfers (based on all buses)
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

  const routes: Array<{ value: MashairRoute | 'all'; label: string }> = [
    { value: 'all', label: t('allRoutes') },
    { value: 'Makkah → Mina', label: t('makkahToMina') },
    { value: 'Mina → Arafat', label: t('minaToArafat') },
    { value: 'Arafat → Muzdalifah', label: t('arafatToMuzdalifah') },
    { value: 'Muzdalifah → Mina', label: t('muzdalifahToMina') },
    { value: 'Mina → Makkah', label: t('minaToMakkah') }
  ];

  return (
    <ProtectedRoute requiredPermission="transport-holy-sites">
      <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 overflow-x-hidden">
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 break-words">
              {t('holySitesTransfers')}
            </h1>
            <p className="text-customgray text-sm sm:text-base break-words">
              {t('holySitesTransfersSubtitle')}
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
            
            {/* Route Filters - Separate Row */}
            <GlassCard className="p-4 border-2 border-bordergray/50 bg-white/90">
              <div className="flex flex-wrap gap-3">
                {routes.map((route) => (
                  <Button
                    key={route.value}
                    type={selectedRoute === route.value ? 'primary' : 'default'}
                    onClick={() => setSelectedRoute(route.value)}
                    className={
                      selectedRoute === route.value
                        ? 'bg-primaryColor hover:bg-primaryColor/90'
                        : 'border-primaryColor text-primaryColor hover:bg-primaryColor/10'
                    }
                    size="large"
                  >
                    {route.label}
                  </Button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Transfer Cards - All responses for same bus in one card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {groupedBusTransfers.map((transfer, index) => (
              <TransferCard
                key={`bus-${transfer.buses[0].busNumber}-${index}`}
                transfer={transfer}
                onBusDetailsClick={handleBusDetailsClick}
                onArrivalClick={handleArrivalClick}
              />
            ))}
            {groupedBusTransfers.length === 0 && (
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
          isMashair={true}
        />
      </div>
    </ProtectedRoute>
  );
};

export default HolySitesTransfersPage;

