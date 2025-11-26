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
import type { ServiceCenterReport } from '../../pages/ServiceCentersPages/ReportsPage';

const { TextArea } = Input;

interface AddServiceCenterReportFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: Omit<ServiceCenterReport, 'id'>) => void;
}

export const AddServiceCenterReportForm: React.FC<AddServiceCenterReportFormProps> = ({
  open,
  onCancel,
  onSubmit
}) => {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    reportNumber: '',
    status: 'pending' as ServiceCenterReport['status'],
    period: '',
    involvedParties: '',
    issueDate: '',
    description: ''
  });
  const [reportDate, setReportDate] = useState<Dayjs | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = [
    { value: 'completed', label: t('serviceCentersReports.completed') },
    { value: 'pending', label: t('serviceCentersReports.pending') },
    { value: 'delayed', label: t('serviceCentersReports.delayed') },
    { value: 'escalated', label: t('serviceCentersReports.escalated') },
  ];

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.reportNumber.trim()) {
      newErrors.reportNumber = 'مطلوب';
    }
    if (!formData.period.trim()) {
      newErrors.period = 'مطلوب';
    }
    if (!formData.involvedParties.trim()) {
      newErrors.involvedParties = 'مطلوب';
    }
    if (!formData.issueDate.trim()) {
      newErrors.issueDate = 'مطلوب';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      issueDate: formData.issueDate || (reportDate ? reportDate.format('YYYY-MM-DD') : '')
    });

    // Reset form
    setFormData({
      reportNumber: '',
      status: 'pending',
      period: '',
      involvedParties: '',
      issueDate: '',
      description: ''
    });
    setReportDate(null);
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({
      reportNumber: '',
      status: 'pending',
      period: '',
      involvedParties: '',
      issueDate: '',
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
      className="service-center-report-form-modal"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {t('serviceCentersReports.addReport')}
        </h2>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {/* Horizontal Layout: Report Information (Left) and Details (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side: Report Information */}
            <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                <h4 className="text-xl font-bold text-gray-900">{t('serviceCentersReports.title')}</h4>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('serviceCentersReports.reportNumber')} <span className="text-red-500">*</span></span>
                  </div>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 ${
                      errors.reportNumber ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder={t('serviceCentersReports.reportNumber')}
                    value={formData.reportNumber}
                    onChange={(e) => updateField('reportNumber', e.target.value)}
                    required
                  />
                  {errors.reportNumber && <p className="text-red-500 text-xs mt-1">{errors.reportNumber}</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('serviceCentersReports.status')}</span>
                  </div>
                  <Select
                    value={formData.status}
                    onChange={(value) => updateField('status', value)}
                    className="w-full"
                    options={statusOptions}
                  />
                </label>

                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <ClockCircleOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('serviceCentersReports.period')} <span className="text-red-500">*</span></span>
                  </div>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 ${
                      errors.period ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder={t('serviceCentersReports.period')}
                    value={formData.period}
                    onChange={(e) => updateField('period', e.target.value)}
                    required
                  />
                  {errors.period && <p className="text-red-500 text-xs mt-1">{errors.period}</p>}
                </label>
              </div>
            </section>

            {/* Right Side: Date and Parties */}
            <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                <h4 className="text-xl font-bold text-gray-900">{t('serviceCentersReports.details')}</h4>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('serviceCentersReports.issueDate')} <span className="text-red-500">*</span></span>
                  </div>
                  <DatePicker
                    value={reportDate}
                    onChange={(date) => {
                      setReportDate(date);
                      updateField('issueDate', date ? date.format('YYYY-MM-DD') : '');
                    }}
                    className={`w-full ${errors.issueDate ? 'border-red-500' : ''}`}
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                  />
                  {errors.issueDate && <p className="text-red-500 text-xs mt-1">{errors.issueDate}</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <EnvironmentOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('serviceCentersReports.involvedParties')} <span className="text-red-500">*</span></span>
                  </div>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 ${
                      errors.involvedParties ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder={t('serviceCentersReports.involvedParties')}
                    value={formData.involvedParties}
                    onChange={(e) => updateField('involvedParties', e.target.value)}
                    required
                  />
                  {errors.involvedParties && <p className="text-red-500 text-xs mt-1">{errors.involvedParties}</p>}
                </label>
              </div>
            </section>
          </div>

          {/* Description Section */}
          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
              <h4 className="text-xl font-bold text-gray-900">{t('serviceCentersReports.description')}</h4>
            </div>
            <div>
              <TextArea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder={t('serviceCentersReports.description')}
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

