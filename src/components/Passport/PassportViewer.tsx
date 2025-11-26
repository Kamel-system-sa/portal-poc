import React from 'react';
import { useTranslation } from 'react-i18next';
import type { MockPassportData } from '../../data/mockPassports';

interface PassportViewerProps {
  passport: MockPassportData;
}

export const PassportViewer: React.FC<PassportViewerProps> = ({ passport }) => {
  const { t } = useTranslation('common');

  return (
    <div className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{t('passport.passportInfo')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Photo Section */}
        <div className="flex flex-col items-center md:items-start">
          <div className="w-32 h-40 bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden mb-4 shadow-sm">
            <img
              src={passport.photo}
              alt={passport.fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/male.png';
              }}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('labels.name')}
            </label>
            <p className="text-lg font-bold text-gray-900 mt-1">{passport.fullName}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {t('passport.passportNumber')}
              </label>
              <p className="text-xl font-mono font-bold text-mainColor mt-1 tracking-wider">
                {passport.passportNumber}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {t('passport.visaNumber')}
              </label>
              <p className="text-lg font-mono font-semibold text-gray-900 mt-1">
                {passport.visaNumber}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {t('form.nationality')}
              </label>
              <p className="text-base font-semibold text-gray-900 mt-1">
                {t(`nationalities.${passport.nationality.toLowerCase()}`) || passport.nationality}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {t('passport.dateOfBirth')}
              </label>
              <p className="text-base font-semibold text-gray-900 mt-1">
                {new Date(passport.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

