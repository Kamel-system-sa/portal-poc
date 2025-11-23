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
  const colorConfig = {
    mainColor: {
      gradient: 'from-mainColor to-primaryColor',
      iconGradient: 'from-mainColor via-mainColor/90 to-primaryColor',
      iconColor: 'text-white',
      valueColor: 'text-mainColor',
      titleColor: 'text-gray-600',
      subtitleColor: 'text-gray-500',
      shadow: 'shadow-mainColor/20'
    },
    primaryColor: {
      gradient: 'from-primaryColor to-secondaryColor',
      iconGradient: 'from-primaryColor via-primaryColor/90 to-secondaryColor',
      iconColor: 'text-white',
      valueColor: 'text-primaryColor',
      titleColor: 'text-gray-600',
      subtitleColor: 'text-gray-500',
      shadow: 'shadow-primaryColor/20'
    },
    secondaryColor: {
      gradient: 'from-secondaryColor to-primaryColor',
      iconGradient: 'from-secondaryColor via-secondaryColor/90 to-primaryColor',
      iconColor: 'text-white',
      valueColor: 'text-secondaryColor',
      titleColor: 'text-gray-600',
      subtitleColor: 'text-gray-500',
      shadow: 'shadow-secondaryColor/20'
    },
    success: {
      gradient: 'from-green-500 to-green-600',
      iconGradient: 'from-green-500 via-green-500/90 to-green-600',
      iconColor: 'text-white',
      valueColor: 'text-green-600',
      titleColor: 'text-gray-600',
      subtitleColor: 'text-gray-500',
      shadow: 'shadow-green-500/20'
    },
    warning: {
      gradient: 'from-orange-500 to-orange-600',
      iconGradient: 'from-orange-500 via-orange-500/90 to-orange-600',
      iconColor: 'text-white',
      valueColor: 'text-orange-600',
      titleColor: 'text-gray-600',
      subtitleColor: 'text-gray-500',
      shadow: 'shadow-orange-500/20'
    },
    danger: {
      gradient: 'from-red-500 to-red-600',
      iconGradient: 'from-red-500 via-red-500/90 to-red-600',
      iconColor: 'text-white',
      valueColor: 'text-red-600',
      titleColor: 'text-gray-600',
      subtitleColor: 'text-gray-500',
      shadow: 'shadow-red-500/20'
    }
  };

  const config = colorConfig[color];

  return (
    <div className="group">
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-gradient-to-br from-gray-900 to-transparent" />
        
        <div className="relative p-5 sm:p-6 md:p-7">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Icon Container - Circular with gradient */}
            {icon && (
              <div className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${config.iconGradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}>
                <div className={`${config.iconColor} text-xl sm:text-2xl md:text-3xl`}>
                  {icon}
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              {/* Title */}
              <div className="mb-2 sm:mb-3">
                <p className={`text-sm sm:text-base font-semibold ${config.titleColor} leading-tight`}>
                  {title}
                </p>
              </div>

              {/* Value */}
              <div>
                <p className={`text-3xl sm:text-4xl md:text-5xl font-bold ${config.valueColor} leading-none`}>
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              </div>

              {/* Trend Indicator */}
              {trend && (
                <div className="flex items-center gap-1.5 mt-3">
                  <span className={`text-xs font-semibold ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                  </span>
                  <span className="text-xs text-gray-400">vs last period</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom accent bar on hover */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      </div>
    </div>
  );
};

