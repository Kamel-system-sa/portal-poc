import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShopOutlined, TeamOutlined, BankOutlined, GlobalOutlined } from '@ant-design/icons';
import type { Center } from '../../data/mockCenters';

interface SummaryCardsProps {
  centers: Center[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ centers }) => {
  const { t } = useTranslation('common');

  const b2bCenters = centers.filter((c: Center) => c.serviceType === 'B2B').length;
  const b2cCenters = centers.filter((c: Center) => c.serviceType === 'B2C').length;
  const b2gCenters = centers.filter((c: Center) => c.serviceType === 'B2G').length;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mainColor to-primary flex items-center justify-center shadow-lg shadow-mainColor/20">
          <GlobalOutlined className="text-xl text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{t('centers.totalCenters')}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{t('centers.totalCentersSubtitle')}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100 hover:shadow-xl hover:shadow-blue-200/30 hover:-translate-y-1 hover:border-blue-200/50 transition-all duration-300 flex flex-col items-center group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
            <ShopOutlined className="text-2xl text-white" />
          </div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 tracking-wide">{t('centers.b2bCenters')}</h4>
          <span className="text-4xl font-extrabold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent">{b2bCenters}</span>
          <div className="mt-2 w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100 hover:shadow-xl hover:shadow-green-200/30 hover:-translate-y-1 hover:border-green-200/50 transition-all duration-300 flex flex-col items-center group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
            <TeamOutlined className="text-2xl text-white" />
          </div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 tracking-wide">{t('centers.b2cCenters')}</h4>
          <span className="text-4xl font-extrabold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent">{b2cCenters}</span>
          <div className="mt-2 w-12 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100 hover:shadow-xl hover:shadow-purple-200/30 hover:-translate-y-1 hover:border-purple-200/50 transition-all duration-300 flex flex-col items-center group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
            <BankOutlined className="text-2xl text-white" />
          </div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 tracking-wide">{t('centers.b2gCenters')}</h4>
          <span className="text-4xl font-extrabold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent">{b2gCenters}</span>
          <div className="mt-2 w-12 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
