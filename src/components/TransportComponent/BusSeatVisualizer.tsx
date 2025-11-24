import React, { useState } from 'react';
import { Map2_5DWrapper } from '../HousingComponent/Map2_5DWrapper';
import { useTranslation } from 'react-i18next';
import { FaChair } from 'react-icons/fa';
import { Modal } from 'antd';
import { GlassCard } from '../HousingComponent/GlassCard';
import { PassengerDetailModal } from './PassengerDetailModal';
import { UserOutlined, PhoneOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import type { Passenger } from '../../types/transport';

interface Seat {
  id: string;
  seatNumber: number;
  occupied: boolean;
  passenger?: Passenger;
}

interface BusSeatVisualizerProps {
  seats: Seat[];
  busNumber: string;
  totalSeats: number;
  className?: string;
  onSeatClick?: (seat: Seat) => void;
  onPassengerClick?: (passenger: Passenger) => void;
}

export const BusSeatVisualizer: React.FC<BusSeatVisualizerProps> = ({
  seats,
  busNumber,
  totalSeats,
  className = '',
  onSeatClick,
  onPassengerClick
}) => {
  const { t } = useTranslation('Transport');
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Ensure seats array matches totalSeats
  const displaySeats = Array.from({ length: totalSeats }, (_, index) => {
    const seatNumber = index + 1;
    const passenger = seats.find(s => s.seatNumber === seatNumber)?.passenger;
    return {
      id: `seat-${seatNumber}`,
      seatNumber,
      occupied: !!passenger,
      passenger
    };
  });

  // Calculate grid columns based on seat count (typical bus layout: 2 columns per row)
  const getGridCols = () => {
    // Most buses have 2 seats per row (aisle in middle)
    return 'grid-cols-2';
  };

  const occupiedCount = seats.filter(s => s.occupied).length;
  const occupancyRate = totalSeats > 0 ? (occupiedCount / totalSeats) * 100 : 0;

  const handleSeatHover = (seat: Seat, event: React.MouseEvent) => {
    if (seat.occupied && seat.passenger) {
      setHoveredSeat(seat);
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    }
  };

  const handleSeatLeave = () => {
    setHoveredSeat(null);
    setTooltipPosition(null);
  };

  const handleSeatClick = (seat: Seat, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (seat.occupied && seat.passenger) {
      // If passenger click handler is provided, use it
      if (onPassengerClick) {
        onPassengerClick(seat.passenger);
      } else if (onSeatClick) {
        onSeatClick(seat);
      } else {
        // Show passenger details modal
        setSelectedPassenger(seat.passenger);
      }
    } else if (onSeatClick) {
      onSeatClick(seat);
    }
  };

  // Group seats by rows (2 seats per row)
  const rows = Math.ceil(totalSeats / 2);
  const seatRows: Seat[][] = [];
  for (let i = 0; i < rows; i++) {
    const rowSeats = displaySeats.slice(i * 2, (i + 1) * 2);
    seatRows.push(rowSeats);
  }

  return (
    <Map2_5DWrapper intensity="medium" className={className}>
      <div 
        className={`
          p-4
          rounded-xl
          border border-bordergray/50
          bg-white/80 backdrop-blur-sm
          transition-all duration-300
        `}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-800">{t('busNumber')}: {busNumber}</h4>
          <span className="text-xs font-medium text-primaryColor">
            {occupiedCount}/{totalSeats}
          </span>
        </div>

        {/* Bus Layout - 2 columns per row */}
        <div className="space-y-0.5 mb-3">
          {seatRows.map((rowSeats, rowIndex) => (
            <div key={rowIndex} className={`grid ${getGridCols()} gap-0.5`}>
              {rowSeats.map((seat, colIndex) => {
                const tiltX = (rowIndex % 2 === 0 ? -0.5 : 0.5);
                const tiltY = (colIndex % 2 === 0 ? -0.5 : 0.5);

                return (
                  <div
                    key={seat.id}
                    className={`
                      relative
                      aspect-square
                      p-0.5
                      rounded-sm
                      border
                      transition-all duration-200
                      transform
                      hover:scale-110
                      hover:z-10
                      cursor-pointer
                      ${seat.occupied 
                        ? 'bg-primaryColor/15 border-primaryColor/40 shadow-sm' 
                        : 'bg-gray-50 border-bordergray'
                      }
                    `}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`,
                      width: '20px',
                      height: '20px',
                      minWidth: '20px',
                      minHeight: '20px'
                    }}
                    onMouseEnter={(e) => handleSeatHover(seat, e)}
                    onMouseLeave={handleSeatLeave}
                    onClick={(e) => handleSeatClick(seat, e)}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
                      <FaChair 
                        className={`${
                          seat.occupied ? 'text-primaryColor' : 'text-customgray'
                        }`}
                        style={{ width: '10px', height: '10px', flexShrink: 0 }}
                      />
                      <span className={`text-[8px] font-medium ${
                        seat.occupied ? 'text-primaryColor' : 'text-customgray'
                      }`}>
                        {seat.seatNumber}
                      </span>
                    </div>
                    
                    {/* 2.5D depth effect */}
                    <div 
                      className="absolute inset-0 rounded-md opacity-10"
                      style={{
                        background: seat.occupied 
                          ? 'linear-gradient(135deg, rgba(0, 169, 150, 0.4) 0%, rgba(0, 121, 107, 0.2) 100%)'
                          : 'linear-gradient(135deg, rgba(156, 163, 175, 0.2) 0%, rgba(229, 231, 235, 0.1) 100%)',
                        transform: 'translateZ(-3px)',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Occupancy bar */}
        <div className="mt-3 pt-3 border-t border-bordergray/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-customgray">{t('occupancyRate')}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primaryColor to-secondaryColor transition-all duration-300"
                  style={{ width: `${occupancyRate}%` }}
                />
              </div>
              <span className="font-semibold text-gray-700">{Math.round(occupancyRate)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredSeat && tooltipPosition && hoveredSeat.occupied && hoveredSeat.passenger && (
        <div
          className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs shadow-xl pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-semibold mb-1">{hoveredSeat.passenger.fullName}</div>
          {hoveredSeat.passenger.gender && (
            <div className="text-gray-300">
              {hoveredSeat.passenger.gender === 'female' ? t('female') : t('male')}
            </div>
          )}
        </div>
      )}

      {/* Seat Details Modal */}
      <Modal
        open={!!selectedSeat}
        onCancel={() => setSelectedSeat(null)}
        footer={null}
        centered
        width={500}
        className="seat-details-modal"
      >
        {selectedSeat && selectedSeat.occupied && selectedSeat.passenger && (
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-primaryColor to-secondaryColor rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900">{t('passengerDetails')}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-bordergray flex items-center justify-center overflow-hidden">
                  {selectedSeat.passenger.gender === 'female' ? (
                    <img 
                      src="/images/female.png" 
                      alt={selectedSeat.passenger.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : selectedSeat.passenger.gender === 'male' ? (
                    <img 
                      src="/images/male.png" 
                      alt={selectedSeat.passenger.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserOutlined className="text-primaryColor" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{selectedSeat.passenger.fullName}</h4>
                  {selectedSeat.passenger.gender && (
                    <p className="text-sm text-customgray">
                      {selectedSeat.passenger.gender === 'female' ? t('female') : t('male')}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white border border-bordergray rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <UserOutlined className="text-primaryColor" />
                    <span className="text-xs font-semibold text-customgray uppercase">{t('fullName')}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{selectedSeat.passenger.fullName}</p>
                </div>

                <div className="p-3 bg-white border border-bordergray rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <UserOutlined className="text-primaryColor" />
                    <span className="text-xs font-semibold text-customgray uppercase">{t('seatNumber')}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{selectedSeat.seatNumber}</p>
                </div>

                <div className="p-3 bg-white border border-bordergray rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <PhoneOutlined className="text-primaryColor" />
                    <span className="text-xs font-semibold text-customgray uppercase">{t('phoneNumber')}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{selectedSeat.passenger.phoneNumber}</p>
                </div>

                {selectedSeat.passenger.gender && (
                  <div className="p-3 bg-white border border-bordergray rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      {selectedSeat.passenger.gender === 'female' ? (
                        <WomanOutlined className="text-primaryColor" />
                      ) : (
                        <ManOutlined className="text-primaryColor" />
                      )}
                      <span className="text-xs font-semibold text-customgray uppercase">{t('gender') || 'Gender'}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedSeat.passenger.gender === 'female' ? t('female') : t('male')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        )}
      </Modal>

      {/* Passenger Details Modal */}
      <PassengerDetailModal
        open={!!selectedPassenger}
        onClose={() => setSelectedPassenger(null)}
        passenger={selectedPassenger}
      />
    </Map2_5DWrapper>
  );
};

