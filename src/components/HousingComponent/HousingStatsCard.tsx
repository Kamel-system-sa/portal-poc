import React from 'react';
import { GlassCard } from './GlassCard';

interface HousingStatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'mainColor' | 'primaryColor' | 'secondaryColor' | 'success' | 'warning' | 'danger';
}

export const HousingStatsCard: React.FC<HousingStatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'mainColor'
}) => {
  const colorClasses = {
    mainColor: 'from-mainColor to-primaryColor',
    primaryColor: 'from-primaryColor to-secondaryColor',
    secondaryColor: 'from-secondaryColor to-primaryColor',
    success: 'from-success to-green-600',
    warning: 'from-warning to-orange-600',
    danger: 'from-danger to-red-600'
  };

  return (
    <GlassCard hover={false} className="p-6 bg-white/90 border-2 border-bordergray/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-customgray uppercase tracking-wide mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
          {subtitle && (
            <p className="text-xs font-medium text-customgray">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-xs font-semibold ${
                trend.isPositive ? 'text-success' : 'text-danger'
              }`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-customgray">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300`}>
            <div className="text-white text-xl">
              {icon}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

