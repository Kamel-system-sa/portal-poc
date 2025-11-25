import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseOutlined, CheckOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { DepartureFormStep1Data, DepartureFormStep2Data } from '../../types/reception';
import { mockOrganizers } from '../../data/mockReception';
import { mockCampaigns } from '../../data/mockCampaigns';
import { mockAccommodations } from '../../data/mockReception';

interface DepartureRegistrationFormProps {
  onComplete: (data: any) => void;
  onClose: () => void;
}

interface Step1Data {
  organizerNumber: string;
  campaignNumber: string;
  departurePoint: 'makkah' | 'madinah' | '';
  accommodations: Array<{
    accommodationId: string;
    accommodationName: string;
    contractNumber: string;
    pilgrimsDeparting: number;
  }>;
}


export const DepartureRegistrationForm: React.FC<DepartureRegistrationFormProps> = ({ onComplete, onClose }) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Step 1 Data
  const [step1Data, setStep1Data] = useState<Step1Data>({
    organizerNumber: '',
    campaignNumber: '',
    departurePoint: '',
    accommodations: []
  });


  // Auto-filled organizer data
  const [organizerData, setOrganizerData] = useState<any>(null);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [departureDate, setDepartureDate] = useState<string>('');
  const [departureTime, setDepartureTime] = useState<string>('');

  // Get organizer by number
  useEffect(() => {
    if (step1Data.organizerNumber) {
      const organizer = mockOrganizers.find(org => org.number === step1Data.organizerNumber);
      setOrganizerData(organizer || null);
    } else {
      setOrganizerData(null);
    }
  }, [step1Data.organizerNumber]);

  // Get campaign by number
  useEffect(() => {
    if (step1Data.campaignNumber) {
      const campaign = mockCampaigns.find(camp => camp.campaignNumber === step1Data.campaignNumber);
      setCampaignData(campaign || null);
    } else {
      setCampaignData(null);
    }
  }, [step1Data.campaignNumber]);

  // Auto-fill departure date/time based on departure point
  useEffect(() => {
    if (step1Data.departurePoint) {
      // In real app, this would fetch from campaign data or accommodation contracts
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDepartureDate(tomorrow.toISOString().split('T')[0]);
      setDepartureTime('14:30');
    }
  }, [step1Data.departurePoint]);

  const handleOrganizerSelect = (organizerNumber: string) => {
    setStep1Data(prev => ({ ...prev, organizerNumber }));
  };

  const handleCampaignSelect = (campaignNumber: string) => {
    setStep1Data(prev => ({ ...prev, campaignNumber }));
  };

  const handleDeparturePointSelect = (point: 'makkah' | 'madinah') => {
    setStep1Data(prev => ({ ...prev, departurePoint: point }));
  };

  const handleAddAccommodation = () => {
    setStep1Data(prev => ({
      ...prev,
      accommodations: [
        ...prev.accommodations,
        {
          accommodationId: '',
          accommodationName: '',
          contractNumber: '',
          pilgrimsDeparting: 0
        }
      ]
    }));
  };

  const handleRemoveAccommodation = (index: number) => {
    setStep1Data(prev => ({
      ...prev,
      accommodations: prev.accommodations.filter((_, i) => i !== index)
    }));
  };

  const handleAccommodationChange = (index: number, field: string, value: any) => {
    setStep1Data(prev => ({
      ...prev,
      accommodations: prev.accommodations.map((acc, i) => 
        i === index ? { ...acc, [field]: value } : acc
      )
    }));
  };


  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!step1Data.organizerNumber || !step1Data.campaignNumber || !step1Data.departurePoint) {
        alert('يرجى إكمال جميع الحقول المطلوبة');
        return;
      }
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3);
    }
  };

  const handleConfirm = () => {
    // Calculate total pilgrims
    const totalPilgrims = step1Data.accommodations.reduce((sum, acc) => sum + acc.pilgrimsDeparting, 0);
    
    const completeData = {
      organizerId: organizerData?.id || '',
      organizerNumber: step1Data.organizerNumber,
      organizerName: organizerData?.name || '',
      organizerCompany: organizerData?.company || '',
      organizerNationality: 'saudi', // Would come from organizer data
      organizerPhone: organizerData?.phone || '',
      organizerEmail: organizerData?.email || '',
      campaignNumber: step1Data.campaignNumber,
      campaignManagerPhone: campaignData?.organizerPhone || '',
      departurePoint: step1Data.departurePoint,
      arrivalDestination: '',
      departureDate: departureDate,
      departureTime: departureTime,
      pilgrimsCount: totalPilgrims,
      accommodations: step1Data.accommodations,
      arrivalAccommodations: []
    };

    onComplete(completeData);
  };

  // Step 1: Choose Departure
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
        <h3 className="text-xl font-bold text-gray-900">
          {t('reception.preArrival.departures.form.step1.title') || 'الخطوة 1: اختيار المغادرة'}
        </h3>
      </div>

      {/* Organizer Selection */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('reception.preArrival.departures.form.step1.selectOrganizer') || 'اختر رقم المنظم'}
          </label>
          <select
            value={step1Data.organizerNumber}
            onChange={(e) => handleOrganizerSelect(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <option value="">{t('reception.preArrival.departures.form.step1.organizerPlaceholder') || 'أدخل أو اختر رقم المنظم'}</option>
            {mockOrganizers.map(org => (
              <option key={org.id} value={org.number}>{org.number} - {org.name}</option>
            ))}
          </select>
        </div>

        {organizerData && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p><strong>{t('reception.preArrival.departures.form.step1.organizerName') || 'اسم المنظم'}:</strong> {organizerData.name}</p>
            <p><strong>{t('reception.preArrival.departures.form.step1.organizerCompany') || 'اسم الشركة'}:</strong> {organizerData.company}</p>
            <p><strong>{t('reception.preArrival.departures.form.step1.organizerPhone') || 'رقم الجوال'}:</strong> {organizerData.phone}</p>
            <p><strong>{t('reception.preArrival.departures.form.step1.organizerEmail') || 'الإيميل'}:</strong> {organizerData.email}</p>
          </div>
        )}

        {/* Campaign Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('reception.preArrival.departures.form.step1.selectCampaign') || 'اختر رقم الحملة'}
          </label>
          <select
            value={step1Data.campaignNumber}
            onChange={(e) => handleCampaignSelect(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <option value="">{t('reception.preArrival.departures.form.step1.campaignPlaceholder') || 'أدخل أو اختر رقم الحملة'}</option>
            {mockCampaigns
              .filter(camp => camp.organizerNumber === step1Data.organizerNumber)
              .map(camp => (
                <option key={camp.id} value={camp.campaignNumber}>{camp.campaignNumber} - {camp.campaignName}</option>
              ))}
          </select>
        </div>

        {/* Departure Point */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('reception.preArrival.departures.form.step1.selectDeparturePoint') || 'اختر نقطة الانطلاق'}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleDeparturePointSelect('makkah')}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                step1Data.departurePoint === 'makkah'
                  ? 'bg-mainColor text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('reception.preArrival.departures.form.step1.makkah') || 'مكة'}
            </button>
            <button
              type="button"
              onClick={() => handleDeparturePointSelect('madinah')}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                step1Data.departurePoint === 'madinah'
                  ? 'bg-mainColor text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('reception.preArrival.departures.form.step1.madinah') || 'المدينة'}
            </button>
          </div>
        </div>

        {/* Departure Date/Time (Auto-filled) */}
        {step1Data.departurePoint && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('reception.preArrival.departures.form.step1.departureDate') || 'تاريخ المغادرة'}
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('reception.preArrival.departures.form.step1.departureTime') || 'وقت المغادرة'}
              </label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white"
              />
            </div>
          </div>
        )}

        {/* Accommodations Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              {t('reception.preArrival.departures.form.step1.accommodationsTable') || 'جدول بيانات السكن'}
            </label>
            <button
              type="button"
              onClick={handleAddAccommodation}
              className="px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-primary transition-all font-semibold flex items-center gap-2"
            >
              <PlusOutlined />
              {t('reception.preArrival.departures.form.step1.addAccommodation') || 'إضافة سكن'}
            </button>
          </div>

          <div className="space-y-3">
            {step1Data.accommodations.map((acc, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t('reception.preArrival.departures.form.step1.accommodationName') || 'اسم السكن'}
                  </label>
                  <select
                    value={acc.accommodationId}
                    onChange={(e) => {
                      const selectedAcc = mockAccommodations.find(a => a.id === e.target.value);
                      handleAccommodationChange(index, 'accommodationId', e.target.value);
                      handleAccommodationChange(index, 'accommodationName', selectedAcc?.name || '');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">اختر السكن</option>
                    {mockAccommodations.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t('reception.preArrival.departures.form.step1.contractNumber') || 'رقم عقد السكن'}
                  </label>
                  <input
                    type="text"
                    value={acc.contractNumber}
                    onChange={(e) => handleAccommodationChange(index, 'contractNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="رقم العقد"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t('reception.preArrival.departures.form.step1.pilgrimsDeparting') || 'عدد الحجاج المغادرين'}
                  </label>
                  <input
                    type="number"
                    value={acc.pilgrimsDeparting || ''}
                    onChange={(e) => handleAccommodationChange(index, 'pilgrimsDeparting', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    min="0"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveAccommodation(index)}
                    className="w-full px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <DeleteOutlined />
                    {t('reception.preArrival.departures.form.step1.removeAccommodation') || 'إزالة'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Confirm Information
  const renderStep2 = () => {
    const totalPilgrims = step1Data.accommodations.reduce((sum, acc) => sum + acc.pilgrimsDeparting, 0);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">
            {t('reception.preArrival.departures.form.step3.title') || 'الخطوة 3: تأكيد المعلومات'}
          </h3>
        </div>

        {/* Review Information */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h4 className="text-lg font-bold text-gray-900">
            {t('reception.preArrival.departures.form.step3.reviewInfo') || 'عرض المعلومات للتأكيد'}
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{t('reception.preArrival.departures.form.step3.organizerNumber') || 'رقم المنظم'}:</p>
              <p className="font-semibold text-gray-900">{step1Data.organizerNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('reception.preArrival.departures.form.step3.organizerName') || 'اسم المنظم'}:</p>
              <p className="font-semibold text-gray-900">{organizerData?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('reception.preArrival.departures.form.step1.organizerCompany') || 'اسم الشركة'}:</p>
              <p className="font-semibold text-gray-900">{organizerData?.company}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('reception.preArrival.departures.form.step3.campaignManagerPhone') || 'رقم الجوال مسؤول الحملة'}:</p>
              <p className="font-semibold text-gray-900">{campaignData?.organizerPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('reception.preArrival.departures.form.step3.departureDateTime') || 'تاريخ ووقت المغادرة'}:</p>
              <p className="font-semibold text-gray-900">{departureDate} {departureTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('reception.preArrival.departures.form.step3.pilgrimsCount') || 'عدد الحجاج'}:</p>
              <p className="font-semibold text-gray-900">{totalPilgrims}</p>
            </div>
          </div>
        </div>

        {/* Departure Plan */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">
            {t('reception.preArrival.departures.form.step3.departurePlan') || 'خطة الانطلاق'}
          </h4>
          <div className="space-y-2">
            {step1Data.accommodations.map((acc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{acc.accommodationName}</span>
                <span className="text-gray-600">{acc.pilgrimsDeparting} حاج</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pilgrims Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">
            {t('reception.preArrival.departures.form.step3.pilgrimsInfo') || 'معلومات الحجاج'}
          </h4>
          <p className="text-gray-600">إجمالي الحجاج: <strong>{totalPilgrims}</strong></p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {t('reception.preArrival.departures.dashboard.addDeparture') || 'إضافة تسجيل مغادرة'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <CloseOutlined className="text-gray-500" />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step
                        ? 'bg-mainColor text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step ? <CheckOutlined /> : step}
                  </div>
                  <span className={`text-sm font-semibold ${currentStep >= step ? 'text-mainColor' : 'text-gray-500'}`}>
                    {step === 1 ? 'اختيار المغادرة' : 'تأكيد المعلومات'}
                  </span>
                </div>
                {step < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-all ${
                      currentStep > step ? 'bg-mainColor' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between rounded-b-2xl">
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('reception.preArrival.departures.form.step2.previous') || 'السابق'}
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all font-semibold text-gray-700"
            >
              {t('form.cancel') || 'إلغاء'}
            </button>
            {currentStep < 2 ? (
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all font-semibold"
              >
                {t('reception.preArrival.departures.form.step1.next') || 'التالي'}
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all font-semibold flex items-center gap-2"
              >
                <CheckOutlined />
                {t('reception.preArrival.departures.form.step3.confirm') || 'تأكيد'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

