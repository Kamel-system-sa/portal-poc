import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  IdcardOutlined, 
  InboxOutlined, 
  CheckCircleOutlined, 
  SwapOutlined,
  GlobalOutlined,
  TeamOutlined
} from '@ant-design/icons';
import type { PassportKPI } from '../../types/passport';

interface PassportKPICardsProps {
  kpi: PassportKPI;
  onCardClick?: (metric: string) => void;
  showCenterDistribution?: boolean;
}

export const PassportKPICards: React.FC<PassportKPICardsProps> = ({ 
  kpi, 
  onCardClick,
  showCenterDistribution = false 
}) => {
  const { t } = useTranslation('common');

  const cards = [
    {
      key: 'totalReceivedToday',
      title: t('passport.kpi.totalReceivedToday'),
      value: kpi.totalReceivedToday.toLocaleString(),
      icon: <IdcardOutlined />,
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
      key: 'totalInStorage',
      title: t('passport.kpi.totalInStorage'),
      value: kpi.totalInStorage.toLocaleString(),
      icon: <InboxOutlined />,
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
      key: 'totalServiceProvided',
      title: t('passport.kpi.totalServiceProvided'),
      value: kpi.totalServiceProvided.toLocaleString(),
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
      key: 'pendingTransfers',
      title: t('passport.kpi.pendingTransfers'),
      value: kpi.pendingTransfers.toLocaleString(),
      icon: <SwapOutlined />,
      colorScheme: {
        bgGradient: 'from-amber-100',
        iconBg: 'bg-amber-200',
        iconColor: 'text-amber-600',
        borderColor: 'border-amber-200',
        lineColor: 'bg-amber-600',
        hoverShadow: 'hover:shadow-amber-200/30'
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.key}
          onClick={() => onCardClick?.(card.key)}
          className={`
            relative overflow-hidden rounded-xl border ${card.colorScheme.borderColor} 
            bg-gradient-to-br ${card.colorScheme.bgGradient} to-white
            p-5 transition-all duration-300 cursor-pointer
            ${card.colorScheme.hoverShadow} hover:scale-[1.02]
          `}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-3 rounded-lg ${card.colorScheme.iconBg}`}>
              <div className={`text-xl ${card.colorScheme.iconColor}`}>
                {card.icon}
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 font-medium">{card.title}</p>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </div>
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${card.colorScheme.lineColor}`} />
        </div>
      ))}
    </div>
  );
};

