import React from 'react';
import { Card, Button, Row, Col, Typography } from 'antd';
import {
  PlusOutlined,
  FileAddOutlined,
  UserAddOutlined,
  SettingOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  BellOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  action: () => void;
}

export interface QuickActionsProps {
  actions?: QuickAction[];
  title?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  title = 'Quick Actions',
}) => {
  const defaultActions: QuickAction[] = [
    {
      id: '1',
      label: 'New Document',
      icon: <FileAddOutlined />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      action: () => console.log('New Document'),
    },
    {
      id: '2',
      label: 'Add User',
      icon: <UserAddOutlined />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      action: () => console.log('Add User'),
    },
    {
      id: '3',
      label: 'Upload File',
      icon: <UploadOutlined />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      action: () => console.log('Upload File'),
    },
    {
      id: '4',
      label: 'Settings',
      icon: <SettingOutlined />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      action: () => console.log('Settings'),
    },
    {
      id: '5',
      label: 'Download',
      icon: <DownloadOutlined />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      action: () => console.log('Download'),
    },
    {
      id: '6',
      label: 'Search',
      icon: <SearchOutlined />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 hover:bg-pink-100',
      action: () => console.log('Search'),
    },
  ];

  const displayActions = actions || defaultActions;

  return (
    <Card
      className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
      bodyStyle={{ padding: '24px' }}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
      <Row gutter={[12, 12]}>
        {displayActions.map((action) => (
          <Col xs={12} sm={8} md={8} lg={8} key={action.id}>
            <button
              onClick={action.action}
              className={`w-full ${action.bgColor} ${action.color} rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md border-0 cursor-pointer group`}
            >
              <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                {action.icon}
              </div>
              <Text className={`text-sm font-medium ${action.color} text-center`}>
                {action.label}
              </Text>
            </button>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default QuickActions;

