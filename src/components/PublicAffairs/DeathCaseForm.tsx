import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Input, Select, DatePicker, Upload, Button } from 'antd';
import { 
  UserOutlined,
  IdcardOutlined,
  GlobalOutlined,
  CloseOutlined,
  UploadOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  SaveOutlined,
  PictureOutlined
} from '@ant-design/icons';
import type { DeathCase, DeathCauseType } from '../../data/mockPublicAffairs';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface DeathCaseFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: Omit<DeathCase, 'id' | 'createdAt' | 'completed' | 'completedAt' | 'burialCompleted'>) => void;
}

export const DeathCaseForm: React.FC<DeathCaseFormProps> = ({
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
    causeOfDeath: '',
    causeOfDeathType: 'heart_attack' as DeathCauseType,
    placeOfDeath: '',
    timeOfDeath: '',
    dateOfDeath: '',
    imageUrl: '',
    nusukCaseNumber: ''
  });
  const [dateOfDeath, setDateOfDeath] = useState<Dayjs | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nationalities = [
    'السعودية', 'مصر', 'باكستان', 'الهند', 'بنغلاديش', 
    'إندونيسيا', 'نيجيريا', 'تركيا', 'إيران', 'المغرب',
    'العراق', 'اليمن', 'سوريا', 'لبنان', 'الأردن'
  ];

  const causeOfDeathOptions = [
    { value: 'heart_attack', label: t('heartAttack') },
    { value: 'traffic_accident', label: t('trafficAccident') },
    { value: 'natural_causes', label: t('naturalCauses') },
    { value: 'medical_emergency', label: t('medicalEmergency') },
    { value: 'other', label: t('other') }
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
    if (!formData.causeOfDeath.trim()) {
      newErrors.causeOfDeath = t('required');
    }
    if (!formData.placeOfDeath.trim()) {
      newErrors.placeOfDeath = t('required');
    }
    if (!formData.timeOfDeath.trim()) {
      newErrors.timeOfDeath = t('required');
    }
    if (!formData.dateOfDeath.trim()) {
      newErrors.dateOfDeath = t('required');
    }
    if (!formData.nusukCaseNumber.trim()) {
      newErrors.nusukCaseNumber = t('required');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      dateOfDeath: formData.dateOfDeath || (dateOfDeath ? dateOfDeath.format('YYYY-MM-DD') : '')
    });

    // Reset form
    setFormData({
      name: '',
      passportNumber: '',
      nationality: '',
      causeOfDeath: '',
      causeOfDeathType: 'heart_attack',
      placeOfDeath: '',
      timeOfDeath: '',
      dateOfDeath: '',
      imageUrl: '',
      nusukCaseNumber: ''
    });
    setDateOfDeath(null);
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      passportNumber: '',
      nationality: '',
      causeOfDeath: '',
      causeOfDeathType: 'heart_attack',
      placeOfDeath: '',
      timeOfDeath: '',
      dateOfDeath: '',
      imageUrl: '',
      nusukCaseNumber: ''
    });
    setDateOfDeath(null);
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
          {t('registerDeathCase')}
        </h2>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {/* Horizontal Layout: Personal Information (Left) and Death Information (Right) */}
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
                    <span className="block text-sm font-semibold text-gray-700">{t('deceasedName')} <span className="text-red-500">*</span></span>
                  </div>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder={t('deceasedNamePlaceholder')}
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
                    placeholder={t('passportNumberPlaceholder')}
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

            {/* Right Side: Death Information */}
            <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                <h4 className="text-xl font-bold text-gray-900">{t('deathInfo')}</h4>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('causeOfDeathType')} <span className="text-red-500">*</span></span>
                  </div>
                  <Select
                    value={formData.causeOfDeathType}
                    onChange={(value) => updateField('causeOfDeathType', value)}
                    className="w-full"
                    options={causeOfDeathOptions}
                  />
                </label>

                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <EnvironmentOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('placeOfDeath')} <span className="text-red-500">*</span></span>
                  </div>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 ${
                      errors.placeOfDeath ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder={t('placeOfDeathPlaceholder')}
                    value={formData.placeOfDeath}
                    onChange={(e) => updateField('placeOfDeath', e.target.value)}
                    required
                  />
                  {errors.placeOfDeath && <p className="text-red-500 text-xs mt-1">{errors.placeOfDeath}</p>}
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarOutlined className="text-mainColor text-base" />
                      <span className="block text-sm font-semibold text-gray-700">{t('dateOfDeath')} <span className="text-red-500">*</span></span>
                    </div>
                    <DatePicker
                      value={dateOfDeath}
                      onChange={(date) => {
                        setDateOfDeath(date);
                        updateField('dateOfDeath', date ? date.format('YYYY-MM-DD') : '');
                      }}
                      className={`w-full ${errors.dateOfDeath ? 'border-red-500' : ''}`}
                      format="YYYY-MM-DD"
                      style={{ width: '100%' }}
                    />
                    {errors.dateOfDeath && <p className="text-red-500 text-xs mt-1">{errors.dateOfDeath}</p>}
                  </label>

                  <label className="block">
                    <div className="flex items-center gap-2 mb-2">
                      <ClockCircleOutlined className="text-mainColor text-base" />
                      <span className="block text-sm font-semibold text-gray-700">{t('timeOfDeath')} <span className="text-red-500">*</span></span>
                    </div>
                    <input
                      type="time"
                      value={formData.timeOfDeath}
                      onChange={(e) => updateField('timeOfDeath', e.target.value)}
                      className={`w-full px-4 py-2 h-[32px] border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 ${
                        errors.timeOfDeath ? 'border-red-500' : 'border-gray-200'
                      }`}
                      required
                    />
                    {errors.timeOfDeath && <p className="text-red-500 text-xs mt-1">{errors.timeOfDeath}</p>}
                  </label>
                </div>

                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('causeOfDeath')} <span className="text-red-500">*</span></span>
                  </div>
                  <TextArea
                    value={formData.causeOfDeath}
                    onChange={(e) => updateField('causeOfDeath', e.target.value)}
                    placeholder={t('causeOfDeathPlaceholder')}
                    rows={3}
                    className={`rounded-xl ${errors.causeOfDeath ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.causeOfDeath && <p className="text-red-500 text-xs mt-1">{errors.causeOfDeath}</p>}
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
                  placeholder={t('nusukCaseNumberPlaceholder')}
                  value={formData.nusukCaseNumber}
                  onChange={(e) => updateField('nusukCaseNumber', e.target.value)}
                  required
                />
                {errors.nusukCaseNumber && <p className="text-red-500 text-xs mt-1">{errors.nusukCaseNumber}</p>}
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <PictureOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('addImage')}</span>
                </div>
                <Upload
                  beforeUpload={() => false}
                  onChange={(info) => {
                    if (info.fileList.length > 0) {
                      const file = info.fileList[0].originFileObj;
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updateField('imageUrl', reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    } else {
                      updateField('imageUrl', '');
                    }
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} className="rounded-xl w-full">
                    {t('uploadImage')}
                  </Button>
                </Upload>
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <FileTextOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('deathCertificate') || 'شهادة الوفاة'}</span>
                </div>
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  className="w-full"
                >
                  <Button icon={<UploadOutlined />} className="rounded-xl w-full">
                    {t('uploadDeathCertificate') || 'رفع شهادة الوفاة'}
                  </Button>
                </Upload>
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <FileTextOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('otherDocuments') || 'إثباتات أخرى'}</span>
                </div>
                <Upload
                  beforeUpload={() => false}
                  multiple
                  className="w-full"
                >
                  <Button icon={<UploadOutlined />} className="rounded-xl w-full">
                    {t('uploadOtherDocuments') || 'رفع إثباتات أخرى'}
                  </Button>
                </Upload>
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
