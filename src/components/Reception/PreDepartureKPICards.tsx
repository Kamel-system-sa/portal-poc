import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TeamOutlined, 
  CheckCircleOutlined, 
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FileOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import type { DepartureDashboardKPI } from '../../types/reception';

interface PreDepartureKPICardsProps {
  kpi: DepartureDashboardKPI;
  onCardClick?: (metric: string) => void;
}

export const PreDepartureKPICards: React.FC<PreDepartureKPICardsProps> = ({ kpi, onCardClick }) => {
  const { t } = useTranslation('common');

  const cards = [
    {
      key: 'registeredPilgrimsInCenter',
      title: t('reception.preArrival.departures.dashboard.registeredPilgrimsInCenter') || 'عدد الحجاج المسجلين في المركز',
      value: kpi.registeredPilgrimsInCenter.toLocaleString(),
      icon: <TeamOutlined />,
      colorScheme: {
        bgGradient: 'from-blue-100',
        iconBg: 'bg-blue-200',
        iconColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        lineColor: 'bg-blue-600',
        hoverShadow: 'hover:shadow-blue-200/30'
      }
    },
    {
      key: 'arrivedPilgrimsCount',
      title: t('reception.preArrival.departures.dashboard.arrivedPilgrimsCount') || 'مجموع الحجاج الواصلين / نسبة الحجاج الواصلين',
      value: `${kpi.arrivedPilgrimsCount.toLocaleString()} (${kpi.arrivedPilgrimsPercentage}%)`,
      icon: <CheckCircleOutlined />,
      colorScheme: {
        bgGradient: 'from-emerald-100',
        iconBg: 'bg-emerald-200',
        iconColor: 'text-emerald-600',
        borderColor: 'border-emerald-200',
        lineColor: 'bg-emerald-600',
        hoverShadow: 'hover:shadow-emerald-200/30'
      }
    },
    {
      key: 'organizersCount',
      title: t('reception.preArrival.departures.dashboard.organizersCount') || 'عدد المنظمين في المركز',
      value: kpi.organizersCount.toLocaleString(),
      icon: <UserOutlined />,
      colorScheme: {
        bgGradient: 'from-amber-100',
        iconBg: 'bg-amber-200',
        iconColor: 'text-amber-600',
        borderColor: 'border-amber-200',
        lineColor: 'bg-amber-600',
        hoverShadow: 'hover:shadow-amber-200/30'
      }
    },
    {
      key: 'pilgrimsInMakkah',
      title: t('reception.preArrival.departures.dashboard.pilgrimsInMakkah') || 'مجموع الحجاج المتواجدين في مكة',
      value: kpi.pilgrimsInMakkah.toLocaleString(),
      icon: <HomeOutlined />,
      colorScheme: {
        bgGradient: 'from-violet-100',
        iconBg: 'bg-violet-200',
        iconColor: 'text-violet-600',
        borderColor: 'border-violet-200',
        lineColor: 'bg-violet-600',
        hoverShadow: 'hover:shadow-violet-200/30'
      }
    },
    {
      key: 'registeredCampaigns',
      title: t('reception.preArrival.departures.dashboard.registeredCampaigns') || 'عدد الحملات المسجلة',
      value: kpi.registeredCampaigns.toLocaleString(),
      icon: <FileOutlined />,
      colorScheme: {
        bgGradient: 'from-cyan-100',
        iconBg: 'bg-cyan-200',
        iconColor: 'text-cyan-600',
        borderColor: 'border-cyan-200',
        lineColor: 'bg-cyan-600',
        hoverShadow: 'hover:shadow-cyan-200/30'
      }
    },
    {
      key: 'pilgrimsInMadinah',
      title: t('reception.preArrival.departures.dashboard.pilgrimsInMadinah') || 'مجموع الحجاج المتواجدين في المدينة',
      value: kpi.pilgrimsInMadinah.toLocaleString(),
      icon: <HomeOutlined />,
      colorScheme: {
        bgGradient: 'from-indigo-100',
        iconBg: 'bg-indigo-200',
        iconColor: 'text-indigo-600',
        borderColor: 'border-indigo-200',
        lineColor: 'bg-indigo-600',
        hoverShadow: 'hover:shadow-indigo-200/30'
      }
    },
    {
      key: 'expectedArrivalsCount',
      title: t('reception.preArrival.departures.dashboard.expectedArrivalsCount') || 'مجموع الحجاج المتوقع وصولهم',
      value: `${kpi.expectedArrivalsCount.toLocaleString()} (${kpi.expectedArrivalsPercentage}%)`,
      icon: <CalendarOutlined />,
      colorScheme: {
        bgGradient: 'from-purple-100',
        iconBg: 'bg-purple-200',
        iconColor: 'text-purple-600',
        borderColor: 'border-purple-200',
        lineColor: 'bg-purple-600',
        hoverShadow: 'hover:shadow-purple-200/30'
      }
    },
    {
      key: 'departedPilgrimsCount',
      title: t('reception.preArrival.departures.dashboard.departedPilgrimsCount') || 'عدد الحجاج المغادرين',
      value: `${kpi.departedPilgrimsCount.toLocaleString()} (${kpi.departedPilgrimsPercentage}%)`,
      icon: <ClockCircleOutlined />,
      colorScheme: {
        bgGradient: 'from-orange-100',
        iconBg: 'bg-orange-200',
        iconColor: 'text-orange-600',
        borderColor: 'border-orange-200',
        lineColor: 'bg-orange-600',
        hoverShadow: 'hover:shadow-orange-200/30'
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {cards.map((card) => (
        <div
          key={card.key}
          onClick={() => onCardClick?.(card.key)}
          className={`bg-white rounded-xl shadow-md p-4 border ${card.colorScheme.borderColor} hover:shadow-lg ${card.colorScheme.hoverShadow} hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col`}
          style={{ minHeight: '120px' }}
        >
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.colorScheme.bgGradient} to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity`}></div>
          <div className={`relative w-12 h-12 rounded-lg ${card.colorScheme.iconBg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0`}>
            <div className={`text-lg ${card.colorScheme.iconColor}`}>{card.icon}</div>
          </div>
          <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{card.title}</h4>
          <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{card.value}</span>
          <div className={`mt-2 w-10 h-0.5 ${card.colorScheme.lineColor} rounded-full flex-shrink-0`}></div>
        </div>
      ))}
    </div>
  );
};

