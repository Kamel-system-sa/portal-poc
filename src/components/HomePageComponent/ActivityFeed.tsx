import React from 'react';
import { Card, Typography, Avatar, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  BellOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

export interface ActivityItem {
  id: string;
  type: 'user' | 'approval' | 'document' | 'notification' | 'system';
  title: string;
  description: string;
  time: string;
  user?: string;
  avatar?: string;
}

export interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  maxItems?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  title = 'Recent Activity',
  maxItems = 6,
}) => {
  const { i18n, t } = useTranslation('common');
  const isRTL = i18n.language === 'ar' || i18n.language === 'ur';
  
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user':
        return <UserOutlined />;
      case 'approval':
        return <CheckCircleOutlined />;
      case 'document':
        return <FileTextOutlined />;
      case 'notification':
        return <BellOutlined />;
      case 'system':
        return <ClockCircleOutlined />;
      default:
        return <BellOutlined />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user':
        return { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' };
      case 'approval':
        return { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' };
      case 'document':
        return { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200' };
      case 'notification':
        return { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-200' };
      case 'system':
        return { bg: 'bg-gray-50', icon: 'text-gray-600', border: 'border-gray-200' };
      default:
        return { bg: 'bg-gray-50', icon: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card
      className="h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
      styles={{ body: { padding: '16px' } }}
    >
      <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h3 className={`text-base font-semibold text-gray-800 m-0 ${isRTL ? 'text-right' : 'text-left'}`}>
          {title}
        </h3>
        <Tag color="blue" className="cursor-pointer hover:shadow-md transition-shadow text-xs">
          {t('homepage.viewAll')}
        </Tag>
      </div>

      <div className="space-y-2">
        {displayActivities.map((activity, index) => {
          const colors = getActivityColor(activity.type);
          return (
            <div
              key={activity.id || index}
              className={`group flex items-start gap-3 p-3 rounded-lg border ${colors.border} ${colors.bg} hover:shadow-sm transition-all cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                {activity.avatar ? (
                  <Avatar src={activity.avatar} size={24} icon={<UserOutlined />} />
                ) : (
                  <span className={colors.icon}>{getActivityIcon(activity.type)}</span>
                )}
              </div>
              <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-start justify-between gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Text className="text-gray-900 font-medium text-sm flex-1 break-words">
                    {activity.title}
                  </Text>
                  <Text className="text-gray-400 text-xs whitespace-nowrap flex-shrink-0">
                    {activity.time}
                  </Text>
                </div>
                <Text className="text-gray-600 text-xs block mb-1 leading-relaxed">
                  {activity.description}
                </Text>
                {activity.user && (
                  <Text className="text-gray-500 text-xs">
                    {isRTL ? `${activity.user} ${t('homepage.by') || 'بواسطة'}` : `${t('homepage.by') || 'by'} ${activity.user}`}
                  </Text>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ActivityFeed;

