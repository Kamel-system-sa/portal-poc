import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';
import { 
  CloseOutlined,
  CarOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import type { CityTransferBus, MashairTransferBus } from '../../types/transport';

// Type guard to check if bus is MashairTransferBus
const isMashairBus = (bus: CityTransferBus | MashairTransferBus): bus is MashairTransferBus => {
  return 'destinationLocation' in bus;
};

interface BusDetailsModalProps {
  open: boolean;
  onClose: () => void;
  bus: CityTransferBus | MashairTransferBus | null;
  isMashair?: boolean;
}

export const BusDetailsModal: React.FC<BusDetailsModalProps> = ({
  open,
  onClose,
  bus,
  isMashair = false
}) => {
  const { t } = useTranslation('Transport');

  if (!bus) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      closeIcon={<CloseOutlined />}
      title={
        <div className="flex items-center gap-2">
          <CarOutlined className="text-primaryColor" />
          <span>{t('busDetails')} - {t('responseNumber')} {bus.busNumber}</span>
        </div>
      }
    >
      <div className="space-y-4 mt-4">
        {/* Destination */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <EnvironmentOutlined className="text-primaryColor" />
            <span className="text-sm font-semibold text-gray-700">
              {t('destination')}
            </span>
          </div>
          {isMashair ? (
            <p className="text-gray-800 font-semibold">
              {isMashairBus(bus) && bus.destinationLocation === 'Makkah'
                ? bus.destinationHotel
                : isMashairBus(bus) ? bus.destinationLocation : bus.destinationHotel}
            </p>
          ) : (
            <p className="text-gray-800 font-semibold">
              {bus.destinationCity === 'Jeddah' && bus.destinationHotel === 'المطار' 
                ? t('airport') || 'المطار'
                : bus.destinationHotel}
            </p>
          )}
        </div>

        {/* Driver Information */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">{t('driverInfo')}</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserOutlined className="text-blue-600" />
              <span className="text-sm text-gray-700">{t('driverName')}:</span>
              <span className="font-semibold text-gray-800">{bus.driverName}</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneOutlined className="text-blue-600" />
              <span className="text-sm text-gray-700">{t('driverPhone')}:</span>
              <span className="font-semibold text-gray-800">{bus.driverPhone}</span>
            </div>
          </div>
        </div>

        {/* Guide Information */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">{t('guideInfo')}</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserOutlined className="text-green-600" />
              <span className="text-sm text-gray-700">{t('guideName')}:</span>
              <span className="font-semibold text-gray-800">{bus.guideName}</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneOutlined className="text-green-600" />
              <span className="text-sm text-gray-700">{t('guidePhone')}:</span>
              <span className="font-semibold text-gray-800">{bus.guidePhone}</span>
            </div>
          </div>
        </div>

        {/* Passenger Count */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserOutlined className="text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">{t('passengerCount')}</span>
            </div>
            <span className="text-2xl font-bold text-purple-600">{bus.passengerCount}</span>
          </div>
        </div>

        {/* Arrival Status */}
        <div className={`rounded-lg p-4 ${
          bus.arrivalStatus === 'arrived' 
            ? 'bg-green-50 border-2 border-green-200' 
            : 'bg-yellow-50 border-2 border-yellow-200'
        }`}>
          <div className="flex items-center gap-2">
            {bus.arrivalStatus === 'arrived' ? (
              <CheckCircleOutlined className="text-green-600 text-xl" />
            ) : (
              <CloseCircleOutlined className="text-yellow-600 text-xl" />
            )}
            <span className={`font-semibold ${
              bus.arrivalStatus === 'arrived' ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {bus.arrivalStatus === 'arrived' ? t('arrived') : t('notArrived')}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

