import React from 'react';
import { Card, Typography, Avatar, Timeline, Tag } from 'antd';
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
  maxItems = 8,
}) => {
  const { i18n, t } = useTranslation('common');
  const isRTL = i18n.language === 'ar' || i18n.language === 'ur';
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user':
        return <UserOutlined className="text-blue-500" />;
      case 'approval':
        return <CheckCircleOutlined className="text-success" />;
      case 'document':
        return <FileTextOutlined className="text-purple-500" />;
      case 'notification':
        return <BellOutlined className="text-orange-500" />;
      case 'system':
        return <ClockCircleOutlined className="text-gray-500" />;
      default:
        return <BellOutlined className="text-gray-500" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user':
        return 'blue';
      case 'approval':
        return 'green';
      case 'document':
        return 'purple';
      case 'notification':
        return 'orange';
      case 'system':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card
      className="h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
      bodyStyle={{ padding: '24px' }}
    >
      <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h3 className={`text-lg font-semibold text-gray-800 m-0 ${isRTL ? 'text-right' : ''}`}>{title}</h3>
        <Tag color="blue" className="cursor-pointer hover:shadow-md transition-shadow">
          {t('homepage.viewAll') || 'View All'}
        </Tag>
      </div>

      <Timeline
        mode={isRTL ? 'right' : 'left'}
        items={displayActivities.map((activity) => ({
          dot: (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200 shadow-sm">
              {activity.avatar ? (
                <Avatar src={activity.avatar} size={20} icon={<UserOutlined />} />
              ) : (
                getActivityIcon(activity.type)
              )}
            </div>
          ),
          children: (
            <div className={`${isRTL ? 'mr-4' : 'ml-4'} animate-fade-in`}>
              <div className={`flex items-start justify-between gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Text className={`text-gray-800 font-medium text-sm ${isRTL ? 'text-right' : ''}`}>
                  {activity.title}
                </Text>
                <Text className={`text-gray-400 text-xs whitespace-nowrap ${isRTL ? 'text-left' : ''}`}>
                  {activity.time}
                </Text>
              </div>
              <Text className={`text-gray-600 text-xs block mb-1 ${isRTL ? 'text-right' : ''}`}>
                {activity.description}
              </Text>
              {activity.user && (
                <Text className={`text-gray-500 text-xs ${isRTL ? 'text-right' : ''}`}>
                  {isRTL ? `${activity.user} ${t('homepage.by') || 'بواسطة'}` : `${t('homepage.by') || 'by'} ${activity.user}`}
                </Text>
              )}
            </div>
          ),
          color: getActivityColor(activity.type),
        }))}
      />
    </Card>
  );
};

export default ActivityFeed;

