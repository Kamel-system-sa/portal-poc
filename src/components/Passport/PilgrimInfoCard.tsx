import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserOutlined } from '@ant-design/icons';
import type { MockPassportData } from '../../data/mockPassports';

interface PilgrimInfoCardProps {
  passport: MockPassportData;
}

export const PilgrimInfoCard: React.FC<PilgrimInfoCardProps> = ({ passport }) => {
  const { t } = useTranslation('common');

  return (
    <div className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mainColor to-primaryColor flex items-center justify-center shadow-md shadow-mainColor/20">
          <UserOutlined className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{t('passport.pilgrimInfo')}</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {t('labels.name')}
          </label>
          <p className="text-base font-semibold text-gray-900 mt-1">{passport.fullName}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('passport.passportNumber')}
            </label>
            <p className="text-sm font-mono font-semibold text-gray-700 mt-1">
              {passport.passportNumber}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('passport.visaNumber')}
            </label>
            <p className="text-sm font-mono font-semibold text-gray-700 mt-1">
              {passport.visaNumber}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('form.nationality')}
            </label>
            <p className="text-sm font-semibold text-gray-700 mt-1">
              {t(`nationalities.${passport.nationality.toLowerCase()}`) || passport.nationality}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('passport.dateOfBirth')}
            </label>
            <p className="text-sm font-semibold text-gray-700 mt-1">
              {new Date(passport.dateOfBirth).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

