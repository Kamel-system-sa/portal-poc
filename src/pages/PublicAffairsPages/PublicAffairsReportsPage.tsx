import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { HousingStatsCard } from '../../components/HousingComponent/HousingStatsCard';
import { AddReportForm } from '../../components/PublicAffairs/AddReportForm';
import { Table, Tag, Button } from 'antd';
import { 
  FileTextOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

export interface Report {
  id: string;
  reportNumber: string;
  source: 'ministry' | 'whatsapp' | 'radio' | 'callcenter';
  reportType: string;
  date: string;
  responseTime: string;
  status: 'completed' | 'delayed' | 'pending' | 'notCompleted';
  description?: string;
}

const PublicAffairsReportsPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      reportNumber: 'RPT-001',
      source: 'ministry',
      reportType: 'شكوى',
      date: '2024-01-15',
      responseTime: '2 ساعات',
      status: 'completed',
      description: 'وصف البلاغ الأول'
    },
    {
      id: '2',
      reportNumber: 'RPT-002',
      source: 'whatsapp',
      reportType: 'استفسار',
      date: '2024-01-16',
      responseTime: '5 ساعات',
      status: 'delayed',
      description: 'وصف البلاغ الثاني'
    },
    {
      id: '3',
      reportNumber: 'RPT-003',
      source: 'radio',
      reportType: 'بلاغ',
      date: '2024-01-17',
      responseTime: '1 ساعة',
      status: 'pending',
      description: 'وصف البلاغ الثالث'
    },
    {
      id: '4',
      reportNumber: 'RPT-004',
      source: 'callcenter',
      reportType: 'شكوى',
      date: '2024-01-18',
      responseTime: '3 ساعات',
      status: 'notCompleted',
      description: 'وصف البلاغ الرابع'
    },
  ]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const total = reports.length;
    const completed = reports.filter(r => r.status === 'completed').length;
    const delayed = reports.filter(r => r.status === 'delayed').length;
    const pending = reports.filter(r => r.status === 'pending').length;
    return { total, completed, delayed, pending };
  }, [reports]);

  // Calculate source distribution
  const sourceStats = useMemo(() => {
    const ministry = reports.filter(r => r.source === 'ministry').length;
    const whatsapp = reports.filter(r => r.source === 'whatsapp').length;
    const radio = reports.filter(r => r.source === 'radio').length;
    const callcenter = reports.filter(r => r.source === 'callcenter').length;
    const total = reports.length;
    
    return {
      ministry: { count: ministry, percentage: total > 0 ? Math.round((ministry / total) * 100) : 0 },
      whatsapp: { count: whatsapp, percentage: total > 0 ? Math.round((whatsapp / total) * 100) : 0 },
      radio: { count: radio, percentage: total > 0 ? Math.round((radio / total) * 100) : 0 },
      callcenter: { count: callcenter, percentage: total > 0 ? Math.round((callcenter / total) * 100) : 0 },
    };
  }, [reports]);

  const handleAddReport = (formData: Omit<Report, 'id'>) => {
    const newReport: Report = {
      ...formData,
      id: `report-${Date.now()}`,
    };
    setReports([...reports, newReport]);
    setIsFormOpen(false);
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'delayed':
        return 'red';
      case 'pending':
        return 'orange';
      case 'notCompleted':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return t('publicAffairsReports.completed');
      case 'delayed':
        return t('publicAffairsReports.delayed');
      case 'pending':
        return t('publicAffairsReports.pending');
      case 'notCompleted':
        return t('publicAffairsReports.notCompleted');
      default:
        return status;
    }
  };

  const getSourceLabel = (source: Report['source']) => {
    switch (source) {
      case 'ministry':
        return t('publicAffairsReports.fromMinistry');
      case 'whatsapp':
        return t('publicAffairsReports.fromWhatsApp');
      case 'radio':
        return t('publicAffairsReports.fromRadio');
      case 'callcenter':
        return t('publicAffairsReports.fromCallCenter');
      default:
        return source;
    }
  };

  const columns: ColumnsType<Report> = [
    {
      title: t('publicAffairsReports.reportNumber'),
      dataIndex: 'reportNumber',
      key: 'reportNumber',
      sorter: (a, b) => a.reportNumber.localeCompare(b.reportNumber),
    },
    {
      title: t('publicAffairsReports.source'),
      dataIndex: 'source',
      key: 'source',
      render: (source: Report['source']) => (
        <Tag color="blue">{getSourceLabel(source)}</Tag>
      ),
    },
    {
      title: t('publicAffairsReports.type'),
      dataIndex: 'reportType',
      key: 'reportType',
    },
    {
      title: t('publicAffairsReports.date'),
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: t('publicAffairsReports.responseTime'),
      dataIndex: 'responseTime',
      key: 'responseTime',
    },
    {
      title: t('publicAffairsReports.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: Report['status']) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: t('centers.viewDetails'),
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
        >
          {t('centers.viewDetails')}
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
                {t('publicAffairsReports.title')}
              </h1>
              <p className="text-customgray text-sm sm:text-base break-words">
                {t('publicAffairsReports.title')} - {t('publicAffairsReports.totalReports')}
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
                <span>{t('publicAffairsReports.addReport')}</span>
              </button>
            </GlassCard>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 items-stretch">
          <HousingStatsCard
            title={t('publicAffairsReports.totalReports')}
            value={summaryStats.total}
            icon={<FileTextOutlined />}
            color="primaryColor"
          />
          <HousingStatsCard
            title={t('publicAffairsReports.completed')}
            value={summaryStats.completed}
            icon={<CheckCircleOutlined />}
            color="success"
          />
          <HousingStatsCard
            title={t('publicAffairsReports.delayed')}
            value={summaryStats.delayed}
            icon={<ExclamationCircleOutlined />}
            color="danger"
          />
          <HousingStatsCard
            title={t('publicAffairsReports.pending')}
            value={summaryStats.pending}
            icon={<ClockCircleOutlined />}
            color="warning"
          />
        </div>

        {/* Horizontal Source Chart */}
        <GlassCard className="p-4 sm:p-5 md:p-6 border-2 border-bordergray/50 bg-white/90">
          <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
            <BarChartOutlined className="text-primaryColor text-xl" />
            {t('publicAffairsReports.title')} - {t('publicAffairsReports.source')}
          </h3>
          
          <div className="space-y-4">
            {/* Ministry */}
            <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="w-32 text-sm font-semibold text-gray-700 flex-shrink-0">
                {t('publicAffairsReports.fromMinistry')}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden relative">
                <div 
                  className={`h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center transition-all duration-500 ${
                    isRtl ? 'justify-start pl-2 ml-auto' : 'justify-end pr-2'
                  }`}
                  style={{ width: `${sourceStats.ministry.percentage}%` }}
                >
                  {sourceStats.ministry.percentage > 10 && (
                    <span className="text-xs font-semibold text-white">
                      {sourceStats.ministry.percentage}%
                    </span>
                  )}
                </div>
              </div>
              {sourceStats.ministry.percentage <= 10 && (
                <div className={`w-12 text-sm font-semibold text-gray-700 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {sourceStats.ministry.percentage}%
                </div>
              )}
            </div>

            {/* WhatsApp */}
            <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="w-32 text-sm font-semibold text-gray-700 flex-shrink-0">
                {t('publicAffairsReports.fromWhatsApp')}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden relative">
                <div 
                  className={`h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center transition-all duration-500 ${
                    isRtl ? 'justify-start pl-2 ml-auto' : 'justify-end pr-2'
                  }`}
                  style={{ width: `${sourceStats.whatsapp.percentage}%` }}
                >
                  {sourceStats.whatsapp.percentage > 10 && (
                    <span className="text-xs font-semibold text-white">
                      {sourceStats.whatsapp.percentage}%
                    </span>
                  )}
                </div>
              </div>
              {sourceStats.whatsapp.percentage <= 10 && (
                <div className={`w-12 text-sm font-semibold text-gray-700 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {sourceStats.whatsapp.percentage}%
                </div>
              )}
            </div>

            {/* Radio */}
            <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="w-32 text-sm font-semibold text-gray-700 flex-shrink-0">
                {t('publicAffairsReports.fromRadio')}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden relative">
                <div 
                  className={`h-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center transition-all duration-500 ${
                    isRtl ? 'justify-start pl-2 ml-auto' : 'justify-end pr-2'
                  }`}
                  style={{ width: `${sourceStats.radio.percentage}%` }}
                >
                  {sourceStats.radio.percentage > 10 && (
                    <span className="text-xs font-semibold text-white">
                      {sourceStats.radio.percentage}%
                    </span>
                  )}
                </div>
              </div>
              {sourceStats.radio.percentage <= 10 && (
                <div className={`w-12 text-sm font-semibold text-gray-700 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {sourceStats.radio.percentage}%
                </div>
              )}
            </div>

            {/* Call Center */}
            <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="w-32 text-sm font-semibold text-gray-700 flex-shrink-0">
                {t('publicAffairsReports.fromCallCenter')}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden relative">
                <div 
                  className={`h-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center transition-all duration-500 ${
                    isRtl ? 'justify-start pl-2 ml-auto' : 'justify-end pr-2'
                  }`}
                  style={{ width: `${sourceStats.callcenter.percentage}%` }}
                >
                  {sourceStats.callcenter.percentage > 10 && (
                    <span className="text-xs font-semibold text-white">
                      {sourceStats.callcenter.percentage}%
                    </span>
                  )}
                </div>
              </div>
              {sourceStats.callcenter.percentage <= 10 && (
                <div className={`w-12 text-sm font-semibold text-gray-700 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {sourceStats.callcenter.percentage}%
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Reports Table */}
        <GlassCard className="p-4 sm:p-5 md:p-6 border-2 border-bordergray/50 bg-white/90">
          <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
            <FileTextOutlined className="text-primaryColor text-xl" />
            {t('publicAffairsReports.title')}
          </h3>

          <Table
            columns={columns}
            dataSource={reports}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${t('hr.pagination.total')}: ${total}`,
            }}
            scroll={{ x: 'max-content' }}
          />
        </GlassCard>
      </div>

      {/* Add Report Form Modal */}
      <AddReportForm
        open={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        onSubmit={handleAddReport}
      />
    </div>
  );
};

export default PublicAffairsReportsPage;

