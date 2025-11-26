import React from 'react';
import { useTranslation } from 'react-i18next';
import { TeamOutlined } from '@ant-design/icons';
import type { MockPassportData } from '../../data/mockPassports';

interface OrganizerInfoCardProps {
  passport: MockPassportData;
}

export const OrganizerInfoCard: React.FC<OrganizerInfoCardProps> = ({ passport }) => {
  const { t } = useTranslation('common');

  return (
    <div className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primaryColor to-secondaryColor flex items-center justify-center shadow-md shadow-primaryColor/20">
          <TeamOutlined className="text-white text-lg" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{t('passport.organizerInfo')}</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {t('reception.preArrival.form.organizerNumber')}
          </label>
          <p className="text-base font-semibold text-gray-900 mt-1">
            {passport.organizer.number}
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {t('reception.preArrival.form.organizerName')}
          </label>
          <p className="text-base font-semibold text-gray-900 mt-1">
            {passport.organizer.name}
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {t('reception.preArrival.form.organizerCompany')}
          </label>
          <p className="text-base font-semibold text-gray-900 mt-1">
            {passport.organizer.company}
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {t('passport.campaign')}
          </label>
          <p className="text-base font-semibold text-gray-900 mt-1">
            {passport.campaign.number} - {passport.campaign.name}
          </p>
        </div>
      </div>
    </div>
  );
};

