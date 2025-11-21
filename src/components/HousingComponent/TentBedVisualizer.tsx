import React, { useState } from 'react';
import { Map2_5DWrapper } from './Map2_5DWrapper';
import { useTranslation } from 'react-i18next';
import { FaBed } from 'react-icons/fa';
import { Modal } from 'antd';
import { GlassCard } from './GlassCard';
import { UserOutlined, PhoneOutlined, GlobalOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';

interface Bed {
  id: string;
  occupied: boolean;
  pilgrimId?: string;
  pilgrimName?: string;
  pilgrimGender?: 'male' | 'female';
}

interface TentBedVisualizerProps {
  beds: Bed[];
  tentNumber: string;
  totalBeds: number;
  className?: string;
  onBedClick?: (bed: Bed) => void;
}

export const TentBedVisualizer: React.FC<TentBedVisualizerProps> = ({
  beds,
  tentNumber,
  totalBeds,
  className = '',
  onBedClick
}) => {
  const { t } = useTranslation('common');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [hoveredBed, setHoveredBed] = useState<Bed | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

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

  const handleBedHover = (bed: Bed, event: React.MouseEvent) => {
    if (bed.occupied) {
      setHoveredBed(bed);
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    }
  };

  const handleBedLeave = () => {
    setHoveredBed(null);
    setTooltipPosition(null);
  };

  const handleBedClick = (bed: Bed, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    // Always call onBedClick if provided, regardless of occupied status
    if (onBedClick) {
      onBedClick(bed);
    } else if (bed.occupied) {
      setSelectedBed(bed);
    }
  };

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
          <h4 className="text-sm font-semibold text-gray-800">{t('housing.tent')} {tentNumber}</h4>
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
                  cursor-pointer
                  ${bed.occupied 
                    ? 'bg-primaryColor/15 border-primaryColor/40 shadow-sm' 
                    : 'bg-gray-50 border-bordergray'
                  }
                `}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`,
                }}
                onMouseEnter={(e) => handleBedHover(bed, e)}
                onMouseLeave={handleBedLeave}
                onClick={(e) => handleBedClick(bed, e)}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <FaBed 
                    className={`${
                      bed.occupied ? 'text-primaryColor' : 'text-customgray'
                    }`}
                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                  />
                </div>
                
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

        {/* Occupancy bar moved below */}
        <div className="mt-3 pt-3 border-t border-bordergray/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-customgray">{t('housing.occupancy')}</span>
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
      {hoveredBed && tooltipPosition && hoveredBed.occupied && (
        <div
          className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs shadow-xl pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-semibold mb-1">{hoveredBed.pilgrimName || t('housing.pilgrim')}</div>
          {hoveredBed.pilgrimGender && (
            <div className="text-gray-300">
              {t(`housing.${hoveredBed.pilgrimGender}`)}
            </div>
          )}
        </div>
      )}

      {/* Bed Details Modal */}
      <Modal
        open={!!selectedBed}
        onCancel={() => setSelectedBed(null)}
        footer={null}
        centered
        width={500}
        className="bed-details-modal"
      >
        {selectedBed && selectedBed.occupied && (
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-primaryColor to-secondaryColor rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900">{t('housing.bedDetails')}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primaryColor to-secondaryColor flex items-center justify-center">
                  {selectedBed.pilgrimGender === 'female' ? (
                    <WomanOutlined className="text-white text-lg" />
                  ) : (
                    <ManOutlined className="text-white text-lg" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{selectedBed.pilgrimName || t('housing.pilgrim')}</h4>
                  {selectedBed.pilgrimGender && (
                    <p className="text-sm text-customgray">{t(`housing.${selectedBed.pilgrimGender}`)}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white border border-bordergray rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <UserOutlined className="text-primaryColor" />
                    <span className="text-xs font-semibold text-customgray uppercase">{t('housing.pilgrim')}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{selectedBed.pilgrimName || t('housing.unknown')}</p>
                </div>

                <div className="p-3 bg-white border border-bordergray rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    {selectedBed.pilgrimGender === 'female' ? (
                      <WomanOutlined className="text-primaryColor" />
                    ) : (
                      <ManOutlined className="text-primaryColor" />
                    )}
                    <span className="text-xs font-semibold text-customgray uppercase">{t('housing.gender')}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedBed.pilgrimGender ? t(`housing.${selectedBed.pilgrimGender}`) : t('housing.unknown')}
                  </p>
                </div>

                <div className="p-3 bg-white border border-bordergray rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <PhoneOutlined className="text-primaryColor" />
                    <span className="text-xs font-semibold text-customgray uppercase">{t('housing.phone')}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{t('housing.notAvailable')}</p>
                </div>

                <div className="p-3 bg-white border border-bordergray rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <GlobalOutlined className="text-primaryColor" />
                    <span className="text-xs font-semibold text-customgray uppercase">{t('form.nationality')}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{t('housing.notAvailable')}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        )}
      </Modal>
    </Map2_5DWrapper>
  );
};

