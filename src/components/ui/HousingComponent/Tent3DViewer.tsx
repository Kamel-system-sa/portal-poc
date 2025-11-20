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

interface Tent3DViewerProps {
  tentNumber: string;
  beds: Bed[];
  totalBeds: number;
  location: 'mina' | 'arafat';
  onClose?: () => void;
}

// 3D Tent Bed Component - Fixed, no animations, no blinking
const TentBed3D: React.FC<{
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
      {/* Bed Mat/Floor Mat - Completely static */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 1.5]} />
        <meshStandardMaterial
          color={occupied ? '#00796B' : '#E5E7EB'}
          roughness={0.9}
        />
      </mesh>
      {/* Pillow - Completely static */}
      <mesh position={[0, 0.1, 0.5]}>
        <boxGeometry args={[0.4, 0.1, 0.5]} />
        <meshStandardMaterial
          color={occupied ? '#005B4F' : '#F3F4F6'}
          roughness={0.8}
        />
      </mesh>
      {/* Status Indicator - Static light, no blinking */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={occupied ? '#27AE60' : '#D64545'}
          emissive={occupied ? '#27AE60' : '#D64545'}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Pilgrim Info Tooltip */}
      {hovered && bed.occupied && bed.pilgrimName && (
        <Html position={[0, 0.5, 0]} center>
          <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm shadow-lg whitespace-nowrap">
            {bed.pilgrimName}
          </div>
        </Html>
      )}
    </group>
  );
};

// Water Station Component
const WaterStation: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Top */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.35, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#E0E0E0" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Tap */}
      <mesh position={[0.2, 0.65, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.15, 0.05, 0.05]} />
        <meshStandardMaterial color="#808080" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// AC Unit Component
const ACUnit: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Main Unit */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 0.4, 0.3]} />
        <meshStandardMaterial color="#E0E0E0" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Vents */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[-0.6 + i * 0.15, 0.5, 0.16]}>
          <boxGeometry args={[0.1, 0.05, 0.02]} />
          <meshStandardMaterial color="#B0B0B0" metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
      {/* Mounting Bracket */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.6, 0.1, 0.1]} />
        <meshStandardMaterial color="#A0A0A0" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
};

// Tent Entrance Component
const TentEntrance: React.FC<{ position: [number, number, number]; width: number }> = ({ position, width }) => {
  return (
    <group position={position}>
      {/* Entrance Opening Frame */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[width + 0.2, 2, 0.1]} />
        <meshStandardMaterial color="#8B4513" roughness={0.6} />
      </mesh>
      {/* Tent Flap (open) */}
      <mesh position={[-width / 2 - 0.1, 1, 0.05]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[width / 2, 2, 0.05]} />
        <meshStandardMaterial
          color="#FFF8E1"
          transparent
          opacity={0.8}
          roughness={0.7}
        />
      </mesh>
      <mesh position={[width / 2 + 0.1, 1, 0.05]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[width / 2, 2, 0.05]} />
        <meshStandardMaterial
          color="#FFF8E1"
          transparent
          opacity={0.8}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
};

// 3D Tent Structure
const Tent3D: React.FC<{
  tentNumber: string;
  beds: Bed[];
  totalBeds: number;
  location: 'mina' | 'arafat';
  onBedHover?: (bed: Bed | null) => void;
}> = ({ tentNumber, beds, totalBeds, location, onBedHover }) => {
  // Calculate bed positions - horizontally arranged across the tent
  const getBedPositions = (): Array<[number, number, number]> => {
    const positions: Array<[number, number, number]> = [];
    const bedWidth = 0.8;
    const bedLength = 1.5;
    const spacing = 0.1; // Small gap between beds
    
    // Calculate how many beds fit in a row (horizontal)
    const maxBedsPerRow = Math.floor(10); // Maximum beds per row
    const rows = Math.ceil(totalBeds / maxBedsPerRow);
    
    const totalWidth = Math.min(totalBeds, maxBedsPerRow) * (bedWidth + spacing) - spacing;
    const totalLength = rows * (bedLength + spacing) - spacing;
    
    const startX = -totalWidth / 2 + bedWidth / 2;
    const startZ = -totalLength / 2 + bedLength / 2;

    // Arrange beds in rows, horizontally across the tent
    for (let i = 0; i < totalBeds; i++) {
      const row = Math.floor(i / maxBedsPerRow);
      const col = i % maxBedsPerRow;
      const x = startX + col * (bedWidth + spacing);
      const z = startZ + row * (bedLength + spacing);
      positions.push([x, 0, z]);
    }
    
    return positions;
  };

  const bedPositions = getBedPositions();

  // Tent dimensions based on bed layout
  const tentWidth = Math.max(10, bedPositions.length > 0 
    ? Math.abs(bedPositions[0][0]) * 2 + 2 
    : 12);
  const tentLength = Math.max(8, bedPositions.length > 0
    ? Math.abs(bedPositions[bedPositions.length - 1][2]) * 2 + 2
    : 10);
  const tentHeight = 3;
  const entranceWidth = 2.5;

  return (
    <group>
      {/* Ground/Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[tentWidth + 2, tentLength + 2]} />
        <meshStandardMaterial color="#F5F7FA" roughness={0.8} />
      </mesh>

      {/* Tent Structure - Front has entrance */}
      {/* Back Wall */}
      <mesh position={[0, tentHeight / 2, -tentLength / 2]}>
        <boxGeometry args={[tentWidth, tentHeight, 0.1]} />
        <meshStandardMaterial
          color={location === 'mina' ? '#FFF8E1' : '#E8F5E9'}
          transparent
          opacity={0.7}
          roughness={0.8}
        />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-tentWidth / 2, tentHeight / 2, 0]}>
        <boxGeometry args={[0.1, tentHeight, tentLength]} />
        <meshStandardMaterial
          color={location === 'mina' ? '#FFF8E1' : '#E8F5E9'}
          transparent
          opacity={0.7}
          roughness={0.8}
        />
      </mesh>
      {/* Right Wall */}
      <mesh position={[tentWidth / 2, tentHeight / 2, 0]}>
        <boxGeometry args={[0.1, tentHeight, tentLength]} />
        <meshStandardMaterial
          color={location === 'mina' ? '#FFF8E1' : '#E8F5E9'}
          transparent
          opacity={0.7}
          roughness={0.8}
        />
      </mesh>
      {/* Front Wall - with entrance opening */}
      <group>
        {/* Left side of entrance */}
        <mesh position={[-tentWidth / 2 + (tentWidth - entranceWidth) / 4, tentHeight / 2, tentLength / 2]}>
          <boxGeometry args={[(tentWidth - entranceWidth) / 2, tentHeight, 0.1]} />
          <meshStandardMaterial
            color={location === 'mina' ? '#FFF8E1' : '#E8F5E9'}
            transparent
            opacity={0.7}
            roughness={0.8}
          />
        </mesh>
        {/* Right side of entrance */}
        <mesh position={[tentWidth / 2 - (tentWidth - entranceWidth) / 4, tentHeight / 2, tentLength / 2]}>
          <boxGeometry args={[(tentWidth - entranceWidth) / 2, tentHeight, 0.1]} />
          <meshStandardMaterial
            color={location === 'mina' ? '#FFF8E1' : '#E8F5E9'}
            transparent
            opacity={0.7}
            roughness={0.8}
          />
        </mesh>
        {/* Top of entrance */}
        <mesh position={[0, tentHeight, tentLength / 2]}>
          <boxGeometry args={[entranceWidth, 0.5, 0.1]} />
          <meshStandardMaterial
            color={location === 'mina' ? '#FFF8E1' : '#E8F5E9'}
            transparent
            opacity={0.7}
            roughness={0.8}
          />
        </mesh>
      </group>

      {/* Tent Entrance */}
      <TentEntrance position={[0, 0, tentLength / 2]} width={entranceWidth} />

      {/* Tent Roof - Arched/Triangular */}
      <group>
        {/* Roof Front */}
        <mesh position={[0, tentHeight, tentLength / 2]} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[tentWidth, 0.1, tentLength * 0.7]} />
          <meshStandardMaterial
            color={location === 'mina' ? '#FFE082' : '#C8E6C9'}
            roughness={0.7}
          />
        </mesh>
        {/* Roof Back */}
        <mesh position={[0, tentHeight, -tentLength / 2]} rotation={[-Math.PI / 4, 0, 0]}>
          <boxGeometry args={[tentWidth, 0.1, tentLength * 0.7]} />
          <meshStandardMaterial
            color={location === 'mina' ? '#FFE082' : '#C8E6C9'}
            roughness={0.7}
          />
        </mesh>
      </group>

      {/* Tent Number Sign */}
      <mesh position={[0, tentHeight + 0.5, -tentLength / 2 + 0.1]}>
        <planeGeometry args={[1, 0.5]} />
        <meshStandardMaterial color="#00796B" />
      </mesh>

      {/* Water Station - positioned near entrance */}
      <WaterStation position={[tentWidth / 2 - 1, 0, tentLength / 2 - 1]} />

      {/* AC Unit - positioned on back wall */}
      <ACUnit position={[0, 0, -tentLength / 2 + 0.2]} />

      {/* Beds Grid - Fixed positions, horizontally arranged, completely static */}
      {bedPositions.map((position, index) => {
        const bed = beds[index] || { id: `bed-${index}`, occupied: false };
        return (
          <TentBed3D
            key={bed.id}
            position={position}
            occupied={bed.occupied}
            bed={bed}
            onHover={onBedHover}
          />
        );
      })}

      {/* Lighting - Static, no flickering */}
      <ambientLight intensity={0.6} />
      <pointLight position={[0, tentHeight + 2, 0]} intensity={1.2} />
      <pointLight position={[-tentWidth / 2, tentHeight, -tentLength / 2]} intensity={0.4} />
      <pointLight position={[tentWidth / 2, tentHeight, tentLength / 2]} intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
    </group>
  );
};

export const Tent3DViewer: React.FC<Tent3DViewerProps> = ({
  tentNumber,
  beds,
  totalBeds,
  location,
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
            {t('housing.tent')} {tentNumber} - {location === 'mina' ? t('housing.mina') : t('housing.arafat')} - {t('housing.view3D')}
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
            camera={{ position: [12, 8, 12], fov: 50 }}
          >
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={8}
              maxDistance={30}
            />
            <Tent3D
              tentNumber={tentNumber}
              beds={beds}
              totalBeds={totalBeds}
              location={location}
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
