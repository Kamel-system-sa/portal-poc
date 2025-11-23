import React from 'react';
import { Card, Typography, List, Tag, Empty } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

const { Title, Text } = Typography;

export interface SummaryItem {
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  date?: string;
  tag?: {
    text: string;
    color: string;
  };
}

export interface SectionSummaryProps {
  title: string;
  icon: ReactNode;
  items: SummaryItem[];
  emptyMessage?: string;
  onViewAll?: () => void;
  maxItems?: number;
}

const SectionSummary: React.FC<SectionSummaryProps> = ({
  title,
  icon,
  items,
  emptyMessage = 'No items available',
  onViewAll,
  maxItems = 5,
}) => {
  const { t } = useTranslation('common');
  const displayItems = items.slice(0, maxItems);

  return (
    <Card
      className="h-full border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
      bodyStyle={{ padding: '20px' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-xl text-mainColor">{icon}</div>
          <Title level={5} className="!mb-0 !text-gray-800">
            {title}
          </Title>
        </div>
        {onViewAll && (
          <Text
            className="text-primaryColor cursor-pointer hover:underline text-sm font-medium"
            onClick={onViewAll}
          >
            {t('homepage.viewAll')} <RightOutlined className="text-xs" />
          </Text>
        )}
      </div>

      {displayItems.length === 0 ? (
        <Empty
          description={<Text className="text-gray-500">{emptyMessage}</Text>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="py-8"
        />
      ) : (
        <List
          dataSource={displayItems}
          renderItem={(item) => (
            <List.Item className="!px-0 !py-3 border-b border-gray-100 last:border-0">
              <div className="flex-1 w-full">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Text className="text-gray-800 font-medium text-sm flex-1">
                    {item.title}
                  </Text>
                  {item.tag && (
                    <Tag color={item.tag.color} className="!m-0">
                      {item.tag.text}
                    </Tag>
                  )}
                </div>
                {item.subtitle && (
                  <Text className="text-gray-500 text-xs block mb-1">
                    {item.subtitle}
                  </Text>
                )}
                <div className="flex items-center gap-3 mt-2">
                  {item.status && (
                    <Text className="text-gray-400 text-xs">{item.status}</Text>
                  )}
                  {item.date && (
                    <Text className="text-gray-400 text-xs">• {item.date}</Text>
                  )}
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default SectionSummary;

