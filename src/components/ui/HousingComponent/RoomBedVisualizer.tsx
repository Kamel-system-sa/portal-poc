import React from 'react';
import { Map2_5DWrapper } from './Map2_5DWrapper';
import { HomeOutlined } from '@ant-design/icons';

interface Bed {
  id: string;
  occupied: boolean;
  pilgrimId?: string;
  pilgrimName?: string;
}

interface RoomBedVisualizerProps {
  beds: Bed[];
  roomNumber: string;
  totalBeds: number;
  className?: string;
}

export const RoomBedVisualizer: React.FC<RoomBedVisualizerProps> = ({
  beds,
  roomNumber,
  totalBeds,
  className = ''
}) => {
  // Ensure beds array matches totalBeds (2-4 beds)
  const displayBeds = Array.from({ length: totalBeds }, (_, index) => 
    beds[index] || { id: `bed-${index}`, occupied: false }
  );

  return (
    <Map2_5DWrapper intensity="medium" className={className}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-800">Room {roomNumber}</h4>
          <span className="text-xs text-customgray">
            {beds.filter(b => b.occupied).length}/{totalBeds} occupied
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {displayBeds.map((bed, index) => (
            <div
              key={bed.id}
              className={`
                relative
                p-3
                rounded-lg
                border
                transition-all duration-300
                transform
                hover:scale-105
                hover:shadow-md
                ${bed.occupied 
                  ? 'bg-primaryColor/10 border-primaryColor/30 shadow-sm' 
                  : 'bg-gray-100 border-bordergray'
                }
              `}
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${index % 2 === 0 ? '-2deg' : '2deg'}) translateZ(0)`,
              }}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <HomeOutlined 
                  className={`text-lg ${
                    bed.occupied ? 'text-primaryColor' : 'text-customgray'
                  }`}
                />
                <span className={`text-xs font-medium ${
                  bed.occupied ? 'text-primaryColor' : 'text-customgray'
                }`}>
                  {bed.occupied ? 'Occupied' : 'Empty'}
                </span>
              </div>
              
              {/* 2.5D depth effect */}
              <div 
                className="absolute inset-0 rounded-lg opacity-20"
                style={{
                  background: bed.occupied 
                    ? 'linear-gradient(135deg, rgba(0, 169, 150, 0.3) 0%, rgba(0, 121, 107, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(156, 163, 175, 0.2) 0%, rgba(229, 231, 235, 0.1) 100%)',
                  transform: 'translateZ(-5px)',
                  filter: 'blur(2px)'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </Map2_5DWrapper>
  );
};

