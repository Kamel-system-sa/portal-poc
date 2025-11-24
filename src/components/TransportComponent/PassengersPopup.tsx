import React from 'react';
import { Modal, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../HousingComponent/GlassCard';
import type { Passenger } from '../../types/transport';
import { UserOutlined, CloseOutlined, PhoneOutlined, IdcardOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';

interface PassengersPopupProps {
  open: boolean;
  onClose: () => void;
  passengers: Passenger[];
  onPassengerClick: (passenger: Passenger) => void;
}

export const PassengersPopup: React.FC<PassengersPopupProps> = ({
  open,
  onClose,
  passengers,
  onPassengerClick
}) => {
  const { t } = useTranslation('Transport');

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <UserOutlined className="text-primaryColor" />
          <span className="text-xl font-bold">{t('passengers')} ({passengers.length})</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
      className="passengers-popup-modal"
      closeIcon={<CloseOutlined className="text-gray-500 hover:text-gray-700" />}
      centered
    >
      <div className="mt-4">
        {passengers.length === 0 ? (
          <div className="text-center py-12 text-customgray">
            {t('noPassengers')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto px-1">
            {passengers.map((passenger) => (
              <GlassCard
                key={passenger.id}
                className="p-4 border-2 border-bordergray/50 bg-white/90 hover:shadow-xl hover:border-primaryColor/50 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  onPassengerClick(passenger);
                  onClose();
                }}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-bordergray flex items-center justify-center shadow-lg overflow-hidden">
                    {passenger.gender === 'female' ? (
                      <img 
                        src="/images/female.png" 
                        alt={passenger.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : passenger.gender === 'male' ? (
                      <img 
                        src="/images/male.png" 
                        alt={passenger.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserOutlined className="text-primaryColor text-2xl" />
                    )}
                  </div>

                  {/* Name */}
                  <div className="w-full">
                    <h4 className="font-bold text-gray-800 text-sm mb-1 truncate" title={passenger.fullName}>
                      {passenger.fullName}
                    </h4>
                  </div>

                  {/* Details */}
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-center gap-2 text-xs text-customgray">
                      <IdcardOutlined className="text-primaryColor" />
                      <span className="truncate">{t('seatNumber')}: {passenger.seatNumber}</span>
                    </div>
                    {passenger.gender && (
                      <div className="flex items-center justify-center gap-2 text-xs text-customgray">
                        {passenger.gender === 'female' ? (
                          <WomanOutlined className="text-primaryColor" />
                        ) : (
                          <ManOutlined className="text-primaryColor" />
                        )}
                        <span className="truncate">
                          {passenger.gender === 'female' ? t('female') : t('male')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Click indicator */}
                  <div className="text-xs text-primaryColor font-semibold mt-1">
                    {t('viewDetails')} →
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
