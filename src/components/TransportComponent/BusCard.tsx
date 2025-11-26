import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../HousingComponent/GlassCard';
import { BusSeatVisualizer } from './BusSeatVisualizer';
import { Bus3DViewer } from './Bus3DViewer';
import { BusSeatsModal } from './BusSeatsModal';
import { PassengerDetailModal } from './PassengerDetailModal';
import type { Bus, Passenger } from '../../types/transport';
import { UserOutlined, PhoneOutlined, CarOutlined, ClockCircleOutlined, EnvironmentOutlined, EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface BusCardProps {
  bus: Bus;
  onPassengerClick: (bus: Bus) => void;
  onBusUpdate?: (updatedBus: Bus) => void;
}

export const BusCard: React.FC<BusCardProps> = ({ bus, onPassengerClick, onBusUpdate }) => {
  const { t } = useTranslation('Transport');
  const [show3D, setShow3D] = useState(false);
  const [showSeats, setShowSeats] = useState(false);
  const [showSeatsModal, setShowSeatsModal] = useState(false);
  const [currentBus, setCurrentBus] = useState<Bus>(bus);

  // Update currentBus when bus prop changes
  React.useEffect(() => {
    setCurrentBus(bus);
  }, [bus]);

  // Convert passengers to seats format
  const seats = Array.from({ length: currentBus.capacity }, (_, index) => {
    const seatNumber = index + 1;
    const passenger = currentBus.passengers.find(p => p.seatNumber === seatNumber);
    return {
      id: `seat-${seatNumber}`,
      seatNumber,
      occupied: !!passenger,
      passenger
    };
  });

  // Calculate status and color
  const occupancyRate = currentBus.capacity > 0 ? (currentBus.passengers.length / currentBus.capacity) * 100 : 0;
  const getStatusInfo = () => {
    if (occupancyRate >= 95) {
      // Full: 95-100%
      return { status: t('full'), color: 'bg-green-500', borderColor: 'border-green-500' };
    } else if (occupancyRate >= 50) {
      // Partially Full: 50-94%
      return { status: t('partiallyFull'), color: 'bg-orange-500', borderColor: 'border-orange-500' };
    } else if (occupancyRate >= 10) {
      // Almost Empty: 10-49%
      return { status: t('almostEmpty') || 'Almost Empty', color: 'bg-yellow-400', borderColor: 'border-yellow-400' };
    } else {
      // Empty: 0-9%
      return { status: t('empty'), color: 'bg-gray-400', borderColor: 'border-gray-400' };
    }
  };

  const statusInfo = getStatusInfo();

  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);

  const handleSeatClick = (seat: { seatNumber: number; occupied: boolean; passenger?: Passenger }) => {
    // This will be handled by BusSeatVisualizer
  };

  const handlePassengerFromSeat = (passenger: Passenger) => {
    setSelectedPassenger(passenger);
  };

  const handlePassengerAssigned = (seatNumber: number, passenger: Passenger) => {
    // Update bus passengers
    const updatedPassengers = [...currentBus.passengers];
    
    // Remove passenger from old seat if exists
    const existingIndex = updatedPassengers.findIndex(p => p.id === passenger.id);
    if (existingIndex >= 0) {
      updatedPassengers[existingIndex] = { ...passenger, seatNumber };
    } else {
      // Add new passenger
      updatedPassengers.push({ ...passenger, seatNumber });
    }

    const updatedBus: Bus = {
      ...currentBus,
      passengers: updatedPassengers
    };

    // Update local state
    setCurrentBus(updatedBus);

    // Notify parent component
    if (onBusUpdate) {
      onBusUpdate(updatedBus);
    }
  };

  return (
    <>
      <GlassCard className="p-5 border-2 border-bordergray/50 bg-white/90 hover:shadow-xl transition-all duration-300">
        <div className="space-y-4">
          {/* Header with Route and Status */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <EnvironmentOutlined className="text-primaryColor text-lg" />
                <h3 className="text-lg font-bold text-gray-800">{currentBus.route}</h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-customgray">
                <div className="flex items-center gap-1">
                  <ClockCircleOutlined />
                <span>{t('departure')}: {currentBus.departureTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockCircleOutlined />
                <span>{t('expectedArrival')}: {currentBus.expectedArrival}</span>
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusInfo.color}`}>
              {statusInfo.status}
            </div>
          </div>

          {/* Bus Information */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-bordergray">
            <div>
              <div className="text-xs text-customgray mb-1">{t('transportCompany')}</div>
              <div className="font-semibold text-gray-800">{currentBus.transportCompany}</div>
            </div>
            <div>
              <div className="text-xs text-customgray mb-1">{t('licensePlate')}</div>
              <div className="font-semibold text-gray-800">{currentBus.licensePlate}</div>
            </div>
            <div>
              <div className="text-xs text-customgray mb-1">{t('busNumber')}</div>
              <div className="font-semibold text-gray-800">{currentBus.busNumber}</div>
            </div>
            <div>
              <div className="text-xs text-customgray mb-1">{t('capacity')}</div>
              <div className="font-semibold text-gray-800">{currentBus.passengers.length} / {currentBus.capacity}</div>
            </div>
          </div>

          {/* Drivers Information */}
          <div className="pt-3 border-t border-bordergray space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="text-xs text-customgray mb-1">{t('driver1')}</div>
                <div className="flex items-center gap-2">
                  <UserOutlined className="text-primaryColor" />
                <span className="font-semibold text-gray-800">{currentBus.driver1Name}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-customgray">
                <PhoneOutlined />
                <span>{currentBus.driver1Phone}</span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="text-xs text-customgray mb-1">{t('driver2')}</div>
              <div className="flex items-center gap-2">
                <UserOutlined className="text-primaryColor" />
                <span className="font-semibold text-gray-800">{currentBus.driver2Name}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-customgray">
                <PhoneOutlined />
                <span>{currentBus.driver2Phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seats Visualizer */}
          <div className="pt-3 border-t border-bordergray">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <UserOutlined className="text-primaryColor" />
                <span className="font-semibold text-gray-800 text-sm">{t('passengers')}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  type="default"
                  size="small"
                  onClick={() => setShowSeatsModal(true)}
                  className="border-primaryColor text-primaryColor hover:bg-primaryColor/10"
                >
                  {t('showSeats') || 'Show Seats'}
                </Button>
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => setShow3D(true)}
                  className="bg-primaryColor hover:bg-primaryColor/90"
                >
                  {t('view3D')}
                </Button>
              </div>
            </div>
            {showSeats && (
              <BusSeatVisualizer
                seats={seats}
                busNumber={bus.busNumber}
                totalSeats={bus.capacity}
                onSeatClick={handleSeatClick}
                onPassengerClick={handlePassengerFromSeat}
              />
            )}
          </div>

          {/* Passengers Count - Clickable */}
          <div 
            className="pt-3 border-t border-bordergray cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
            onClick={() => onPassengerClick(currentBus)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserOutlined className="text-primaryColor" />
                <span className="font-semibold text-gray-800">{t('viewAllPassengers') || 'View All Passengers'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primaryColor">{currentBus.passengers.length}</span>
                <CarOutlined className="text-customgray" />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 3D Viewer Modal */}
      {show3D && (
        <Bus3DViewer
          busNumber={currentBus.busNumber}
          seats={seats}
          totalSeats={currentBus.capacity}
          onClose={() => setShow3D(false)}
        />
      )}

      {/* Seats Modal */}
      <BusSeatsModal
        open={showSeatsModal}
        onClose={() => setShowSeatsModal(false)}
        seats={seats}
        busNumber={currentBus.busNumber}
        totalSeats={currentBus.capacity}
        onSeatClick={handleSeatClick}
        onPassengerAssigned={handlePassengerAssigned}
      />

      {/* Passenger Details Modal */}
      <PassengerDetailModal
        open={!!selectedPassenger}
        onClose={() => setSelectedPassenger(null)}
        passenger={selectedPassenger}
      />
    </>
  );
};
