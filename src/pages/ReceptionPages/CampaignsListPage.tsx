import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchOutlined, PlusOutlined, EyeOutlined, CloseOutlined, CheckCircleOutlined, XOutlined, EditOutlined } from '@ant-design/icons';
import { mockCampaigns, mockOrganizers } from '../../data/mockCampaigns';
import { CampaignDetails } from '../../components/Reception/CampaignDetails';
import { CampaignRegistrationForm } from '../../components/Reception/CampaignRegistrationForm';
import { CampaignFollowUpForm } from '../../components/Reception/CampaignFollowUpForm';
import type { Campaign, CampaignRegistrationFormData, CampaignFollowUpFormData } from '../../types/reception';

const CampaignsListPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [campaignStep, setCampaignStep] = useState<'registration' | 'followUp' | 'outcome'>('registration');
  const [registrationData, setRegistrationData] = useState<CampaignRegistrationFormData | null>(null);
  const [followUpData, setFollowUpData] = useState<CampaignFollowUpFormData | null>(null);
  const [newCampaign, setNewCampaign] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.campaignNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      campaign.campaignName.toLowerCase().includes(searchValue.toLowerCase()) ||
      campaign.organizerName.toLowerCase().includes(searchValue.toLowerCase()) ||
      campaign.organizerCompany.toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(campaign.status);

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
      draft: {
        label: t('reception.campaigns.status.draft') || 'Draft',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50'
      },
      registered: {
        label: t('reception.campaigns.status.registered') || 'Registered',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      completed: {
        label: t('reception.campaigns.status.completed') || 'Completed',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      }
    };
    const statusInfo = statusMap[status] || statusMap.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    // Find organizer by ID to get all details
    const organizer = mockOrganizers.find(org => org.id === campaign.organizerId);
    // Map Campaign fields to CampaignRegistrationFormData
    setRegistrationData({
      organizerId: campaign.organizerId,
      organizerNumber: campaign.organizerNumber,
      organizerName: campaign.organizerName,
      companyName: campaign.organizerCompany,
      totalPilgrims: campaign.totalPilgrims,
      nationality: '', // Nationality not available in Organizer type
      phone: campaign.organizerPhone || organizer?.phone || '',
      email: campaign.organizerEmail || organizer?.email || '',
    });
    // Also set follow-up data for step 2
    setFollowUpData({
      campaignName: campaign.campaignName,
      responsiblePerson: campaign.responsiblePerson,
      gender: campaign.gender,
      phone: campaign.organizerPhone || '',
      secondaryPhone: '', // Not available in Campaign type
      email: campaign.organizerEmail || '',
      photo: campaign.photo
    });
    setCampaignStep('registration');
    setIsAddModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingCampaign(null);
    setRegistrationData(null);
    setFollowUpData(null);
    setNewCampaign(null);
    setCampaignStep('registration');
    setIsAddModalOpen(true);
  };

  return (
    <>
      <section className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('reception.campaigns.title') || 'Campaigns'}
              </h1>
              <p className="text-gray-600">{t('reception.campaigns.list.subtitle') || 'Manage and view all campaigns'}</p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-md shadow-mainColor/20 hover:shadow-lg font-semibold flex items-center gap-2"
            >
              <PlusOutlined />
              {t('reception.campaigns.list.addCampaign') || 'Add Campaign'}
            </button>
          </div>

          {/* Toolbar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md w-full sm:w-auto">
              <SearchOutlined className={`absolute top-1/2 transform -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} text-gray-400`} />
              <input
                type="text"
                placeholder={t('reception.campaigns.list.searchPlaceholder') || 'Search by campaign number, name, organizer...'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700`}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="flex gap-2">
              {['draft', 'registered', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(
                      statusFilter.includes(status)
                        ? statusFilter.filter((s) => s !== status)
                        : [...statusFilter, status]
                    );
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter.includes(status)
                      ? 'bg-mainColor text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t(`reception.campaigns.status.${status}`) || status}
                </button>
              ))}
            </div>
          </div>

          {/* Campaigns Grid */}
          {paginatedCampaigns.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {paginatedCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{campaign.campaignName}</h3>
                        <p className="text-sm text-gray-600">{campaign.campaignNumber}</p>
                      </div>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{t('reception.campaigns.list.organizer') || 'Organizer'}:</span>
                        <span className="font-semibold text-gray-900">{campaign.organizerName}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{t('reception.campaigns.list.totalPilgrims') || 'Total Pilgrims'}:</span>
                        <span className="font-semibold text-gray-900">{campaign.totalPilgrims}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{t('reception.campaigns.list.registered') || 'Registered'}:</span>
                        <span className="font-semibold text-green-600">{campaign.registeredPilgrims}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{t('reception.campaigns.list.registrationPercentage') || 'Registration %'}:</span>
                        <span className="font-semibold text-blue-600">{campaign.registrationPercentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-mainColor to-primary rounded-full transition-all duration-300"
                        style={{ width: `${campaign.registrationPercentage}%` }}
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCampaign(campaign);
                        }}
                        className="flex-1 px-4 py-2 bg-mainColor/10 hover:bg-mainColor/20 text-mainColor rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                      >
                        <EditOutlined />
                        {t('form.edit') || 'Edit'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCampaign(campaign);
                        }}
                        className="flex-1 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                      >
                        <EyeOutlined />
                        {t('reception.campaigns.list.viewDetails') || 'View Details'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-white rounded-xl border border-gray-200">
                  <div className="text-sm text-gray-700">
                    {t('pagination.showing') || 'Showing'} {(currentPage - 1) * itemsPerPage + 1} -{' '}
                    {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)} {t('pagination.of') || 'of'}{' '}
                    {filteredCampaigns.length}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('pagination.previous') || 'Previous'}
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('pagination.next') || 'Next'}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-12 border border-gray-100">
              <div className="flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 shadow-inner">
                  <InboxOutlined className="text-5xl text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  {t('reception.campaigns.list.empty') || 'No campaigns found'}
                </h3>
                <p className="text-sm text-gray-500 max-w-md text-center mb-6">
                  {t('reception.campaigns.list.emptyMessage') || 'Start by registering a new campaign'}
                </p>
                <button
                  onClick={() => {
                    setIsAddModalOpen(true);
                    setCampaignStep('registration');
                    setRegistrationData(null);
                    setFollowUpData(null);
                    setNewCampaign(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-md shadow-mainColor/20 hover:shadow-lg font-semibold flex items-center gap-2"
                >
                  <PlusOutlined />
                  {t('reception.campaigns.list.addCampaign') || 'Add Campaign'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCampaign(null);
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-7xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">{t('reception.campaigns.details.title') || 'Campaign Details'}</h2>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
                aria-label="Close modal"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
              <CampaignDetails campaign={selectedCampaign} />
            </div>
          </div>
        </div>
      )}

      {/* Add Campaign Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && campaignStep === 'registration') {
              setIsAddModalOpen(false);
              setCampaignStep('registration');
              setRegistrationData(null);
              setFollowUpData(null);
              setNewCampaign(null);
            }
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-7xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingCampaign
                  ? (campaignStep === 'registration' && (t('reception.campaigns.registration.editStep1') || 'Edit Campaign Registration'))
                    || (campaignStep === 'followUp' && (t('reception.campaigns.registration.editStep2') || 'Edit Follow-Up'))
                    || (campaignStep === 'outcome' && (t('reception.campaigns.registration.editStep3') || 'Campaign Details'))
                  : (campaignStep === 'registration' && (t('reception.campaigns.registration.step1') || 'Step 1: Campaign Registration Form'))
                    || (campaignStep === 'followUp' && (t('reception.campaigns.registration.step2') || 'Step 2: Follow-Up Form'))
                    || (campaignStep === 'outcome' && (t('reception.campaigns.registration.step3') || 'Step 3: Campaign Details'))}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setCampaignStep('registration');
                  setRegistrationData(null);
                  setFollowUpData(null);
                  setNewCampaign(null);
                  setEditingCampaign(null);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
                aria-label="Close modal"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
              {campaignStep === 'registration' && (
                <CampaignRegistrationForm
                  initialData={registrationData || undefined}
                  onCancel={() => {
                    setIsAddModalOpen(false);
                    setCampaignStep('registration');
                    setRegistrationData(null);
                    setEditingCampaign(null);
                  }}
                  onSubmit={(data) => {
                    setRegistrationData(data);
                    setCampaignStep('followUp');
                  }}
                  onNext={(data) => {
                    setRegistrationData(data);
                    setCampaignStep('followUp');
                  }}
                />
              )}

              {campaignStep === 'followUp' && registrationData && (
                <CampaignFollowUpForm
                  registrationData={registrationData}
                  initialData={followUpData || undefined}
                  onCancel={() => {
                    setCampaignStep('registration');
                  }}
                  onSave={(data) => {
                    setFollowUpData(data);
                    // Create mock campaign
                    const mockCampaign: Campaign = {
                      id: `camp-${Date.now()}`,
                      campaignNumber: `CAMP-2024-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
                      campaignName: data.campaignName,
                      organizerId: registrationData.organizerId!,
                      organizerNumber: registrationData.organizerNumber!,
                      organizerName: registrationData.organizerName!,
                      organizerCompany: registrationData.companyName!,
                      organizerPhone: registrationData.phone,
                      organizerEmail: registrationData.email,
                      responsiblePerson: data.responsiblePerson,
                      gender: data.gender,
                      totalPilgrims: registrationData.totalPilgrims,
                      registeredPilgrims: 0,
                      pilgrims: [],
                      registrationPercentage: 0,
                      photo: data.photo,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      status: 'registered'
                    };
                    setNewCampaign(mockCampaign);
                    setCampaignStep('outcome');
                  }}
                  onSaveAndExit={(data) => {
                    setFollowUpData(data);
                    // Create mock campaign and close
                    const mockCampaign: Campaign = {
                      id: `camp-${Date.now()}`,
                      campaignNumber: `CAMP-2024-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
                      campaignName: data.campaignName,
                      organizerId: registrationData.organizerId!,
                      organizerNumber: registrationData.organizerNumber!,
                      organizerName: registrationData.organizerName!,
                      organizerCompany: registrationData.companyName!,
                      organizerPhone: registrationData.phone,
                      organizerEmail: registrationData.email,
                      responsiblePerson: data.responsiblePerson,
                      gender: data.gender,
                      totalPilgrims: registrationData.totalPilgrims,
                      registeredPilgrims: 0,
                      pilgrims: [],
                      registrationPercentage: 0,
                      photo: data.photo,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      status: 'registered'
                    };
                    // In real app, save to backend and refresh list
                    setIsAddModalOpen(false);
                    setCampaignStep('registration');
                    setRegistrationData(null);
                    setFollowUpData(null);
                    setNewCampaign(null);
                  }}
                  onAddAnother={(data) => {
                    setFollowUpData(data);
                    // Create mock campaign and reset for next
                    const mockCampaign: Campaign = {
                      id: `camp-${Date.now()}`,
                      campaignNumber: `CAMP-2024-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
                      campaignName: data.campaignName,
                      organizerId: registrationData.organizerId!,
                      organizerNumber: registrationData.organizerNumber!,
                      organizerName: registrationData.organizerName!,
                      organizerCompany: registrationData.companyName!,
                      organizerPhone: registrationData.phone,
                      organizerEmail: registrationData.email,
                      responsiblePerson: data.responsiblePerson,
                      gender: data.gender,
                      totalPilgrims: registrationData.totalPilgrims,
                      registeredPilgrims: 0,
                      pilgrims: [],
                      registrationPercentage: 0,
                      photo: data.photo,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      status: 'registered'
                    };
                    // Reset for next campaign with same organizer
                    setCampaignStep('followUp');
                    setFollowUpData(null);
                    setNewCampaign(null);
                  }}
                />
              )}

              {campaignStep === 'outcome' && newCampaign && (
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
                  <CampaignDetails campaign={newCampaign} />
                  <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setIsAddModalOpen(false);
                        setCampaignStep('registration');
                        setRegistrationData(null);
                        setFollowUpData(null);
                        setNewCampaign(null);
                      }}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                    >
                      {t('reception.campaigns.registration.backToList') || 'Close'}
                    </button>
                    <button
                      onClick={() => {
                        setCampaignStep('followUp');
                        setFollowUpData(null);
                        setNewCampaign(null);
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
      )}
    </>
  );
};

export default CampaignsListPage;

