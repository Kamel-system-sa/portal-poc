import React from 'react';
import { Card, Typography, List, Button, Avatar, Tag } from 'antd';
import { FileTextOutlined, UserOutlined, CheckOutlined, CloseOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export interface Approval {
  id: string;
  type: 'leave' | 'expense' | 'document' | 'request';
  title: string;
  requester: string;
  requesterAvatar?: string;
  date: string;
  amount?: string;
  days?: number;
  priority: 'high' | 'medium' | 'low';
}

export interface PendingApprovalsCardProps {
  approvals: Approval[];
  title?: string;
  maxItems?: number;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const PendingApprovalsCard: React.FC<PendingApprovalsCardProps> = ({
  approvals,
  title = 'Pending Approvals',
  maxItems = 5,
  onApprove,
  onReject,
}) => {
  const getTypeIcon = (type: Approval['type']) => {
    switch (type) {
      case 'leave':
        return <ClockCircleOutlined className="text-blue-500" />;
      case 'expense':
        return <FileTextOutlined className="text-green-500" />;
      case 'document':
        return <FileTextOutlined className="text-purple-500" />;
      case 'request':
        return <UserOutlined className="text-orange-500" />;
      default:
        return <FileTextOutlined className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type: Approval['type']) => {
    switch (type) {
      case 'leave':
        return 'Leave Request';
      case 'expense':
        return 'Expense Report';
      case 'document':
        return 'Document';
      case 'request':
        return 'General Request';
      default:
        return 'Request';
    }
  };

  const getPriorityColor = (priority: Approval['priority']) => {
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

  const displayApprovals = approvals.slice(0, maxItems);

  return (
    <Card
      className="h-full border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
      bodyStyle={{ padding: '24px' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-2xl text-mainColor" />
          <Title level={5} className="!mb-0 !text-gray-800">
            {title}
          </Title>
        </div>
        <Tag color="red" className="cursor-pointer">
          {approvals.length} Pending
        </Tag>
      </div>

      <List
        dataSource={displayApprovals}
        renderItem={(item) => (
          <List.Item className="!px-0 !py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
            <div className="w-full">
              <div className="flex items-start gap-3 mb-3">
                <Avatar
                  src={item.requesterAvatar}
                  icon={getTypeIcon(item.type)}
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Text className="text-gray-800 font-semibold text-sm">
                      {item.title}
                    </Text>
                    <Tag color={getPriorityColor(item.priority)} className="!m-0 text-xs">
                      {item.priority}
                    </Tag>
                  </div>
                  <Text className="text-gray-600 text-xs block mb-1">
                    {getTypeLabel(item.type)} • {item.requester}
                  </Text>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <Text>{item.date}</Text>
                    {item.amount && <Text>• Amount: {item.amount}</Text>}
                    {item.days && <Text>• {item.days} days</Text>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => onApprove?.(item.id)}
                  className="bg-success border-success hover:bg-green-600"
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => onReject?.(item.id)}
                  className="text-danger border-danger hover:bg-red-50"
                >
                  Reject
                </Button>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default PendingApprovalsCard;

