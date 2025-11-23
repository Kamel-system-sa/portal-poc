import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Select, Tabs, Table, Tag } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { StoredPassport } from '../../types/passport';

interface StorageDistributionViewProps {
  storedPassports: StoredPassport[];
  groupBy: 'nationality' | 'organizer' | 'campaign' | 'ageGroup';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const StorageDistributionView: React.FC<StorageDistributionViewProps> = ({
  storedPassports,
  groupBy
}) => {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');

  // Group data based on groupBy prop
  const groupedData = React.useMemo(() => {
    const groups: Record<string, number> = {};
    storedPassports.forEach(passport => {
      let key = '';
      switch (groupBy) {
        case 'nationality':
          key = passport.nationality;
          break;
        case 'organizer':
          key = 'Organizer'; // Would need organizer data
          break;
        case 'campaign':
          key = 'Campaign'; // Would need campaign data
          break;
        default:
          key = 'Other';
      }
      groups[key] = (groups[key] || 0) + 1;
    });

    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [storedPassports, groupBy]);

  const getGroupByLabel = () => {
    switch (groupBy) {
      case 'nationality':
        return t('passport.distribution.byNationality');
      case 'organizer':
        return t('passport.distribution.byOrganizer');
      case 'campaign':
        return t('passport.distribution.byCampaign');
      case 'ageGroup':
        return t('passport.distribution.byAgeGroup');
      default:
        return t('passport.distribution.title');
    }
  };

  const tableColumns = [
    {
      title: getGroupByLabel(),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('passport.distribution.count'),
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => <Tag color="blue">{value}</Tag>
    },
    {
      title: t('passport.distribution.percentage'),
      dataIndex: 'value',
      key: 'percentage',
      render: (value: number) => {
        const total = storedPassports.length;
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
        return `${percentage}%`;
      }
    }
  ];

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <BarChartOutlined className="text-primaryColor" />
          <span>{t('passport.distribution.title')}</span>
        </div>
      }
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab={t('passport.distribution.chart')} key="chart">
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('passport.distribution.table')} key="table">
          <Table
            dataSource={groupedData}
            columns={tableColumns}
            rowKey="name"
            pagination={false}
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

