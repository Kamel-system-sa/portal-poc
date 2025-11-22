import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CloseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { CampaignRegistrationForm } from '../../components/Reception/CampaignRegistrationForm';
import { CampaignFollowUpForm } from '../../components/Reception/CampaignFollowUpForm';
import { CampaignDetails } from '../../components/Reception/CampaignDetails';
import type { CampaignRegistrationFormData, CampaignFollowUpFormData, Campaign } from '../../types/reception';

const CampaignsRegistrationPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [step, setStep] = useState<'registration' | 'followUp' | 'outcome'>('registration');
  const [registrationData, setRegistrationData] = useState<CampaignRegistrationFormData | null>(null);
  const [followUpData, setFollowUpData] = useState<CampaignFollowUpFormData | null>(null);
  const [createdCampaign, setCreatedCampaign] = useState<Campaign | null>(null);

  const handleRegistrationSubmit = (data: CampaignRegistrationFormData) => {
    setRegistrationData(data);
    setStep('followUp');
  };

  const handleFollowUpSave = (data: CampaignFollowUpFormData) => {
    setFollowUpData(data);
    // In real app, this would save to backend
    console.log('Save campaign', { registrationData, followUpData: data });
    // For mockup, create a mock campaign
    const mockCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      campaignNumber: `CAMP-2024-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      campaignName: data.campaignName,
      organizerId: registrationData!.organizerId!,
      organizerNumber: registrationData!.organizerNumber!,
      organizerName: registrationData!.organizerName!,
      organizerCompany: registrationData!.companyName!,
      organizerPhone: registrationData!.phone,
      organizerEmail: registrationData!.email,
      responsiblePerson: data.responsiblePerson,
      gender: data.gender,
      totalPilgrims: registrationData!.totalPilgrims,
      registeredPilgrims: 0,
      pilgrims: [],
      registrationPercentage: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'registered'
    };
    setCreatedCampaign(mockCampaign);
    setStep('outcome');
  };

  const handleFollowUpSaveAndExit = (data: CampaignFollowUpFormData) => {
    handleFollowUpSave(data);
    setTimeout(() => {
      navigate('/reception/campaigns');
    }, 2000);
  };

  const handleFollowUpAddAnother = (data: CampaignFollowUpFormData) => {
    handleFollowUpSave(data);
    // Reset and start new registration
    setTimeout(() => {
      setStep('registration');
      setRegistrationData(null);
      setFollowUpData(null);
      setCreatedCampaign(null);
    }, 1000);
  };

  const handleCancel = () => {
    if (step === 'registration') {
      navigate('/reception/campaigns');
    } else if (step === 'followUp') {
      setStep('registration');
    } else {
      navigate('/reception/campaigns');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('reception.campaigns.registration.title') || 'Campaign Registration'}
              </h1>
              <p className="text-gray-600">
                {step === 'registration' && (t('reception.campaigns.registration.step1') || 'Step 1: Campaign Registration Form')}
                {step === 'followUp' && (t('reception.campaigns.registration.step2') || 'Step 2: Follow-Up Form')}
                {step === 'outcome' && (t('reception.campaigns.registration.step3') || 'Step 3: Campaign Details')}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
            >
              <CloseOutlined className="text-lg" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step === 'registration' ? 'text-mainColor' : step === 'followUp' || step === 'outcome' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step === 'registration' ? 'bg-mainColor text-white' : step === 'followUp' || step === 'outcome' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step === 'followUp' || step === 'outcome' ? <CheckCircleOutlined /> : '1'}
                </div>
                <span className="font-semibold">{t('reception.campaigns.registration.step1Label') || 'Registration'}</span>
              </div>
              <div className={`w-16 h-1 ${step === 'followUp' || step === 'outcome' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center gap-2 ${step === 'followUp' ? 'text-mainColor' : step === 'outcome' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step === 'followUp' ? 'bg-mainColor text-white' : step === 'outcome' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step === 'outcome' ? <CheckCircleOutlined /> : '2'}
                </div>
                <span className="font-semibold">{t('reception.campaigns.registration.step2Label') || 'Follow-Up'}</span>
              </div>
              <div className={`w-16 h-1 ${step === 'outcome' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center gap-2 ${step === 'outcome' ? 'text-mainColor' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step === 'outcome' ? 'bg-mainColor text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  3
                </div>
                <span className="font-semibold">{t('reception.campaigns.registration.step3Label') || 'Details'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          {step === 'registration' && (
            <CampaignRegistrationForm
              initialData={registrationData || undefined}
              onCancel={handleCancel}
              onSubmit={handleRegistrationSubmit}
              onNext={handleRegistrationSubmit}
            />
          )}

          {step === 'followUp' && registrationData && (
            <CampaignFollowUpForm
              registrationData={registrationData}
              onCancel={handleCancel}
              onSave={handleFollowUpSave}
              onSaveAndExit={handleFollowUpSaveAndExit}
              onAddAnother={handleFollowUpAddAnother}
            />
          )}

          {step === 'outcome' && createdCampaign && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('reception.campaigns.registration.success') || 'Campaign Registered Successfully!'}
                </h2>
                <p className="text-gray-600">
                  {t('reception.campaigns.registration.successMessage') || 'Your campaign has been registered and all information has been saved.'}
                </p>
              </div>
              <CampaignDetails campaign={createdCampaign} />
              <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate('/reception/campaigns')}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                >
                  {t('reception.campaigns.registration.backToList') || 'Back to List'}
                </button>
                <button
                  onClick={() => {
                    setStep('registration');
                    setRegistrationData(null);
                    setFollowUpData(null);
                    setCreatedCampaign(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg font-semibold"
                >
                  {t('reception.campaigns.registration.addAnother') || 'Add Another Campaign'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignsRegistrationPage;

