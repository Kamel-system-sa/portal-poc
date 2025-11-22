import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  IdcardOutlined,
  GlobalOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { mockOrganizers, getCampaignStatsForOrganizer } from '../../data/mockCampaigns';
import type { CampaignRegistrationFormData, Organizer } from '../../types/reception';

interface CampaignRegistrationFormProps {
  initialData?: CampaignRegistrationFormData;
  onCancel: () => void;
  onSubmit: (data: CampaignRegistrationFormData) => void;
  onNext: (data: CampaignRegistrationFormData) => void;
}

export const CampaignRegistrationForm: React.FC<CampaignRegistrationFormProps> = ({
  initialData,
  onCancel,
  onSubmit,
  onNext
}) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';

  const [formData, setFormData] = useState<CampaignRegistrationFormData>({
    organizerId: initialData?.organizerId || '',
    organizerNumber: initialData?.organizerNumber || '',
    organizerName: initialData?.organizerName || '',
    companyName: initialData?.companyName || '',
    totalPilgrims: initialData?.totalPilgrims || 0,
    nationality: initialData?.nationality || '',
    phone: initialData?.phone || '',
    email: initialData?.email || ''
  });

  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);
  const [campaignStats, setCampaignStats] = useState<{
    totalCampaigns: number;
    totalPilgrims: number;
    registeredPilgrims: number;
    remainingPilgrims: number;
    registrationPercentage: number;
  } | null>(null);

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      // Find organizer by number if organizerId is not provided
      if (!initialData.organizerId && initialData.organizerNumber) {
        const organizer = mockOrganizers.find(org => org.number === initialData.organizerNumber);
        if (organizer) {
          setFormData({
            ...initialData,
            organizerId: organizer.id,
            companyName: initialData.companyName || organizer.company
          });
          setSelectedOrganizer(organizer);
          const stats = getCampaignStatsForOrganizer(organizer.id);
          setCampaignStats(stats);
        } else {
          setFormData(initialData);
        }
      } else if (initialData.organizerId) {
        const organizer = mockOrganizers.find(org => org.id === initialData.organizerId);
        if (organizer) {
          setSelectedOrganizer(organizer);
          const stats = getCampaignStatsForOrganizer(organizer.id);
          setCampaignStats(stats);
        }
        setFormData(initialData);
      } else {
        setFormData(initialData);
      }
    }
  }, [initialData]);

  // Update form when organizer is selected (only if not in edit mode or if initialData was cleared)
  useEffect(() => {
    if (formData.organizerId && !initialData) {
      const organizer = mockOrganizers.find(org => org.id === formData.organizerId);
      if (organizer) {
        setSelectedOrganizer(organizer);
        setFormData(prev => ({
          ...prev,
          organizerNumber: organizer.number,
          organizerName: organizer.name,
          companyName: organizer.company,
          phone: organizer.phone,
          email: organizer.email
        }));
        const stats = getCampaignStatsForOrganizer(organizer.id);
        setCampaignStats(stats);
      }
    } else if (!formData.organizerId) {
      setSelectedOrganizer(null);
      setCampaignStats(null);
    }
  }, [formData.organizerId, initialData]);

  const handleOrganizerChange = (organizerId: string) => {
    const organizer = mockOrganizers.find(org => org.id === organizerId);
    if (organizer) {
      setFormData(prev => ({
        ...prev,
        organizerId,
        organizerNumber: organizer.number,
        organizerName: organizer.name,
        companyName: organizer.company,
        phone: organizer.phone,
        email: organizer.email
      }));
    }
  };

  const handleSearchOrganizer = (searchValue: string) => {
    // Search by number, name, or company
    const found = mockOrganizers.find(
      org =>
        org.number.toLowerCase().includes(searchValue.toLowerCase()) ||
        org.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        org.company.toLowerCase().includes(searchValue.toLowerCase())
    );
    if (found) {
      handleOrganizerChange(found.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) {
      onNext(formData);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Organizer Selection Section */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">
            {t('reception.campaigns.form.selectOrganizer') || 'Select Organizer'}
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Search Organizer */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('reception.campaigns.form.searchOrganizer') || 'Search Organizer (Number/Name/Company)'}
            </label>
            <input
              type="text"
              placeholder={t('reception.campaigns.form.searchPlaceholder') || 'Search by organizer number, name, or company...'}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              onChange={(e) => handleSearchOrganizer(e.target.value)}
            />
          </div>

          {/* Organizer Selection Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <UserOutlined className="text-mainColor" />
              {t('reception.campaigns.form.organizer') || 'Organizer'}
            </label>
            <select
              value={formData.organizerId}
              onChange={(e) => handleOrganizerChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
              required
            >
              <option value="">{t('reception.campaigns.form.selectOrganizer') || 'Select Organizer...'}</option>
              {mockOrganizers.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.number} - {org.name} ({org.company})
                </option>
              ))}
            </select>
          </div>

          {/* Auto-filled Organizer Info */}
          {selectedOrganizer && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <InfoCircleOutlined className="text-mainColor" />
                {t('reception.campaigns.form.organizerInfo') || 'Organizer Information'}
              </h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">{t('reception.preArrival.form.organizerNumber')}: </span>
                  <span className="text-gray-900">{formData.organizerNumber}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t('reception.preArrival.form.organizerName')}: </span>
                  <span className="text-gray-900">{formData.organizerName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t('reception.preArrival.form.organizerCompany')}: </span>
                  <span className="text-gray-900">{formData.companyName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t('reception.preArrival.form.organizerPhone')}: </span>
                  <span className="text-gray-900">{formData.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">{t('reception.preArrival.form.organizerEmail')}: </span>
                  <span className="text-gray-900">{formData.email}</span>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Statistics */}
          {campaignStats && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <GlobalOutlined className="text-blue-600" />
                {t('reception.campaigns.form.campaignStats') || 'Campaign Statistics'}
              </h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-blue-700">{t('reception.campaigns.form.totalCampaigns') || 'Total Campaigns'}: </span>
                  <span className="text-blue-900 font-semibold">{campaignStats.totalCampaigns}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">{t('reception.campaigns.form.totalPilgrims') || 'Total Pilgrims'}: </span>
                  <span className="text-blue-900 font-semibold">{campaignStats.totalPilgrims.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">{t('reception.campaigns.form.registeredPilgrims') || 'Registered Pilgrims'}: </span>
                  <span className="text-blue-900 font-semibold">{campaignStats.registeredPilgrims.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">{t('reception.campaigns.form.remainingPilgrims') || 'Remaining Pilgrims'}: </span>
                  <span className="text-blue-900 font-semibold">{campaignStats.remainingPilgrims.toLocaleString()}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-blue-700">{t('reception.campaigns.form.registrationPercentage') || 'Registration Percentage'}: </span>
                  <span className="text-blue-900 font-semibold">{campaignStats.registrationPercentage}%</span>
                  <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${campaignStats.registrationPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Campaign Details Section */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">
            {t('reception.campaigns.form.campaignDetails') || 'Campaign Details'}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Number of Pilgrims */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <TeamOutlined className="text-mainColor" />
              {t('reception.campaigns.form.numberOfPilgrims') || 'Number of Pilgrims'}
            </label>
            <input
              type="number"
              value={formData.totalPilgrims}
              onChange={(e) => setFormData(prev => ({ ...prev, totalPilgrims: Number(e.target.value) }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              required
              min={1}
            />
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <GlobalOutlined className="text-mainColor" />
              {t('reception.campaigns.form.nationality') || 'Nationality'}
            </label>
            <select
              value={formData.nationality}
              onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
              required
            >
              <option value="">{t('form.selectNationality') || 'Select Nationality'}</option>
              <option value="saudi">{t('nationalities.saudi') || 'Saudi'}</option>
              <option value="egyptian">{t('nationalities.egyptian') || 'Egyptian'}</option>
              <option value="pakistani">{t('nationalities.pakistani') || 'Pakistani'}</option>
              <option value="indian">{t('nationalities.indian') || 'Indian'}</option>
              <option value="indonesian">{t('nationalities.indonesian') || 'Indonesian'}</option>
              <option value="turkish">{t('nationalities.turkish') || 'Turkish'}</option>
            </select>
          </div>

          {/* Phone */}
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

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MailOutlined className="text-mainColor" />
              {t('reception.campaigns.form.email') || 'Email'}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="example@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              required
            />
          </div>
        </div>
      </section>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
        >
          {t('form.cancel') || 'Cancel'}
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3.5 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center justify-center gap-2"
        >
          {t('reception.campaigns.form.next') || 'Next: Follow-Up Form'}
        </button>
      </div>
    </form>
  );
};

