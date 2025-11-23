import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Tag } from 'antd';
import { IdcardOutlined, CalendarOutlined, GlobalOutlined } from '@ant-design/icons';
import type { MockPassportScanResult } from '../../data/mockPassports';

interface PassportViewerProps {
  passport: MockPassportScanResult;
  currentCenterId: string;
}

export const PassportViewer: React.FC<PassportViewerProps> = ({
  passport,
  currentCenterId
}) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const belongsToCenter = passport.serviceCenterId === currentCenterId;

  return (
    <Card className="shadow-xl border-2 border-gray-200 overflow-hidden">
      {/* Passport Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 mb-4 -mx-6 -mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IdcardOutlined className="text-2xl" />
            <h3 className="text-xl font-bold">{t('passport.passportDocument')}</h3>
          </div>
          <Tag color={belongsToCenter ? 'green' : 'orange'} className="text-sm">
            {belongsToCenter ? t('passport.belongsToCenter') : t('passport.belongsToAnotherCenter')}
          </Tag>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Photo Section */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-60 bg-gray-100 border-4 border-gray-300 rounded-lg overflow-hidden shadow-lg mb-4">
            {passport.photo ? (
              <img
                src={passport.photo}
                alt={passport.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <IdcardOutlined className="text-6xl text-gray-400" />
              </div>
            )}
          </div>
          <Tag color={passport.gender === 'male' ? 'blue' : 'pink'} className="text-base px-4 py-1">
            {passport.gender === 'male' ? t('form.male') : t('form.female')}
          </Tag>
        </div>

        {/* Main Info Section */}
        <div className="md:col-span-2 space-y-4">
          {/* Passport Number - Machine Readable Style */}
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-xs text-gray-500 mb-1">{t('passport.passportNumber')}</div>
            <div className="text-2xl font-mono font-bold tracking-wider text-gray-800">
              {passport.passportNumber}
            </div>
          </div>

          {/* Name */}
          <div>
            <div className="text-sm text-gray-500 mb-1">{t('passport.name')}</div>
            <div className="text-xl font-bold text-gray-800">{passport.name}</div>
          </div>

          {/* Nationality */}
          <div className="flex items-center gap-2">
            <GlobalOutlined className="text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">{t('passport.nationality')}</div>
              <div className="font-semibold text-gray-800">{passport.nationality}</div>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">{t('passport.dateOfBirth')}</div>
              <div className="font-semibold text-gray-800">
                {new Date(passport.dateOfBirth).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Visa Number */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">{t('passport.visaNumber')}</div>
            <div className="text-lg font-mono font-semibold text-gray-800">
              {passport.visaNumber}
            </div>
          </div>

          {/* Service Center */}
          <div className="pt-3 border-t">
            <div className="text-sm text-gray-500 mb-1">{t('passport.serviceCenter')}</div>
            <div className="font-semibold text-gray-800">{passport.serviceCenterName}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

