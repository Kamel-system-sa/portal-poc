import React from 'react';
import { Map2_5DWrapper } from './Map2_5DWrapper';
import { HomeOutlined } from '@ant-design/icons';

interface Bed {
  id: string;
  occupied: boolean;
  pilgrimId?: string;
  pilgrimName?: string;
}

interface TentBedVisualizerProps {
  beds: Bed[];
  tentNumber: string;
  totalBeds: number;
  className?: string;
  onClick?: () => void;
}

export const TentBedVisualizer: React.FC<TentBedVisualizerProps> = ({
  beds,
  tentNumber,
  totalBeds,
  className = '',
  onClick
}) => {
  // Ensure beds array matches totalBeds (10-50 beds)
  const displayBeds = Array.from({ length: totalBeds }, (_, index) => 
    beds[index] || { id: `bed-${index}`, occupied: false }
  );

  // Calculate grid columns based on bed count
  const getGridCols = () => {
    if (totalBeds <= 20) return 'grid-cols-5';
    if (totalBeds <= 30) return 'grid-cols-6';
    return 'grid-cols-7';
  };

  const occupiedCount = beds.filter(b => b.occupied).length;
  const occupancyRate = totalBeds > 0 ? (occupiedCount / totalBeds) * 100 : 0;

  return (
    <Map2_5DWrapper intensity="medium" className={className}>
      <div 
        className={`
          p-4
          rounded-xl
          border border-bordergray/50
          bg-white/80 backdrop-blur-sm
          cursor-pointer
          transition-all duration-300
          hover:shadow-lg hover:shadow-mainColor/10
          hover:-translate-y-1
          ${onClick ? '' : ''}
        `}
        onClick={onClick}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-800">Tent {tentNumber}</h4>
          <span className="text-xs font-medium text-primaryColor">
            {occupiedCount}/{totalBeds}
          </span>
        </div>

        <div className={`grid ${getGridCols()} gap-1.5 mb-3`}>
          {displayBeds.map((bed, index) => {
            const row = Math.floor(index / (totalBeds <= 20 ? 5 : totalBeds <= 30 ? 6 : 7));
            const col = index % (totalBeds <= 20 ? 5 : totalBeds <= 30 ? 6 : 7);
            const tiltX = (row % 2 === 0 ? -1 : 1) * 0.5;
            const tiltY = (col % 2 === 0 ? -1 : 1) * 0.5;

            return (
              <div
                key={bed.id}
                className={`
                  relative
                  aspect-square
                  p-1.5
                  rounded-md
                  border
                  transition-all duration-200
                  transform
                  hover:scale-110
                  hover:z-10
                  ${bed.occupied 
                    ? 'bg-primaryColor/15 border-primaryColor/40 shadow-sm' 
                    : 'bg-gray-50 border-bordergray'
                  }
                `}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`,
                }}
                title={bed.occupied ? `Occupied by ${bed.pilgrimName || 'Pilgrim'}` : 'Empty bed'}
              >
                <HomeOutlined 
                  className={`text-xs w-full h-full flex items-center justify-center ${
                    bed.occupied ? 'text-primaryColor' : 'text-customgray'
                  }`}
                />
                
                {/* 2.5D depth effect */}
                <div 
                  className="absolute inset-0 rounded-md opacity-10"
                  style={{
                    background: bed.occupied 
                      ? 'linear-gradient(135deg, rgba(0, 169, 150, 0.4) 0%, rgba(0, 121, 107, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(156, 163, 175, 0.2) 0%, rgba(229, 231, 235, 0.1) 100%)',
                    transform: 'translateZ(-3px)',
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-customgray">Occupancy</span>
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
    </Map2_5DWrapper>
  );
};

