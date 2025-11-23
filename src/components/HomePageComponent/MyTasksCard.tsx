import React from 'react';
import { Card, Typography, List, Progress, Tag, Button } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  progress?: number;
  assignee?: string;
}

export interface MyTasksCardProps {
  tasks: Task[];
  title?: string;
  maxItems?: number;
}

const MyTasksCard: React.FC<MyTasksCardProps> = ({
  tasks,
  title = 'My Tasks',
  maxItems = 6,
}) => {
  const { t } = useTranslation('common');
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined className="text-success" />;
      case 'in-progress':
        return <ClockCircleOutlined className="text-blue-500" />;
      case 'pending':
        return <ExclamationCircleOutlined className="text-orange-500" />;
      default:
        return <ClockCircleOutlined className="text-gray-500" />;
    }
  };

  const displayTasks = tasks.slice(0, maxItems);
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card
      className="h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
      styles={{ body: { padding: '24px' } }}
    >
      <div className="flex items-center justify-between mb-6">
        <Title level={5} className="!mb-0 !text-gray-800">
          {title}
        </Title>
        <Button type="link" className="p-0 text-mainColor hover:text-primaryColor font-medium">
          {t('homepage.viewAll')} <RightOutlined />
        </Button>
      </div>

      {/* Progress Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <Text className="text-gray-600 text-sm font-medium">{t('homepage.overallProgress')}</Text>
          <Text className="text-gray-800 font-semibold">{completionRate}%</Text>
        </div>
        <Progress
          percent={completionRate}
          strokeColor={{
            '0%': '#005B4F',
            '100%': '#00796B',
          }}
          showInfo={false}
          className="mb-2"
        />
        <Text className="text-gray-500 text-xs">
          {completedTasks} {t('homepage.homepageOf')} {totalTasks} {t('homepage.tasksCompleted')}
        </Text>
      </div>

      <List
        dataSource={displayTasks}
        renderItem={(item) => (
          <List.Item className="!px-0 !py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer group">
            <div className="flex gap-3 w-full items-start">
              <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                {getStatusIcon(item.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Text className="text-gray-800 font-medium text-sm group-hover:text-mainColor transition-colors line-clamp-1">
                    {item.title}
                  </Text>
                  <Tag color={getPriorityColor(item.priority)} className="!m-0 text-xs flex-shrink-0">
                    {t(`homepage.${item.priority}`)}
                  </Tag>
                </div>
                {item.description && (
                  <Text className="text-gray-600 text-xs block mb-2 line-clamp-1">
                    {item.description}
                  </Text>
                )}
                <div className="flex items-center gap-3">
                  {item.progress !== undefined && item.status === 'in-progress' && (
                    <Progress
                      percent={item.progress}
                      size="small"
                      strokeColor="#005B4F"
                      showInfo={false}
                      className="flex-1 max-w-[100px]"
                    />
                  )}
                  <Text className="text-gray-400 text-xs">{t('homepage.due')}: {item.dueDate}</Text>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default MyTasksCard;

