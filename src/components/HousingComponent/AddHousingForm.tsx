import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  UserOutlined,
  PhoneOutlined,
  TeamOutlined,
  HomeOutlined,
  IdcardOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  CalendarOutlined,
  NumberOutlined,
  ApartmentOutlined,
  StarOutlined,
  LinkOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { allOrganizers } from '../../data/housingOrganizers';
import type { HousingRecord, Organizer } from '../../types/housing';

interface AddHousingFormProps {
  onCancel: () => void;
  onSubmit: (data: HousingRecord) => void;
  initialData?: HousingRecord;
}

export const AddHousingForm: React.FC<AddHousingFormProps> = ({
  onCancel,
  onSubmit,
  initialData
}) => {
  const { t } = useTranslation('common');
  const [organizerSearch, setOrganizerSearch] = useState('');
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(
    initialData?.organizer || null
  );

  const [form, setForm] = useState({
    organizerNumber: initialData?.organizer.organizerNumber || '',
    organizerName: initialData?.organizer.name || '',
    organizerCompany: initialData?.organizer.company || '',
    organizerPhone: initialData?.organizer.phone || '',
    groupSize: initialData?.organizer.groupSize || 0,
    campaignNumber: initialData?.organizer.campaignNumber || '',
    contact1: initialData?.organizer.contact1 || '',
    contact2: initialData?.organizer.contact2 || '',
    housingType: initialData?.type || 'hotel',
    housingName: initialData?.housingName || '',
    licenseNumber: initialData?.licenseNumber || '',
    classificationLevel: initialData?.classificationLevel || 3,
    ministryRegistrationNumber: initialData?.ministryRegistrationNumber || '',
    city: initialData?.city || 'makkah',
    district: initialData?.district || '',
    fullAddress: initialData?.fullAddress || '',
    googleMapsUrl: initialData?.googleMapsUrl || '',
    housingCapacity: initialData?.housingCapacity || 0,
    numberOfElevators: initialData?.numberOfElevators || 0,
    numberOfFireExtinguishers: initialData?.numberOfFireExtinguishers || 0,
    numberOfEmergencyExits: initialData?.numberOfEmergencyExits || 0,
    numberOfFloors: initialData?.numberOfFloors || 0,
    reservedRoomsBeforeHajj: initialData?.reservedRoomsBeforeHajj || 0,
    reservedRoomsAfterHajj: initialData?.reservedRoomsAfterHajj || 0,
    checkInDate: initialData?.checkInDate || '',
    checkOutDate: initialData?.checkOutDate || ''
  });

  // Filter organizers based on search
  const filteredOrganizers = useMemo(() => {
    if (!organizerSearch) return allOrganizers.slice(0, 20);
    const searchLower = organizerSearch.toLowerCase();
    return allOrganizers.filter(org =>
      org.organizerNumber.includes(searchLower) ||
      org.name.toLowerCase().includes(searchLower) ||
      org.company.toLowerCase().includes(searchLower)
    ).slice(0, 20);
  }, [organizerSearch]);

  const handleOrganizerSelect = (organizerNumber: string) => {
    const organizer = allOrganizers.find(org => org.organizerNumber === organizerNumber);
    if (organizer) {
      setSelectedOrganizer(organizer);
      setForm(prev => ({
        ...prev,
        organizerNumber: organizer.organizerNumber,
        organizerName: organizer.name,
        organizerCompany: organizer.company,
        organizerPhone: organizer.phone,
        groupSize: organizer.groupSize,
        campaignNumber: organizer.campaignNumber || '',
        contact1: organizer.contact1,
        contact2: organizer.contact2 || ''
      }));
    }
  };

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const housingRecord: HousingRecord = {
      id: initialData?.id || `housing-${Date.now()}`,
      type: form.housingType as 'hotel' | 'building' | 'mina' | 'arafat',
      organizer: selectedOrganizer || {
        id: 'temp-org',
        organizerNumber: form.organizerNumber,
        name: form.organizerName,
        company: form.organizerCompany,
        phone: form.organizerPhone,
        groupSize: form.groupSize,
        campaignNumber: form.campaignNumber || undefined,
        contact1: form.contact1,
        contact2: form.contact2 || undefined
      },
      housingName: form.housingName,
      licenseNumber: form.licenseNumber,
      classificationLevel: form.classificationLevel as 1 | 2 | 3 | 4 | 5,
      ministryRegistrationNumber: form.ministryRegistrationNumber,
      city: form.city as 'makkah' | 'madinah',
      district: form.district,
      fullAddress: form.fullAddress,
      googleMapsUrl: form.googleMapsUrl || undefined,
      housingCapacity: form.housingCapacity,
      numberOfElevators: form.numberOfElevators || undefined,
      numberOfFireExtinguishers: form.numberOfFireExtinguishers || undefined,
      numberOfEmergencyExits: form.numberOfEmergencyExits || undefined,
      numberOfFloors: form.numberOfFloors || undefined,
      reservedRoomsBeforeHajj: form.reservedRoomsBeforeHajj || undefined,
      reservedRoomsAfterHajj: form.reservedRoomsAfterHajj || undefined,
      checkInDate: form.checkInDate || undefined,
      checkOutDate: form.checkOutDate || undefined,
      createdAt: initialData?.createdAt || new Date().toISOString()
    };

    onSubmit(housingRecord);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Horizontal Layout: Organizer Information (Left) and Housing Information (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Organizer Information */}
        <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h4 className="text-xl font-bold text-gray-900">{t('housing.organizerInfo')}</h4>
          </div>
          <div className="space-y-4">
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <NumberOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.organizerNumber')}</span>
            </div>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                placeholder={t('housing.searchOrganizerNumber')}
                value={form.organizerNumber}
                onChange={(e) => {
                  updateField('organizerNumber', e.target.value);
                  setOrganizerSearch(e.target.value);
                }}
                list="organizer-list"
                required
              />
              <datalist id="organizer-list">
                {filteredOrganizers.map(org => (
                  <option key={org.id} value={org.organizerNumber}>
                    {org.organizerNumber} - {org.name} ({org.company})
                  </option>
                ))}
              </datalist>
            </div>
            {filteredOrganizers.length > 0 && organizerSearch && (
              <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg z-10">
                {filteredOrganizers.map(org => (
                  <div
                    key={org.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleOrganizerSelect(org.organizerNumber)}
                  >
                    <div className="font-semibold text-gray-800">{org.organizerNumber}</div>
                    <div className="text-sm text-gray-600">{org.name} - {org.company}</div>
                  </div>
                ))}
              </div>
            )}
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <UserOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.organizerName')}</span>
            </div>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              placeholder={t('housing.enterOrganizerName')}
              value={form.organizerName}
              onChange={(e) => updateField('organizerName', e.target.value)}
              required
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <ApartmentOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.organizerCompany')}</span>
            </div>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              placeholder={t('housing.enterOrganizerCompany')}
              value={form.organizerCompany}
              onChange={(e) => updateField('organizerCompany', e.target.value)}
              required
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <PhoneOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.organizerPhone')}</span>
            </div>
            <input
              type="tel"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              placeholder={t('placeholders.phone')}
              value={form.organizerPhone}
              onChange={(e) => updateField('organizerPhone', e.target.value)}
              pattern="^05\d{8}$"
              required
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <TeamOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.groupSize')}</span>
            </div>
            <input
              type="number"
              min="1"
              max="10000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              placeholder={t('housing.enterGroupSize')}
              value={form.groupSize || ''}
              onChange={(e) => updateField('groupSize', parseInt(e.target.value) || 0)}
              required
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <IdcardOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.campaignNumber')}</span>
            </div>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              placeholder={t('housing.enterCampaignNumber')}
              value={form.campaignNumber}
              onChange={(e) => updateField('campaignNumber', e.target.value)}
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <PhoneOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.firstContact')}</span>
            </div>
            <input
              type="tel"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              placeholder={t('placeholders.phone')}
              value={form.contact1}
              onChange={(e) => updateField('contact1', e.target.value)}
              pattern="^05\d{8}$"
              required
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <PhoneOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.secondContact')}</span>
            </div>
            <input
              type="tel"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              placeholder={t('placeholders.phone')}
              value={form.contact2}
              onChange={(e) => updateField('contact2', e.target.value)}
              pattern="^05\d{8}$"
            />
          </label>
          </div>
        </section>

        {/* Right Side: Housing Information */}
        <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h4 className="text-xl font-bold text-gray-900">{t('housing.housingInfo')}</h4>
          </div>
          <div className="space-y-4">
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <HomeOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.housingType')}</span>
            </div>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
              value={form.housingType}
              onChange={(e) => updateField('housingType', e.target.value)}
              required
            >
              <option value="hotel">{t('housing.hotels')}</option>
              <option value="building">{t('housing.buildings')}</option>
              <option value="mina">{t('housing.mina')}</option>
              <option value="arafat">{t('housing.arafat')}</option>
            </select>
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <HomeOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.housingName')}</span>
            </div>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              placeholder={t('housing.enterHousingName')}
              value={form.housingName}
              onChange={(e) => updateField('housingName', e.target.value)}
              required
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <IdcardOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.licenseNumber')}</span>
            </div>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              placeholder={t('housing.enterLicenseNumber')}
              value={form.licenseNumber}
              onChange={(e) => updateField('licenseNumber', e.target.value)}
              required
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <StarOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.classificationLevel')}</span>
            </div>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
              value={form.classificationLevel}
              onChange={(e) => updateField('classificationLevel', parseInt(e.target.value))}
              required
            >
              <option value={1}>★☆☆☆☆</option>
              <option value={2}>★★☆☆☆</option>
              <option value={3}>★★★☆☆</option>
              <option value={4}>★★★★☆</option>
              <option value={5}>★★★★★</option>
            </select>
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <IdcardOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.ministryRegistrationNumber')}</span>
            </div>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              placeholder={t('housing.enterMinistryRegistration')}
              value={form.ministryRegistrationNumber}
              onChange={(e) => updateField('ministryRegistrationNumber', e.target.value)}
              required
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <EnvironmentOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.city')}</span>
            </div>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
              required
            >
              <option value="makkah">{t('housing.makkah')}</option>
              <option value="madinah">{t('housing.madinah')}</option>
            </select>
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <EnvironmentOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.district')}</span>
            </div>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              placeholder={t('housing.enterDistrict')}
              value={form.district}
              onChange={(e) => updateField('district', e.target.value)}
              required
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <EnvironmentOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.fullAddress')}</span>
            </div>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 resize-none"
              placeholder={t('housing.enterFullAddress')}
              value={form.fullAddress}
              onChange={(e) => updateField('fullAddress', e.target.value)}
              required
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <LinkOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.googleMapsUrl')}</span>
            </div>
            <input
              type="url"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              placeholder={t('placeholders.googleMapsLink')}
              value={form.googleMapsUrl}
              onChange={(e) => updateField('googleMapsUrl', e.target.value)}
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <TeamOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.housingCapacity')}</span>
            </div>
            <input
              type="number"
              min="1"
              max="10000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              placeholder={t('housing.enterCapacity')}
              value={form.housingCapacity || ''}
              onChange={(e) => updateField('housingCapacity', parseInt(e.target.value) || 0)}
              required
            />
          </label>

          </div>
        </section>
      </div>

      {/* Third Section: Additional Details */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100 mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('housing.additionalDetails')}</h4>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <SafetyOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.numberOfElevators')}</span>
            </div>
            <input
              type="number"
              min="0"
              max="50"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              value={form.numberOfElevators || ''}
              onChange={(e) => updateField('numberOfElevators', parseInt(e.target.value) || 0)}
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <SafetyOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.numberOfFireExtinguishers')}</span>
            </div>
            <input
              type="number"
              min="0"
              max="1000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              value={form.numberOfFireExtinguishers || ''}
              onChange={(e) => updateField('numberOfFireExtinguishers', parseInt(e.target.value) || 0)}
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <SafetyOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.numberOfEmergencyExits')}</span>
            </div>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              value={form.numberOfEmergencyExits || ''}
              onChange={(e) => updateField('numberOfEmergencyExits', parseInt(e.target.value) || 0)}
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <HomeOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.numberOfFloors')}</span>
            </div>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              value={form.numberOfFloors || ''}
              onChange={(e) => updateField('numberOfFloors', parseInt(e.target.value) || 0)}
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <HomeOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.reservedRoomsBeforeHajj')}</span>
            </div>
            <input
              type="number"
              min="0"
              max="10000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              value={form.reservedRoomsBeforeHajj || ''}
              onChange={(e) => updateField('reservedRoomsBeforeHajj', parseInt(e.target.value) || 0)}
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <HomeOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.reservedRoomsAfterHajj')}</span>
            </div>
            <input
              type="number"
              min="0"
              max="10000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              value={form.reservedRoomsAfterHajj || ''}
              onChange={(e) => updateField('reservedRoomsAfterHajj', parseInt(e.target.value) || 0)}
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <CalendarOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.checkInDate')}</span>
            </div>
            <input
              type="date"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              value={form.checkInDate}
              onChange={(e) => updateField('checkInDate', e.target.value)}
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <CalendarOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('housing.checkOutDate')}</span>
            </div>
            <input
              type="date"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              value={form.checkOutDate}
              onChange={(e) => updateField('checkOutDate', e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
        >
          {t('housing.cancel')}
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:shadow-lg hover:shadow-mainColor/30 transition-all duration-200 font-semibold flex items-center gap-2"
        >
          <SaveOutlined />
          {t('housing.submit')}
        </button>
      </div>
    </form>
  );
};
