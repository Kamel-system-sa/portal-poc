import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShopOutlined, TeamOutlined, BankOutlined, GlobalOutlined, AppstoreOutlined } from '@ant-design/icons';
import type { Center } from '../../data/mockCenters';

interface SummaryCardsProps {
  centers: Center[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ centers }) => {
  const { t } = useTranslation('common');

  const totalCenters = centers.length;
  const b2bCenters = centers.filter((c: Center) => c.serviceType === 'B2B').length;
  const b2cCenters = centers.filter((c: Center) => c.serviceType === 'B2C').length;
  const b2gCenters = centers.filter((c: Center) => c.serviceType === 'B2G').length;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-5 md:mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mainColor to-primary flex items-center justify-center shadow-lg shadow-mainColor/20 flex-shrink-0">
          <GlobalOutlined className="text-xl text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight break-words">{t('centers.totalCenters')}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 break-words">{t('centers.totalCentersSubtitle')}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
            <AppstoreOutlined className="text-lg text-blue-600" />
          </div>
          <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('centers.totalCenters')}</h4>
          <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{totalCenters}</span>
          <div className="mt-2 w-10 h-0.5 bg-blue-600 rounded-full flex-shrink-0"></div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-indigo-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
            <ShopOutlined className="text-lg text-indigo-600" />
          </div>
          <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('centers.b2bCenters')}</h4>
          <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{b2bCenters}</span>
          <div className="mt-2 w-10 h-0.5 bg-indigo-600 rounded-full flex-shrink-0"></div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-emerald-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
            <TeamOutlined className="text-lg text-emerald-600" />
          </div>
          <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('centers.b2cCenters')}</h4>
          <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{b2cCenters}</span>
          <div className="mt-2 w-10 h-0.5 bg-emerald-600 rounded-full flex-shrink-0"></div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-teal-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
            <BankOutlined className="text-lg text-teal-600" />
          </div>
          <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('centers.b2gCenters')}</h4>
          <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{b2gCenters}</span>
          <div className="mt-2 w-10 h-0.5 bg-teal-600 rounded-full flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
};
