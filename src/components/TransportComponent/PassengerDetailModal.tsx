import React from 'react';
import { Modal, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../HousingComponent/GlassCard';
import type { Passenger } from '../../types/transport';
import { UserOutlined, PhoneOutlined, IdcardOutlined, FileTextOutlined, CloseOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';

interface PassengerDetailModalProps {
  open: boolean;
  onClose: () => void;
  passenger: Passenger | null;
}

export const PassengerDetailModal: React.FC<PassengerDetailModalProps> = ({
  open,
  onClose,
  passenger
}) => {
  const { t } = useTranslation('Transport');
  const { t: tCommon } = useTranslation('common');

  if (!passenger) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={900}
      className="passenger-details-modal"
      closeIcon={<CloseOutlined className="text-gray-500 hover:text-gray-700" />}
    >
      <GlassCard className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Profile Section */}
          <div className="lg:w-1/3 bg-gradient-to-br from-primaryColor/10 to-secondaryColor/10 p-6 lg:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-bordergray">
            <div className="w-24 h-24 rounded-full bg-white border-2 border-bordergray flex items-center justify-center shadow-xl mb-4 overflow-hidden">
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
                <ManOutlined className="text-primaryColor text-4xl" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {passenger.fullName}
            </h3>
            <p className="text-sm text-customgray mb-4 text-center">
              {passenger.gender === 'female' ? (tCommon('housing.female') || 'Female') : (tCommon('housing.male') || 'Male')}
            </p>
          </div>

          {/* Right Side - Details Section */}
          <div className="lg:w-2/3 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-primaryColor to-secondaryColor rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900">{t('passengerDetails')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined className="text-primaryColor" />
                  <span className="text-xs font-semibold text-customgray uppercase">{t('fullName')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{passenger.fullName}</p>
              </div>

              {/* Gender */}
              {passenger.gender && (
                <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                  <div className="flex items-center gap-2 mb-2">
                    {passenger.gender === 'female' ? (
                      <WomanOutlined className="text-primaryColor" />
                    ) : (
                      <ManOutlined className="text-primaryColor" />
                    )}
                    <span className="text-xs font-semibold text-customgray uppercase">{tCommon('housing.gender') || 'Gender'}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {passenger.gender === 'female' ? (tCommon('housing.female') || 'Female') : (tCommon('housing.male') || 'Male')}
                  </p>
                </div>
              )}

              {/* ID Number */}
              <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="flex items-center gap-2 mb-2">
                  <IdcardOutlined className="text-primaryColor" />
                  <span className="text-xs font-semibold text-customgray uppercase">{t('idNumber')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{passenger.idNumber}</p>
              </div>

              {/* Passport Number */}
              <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="flex items-center gap-2 mb-2">
                  <IdcardOutlined className="text-primaryColor" />
                  <span className="text-xs font-semibold text-customgray uppercase">{t('passportNumber')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{passenger.passportNumber}</p>
              </div>

              {/* Seat Number */}
              <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined className="text-primaryColor" />
                  <span className="text-xs font-semibold text-customgray uppercase">{t('seatNumber')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{passenger.seatNumber}</p>
              </div>

              {/* Phone Number */}
              <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="flex items-center gap-2 mb-2">
                  <PhoneOutlined className="text-primaryColor" />
                  <span className="text-xs font-semibold text-customgray uppercase">{t('phoneNumber')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{passenger.phoneNumber}</p>
              </div>

              {/* Notes */}
              {passenger.notes && (
                <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextOutlined className="text-primaryColor" />
                    <span className="text-xs font-semibold text-customgray uppercase">{t('notes')}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{passenger.notes}</p>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <Button onClick={onClose} type="default">
                {t('close')}
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </Modal>
  );
};
