import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  NumberOutlined, 
  ApartmentOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  UserOutlined,
  EyeOutlined,
  TeamOutlined
} from '@ant-design/icons';
import type { Center } from '../../../data/mockCenters';

interface CenterCardProps {
  center: Center;
  onSelect: (center: Center) => void;
}

export const CenterCard: React.FC<CenterCardProps> = ({ center, onSelect }) => {
  const { t } = useTranslation('common');
  
  return (
    <article
      className="bg-white rounded-xl shadow-md shadow-gray-200/50 border border-gray-100 p-4 cursor-pointer hover:shadow-xl hover:shadow-mainColor/10 hover:border-mainColor/30 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col"
      onClick={() => onSelect(center)}
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-mainColor/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Center Number on top */}
      <div className="mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-mainColor to-primary flex items-center justify-center shadow-md shadow-mainColor/20">
            <NumberOutlined className="text-white text-xs" />
          </div>
          <h4 className="text-base font-bold text-gray-900 tracking-tight">{center.number}</h4>
        </div>
      </div>

      {/* Service Type with value side by side */}
      <div className="mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <ApartmentOutlined className="text-gray-400 text-xs" />
          <span className="text-xs text-gray-500 font-medium">{t('centers.serviceType')}:</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
            center.serviceType === 'B2B' ? 'bg-blue-50 text-blue-700' :
            center.serviceType === 'B2C' ? 'bg-green-50 text-green-700' :
            'bg-purple-50 text-purple-700'
          }`}>
            {center.serviceType}
          </span>
        </div>
      </div>

      {/* Responsible person's name */}
      <div className="mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-400 text-xs" />
          <span className="text-xs text-gray-500 font-medium">{t('centers.responsible')}:</span>
          <span className="text-xs font-semibold text-gray-800 truncate">{center.responsible.name}</span>
        </div>
      </div>

      {/* Status and Capacity in the same line */}
      <div className="mb-4 flex items-center gap-4 relative z-10">
        <div className="flex items-center gap-1.5">
          {center.status === 'active' ? (
            <CheckCircleOutlined className="text-green-600 text-xs" />
          ) : (
            <CloseCircleOutlined className="text-red-600 text-xs" />
          )}
          <span className={`text-xs font-semibold ${
            center.status === 'active' ? 'text-green-600' : 'text-red-600'
          }`}>
            {center.status === 'active' ? t('centers.active') : t('centers.inactive')}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <TeamOutlined className="text-blue-600 text-xs" />
          <span className="text-xs font-semibold text-gray-700">{Math.min(center.capacity, 3500).toLocaleString()}</span>
        </div>
      </div>

      {/* View Details button at the bottom */}
      <footer className="mt-auto relative z-10">
        <button
          className="w-full px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-mainColor to-primary rounded-lg hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md shadow-mainColor/20 hover:shadow-lg hover:shadow-mainColor/30 transform group-hover:scale-[1.02]"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onSelect(center);
          }}
        >
          <EyeOutlined className="text-xs" />
          <span>{t('centers.viewDetails')}</span>
        </button>
      </footer>
    </article>
  );
};

