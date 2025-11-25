import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TeamOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { DashboardKPI } from '../../types/reception';

interface PreArrivalKPICardsProps {
  kpi: DashboardKPI;
  onCardClick?: (metric: string) => void;
}

export const PreArrivalKPICards: React.FC<PreArrivalKPICardsProps> = ({ kpi, onCardClick }) => {
  const { t } = useTranslation('common');

  const cards = [
    {
      key: 'totalContracted',
      title: 'التأشيرات',
      value: kpi.totalContracted.toLocaleString(),
      icon: <TeamOutlined />,
      colorScheme: {
        bgGradient: 'from-slate-100',
        iconBg: 'bg-slate-200',
        iconColor: 'text-slate-600',
        borderColor: 'border-slate-200',
        lineColor: 'bg-slate-600',
        hoverShadow: 'hover:shadow-slate-200/30'
      }
    },
    {
      key: 'totalArrived',
      title: t('reception.preArrival.kpi.totalArrived'),
      value: kpi.totalArrived.toLocaleString(),
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
      key: 'remaining',
      title: t('reception.preArrival.kpi.remaining'),
      value: kpi.remaining.toLocaleString(),
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
      key: 'todayExpected',
      title: t('reception.preArrival.kpi.todayExpected'),
      value: kpi.todayExpected.toLocaleString(),
      icon: <CalendarOutlined />,
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
      key: 'todayArrived',
      title: t('reception.preArrival.kpi.todayArrived'),
      value: kpi.todayArrived.toLocaleString(),
      icon: <ClockCircleOutlined />,
      colorScheme: {
        bgGradient: 'from-cyan-100',
        iconBg: 'bg-cyan-200',
        iconColor: 'text-cyan-600',
        borderColor: 'border-cyan-200',
        lineColor: 'bg-cyan-600',
        hoverShadow: 'hover:shadow-cyan-200/30'
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 mb-5">
      {cards.map((card) => (
        <div
          key={card.key}
          onClick={() => onCardClick?.(card.key)}
          className={`bg-white rounded-xl shadow-md p-3 border ${card.colorScheme.borderColor} hover:shadow-lg ${card.colorScheme.hoverShadow} hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col items-center justify-center`}
          style={{ minHeight: '100px' }}
        >
          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.colorScheme.bgGradient} to-transparent rounded-full -mr-10 -mt-10 opacity-40 group-hover:opacity-60 transition-opacity`}></div>
          <div className={`relative w-10 h-10 rounded-lg ${card.colorScheme.iconBg} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0`}>
            <div className={`text-base ${card.colorScheme.iconColor}`}>{card.icon}</div>
          </div>
          <h4 className="text-xs font-medium text-gray-700 mb-1.5 leading-tight text-center">{card.title}</h4>
          <span className="text-xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent text-center">{card.value}</span>
          <div className={`mt-1.5 w-8 h-0.5 ${card.colorScheme.lineColor} rounded-full flex-shrink-0`}></div>
        </div>
      ))}
    </div>
  );
};
