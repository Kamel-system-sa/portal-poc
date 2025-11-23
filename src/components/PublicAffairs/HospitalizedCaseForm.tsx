import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Input, Select, Button } from 'antd';
import { 
  UserOutlined,
  IdcardOutlined,
  GlobalOutlined,
  CloseOutlined,
  SaveOutlined,
  HeartOutlined,
  PhoneOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import type { HospitalizedCase, HospitalStatus } from '../../data/mockPublicAffairs';

const { TextArea } = Input;

interface HospitalizedCaseFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: Omit<HospitalizedCase, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt' | 'discharged'>) => void;
}

export const HospitalizedCaseForm: React.FC<HospitalizedCaseFormProps> = ({
  open,
  onCancel,
  onSubmit
}) => {
  const { t } = useTranslation('PublicAffairs');
  const { t: tCommon } = useTranslation('common');
  const [formData, setFormData] = useState({
    name: '',
    passportNumber: '',
    nationality: '',
    hospital: '',
    status: 'مستقر',
    statusType: 'stable' as HospitalStatus,
    contactDelegate: '',
    detailedReport: '',
    nusukCaseNumber: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nationalities = [
    'السعودية', 'مصر', 'باكستان', 'الهند', 'بنغلاديش', 
    'إندونيسيا', 'نيجيريا', 'تركيا', 'إيران', 'المغرب',
    'العراق', 'اليمن', 'سوريا', 'لبنان', 'الأردن'
  ];

  const hospitalOptions = [
    'مستشفى الملك فهد', 'مستشفى النور', 'مستشفى الحراء', 
    'مستشفى العزيزية', 'مستشفى العابدية', 'مستشفى أجياد',
    'مستشفى المشاعر', 'مستشفى منى', 'مستشفى عرفات'
  ];

  const statusOptions = [
    { value: 'stable', label: t('stable'), statusText: 'مستقر' },
    { value: 'critical', label: t('critical'), statusText: 'حرجة' },
    { value: 'improving', label: t('improving'), statusText: 'تحسن' },
    { value: 'discharged', label: t('markDischarged'), statusText: 'تم الإفاقة' }
  ];

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('required');
    }
    if (!formData.passportNumber.trim()) {
      newErrors.passportNumber = t('required');
    }
    if (!formData.nationality.trim()) {
      newErrors.nationality = t('required');
    }
    if (!formData.hospital.trim()) {
      newErrors.hospital = t('required');
    }
    if (!formData.contactDelegate.trim()) {
      newErrors.contactDelegate = t('required');
    }
    if (!formData.nusukCaseNumber.trim()) {
      newErrors.nusukCaseNumber = t('required');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData
    });

    // Reset form
    setFormData({
      name: '',
      passportNumber: '',
      nationality: '',
      hospital: '',
      status: 'مستقر',
      statusType: 'stable',
      contactDelegate: '',
      detailedReport: '',
      nusukCaseNumber: ''
    });
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      passportNumber: '',
      nationality: '',
      hospital: '',
      status: 'مستقر',
      statusType: 'stable',
      contactDelegate: '',
      detailedReport: '',
      nusukCaseNumber: ''
    });
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
          {t('registerHospitalizedCase')}
        </h2>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {/* Horizontal Layout: Personal Information (Left) and Hospitalization Information (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side: Personal Information */}
            <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                <h4 className="text-xl font-bold text-gray-900">{t('personalInfo')}</h4>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <UserOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('pilgrimName')} <span className="text-red-500">*</span></span>
                  </div>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder={t('enterPilgrimName')}
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <IdcardOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('passportNumber')} <span className="text-red-500">*</span></span>
                  </div>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 ${
                      errors.passportNumber ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder={t('enterPassportNumber')}
                    value={formData.passportNumber}
                    onChange={(e) => updateField('passportNumber', e.target.value)}
                    required
                  />
                  {errors.passportNumber && <p className="text-red-500 text-xs mt-1">{errors.passportNumber}</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <GlobalOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('pilgrimNationality')} <span className="text-red-500">*</span></span>
                  </div>
                  <Select
                    value={formData.nationality || undefined}
                    onChange={(value) => updateField('nationality', value)}
                    placeholder={t('selectNationality')}
                    className={`w-full ${errors.nationality ? 'border-red-500' : ''}`}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={nationalities.map(nat => ({ value: nat, label: nat }))}
                  />
                  {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
                </label>
              </div>
            </section>

            {/* Right Side: Hospitalization Information */}
            <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                <h4 className="text-xl font-bold text-gray-900">{t('hospitalizationInfo')}</h4>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <HeartOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('hospital')} <span className="text-red-500">*</span></span>
                  </div>
                  <Select
                    value={formData.hospital || undefined}
                    onChange={(value) => updateField('hospital', value)}
                    placeholder={t('enterHospital')}
                    className={`w-full ${errors.hospital ? 'border-red-500' : ''}`}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={hospitalOptions.map(hosp => ({ value: hosp, label: hosp }))}
                  />
                  {errors.hospital && <p className="text-red-500 text-xs mt-1">{errors.hospital}</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('status')} <span className="text-red-500">*</span></span>
                  </div>
                  <Select
                    value={formData.statusType}
                    onChange={(value) => {
                      const selectedOption = statusOptions.find(opt => opt.value === value);
                      setFormData({ 
                        ...formData, 
                        statusType: value,
                        status: selectedOption?.statusText || 'مستقر'
                      });
                    }}
                    className="w-full"
                    options={statusOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                  />
                </label>

                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <PhoneOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('contactDelegate')} <span className="text-red-500">*</span></span>
                  </div>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 ${
                      errors.contactDelegate ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder={t('enterContactDelegate')}
                    value={formData.contactDelegate}
                    onChange={(e) => updateField('contactDelegate', e.target.value)}
                    required
                  />
                  {errors.contactDelegate && <p className="text-red-500 text-xs mt-1">{errors.contactDelegate}</p>}
                </label>

                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('detailedReport')}</span>
                  </div>
                  <TextArea
                    value={formData.detailedReport}
                    onChange={(e) => updateField('detailedReport', e.target.value)}
                    placeholder={t('enterDetailedReport')}
                    rows={4}
                    className="rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200"
                  />
                </label>
              </div>
            </section>
          </div>

          {/* Third Section: Additional Details */}
          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
              <h4 className="text-xl font-bold text-gray-900">{t('additionalDetails')}</h4>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <IdcardOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('nusukCaseNumber')} <span className="text-red-500">*</span></span>
                </div>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 ${
                    errors.nusukCaseNumber ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder={t('enterNusukCaseNumber')}
                  value={formData.nusukCaseNumber}
                  onChange={(e) => updateField('nusukCaseNumber', e.target.value)}
                  required
                />
                {errors.nusukCaseNumber && <p className="text-red-500 text-xs mt-1">{errors.nusukCaseNumber}</p>}
              </label>
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
              {t('submit')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
