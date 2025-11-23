import React from 'react';
import { Card, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

const { Title, Text } = Typography;

export interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  bgColor: string;
  iconColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  suffix?: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  iconColor,
  trend,
  suffix,
}) => {
  const { t } = useTranslation('common');
  return (
    <Card
      className="h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 group overflow-hidden relative"
      bodyStyle={{ padding: '24px' }}
    >
      {/* Animated Background Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-mainColor/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <Text className="text-gray-500 text-sm font-medium block mb-2 group-hover:text-gray-700 transition-colors">
            {title}
          </Text>
          <div className="flex items-baseline gap-2 mb-2">
            <Title 
              level={2} 
              className="!mb-0 !text-gray-800 group-hover:text-mainColor transition-colors duration-300"
            >
              {value}
            </Title>
            {suffix && (
              <Text className="text-gray-500 text-sm">{suffix}</Text>
            )}
          </div>
          {trend && (
            <div className="flex items-center gap-1 mt-2 animate-fade-in">
              {trend.isPositive ? (
                <ArrowUpOutlined 
                  className={`${trend.isPositive ? 'text-success' : 'text-danger'} group-hover:scale-110 transition-transform duration-300`} 
                />
              ) : (
                <ArrowDownOutlined 
                  className={`${trend.isPositive ? 'text-success' : 'text-danger'} group-hover:scale-110 transition-transform duration-300`} 
                />
              )}
              <Text
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success' : 'text-danger'
                }`}
              >
                {Math.abs(trend.value)}%
              </Text>
              <Text className="text-gray-500 text-sm ml-1">{t('homepage.vsLastMonth')}</Text>
            </div>
          )}
        </div>
        <div
          className={`${bgColor} rounded-xl p-4 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md group-hover:shadow-lg`}
          style={{ minWidth: '64px', height: '64px' }}
        >
          <div className={`text-3xl ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
      </div>
      
      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </Card>
  );
};

export default OverviewCard;

