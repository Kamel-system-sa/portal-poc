import React from 'react';
import { Card, Typography, Row, Col, Statistic } from 'antd';
import { UserOutlined, CalendarOutlined, TeamOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

export interface QuickStat {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

export interface StatsWidgetProps {
  stats?: QuickStat[];
}

const defaultStats: QuickStat[] = [
  {
    title: 'Active Users',
    value: 1248,
    icon: <UserOutlined />,
    color: 'text-blue-600',
  },
  {
    title: 'This Week',
    value: 342,
    icon: <CalendarOutlined />,
    color: 'text-success',
  },
  {
    title: 'Departments',
    value: 12,
    icon: <TeamOutlined />,
    color: 'text-purple-600',
  },
  {
    title: 'Completed',
    value: 89,
    icon: <CheckCircleOutlined />,
    color: 'text-success',
  },
];

const StatsWidget: React.FC<StatsWidgetProps> = ({ stats = defaultStats }) => {
  // Map color classes to background colors
  const getBgColor = (colorClass: string) => {
    const colorMap: Record<string, string> = {
      'text-blue-600': 'bg-blue-50',
      'text-green-600': 'bg-green-50',
      'text-purple-600': 'bg-purple-50',
      'text-orange-600': 'bg-orange-50',
      'text-success': 'bg-green-50',
      'text-danger': 'bg-red-50',
    };
    return colorMap[colorClass] || 'bg-gray-50';
  };

  return (
    <Row gutter={[8, 8]} className="sm:!mx-0">
      {stats.map((stat, index) => {
        const bgColor = getBgColor(stat.color);
        return (
          <Col xs={12} sm={12} md={12} lg={6} key={index}>
            <Card
              className={`border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${bgColor} group cursor-pointer overflow-hidden relative`}
              bodyStyle={{ padding: '12px' }}
            >
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-white/40 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className={`text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 ${stat.color} flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-center">
                  <Statistic
                    title={<span className="text-gray-600 text-xs font-medium truncate block">{stat.title}</span>}
                    value={stat.value}
                    valueStyle={{ 
                      fontSize: '16px', 
                      fontWeight: 700, 
                      color: '#1F2937',
                      lineHeight: '1.2'
                    }}
                    className="group-hover:text-mainColor transition-colors duration-300"
                  />
                </div>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default StatsWidget;

