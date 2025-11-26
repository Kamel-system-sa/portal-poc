import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../HousingComponent/GlassCard';
import { 
  HomeOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  CarOutlined, 
  EnvironmentOutlined,
  EyeOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Button } from 'antd';
import type { CityTransfer, MashairTransfer } from '../../types/transport';

interface TransferCardProps {
  transfer: CityTransfer | MashairTransfer;
  onBusDetailsClick: (busId: string) => void;
  onArrivalClick: (busId: string) => void;
}

export const TransferCard: React.FC<TransferCardProps> = ({ 
  transfer, 
  onBusDetailsClick,
  onArrivalClick 
}) => {
  const { t } = useTranslation('Transport');
  const isMashair = 'route' in transfer;
  
  // For Mashair transfers, show Bus number as title
  const getTitle = () => {
    if (isMashair && transfer.buses.length > 0) {
      return `Bus ${transfer.buses[0].busNumber}`;
    }
    return transfer.hotelName;
  };
  
  return (
    <GlassCard className="p-5 border-2 border-bordergray/50 bg-white/90 hover:shadow-xl transition-all duration-300">
      <div className="space-y-4">
        {/* Header - Hotel Name or Bus Names */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {!isMashair && <HomeOutlined className="text-primaryColor text-xl" />}
            {isMashair && <CarOutlined className="text-primaryColor text-xl" />}
            <h3 className="text-xl font-bold text-gray-800">{getTitle()}</h3>
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-primaryColor" />
            <div>
              <div className="text-xs text-customgray">{t('date')}</div>
              <div className="font-semibold text-gray-800">{transfer.date}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-primaryColor" />
            <div>
              <div className="text-xs text-customgray">{t('time')}</div>
              <div className="font-semibold text-gray-800">{transfer.time}</div>
            </div>
          </div>
        </div>

        {/* Number of Buses - Only show for non-Mashair */}
        {!isMashair && (
          <div className="flex items-center gap-2 pt-2 border-t border-bordergray">
            <CarOutlined className="text-primaryColor" />
            <div>
              <div className="text-xs text-customgray">{t('busesCount')}</div>
              <div className="font-semibold text-gray-800">{transfer.busesCount} {t('buses')}</div>
            </div>
          </div>
        )}
        
        {/* City or Route */}
        <div className="flex items-center gap-2 pt-2 border-t border-bordergray">
          <EnvironmentOutlined className="text-primaryColor" />
          <div>
            <div className="text-xs text-customgray">
              {isMashair ? t('route') : t('city')}
            </div>
            <div className="font-semibold text-gray-800">
              {isMashair 
                ? transfer.route 
                : (transfer as any).fromCity && (transfer as any).toCity
                  ? `${(transfer as any).fromCity} → ${(transfer as any).toCity}`
                  : transfer.city}
            </div>
          </div>
        </div>

        {/* Responses List - For Mashair: each response is a small card inside the big card */}
        {isMashair && transfer.buses.length > 0 && (
          <div className="pt-3 border-t border-bordergray space-y-3">
            {transfer.buses.map((bus, idx) => (
              <div 
                key={bus.id} 
                className="bg-gray-50 rounded-lg p-3 border-2 border-gray-200 shadow-sm"
              >
                {/* Small Card Header - Response Title */}
                <div className="flex items-start justify-between mb-3 pb-2 border-b border-gray-300">
                  <h4 className="text-base font-bold text-gray-800">
                    {t('response')} {bus.responseNumber || bus.busNumber}
                  </h4>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    bus.arrivalStatus === 'arrived' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {bus.arrivalStatus === 'arrived' ? t('arrived') : t('notArrived')}
                  </div>
                </div>
                
                <div className="text-sm text-customgray mb-3">
                  {t('passengerCount')}: <span className="font-semibold text-gray-800">{bus.passengerCount}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="default"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => onBusDetailsClick(bus.id)}
                    className="flex-1"
                  >
                    {t('details')}
                  </Button>
                  {bus.arrivalStatus === 'not_arrived' && (
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      size="small"
                      onClick={() => onArrivalClick(bus.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {t('markArrival')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Buses List - For City transfers */}
        {!isMashair && transfer.buses.length > 1 && (
          <div className="pt-3 border-t border-bordergray space-y-3">
            {transfer.buses.slice(0, 4).map((bus) => (
              <div 
                key={bus.id} 
                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-xs text-customgray">{t('busNumber')}</div>
                    <div className="font-semibold text-gray-800">{bus.busNumber}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    bus.arrivalStatus === 'arrived' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {bus.arrivalStatus === 'arrived' ? t('arrived') : t('notArrived')}
                  </div>
                </div>
                
                <div className="text-sm text-customgray mb-3">
                  {t('passengerCount')}: <span className="font-semibold text-gray-800">{bus.passengerCount}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="default"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => onBusDetailsClick(bus.id)}
                    className="flex-1"
                  >
                    {t('details')}
                  </Button>
                  {bus.arrivalStatus === 'not_arrived' && (
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      size="small"
                      onClick={() => onArrivalClick(bus.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {t('markArrival')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Single Bus - For City transfers */}
        {!isMashair && transfer.buses.length === 1 && (
          <div className="pt-3 border-t border-bordergray">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-customgray mb-1">
                  {t('passengerCount')}: <span className="font-semibold text-gray-800">{transfer.buses[0].passengerCount}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  transfer.buses[0].arrivalStatus === 'arrived' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {transfer.buses[0].arrivalStatus === 'arrived' ? t('arrived') : t('notArrived')}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => onBusDetailsClick(transfer.buses[0].id)}
                  className="flex-1"
                >
                  {t('details')}
                </Button>
                {transfer.buses[0].arrivalStatus === 'not_arrived' && (
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    size="small"
                    onClick={() => onArrivalClick(transfer.buses[0].id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {t('markArrival')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

