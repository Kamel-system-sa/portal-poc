import React from 'react';
import { useTranslation } from 'react-i18next';
import { InboxOutlined } from '@ant-design/icons';
import type { Center } from '../../data/mockCenters';
import { CenterCard } from './CenterCard';

interface CentersGridProps {
  centers: Center[];
  onSelectCenter: (center: Center) => void;
}

export const CentersGrid: React.FC<CentersGridProps> = ({ centers, onSelectCenter }) => {
  const { t } = useTranslation('common');
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3">
    {centers.map((center: Center) => (
      <CenterCard
        key={center.id}
        center={center}
        onSelect={onSelectCenter}
      />
    ))}
    {centers.length === 0 && (
      <div className="col-span-full">
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 shadow-inner">
            <InboxOutlined className="text-5xl text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">{t('centers.noCenters')}</h3>
          <p className="text-sm text-gray-500 max-w-md text-center mb-6">{t('centers.startAddingCenter')}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-mainColor to-primary rounded-full"></div>
        </div>
      </div>
    )}
    </div>
  );
};

