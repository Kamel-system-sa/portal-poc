import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CameraOutlined,
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import type { CampaignFollowUpFormData, CampaignRegistrationFormData } from '../../types/reception';

interface CampaignFollowUpFormProps {
  registrationData: CampaignRegistrationFormData;
  initialData?: CampaignFollowUpFormData;
  onCancel: () => void;
  onSave: (data: CampaignFollowUpFormData) => void;
  onSaveAndExit: (data: CampaignFollowUpFormData) => void;
  onAddAnother: (data: CampaignFollowUpFormData) => void;
}

export const CampaignFollowUpForm: React.FC<CampaignFollowUpFormProps> = ({
  registrationData,
  initialData,
  onCancel,
  onSave,
  onSaveAndExit,
  onAddAnother
}) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';

  const [formData, setFormData] = useState<CampaignFollowUpFormData>({
    campaignName: initialData?.campaignName || '',
    responsiblePerson: initialData?.responsiblePerson || '',
    gender: initialData?.gender || 'male',
    phone: initialData?.phone || '',
    secondaryPhone: initialData?.secondaryPhone || '',
    email: initialData?.email || '',
    photo: initialData?.photo
  });

  const [photo, setPhoto] = useState<string | null>(initialData?.photo || null);

  // Update form when initialData changes (for edit mode)
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        campaignName: initialData.campaignName || '',
        responsiblePerson: initialData.responsiblePerson || '',
        gender: initialData.gender || 'male',
        phone: initialData.phone || '',
        secondaryPhone: initialData.secondaryPhone || '',
        email: initialData.email || '',
        photo: initialData.photo
      });
      setPhoto(initialData.photo || null);
    }
  }, [initialData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      setPhoto(photoUrl);
      setFormData(prev => ({ ...prev, photo: photoUrl }));
    }
  };

  const handleSubmit = (e: React.FormEvent, action: 'save' | 'saveAndExit' | 'addAnother') => {
    e.preventDefault();
    const submitData: CampaignFollowUpFormData = {
      ...formData,
      photo: photo || undefined
    };

    if (action === 'save') {
      onSave(submitData);
    } else if (action === 'saveAndExit') {
      onSaveAndExit(submitData);
    } else if (action === 'addAnother') {
      onAddAnother(submitData);
    }
  };

  return (
    <form className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Campaign Manager Information */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">
            {t('reception.campaigns.form.campaignManagerInfo') || 'Campaign Manager Information'}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <UserOutlined className="text-mainColor" />
              {t('reception.campaigns.form.campaignName') || 'Campaign Name'}
            </label>
            <input
              type="text"
              value={formData.campaignName}
              onChange={(e) => setFormData(prev => ({ ...prev, campaignName: e.target.value }))}
              placeholder={t('reception.campaigns.form.campaignNamePlaceholder') || 'Enter campaign name'}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              required
            />
          </div>

          {/* Responsible Person Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <UserOutlined className="text-mainColor" />
              {t('reception.campaigns.form.responsiblePerson') || 'Responsible Person Name'}
            </label>
            <input
              type="text"
              value={formData.responsiblePerson}
              onChange={(e) => setFormData(prev => ({ ...prev, responsiblePerson: e.target.value }))}
              placeholder={t('reception.campaigns.form.responsiblePersonPlaceholder') || 'Enter responsible person name'}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <UserOutlined className="text-mainColor" />
              {t('reception.campaigns.form.gender') || 'Gender'}
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
              required
            >
              <option value="male">{t('hr.form.male') || 'Male'}</option>
              <option value="female">{t('hr.form.female') || 'Female'}</option>
            </select>
          </div>

          {/* Primary Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <PhoneOutlined className="text-mainColor" />
              {t('reception.campaigns.form.phone') || 'Phone Number'}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+9665XXXXXXXX"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              required
            />
          </div>

          {/* Secondary Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <PhoneOutlined className="text-mainColor" />
              {t('reception.campaigns.form.secondaryPhone') || 'Secondary Phone'} ({t('form.optional') || 'Optional'})
            </label>
            <input
              type="tel"
              value={formData.secondaryPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, secondaryPhone: e.target.value }))}
              placeholder="+9665XXXXXXXX"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MailOutlined className="text-mainColor" />
              {t('reception.campaigns.form.email') || 'Email'} ({t('form.optional') || 'Optional'})
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="example@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
            />
          </div>

          {/* Photo Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <CameraOutlined className="text-mainColor" />
              {t('reception.campaigns.form.addPhoto') || 'Add Photo'} ({t('form.optional') || 'Optional'})
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-mainColor transition-colors">
              {photo ? (
                <div className="space-y-3">
                  <img src={photo} alt="Campaign Manager" className="w-full h-48 object-cover rounded-lg mx-auto max-w-md" />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setFormData(prev => ({ ...prev, photo: undefined }));
                    }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    {t('reception.campaigns.form.removePhoto') || 'Remove Photo'}
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="space-y-3">
                    <CameraOutlined className="text-4xl text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">{t('reception.campaigns.form.clickToUpload') || 'Click to upload photo'}</p>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Form Actions */}
      <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
        >
          {t('form.cancel') || 'Cancel'}
        </button>
        <button
          type="submit"
          onClick={(e) => handleSubmit(e, 'save')}
          className="px-6 py-3.5 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg font-semibold flex items-center justify-center gap-2"
        >
          <SaveOutlined />
          {t('reception.campaigns.form.save') || 'Save'}
        </button>
        <button
          type="submit"
          onClick={(e) => handleSubmit(e, 'addAnother')}
          className="px-6 py-3.5 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg font-semibold flex items-center justify-center gap-2"
        >
          <PlusOutlined />
          {t('reception.campaigns.form.addAnother') || 'Add Another Campaign'}
        </button>
        <button
          type="submit"
          onClick={(e) => handleSubmit(e, 'saveAndExit')}
          className="px-6 py-3.5 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center justify-center gap-2"
        >
          <SaveOutlined />
          {t('reception.campaigns.form.saveAndExit') || 'Save & Exit'}
        </button>
      </div>
    </form>
  );
};
