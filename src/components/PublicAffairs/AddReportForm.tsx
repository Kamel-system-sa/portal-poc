import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Input, Select, DatePicker } from 'antd';
import { 
  FileTextOutlined,
  CloseOutlined,
  SaveOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { Report } from '../../pages/PublicAffairsPages/PublicAffairsReportsPage';

const { TextArea } = Input;

interface AddReportFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: Omit<Report, 'id'>) => void;
}

export const AddReportForm: React.FC<AddReportFormProps> = ({
  open,
  onCancel,
  onSubmit
}) => {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    reportNumber: '',
    source: '' as Report['source'] | '',
    reportType: '',
    date: '',
    responseTime: '',
    status: 'pending' as Report['status'],
    description: ''
  });
  const [reportDate, setReportDate] = useState<Dayjs | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sourceOptions = [
    { value: 'ministry', label: t('publicAffairsReports.fromMinistry') },
    { value: 'whatsapp', label: t('publicAffairsReports.fromWhatsApp') },
    { value: 'radio', label: t('publicAffairsReports.fromRadio') },
    { value: 'callcenter', label: t('publicAffairsReports.fromCallCenter') },
  ];

  const statusOptions = [
    { value: 'completed', label: t('publicAffairsReports.completed') },
    { value: 'delayed', label: t('publicAffairsReports.delayed') },
    { value: 'pending', label: t('publicAffairsReports.pending') },
    { value: 'notCompleted', label: t('publicAffairsReports.notCompleted') },
  ];

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.reportNumber.trim()) {
      newErrors.reportNumber = 'مطلوب';
    }
    if (!formData.source) {
      newErrors.source = 'مطلوب';
    }
    if (!formData.reportType.trim()) {
      newErrors.reportType = 'مطلوب';
    }
    if (!formData.date.trim()) {
      newErrors.date = 'مطلوب';
    }
    if (!formData.responseTime.trim()) {
      newErrors.responseTime = 'مطلوب';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      source: formData.source as Report['source'],
      date: formData.date || (reportDate ? reportDate.format('YYYY-MM-DD') : '')
    });

    // Reset form
    setFormData({
      reportNumber: '',
      source: '' as Report['source'] | '',
      reportType: '',
      date: '',
      responseTime: '',
      status: 'pending',
      description: ''
    });
    setReportDate(null);
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({
      reportNumber: '',
      source: '' as Report['source'] | '',
      reportType: '',
      date: '',
      responseTime: '',
      status: 'pending',
      description: ''
    });
    setReportDate(null);
    setErrors({});
    onCancel();
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={1200}
      closeIcon={<CloseOutlined />}
      className="public-affairs-form-modal"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {t('publicAffairsReports.addReport')}
        </h2>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {/* Horizontal Layout: Report Information (Left) and Details (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side: Report Information */}
            <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                <h4 className="text-xl font-bold text-gray-900">{t('publicAffairsReports.title')}</h4>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('publicAffairsReports.reportNumber')} <span className="text-red-500">*</span></span>
                  </div>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 ${
                      errors.reportNumber ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder={t('publicAffairsReports.reportNumber')}
                    value={formData.reportNumber}
                    onChange={(e) => updateField('reportNumber', e.target.value)}
                    required
                  />
                  {errors.reportNumber && <p className="text-red-500 text-xs mt-1">{errors.reportNumber}</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <EnvironmentOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('publicAffairsReports.source')} <span className="text-red-500">*</span></span>
                  </div>
                  <Select
                    value={formData.source || undefined}
                    onChange={(value) => updateField('source', value)}
                    placeholder={t('publicAffairsReports.source')}
                    className={`w-full ${errors.source ? 'border-red-500' : ''}`}
                    options={sourceOptions}
                  />
                  {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source}</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('publicAffairsReports.type')} <span className="text-red-500">*</span></span>
                  </div>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 ${
                      errors.reportType ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder={t('publicAffairsReports.type')}
                    value={formData.reportType}
                    onChange={(e) => updateField('reportType', e.target.value)}
                    required
                  />
                  {errors.reportType && <p className="text-red-500 text-xs mt-1">{errors.reportType}</p>}
                </label>
              </div>
            </section>

            {/* Right Side: Date and Status */}
            <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                <h4 className="text-xl font-bold text-gray-900">{t('publicAffairsReports.date')}</h4>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('publicAffairsReports.date')} <span className="text-red-500">*</span></span>
                  </div>
                  <DatePicker
                    value={reportDate}
                    onChange={(date) => {
                      setReportDate(date);
                      updateField('date', date ? date.format('YYYY-MM-DD') : '');
                    }}
                    className={`w-full ${errors.date ? 'border-red-500' : ''}`}
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <ClockCircleOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('publicAffairsReports.responseTime')} <span className="text-red-500">*</span></span>
                  </div>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 ${
                      errors.responseTime ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder={t('publicAffairsReports.responseTime')}
                    value={formData.responseTime}
                    onChange={(e) => updateField('responseTime', e.target.value)}
                    required
                  />
                  {errors.responseTime && <p className="text-red-500 text-xs mt-1">{errors.responseTime}</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('publicAffairsReports.status')}</span>
                  </div>
                  <Select
                    value={formData.status}
                    onChange={(value) => updateField('status', value)}
                    className="w-full"
                    options={statusOptions}
                  />
                </label>
              </div>
            </section>
          </div>

          {/* Description Section */}
          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
              <h4 className="text-xl font-bold text-gray-900">{t('publicAffairsReports.description')}</h4>
            </div>
            <div>
              <TextArea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder={t('publicAffairsReports.description')}
                rows={4}
                className="rounded-xl"
              />
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:shadow-lg hover:shadow-mainColor/30 transition-all duration-200 font-semibold flex items-center gap-2"
            >
              <SaveOutlined />
              {t('submit') || 'حفظ'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

