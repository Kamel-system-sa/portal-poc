import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';
import { UserOutlined } from '@ant-design/icons';
import type { Passenger } from '../../types/transport';

interface Seat {
  seatNumber: number;
  occupied: boolean;
  passenger?: Passenger;
}

interface Bus3DViewerProps {
  busNumber: string;
  seats: Seat[];
  totalSeats: number;
  onClose?: () => void;
}

// 3D Seat Component
const Seat3D: React.FC<{
  position: [number, number, number];
  occupied: boolean;
  seat: Seat;
  onHover?: (seat: Seat | null) => void;
}> = ({ position, occupied, seat, onHover }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      onPointerEnter={() => {
        setHovered(true);
        onHover?.(seat);
      }}
      onPointerLeave={() => {
        setHovered(false);
        onHover?.(null);
      }}
    >
      {/* Seat Base */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.4, 0.2, 0.4]} />
        <meshStandardMaterial
          color={occupied ? '#00796B' : '#9CA3AF'}
          metalness={0.3}
          roughness={0.7}
          emissive={hovered ? (occupied ? '#00796B' : '#9CA3AF') : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      {/* Seat Back */}
      <mesh position={[0, 0.4, -0.15]}>
        <boxGeometry args={[0.4, 0.6, 0.1]} />
        <meshStandardMaterial
          color={occupied ? '#00A896' : '#E5E7EB'}
          roughness={0.9}
        />
      </mesh>
      {/* Status Indicator */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={occupied ? '#27AE60' : '#D64545'}
          emissive={occupied ? '#27AE60' : '#D64545'}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Passenger Info Tooltip */}
      {hovered && seat.occupied && seat.passenger && (
        <Html position={[0, 1, 0]} center>
          <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm shadow-lg whitespace-nowrap">
            {seat.passenger.fullName}
          </div>
        </Html>
      )}
    </group>
  );
};

// 3D Bus Structure
const Bus3D: React.FC<{
  busNumber: string;
  seats: Seat[];
  totalSeats: number;
  onSeatHover?: (seat: Seat | null) => void;
}> = ({ busNumber, seats, totalSeats, onSeatHover }) => {
  const { t } = useTranslation('Transport');
  
  // Calculate seat positions - 2 seats per row, arranged in bus layout
  const rows = Math.ceil(totalSeats / 2);
  const seatPositions: Array<{ seat: Seat; position: [number, number, number] }> = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < 2; col++) {
      const seatNumber = row * 2 + col + 1;
      if (seatNumber > totalSeats) break;
      
      const seat = seats.find(s => s.seatNumber === seatNumber) || {
        seatNumber,
        occupied: false
      };
      
      // Position seats: left side (col 0) and right side (col 1) with aisle in middle
      const x = col === 0 ? -0.5 : 0.5; // Left and right sides
      const y = 0.1;
      const z = (rows / 2 - row) * 0.6; // Center the seats
      
      seatPositions.push({
        seat,
        position: [x, y, z]
      });
    }
  }

  return (
    <>
      {/* Bus Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, rows * 0.6 + 2]} />
        <meshStandardMaterial color="#E5E7EB" roughness={0.8} />
      </mesh>

      {/* Bus Walls */}
      {/* Left Wall */}
      <mesh position={[-1.5, 1, 0]}>
        <boxGeometry args={[0.1, 2, rows * 0.6 + 2]} />
        <meshStandardMaterial color="#9CA3AF" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[1.5, 1, 0]}>
        <boxGeometry args={[0.1, 2, rows * 0.6 + 2]} />
        <meshStandardMaterial color="#9CA3AF" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Front Wall */}
      <mesh position={[0, 1, (rows * 0.6 + 2) / 2]}>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#6B7280" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Back Wall */}
      <mesh position={[0, 1, -(rows * 0.6 + 2) / 2]}>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#6B7280" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Roof - Transparent to show seats */}
      <mesh position={[0, 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, rows * 0.6 + 2]} />
        <meshStandardMaterial 
          color="#4B5563" 
          metalness={0.7} 
          roughness={0.4}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Seats */}
      {seatPositions.map(({ seat, position }) => (
        <Seat3D
          key={seat.seatNumber}
          position={position}
          occupied={seat.occupied}
          seat={seat}
          onHover={onSeatHover}
        />
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[0, 3, 0]} intensity={0.5} />
    </>
  );
};

export const Bus3DViewer: React.FC<Bus3DViewerProps> = ({
  busNumber,
  seats,
  totalSeats,
  onClose
}) => {
  const { t } = useTranslation('Transport');
  const { t: tCommon } = useTranslation('common');
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-md border-b border-bordergray p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {t('busNumber')}: {busNumber} - {t('view3D') || '3D View'}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors"
            >
              {t('close')}
            </button>
          )}
        </div>

        {/* 3D Canvas */}
        <div className="w-full h-full pt-16">
          <Canvas
            shadows
            camera={{ position: [8, 6, 8], fov: 50 }}
          >
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={20}
            />
            <Bus3D
              busNumber={busNumber}
              seats={seats}
              totalSeats={totalSeats}
              onSeatHover={setHoveredSeat}
            />
          </Canvas>
        </div>

        {/* Info Panel - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-bordergray p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4">
              <div>
                <span className="text-customgray">{t('capacity')}: </span>
                <span className="font-semibold text-gray-800">{totalSeats}</span>
              </div>
              <div>
                <span className="text-customgray">{t('occupied')}: </span>
                <span className="font-semibold text-primaryColor">
                  {seats.filter(s => s.occupied).length}
                </span>
              </div>
              <div>
                <span className="text-customgray">{t('empty')}: </span>
                <span className="font-semibold text-success">
                  {seats.filter(s => !s.occupied).length}
                </span>
              </div>
              {hoveredSeat && hoveredSeat.occupied && hoveredSeat.passenger && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-bordergray flex items-center justify-center overflow-hidden">
                    {hoveredSeat.passenger.gender === 'female' ? (
                      <img 
                        src="/images/female.png" 
                        alt={hoveredSeat.passenger.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : hoveredSeat.passenger.gender === 'male' ? (
                      <img 
                        src="/images/male.png" 
                        alt={hoveredSeat.passenger.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserOutlined className="text-primaryColor text-xs" />
                    )}
                  </div>
                  <div>
                    <span className="text-customgray">{t('passengerName')}: </span>
                    <span className="font-semibold text-mainColor">
                      {hoveredSeat.passenger.fullName}
                    </span>
                    <span className="text-customgray ml-2">
                      ({t('seatNumber')}: {hoveredSeat.seatNumber})
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="text-xs text-customgray">
              {tCommon('rotateHint') || 'Rotate, zoom, and pan to explore'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

