import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../HousingComponent/GlassCard';
import { PassengerDetailModal } from './PassengerDetailModal';
import { AssignPassengerModal } from './AssignPassengerModal';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import { FaChair } from 'react-icons/fa';
import type { Passenger } from '../../types/transport';

interface Seat {
  id: string;
  seatNumber: number;
  occupied: boolean;
  passenger?: Passenger;
}

interface BusSeatsModalProps {
  open: boolean;
  onClose: () => void;
  seats: Seat[];
  busNumber: string;
  totalSeats: number;
  onSeatClick?: (seat: Seat) => void;
  onPassengerAssigned?: (seatNumber: number, passenger: Passenger) => void;
}

export const BusSeatsModal: React.FC<BusSeatsModalProps> = ({
  open,
  onClose,
  seats,
  busNumber,
  totalSeats,
  onSeatClick,
  onPassengerAssigned
}) => {
  const { t } = useTranslation('Transport');
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [selectedEmptySeat, setSelectedEmptySeat] = useState<number | null>(null);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [localSeats, setLocalSeats] = useState<Seat[]>(seats);

  // Update local seats when seats prop changes
  useEffect(() => {
    setLocalSeats(seats);
  }, [seats]);

  // Ensure seats array matches totalSeats
  const displaySeats = Array.from({ length: totalSeats }, (_, index) => {
    const seatNumber = index + 1;
    const seat = localSeats.find(s => s.seatNumber === seatNumber);
    return {
      id: `seat-${seatNumber}`,
      seatNumber,
      occupied: !!seat?.passenger,
      passenger: seat?.passenger
    };
  });

  const occupiedCount = localSeats.filter(s => s.occupied).length;
  const occupancyRate = totalSeats > 0 ? (occupiedCount / totalSeats) * 100 : 0;

  const handleSeatClick = (seat: Seat) => {
    if (seat.occupied && seat.passenger) {
      setSelectedPassenger(seat.passenger);
    } else if (!seat.occupied) {
      // Open assign passenger modal for empty seat
      setSelectedEmptySeat(seat.seatNumber);
    } else if (onSeatClick) {
      onSeatClick(seat);
    }
  };

  const handleAssignPassenger = (passenger: Passenger) => {
    if (selectedEmptySeat === null) return;
    
    // Update passenger seat number
    const updatedPassenger: Passenger = {
      ...passenger,
      seatNumber: selectedEmptySeat
    };

    // Update local seats state
    const updatedSeats = localSeats.map(seat => 
      seat.seatNumber === selectedEmptySeat
        ? { ...seat, occupied: true, passenger: updatedPassenger }
        : seat
    );

    // If seat doesn't exist in localSeats, add it
    if (!localSeats.find(s => s.seatNumber === selectedEmptySeat)) {
      updatedSeats.push({
        id: `seat-${selectedEmptySeat}`,
        seatNumber: selectedEmptySeat,
        occupied: true,
        passenger: updatedPassenger
      });
    }

    setLocalSeats(updatedSeats);

    // Notify parent component
    if (onPassengerAssigned) {
      onPassengerAssigned(selectedEmptySeat, updatedPassenger);
    }

    // Close modal
    setSelectedEmptySeat(null);
  };

  // Group seats by rows (2 seats per row for horizontal layout)
  // But display them horizontally from right to left
  const rows = Math.ceil(totalSeats / 2);
  const seatRows: Seat[][] = [];
  for (let i = 0; i < rows; i++) {
    const rowSeats = displaySeats.slice(i * 2, (i + 1) * 2);
    seatRows.push(rowSeats);
  }

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        width={800}
        className="bus-seats-modal"
        closeIcon={<CloseOutlined className="text-gray-500 hover:text-gray-700" />}
      >
        <GlassCard className="p-0">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {t('busNumber')}: {busNumber}
                </h3>
                <p className="text-sm text-customgray">
                  {occupiedCount}/{totalSeats} {t('passengers')}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-customgray mb-1">{t('occupancyRate')}</div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primaryColor to-secondaryColor transition-all duration-300"
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                  <span className="font-semibold text-gray-700 text-sm">{Math.round(occupancyRate)}%</span>
                </div>
              </div>
            </div>

            {/* Seats Layout - Horizontal rows */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto px-2">
              {seatRows.map((rowSeats, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-3">
                  {/* Row Number */}
                  <div className="w-8 text-xs font-semibold text-customgray text-center">
                    {rowIndex + 1}
                  </div>
                  
                  {/* Seats - Horizontal */}
                  <div className="flex-1 flex gap-3">
                    {rowSeats.map((seat) => (
                      <div
                        key={seat.id}
                        className={`
                          flex-1
                          p-3
                          rounded-lg
                          border-2
                          transition-all duration-200
                          transform
                          hover:scale-105
                          hover:shadow-lg
                          cursor-pointer
                          ${seat.occupied 
                            ? 'bg-primaryColor/15 border-primaryColor/40 shadow-md' 
                            : 'bg-gray-50 border-bordergray'
                          }
                        `}
                        onMouseEnter={() => setHoveredSeat(seat)}
                        onMouseLeave={() => setHoveredSeat(null)}
                        onClick={() => handleSeatClick(seat)}
                      >
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <FaChair 
                            className={`text-xl ${
                              seat.occupied ? 'text-primaryColor' : 'text-customgray'
                            }`}
                          />
                          <div className="text-center">
                            <div className={`text-xs font-bold ${
                              seat.occupied ? 'text-primaryColor' : 'text-customgray'
                            }`}>
                              {t('seatNumber')}: {seat.seatNumber}
                            </div>
                            {seat.occupied && seat.passenger && (
                              <div className="text-[10px] text-customgray mt-1 truncate max-w-[100px]">
                                {seat.passenger.fullName}
                              </div>
                            )}
                            {!seat.occupied && (
                              <div className="text-[10px] text-customgray mt-1">
                                {t('empty')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Fill empty space if odd number of seats */}
                    {rowSeats.length === 1 && (
                      <div className="flex-1"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-bordergray flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primaryColor/15 border-2 border-primaryColor/40"></div>
                <span className="text-xs text-customgray">{t('occupied') || 'Occupied'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-50 border-2 border-bordergray"></div>
                <span className="text-xs text-customgray">{t('empty')}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </Modal>

      {/* Passenger Details Modal */}
      <PassengerDetailModal
        open={!!selectedPassenger}
        onClose={() => setSelectedPassenger(null)}
        passenger={selectedPassenger}
      />

      {/* Assign Passenger Modal */}
      {selectedEmptySeat !== null && (
        <AssignPassengerModal
          open={true}
          onClose={() => setSelectedEmptySeat(null)}
          seatNumber={selectedEmptySeat}
          busNumber={busNumber}
          onAssign={handleAssignPassenger}
        />
      )}
    </>
  );
};

