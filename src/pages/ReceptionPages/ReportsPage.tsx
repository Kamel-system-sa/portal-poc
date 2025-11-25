import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { ReportBuilder } from '../../components/HousingComponent/ReportBuilder';
import { Table, Tag, Button } from 'antd';
import { 
  FileTextOutlined,
  PlusOutlined,
  CloseOutlined,
  SendOutlined,
  InboxOutlined,
  EyeOutlined,
  TeamOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const ReportsPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [isReportBuilderOpen, setIsReportBuilderOpen] = useState(false);

  // Reports summary mock data
  const reportsSummary = useMemo(() => ({
    totalCreated: 18,
    inDraft: 4,
    sent: 13,
    received: 10
  }), []);

  // Mock reports data
  const mockReports = useMemo(() => [
    {
      id: 'R-1',
      title: 'تقرير 1',
      type: 'arrivals',
      status: 'sent',
      createdAt: '2024-01-15',
      createdBy: 'مستخدم 1'
    },
    {
      id: 'R-2',
      title: 'تقرير 2',
      type: 'departures',
      status: 'draft',
      createdAt: '2024-01-16',
      createdBy: 'مستخدم 2'
    },
    {
      id: 'R-3',
      title: 'تقرير 3',
      type: 'groups',
      status: 'sent',
      createdAt: '2024-01-17',
      createdBy: 'مستخدم 3'
    },
    {
      id: 'R-4',
      title: 'تقرير 4',
      type: 'ports',
      status: 'received',
      createdAt: '2024-01-18',
      createdBy: 'مستخدم 4'
    },
    {
      id: 'R-5',
      title: 'تقرير 5',
      type: 'arrivals',
      status: 'draft',
      createdAt: '2024-01-19',
      createdBy: 'مستخدم 1'
    }
  ], []);

  const columns: ColumnsType<typeof mockReports[0]> = [
    {
      title: t('labels.name') || 'اسم التقرير',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: t('reception.reportType') || 'نوع التقرير',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          'arrivals': t('reception.preArrival.arrivals.title') || 'الوصول',
          'departures': t('reception.preArrival.departures.title') || 'المغادرة',
          'groups': t('reception.groups') || 'المجموعات',
          'ports': t('reception.ports.title') || 'المنافذ'
        };
        return <Tag>{typeMap[type] || type}</Tag>;
      },
    },
    {
      title: t('reception.reportStatus') || 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          'draft': { color: 'amber', label: t('reception.reportsInDraft') || 'مسودة' },
          'sent': { color: 'blue', label: t('reception.reportsSent') || 'مرسل' },
          'received': { color: 'green', label: t('reception.reportsReceived') || 'مستلم' }
        };
        const statusInfo = statusMap[status] || { color: 'default', label: status };
        return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
      },
    },
    {
      title: t('reception.createdBy') || 'أنشأه',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: t('reception.createdAt') || 'تاريخ الإنشاء',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
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
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 break-words">
            {t('reception.reports') || 'التقارير'}
          </h1>
          <p className="text-customgray text-sm sm:text-base break-words">
            {t('reception.reportsDescription') || 'عرض وإدارة التقارير الخاصة بالاستقبال'}
          </p>
        </div>

        {/* Report Overview Section */}
        <div>
          <GlassCard className="p-4 sm:p-5 md:p-6 border-2 border-bordergray/50 bg-white/90">
            <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
              <FileTextOutlined className="text-primaryColor text-xl" />
              {t('reception.reportsOverview') || 'نظرة عامة على التقارير'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="p-4 bg-gradient-to-br from-primaryColor/10 to-primaryColor/5 rounded-lg border border-primaryColor/20">
                <div className="flex items-center gap-3 mb-2">
                  <FileTextOutlined className="text-primaryColor text-xl" />
                  <div className="text-2xl font-bold text-primaryColor">{reportsSummary.totalCreated}</div>
                </div>
                <div className="text-sm text-customgray">{t('reception.totalReportsCreated') || 'إجمالي التقارير المنشأة'}</div>
              </div>

              <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3 mb-2">
                  <FileTextOutlined className="text-amber-600 text-xl" />
                  <div className="text-2xl font-bold text-amber-600">{reportsSummary.inDraft}</div>
                </div>
                <div className="text-sm text-customgray">{t('reception.reportsInDraft') || 'التقارير المسودة'}</div>
              </div>

              <div className="p-4 bg-gradient-to-br from-secondaryColor/10 to-secondaryColor/5 rounded-lg border border-secondaryColor/20">
                <div className="flex items-center gap-3 mb-2">
                  <SendOutlined className="text-secondaryColor text-xl" />
                  <div className="text-2xl font-bold text-secondaryColor">{reportsSummary.sent}</div>
                </div>
                <div className="text-sm text-customgray">{t('reception.reportsSent') || 'التقارير المرسلة'}</div>
              </div>

              <div className="p-4 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-3 mb-2">
                  <InboxOutlined className="text-cyan-600 text-xl" />
                  <div className="text-2xl font-bold text-cyan-600">{reportsSummary.received}</div>
                </div>
                <div className="text-sm text-customgray">{t('reception.reportsReceived') || 'التقارير المستلمة'}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsReportBuilderOpen(true)}
              className="w-full px-6 py-3 bg-gradient-to-r from-primaryColor to-secondaryColor text-white rounded-xl hover:shadow-lg hover:shadow-primaryColor/30 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <PlusOutlined />
              {t('reception.createReport') || 'إنشاء تقرير'}
            </button>
          </GlassCard>
        </div>

        {/* Reports List Section */}
        <div>
          <GlassCard className="p-4 sm:p-5 md:p-6 border-2 border-bordergray/50 bg-white/90">
            <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
              <TeamOutlined className="text-primaryColor text-xl" />
              {t('reception.reportsList') || 'قائمة التقارير'}
            </h3>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-xs sm:text-sm text-customgray">
                {t('reception.showingResults') || 'عرض'} {mockReports.length} {t('reception.reports') || 'تقرير'}
              </p>
            </div>

            {/* Table */}
            <Table
              columns={columns}
              dataSource={mockReports}
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
      </div>

      {/* Report Builder Modal */}
      {isReportBuilderOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsReportBuilderOpen(false);
          }}
        >
          <div className="relative w-full max-w-5xl max-h-[95vh] bg-white rounded-xl shadow-2xl overflow-hidden z-10">
            <div className="flex items-center justify-between p-6 border-b border-bordergray bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-800">
                {t('reception.reportBuilder') || 'منشئ التقارير'}
              </h2>
              <button
                onClick={() => setIsReportBuilderOpen(false)}
                className="p-2 text-customgray hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
              <ReportBuilder />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;

