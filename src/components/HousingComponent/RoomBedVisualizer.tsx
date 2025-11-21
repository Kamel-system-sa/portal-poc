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

interface RoomBedVisualizerProps {
  beds: Bed[];
  roomNumber: string;
  totalBeds: number;
  className?: string;
  onBedClick?: (bed: Bed) => void;
}

export const RoomBedVisualizer: React.FC<RoomBedVisualizerProps> = ({
  beds,
  roomNumber,
  totalBeds,
  className = '',
  onBedClick
}) => {
  const { t } = useTranslation('common');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [hoveredBed, setHoveredBed] = useState<Bed | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Ensure beds array matches totalBeds (2-4 beds)
  const displayBeds = Array.from({ length: totalBeds }, (_, index) => 
    beds[index] || { id: `bed-${index}`, occupied: false }
  );

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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-800">{t('housing.room')} {roomNumber}</h4>
          <span className="text-xs text-customgray">
            {beds.filter(b => b.occupied).length}/{totalBeds} {t('housing.occupied')}
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
                cursor-pointer
                ${bed.occupied 
                  ? 'bg-primaryColor/10 border-primaryColor/30 shadow-sm' 
                  : 'bg-gray-100 border-bordergray'
                }
              `}
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${index % 2 === 0 ? '-2deg' : '2deg'}) translateZ(0)`,
              }}
              onMouseEnter={(e) => handleBedHover(bed, e)}
              onMouseLeave={handleBedLeave}
              onClick={(e) => handleBedClick(bed, e)}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <FaBed 
                  className={`text-lg ${
                    bed.occupied ? 'text-primaryColor' : 'text-customgray'
                  }`}
                />
                <span className={`text-xs font-medium ${
                  bed.occupied ? 'text-primaryColor' : 'text-customgray'
                }`}>
                  {bed.occupied ? t('housing.occupied') : t('housing.empty')}
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

