import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { HousingStatsCard } from '../../components/HousingComponent/HousingStatsCard';
import { AddServiceCenterReportForm } from '../../components/ServiceCenters/AddServiceCenterReportForm';
import { Table, Tag, Button } from 'antd';
import { 
  FileTextOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  WarningOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

export interface ServiceCenterReport {
  id: string;
  reportNumber: string;
  status: 'completed' | 'pending' | 'delayed' | 'escalated';
  period: string;
  involvedParties: string;
  issueDate: string;
  description?: string;
}

const ServiceCenterReportsPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reports, setReports] = useState<ServiceCenterReport[]>([
    {
      id: '1',
      reportNumber: 'MHR-001',
      status: 'completed',
      period: 'يناير 2024',
      involvedParties: 'مركز الخدمة 1، منظم 1',
      issueDate: '2024-01-15',
      description: 'وصف المحضر الأول'
    },
    {
      id: '2',
      reportNumber: 'MHR-002',
      status: 'pending',
      period: 'يناير 2024',
      involvedParties: 'مركز الخدمة 2، منظم 2',
      issueDate: '2024-01-16',
      description: 'وصف المحضر الثاني'
    },
    {
      id: '3',
      reportNumber: 'MHR-003',
      status: 'delayed',
      period: 'يناير 2024',
      involvedParties: 'مركز الخدمة 3، منظم 3',
      issueDate: '2024-01-17',
      description: 'وصف المحضر الثالث'
    },
    {
      id: '4',
      reportNumber: 'MHR-004',
      status: 'escalated',
      period: 'يناير 2024',
      involvedParties: 'مركز الخدمة 4، منظم 4',
      issueDate: '2024-01-18',
      description: 'وصف المحضر الرابع'
    },
  ]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const total = reports.length;
    const completed = reports.filter(r => r.status === 'completed').length;
    const pending = reports.filter(r => r.status === 'pending').length;
    const delayed = reports.filter(r => r.status === 'delayed').length;
    return { total, completed, pending, delayed };
  }, [reports]);

  const handleAddReport = (formData: Omit<ServiceCenterReport, 'id'>) => {
    const newReport: ServiceCenterReport = {
      ...formData,
      id: `report-${Date.now()}`,
    };
    setReports([...reports, newReport]);
    setIsFormOpen(false);
  };

  const getStatusColor = (status: ServiceCenterReport['status']) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'delayed':
        return 'red';
      case 'escalated':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: ServiceCenterReport['status']) => {
    switch (status) {
      case 'completed':
        return t('serviceCentersReports.completed');
      case 'pending':
        return t('serviceCentersReports.pending');
      case 'delayed':
        return t('serviceCentersReports.delayed');
      case 'escalated':
        return t('serviceCentersReports.escalated');
      default:
        return status;
    }
  };

  const columns: ColumnsType<ServiceCenterReport> = [
    {
      title: t('serviceCentersReports.reportNumber'),
      dataIndex: 'reportNumber',
      key: 'reportNumber',
      sorter: (a, b) => a.reportNumber.localeCompare(b.reportNumber),
    },
    {
      title: t('serviceCentersReports.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: ServiceCenterReport['status']) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: t('serviceCentersReports.period'),
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: t('serviceCentersReports.involvedParties'),
      dataIndex: 'involvedParties',
      key: 'involvedParties',
    },
    {
      title: t('serviceCentersReports.issueDate'),
      dataIndex: 'issueDate',
      key: 'issueDate',
      sorter: (a, b) => a.issueDate.localeCompare(b.issueDate),
    },
    {
      title: t('centers.viewDetails') || 'الإجراءات',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
        >
          {t('centers.viewDetails') || 'عرض'}
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 overflow-x-hidden">
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 break-words">
                {t('serviceCentersReports.title')}
              </h1>
              <p className="text-customgray text-sm sm:text-base break-words">
                {t('serviceCentersReports.subtitle')}
              </p>
            </div>
            
            {/* Add Button */}
            <GlassCard className="p-3 sm:p-4 lg:p-5 flex-shrink-0 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-primaryColor to-primaryColor/90 text-white rounded-xl hover:shadow-lg hover:shadow-primaryColor/30 transition-all duration-200 flex items-center gap-2 font-medium text-xs sm:text-sm w-full justify-center"
              >
                <PlusOutlined />
                <span>{t('serviceCentersReports.addReport')}</span>
              </button>
            </GlassCard>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 items-stretch">
          <HousingStatsCard
            title={t('serviceCentersReports.totalReports')}
            value={summaryStats.total}
            icon={<FileTextOutlined />}
            color="primaryColor"
          />
          <HousingStatsCard
            title={t('serviceCentersReports.completed')}
            value={summaryStats.completed}
            icon={<CheckCircleOutlined />}
            color="success"
          />
          <HousingStatsCard
            title={t('serviceCentersReports.pending')}
            value={summaryStats.pending}
            icon={<ClockCircleOutlined />}
            color="warning"
          />
          <HousingStatsCard
            title={t('serviceCentersReports.delayed')}
            value={summaryStats.delayed}
            icon={<ExclamationCircleOutlined />}
            color="danger"
          />
        </div>

        {/* Reports Table */}
        <GlassCard className="p-4 sm:p-5 md:p-6 border-2 border-bordergray/50 bg-white/90">
          <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
            <FileTextOutlined className="text-primaryColor text-xl" />
            {t('serviceCentersReports.title')}
          </h3>

          <Table
            columns={columns}
            dataSource={reports}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${t('housing.total') || 'الإجمالي'}: ${total}`,
            }}
            scroll={{ x: 'max-content' }}
          />
        </GlassCard>
      </div>

      {/* Add Report Form Modal */}
      <AddServiceCenterReportForm
        open={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        onSubmit={handleAddReport}
      />
    </div>
  );
};

export default ServiceCenterReportsPage;

