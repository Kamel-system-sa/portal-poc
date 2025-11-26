import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Button, Tag, Space, Modal, Form, Select, Checkbox, Input, message } from 'antd';
import { 
  FileTextOutlined,
  PlusOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { mockPassportReports, availableColumns, reportTemplates, type PassportReport } from '../../data/mockPassportReports';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Option } = Select;

const PassportReportsPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [reports] = useState<PassportReport[]>(mockPassportReports);
  const [isReportBuilderOpen, setIsReportBuilderOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [templateName, setTemplateName] = useState<string>('');

  const handleCreateReport = () => {
    setIsReportBuilderOpen(true);
    form.resetFields();
    setSelectedColumns([]);
    setTemplateName('');
  };

  const handleGenerateReport = async (format: 'pdf' | 'excel') => {
    try {
      const values = await form.validateFields();
      
      if (selectedColumns.length === 0) {
        message.warning(t('passport.reports.selectAtLeastOneColumn'));
        return;
      }

      // Simulate report generation
      message.loading(t('passport.reports.generating'), 2);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success(t('passport.reports.reportGenerated'));
      setIsReportBuilderOpen(false);
      form.resetFields();
      setSelectedColumns([]);
      setTemplateName('');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      message.warning(t('passport.reports.enterTemplateName'));
      return;
    }
    if (selectedColumns.length === 0) {
      message.warning(t('passport.reports.selectAtLeastOneColumn'));
      return;
    }
    message.success(t('passport.reports.templateSaved'));
    setTemplateName('');
  };

  const handleViewReport = (report: PassportReport) => {
    message.info(t('passport.reports.viewingReport', { name: report.name }));
  };

  const handleDownloadReport = (report: PassportReport) => {
    const fileName = `${report.name}-${dayjs(report.createdAt).format('YYYY-MM-DD')}.${report.format}`;
    message.success(t('passport.reports.downloading', { name: fileName }));
  };

  const handleDeleteReport = (report: PassportReport) => {
    Modal.confirm({
      title: t('passport.reports.deleteConfirm'),
      content: t('passport.reports.deleteConfirmMessage', { name: report.name }),
      okText: t('delete'),
      cancelText: t('cancel'),
      onOk: () => {
        message.success(t('passport.reports.reportDeleted'));
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'sent':
        return 'blue';
      case 'draft':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`passport.reports.status.${status}`) || status;
  };

  const columns: ColumnsType<PassportReport> = [
    {
      title: t('passport.reports.reportName'),
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-semibold text-gray-900">{text}</span>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('passport.reports.template'),
      dataIndex: 'template',
      key: 'template',
      render: (template) => (
        <Tag color="purple">{t(`passport.reports.templates.${template}`) || template}</Tag>
      ),
    },
    {
      title: t('passport.reports.columns'),
      dataIndex: 'columns',
      key: 'columns',
      render: (cols: string[]) => (
        <span className="text-gray-600">{cols.length} {t('passport.reports.columnsLabel')}</span>
      ),
    },
    {
      title: t('passport.reports.format'),
      dataIndex: 'format',
      key: 'format',
      render: (format) => (
        <Tag color={format === 'pdf' ? 'red' : 'green'}>
          {format.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: t('passport.reports.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: t('passport.reports.createdBy'),
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: t('passport.reports.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewReport(record)}
            title={t('view')}
          />
          <Button
            type="text"
            icon={record.format === 'pdf' ? <FilePdfOutlined /> : <FileExcelOutlined />}
            onClick={() => handleDownloadReport(record)}
            title={t('download')}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteReport(record)}
            title={t('delete')}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {t('passport.reports.title')}
          </h1>
          <p className="text-gray-600">{t('passport.reports.subtitle')}</p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleCreateReport}
          className="bg-gradient-to-r from-mainColor to-primaryColor hover:from-mainColor/90 hover:to-primaryColor/90 border-0 shadow-lg shadow-mainColor/30 hover:shadow-xl hover:shadow-mainColor/40 hover:-translate-y-0.5 transition-all duration-300"
        >
          {t('passport.reports.createReport')}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-mainColor to-primaryColor flex items-center justify-center shadow-md shadow-mainColor/20">
              <FileTextOutlined className="text-white text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">{t('passport.reports.totalReports')}</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md shadow-green-500/20">
              <FileTextOutlined className="text-white text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">{t('passport.reports.completed')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileTextOutlined className="text-white text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">{t('passport.reports.sent')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'sent').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20">
              <FileTextOutlined className="text-white text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">{t('passport.reports.drafts')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'draft').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
        <Table
          columns={columns}
          dataSource={reports}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `${t('passport.reports.total')}: ${total}`,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* Report Builder Modal */}
      <Modal
        open={isReportBuilderOpen}
        onCancel={() => {
          setIsReportBuilderOpen(false);
          form.resetFields();
          setSelectedColumns([]);
          setTemplateName('');
        }}
        footer={null}
        width={800}
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-mainColor text-xl" />
            <span className="text-xl font-bold">{t('passport.reports.createReport')}</span>
          </div>
        }
      >
        <Form form={form} layout="vertical" className="mt-4">
          {/* Template Selection */}
          <Form.Item
            label={t('passport.reports.selectTemplate')}
            name="template"
            rules={[{ required: true, message: t('passport.reports.selectTemplateRequired') }]}
          >
            <Select size="large" placeholder={t('passport.reports.chooseTemplate')}>
              {reportTemplates.map(template => (
                <Option key={template.key} value={template.key}>
                  {t(`passport.reports.templates.${template.key}`) || template.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Template Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('passport.reports.templateName')}
            </label>
            <div className="flex gap-2">
              <Input
                size="large"
                placeholder={t('passport.reports.enterTemplateName')}
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="flex-1"
              />
              <Button
                icon={<SaveOutlined />}
                onClick={handleSaveTemplate}
                disabled={!templateName.trim()}
                size="large"
              >
                {t('passport.reports.saveTemplate')}
              </Button>
            </div>
          </div>

          {/* Column Selection */}
          <Form.Item
            label={t('passport.reports.selectColumns')}
            required
          >
            <div className="border-2 border-gray-200 rounded-xl p-4 max-h-64 overflow-y-auto">
              <div className="flex gap-2 mb-3">
                <Button size="small" onClick={() => setSelectedColumns(availableColumns.map(c => c.key))}>
                  {t('passport.reports.selectAll')}
                </Button>
                <Button size="small" onClick={() => setSelectedColumns([])}>
                  {t('passport.reports.deselectAll')}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {availableColumns.map(column => (
                  <Checkbox
                    key={column.key}
                    checked={selectedColumns.includes(column.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedColumns([...selectedColumns, column.key]);
                      } else {
                        setSelectedColumns(selectedColumns.filter(c => c !== column.key));
                      }
                    }}
                  >
                    {t(`passport.reports.columns.${column.key}`) || column.label}
                  </Checkbox>
                ))}
              </div>
            </div>
          </Form.Item>

          {/* Format Selection */}
          <Form.Item
            label={t('passport.reports.selectFormat')}
            name="format"
            rules={[{ required: true, message: t('passport.reports.selectFormatRequired') }]}
          >
            <Select size="large" placeholder={t('passport.reports.chooseFormat')}>
              <Option value="pdf">
                <FilePdfOutlined className="text-red-500 mr-2" />
                PDF
              </Option>
              <Option value="excel">
                <FileExcelOutlined className="text-green-500 mr-2" />
                Excel
              </Option>
            </Select>
          </Form.Item>

          {/* Actions */}
          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
            <Button
              onClick={() => {
                setIsReportBuilderOpen(false);
                form.resetFields();
                setSelectedColumns([]);
                setTemplateName('');
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={() => handleGenerateReport('pdf')}
              className="bg-red-500 hover:bg-red-600 border-0"
            >
              {t('passport.reports.generatePDF')}
            </Button>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={() => handleGenerateReport('excel')}
              className="bg-green-500 hover:bg-green-600 border-0"
            >
              {t('passport.reports.generateExcel')}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PassportReportsPage;

