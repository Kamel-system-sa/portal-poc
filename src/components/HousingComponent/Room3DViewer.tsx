import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';

interface Bed {
  id: string;
  occupied: boolean;
  pilgrimId?: string;
  pilgrimName?: string;
}

interface Room3DViewerProps {
  roomNumber: string;
  beds: Bed[];
  totalBeds: number;
  onClose?: () => void;
}

// 3D Bed Component - Fixed, no animations
const Bed3D: React.FC<{
  position: [number, number, number];
  occupied: boolean;
  bed: Bed;
  onHover?: (bed: Bed | null) => void;
}> = ({ position, occupied, bed, onHover }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      onPointerEnter={() => {
        setHovered(true);
        onHover?.(bed);
      }}
      onPointerLeave={() => {
        setHovered(false);
        onHover?.(null);
      }}
    >
      {/* Bed Frame */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.8, 0.1, 0.9]} />
        <meshStandardMaterial
          color={occupied ? '#00796B' : '#9CA3AF'}
          metalness={0.3}
          roughness={0.7}
          emissive={hovered ? (occupied ? '#00796B' : '#9CA3AF') : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.6, 0.2, 0.8]} />
        <meshStandardMaterial
          color={occupied ? '#00A896' : '#E5E7EB'}
          roughness={0.9}
        />
      </mesh>
      {/* Pillow */}
      <mesh position={[0, 0.35, 0.3]}>
        <boxGeometry args={[0.5, 0.1, 0.6]} />
        <meshStandardMaterial
          color={occupied ? '#005B4F' : '#F3F4F6'}
          roughness={0.8}
        />
      </mesh>
      {/* Status Indicator */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={occupied ? '#27AE60' : '#D64545'}
          emissive={occupied ? '#27AE60' : '#D64545'}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Pilgrim Info Tooltip */}
      {hovered && bed.occupied && bed.pilgrimName && (
        <Html position={[0, 1, 0]} center>
          <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm shadow-lg whitespace-nowrap">
            {bed.pilgrimName}
          </div>
        </Html>
      )}
    </group>
  );
};

// 3D Room Structure
const Room3D: React.FC<{
  roomNumber: string;
  beds: Bed[];
  totalBeds: number;
  onBedHover?: (bed: Bed | null) => void;
}> = ({ roomNumber, beds, totalBeds, onBedHover }) => {
  const { t } = useTranslation('common');
  
  // Calculate bed positions - horizontally arranged side-by-side against the LEFT wall
  // Beds are placed with their backs against the wall, extending into the room
  const getBedPositions = (): Array<[number, number, number]> => {
    const positions: Array<[number, number, number]> = [];
    const bedWidth = 1.8;
    const bedDepth = 0.9;
    const spacing = 0.1; // Small gap between beds
    const totalWidth = (totalBeds * bedWidth) + ((totalBeds - 1) * spacing);
    const startZ = -totalWidth / 2 + bedWidth / 2;
    
    // Arrange beds horizontally against the LEFT wall (x = -3.5)
    // Beds extend from the wall into the room
    for (let i = 0; i < totalBeds; i++) {
      const z = startZ + i * (bedWidth + spacing);
      // Position: x = -3.5 (against left wall), beds extend to x = -3.5 + bedDepth/2
      positions.push([-3.5 + bedDepth / 2, 0, z]);
    }
    
    return positions;
  };

  const bedPositions = getBedPositions();

  return (
    <group>
      {/* Room Floor */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[8, 0.1, 8]} />
        <meshStandardMaterial color="#F5F7FA" roughness={0.8} />
      </mesh>

      {/* Room Walls - Front wall is completely open */}
      {/* Back Wall */}
      <mesh position={[0, 1.5, -4]}>
        <boxGeometry args={[8, 3, 0.2]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-4, 1.5, 0]}>
        <boxGeometry args={[0.2, 3, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[4, 1.5, 0]}>
        <boxGeometry args={[0.2, 3, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
      </mesh>
      {/* Front Wall - REMOVED (completely open) */}

      {/* Ceiling */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[8, 0.1, 8]} />
        <meshStandardMaterial color="#F9FAFB" roughness={0.7} />
      </mesh>

      {/* Room Number Sign */}
      <mesh position={[0, 2.5, -3.9]}>
        <planeGeometry args={[1, 0.5]} />
        <meshStandardMaterial color="#00796B" />
      </mesh>

      {/* Beds - Fixed positions, horizontally arranged against LEFT wall */}
      {bedPositions.map((position, index) => {
        const bed = beds[index] || { id: `bed-${index}`, occupied: false };
        return (
          <Bed3D
            key={bed.id}
            position={position}
            occupied={bed.occupied}
            bed={bed}
            onHover={onBedHover}
          />
        );
      })}

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 2.5, 0]} intensity={1} />
      <pointLight position={[-3, 2, -3]} intensity={0.5} />
      <pointLight position={[3, 2, 3]} intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
    </group>
  );
};

export const Room3DViewer: React.FC<Room3DViewerProps> = ({
  roomNumber,
  beds,
  totalBeds,
  onClose
}) => {
  const { t } = useTranslation('common');
  const [hoveredBed, setHoveredBed] = useState<Bed | null>(null);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-md border-b border-bordergray p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {t('housing.room')} {roomNumber} - {t('housing.view3D')}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors"
            >
              {t('housing.close')}
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
            <Room3D
              roomNumber={roomNumber}
              beds={beds}
              totalBeds={totalBeds}
              onBedHover={setHoveredBed}
            />
          </Canvas>
        </div>

        {/* Info Panel */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-bordergray p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4">
              <div>
                <span className="text-customgray">{t('housing.totalBeds')}: </span>
                <span className="font-semibold text-gray-800">{totalBeds}</span>
              </div>
              <div>
                <span className="text-customgray">{t('housing.occupiedBeds')}: </span>
                <span className="font-semibold text-primaryColor">
                  {beds.filter(b => b.occupied).length}
                </span>
              </div>
              <div>
                <span className="text-customgray">{t('housing.availableBeds')}: </span>
                <span className="font-semibold text-success">
                  {beds.filter(b => !b.occupied).length}
                </span>
              </div>
              {hoveredBed && hoveredBed.occupied && (
                <div>
                  <span className="text-customgray">{t('housing.assignedPilgrim')}: </span>
                  <span className="font-semibold text-mainColor">
                    {hoveredBed.pilgrimName || t('housing.unknown')}
                  </span>
                </div>
              )}
            </div>
            <div className="text-xs text-customgray">
              {t('housing.rotateHint')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
