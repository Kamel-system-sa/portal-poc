import React from 'react';
import { Card, Typography, List, Tag, Avatar } from 'antd';
import { NotificationOutlined, InfoCircleOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  author: string;
  date: string;
  isNew?: boolean;
}

export interface AnnouncementsCardProps {
  announcements: Announcement[];
  title?: string;
  maxItems?: number;
}

const AnnouncementsCard: React.FC<AnnouncementsCardProps> = ({
  announcements,
  title = 'Company Announcements',
  maxItems = 5,
}) => {
  const { t } = useTranslation('common');
  const getIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'info':
        return <InfoCircleOutlined className="text-blue-500" />;
      case 'warning':
        return <WarningOutlined className="text-orange-500" />;
      case 'success':
        return <CheckCircleOutlined className="text-success" />;
      case 'urgent':
        return <NotificationOutlined className="text-danger" />;
      default:
        return <InfoCircleOutlined className="text-gray-500" />;
    }
  };

  const getTagColor = (type: Announcement['type']) => {
    switch (type) {
      case 'info':
        return 'blue';
      case 'warning':
        return 'orange';
      case 'success':
        return 'green';
      case 'urgent':
        return 'red';
      default:
        return 'default';
    }
  };

  const displayAnnouncements = announcements.slice(0, maxItems);

  return (
    <Card
      className="h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
      bodyStyle={{ padding: '24px' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <NotificationOutlined className="text-2xl text-mainColor" />
          <Title level={5} className="!mb-0 !text-gray-800">
            {title}
          </Title>
        </div>
        <Tag color="blue" className="cursor-pointer hover:shadow-md transition-shadow">
          {t('homepage.viewAll')}
        </Tag>
      </div>

      <List
        dataSource={displayAnnouncements}
        renderItem={(item) => (
          <List.Item className="!px-0 !py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer group">
            <div className="flex gap-3 w-full">
              <Avatar
                icon={getIcon(item.type)}
                className="flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{
                  backgroundColor:
                    item.type === 'info'
                      ? '#DBEAFE'
                      : item.type === 'warning'
                      ? '#FEF3C7'
                      : item.type === 'success'
                      ? '#DCFCE7'
                      : '#FEE2E2',
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Text className="text-gray-800 font-semibold text-sm group-hover:text-mainColor transition-colors">
                    {item.title}
                  </Text>
                  {item.isNew && (
                    <Tag color="red" className="!m-0 text-xs">
                      {t('homepage.active')}
                    </Tag>
                  )}
                </div>
                <Text className="text-gray-600 text-xs block mb-2 line-clamp-2">
                  {item.message}
                </Text>
                <div className="flex items-center gap-2">
                  <Tag color={getTagColor(item.type)} className="!m-0 text-xs">
                    {t(`homepage.${item.type === 'urgent' ? 'high' : item.type}`)}
                  </Tag>
                  <Text className="text-gray-400 text-xs">{t('homepage.by')} {item.author}</Text>
                  <Text className="text-gray-400 text-xs">•</Text>
                  <Text className="text-gray-400 text-xs">{item.date}</Text>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default AnnouncementsCard;

