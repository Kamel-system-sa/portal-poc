import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { TentBedVisualizer } from '../../components/HousingComponent/TentBedVisualizer';
import { HousingStatsCard } from '../../components/HousingComponent/HousingStatsCard';
import { PilgrimDetailsModal } from '../../components/HousingComponent/PilgrimDetailsModal';
import { MiniChartsSection } from '../../components/HousingComponent/MiniChartsSection';
import { UnifiedFilters } from '../../components/HousingComponent/UnifiedFilters';
import type { UnifiedFilterState } from '../../components/HousingComponent/UnifiedFilters';
import { HousingActionsMenu } from '../../components/HousingMenu';
import { Modal } from 'antd';
import { CloseOutlined, EyeOutlined, UnorderedListOutlined, UserOutlined, PlusOutlined, UploadOutlined, DeleteOutlined, FileTextOutlined, HomeOutlined, AppstoreOutlined, TeamOutlined, BankOutlined } from '@ant-design/icons';
import { FaBed, FaCampground } from 'react-icons/fa';
import { mockMinaTents, mockPilgrims } from '../../data/mockHousing';
import { Tent3DViewer } from '../../components/HousingComponent/Tent3DViewer';
import type { Tent, Bed, MashairTent, MashairTentAssignment } from '../../types/housing';
import { Button, Select, Input, message, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getMinaTents, saveMinaTents, deleteMinaTent, getMinaAssignments, saveMinaAssignments, deleteMinaAssignment } from '../../data/mashairStorage';

const { Option } = Select;


const MinaHousingPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [selectedTent, setSelectedTent] = useState<Tent | null>(null);
  const [selectedTent3D, setSelectedTent3D] = useState<Tent | null>(null);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [selectedBedRoomInfo, setSelectedBedRoomInfo] = useState<{ type: 'room' | 'tent'; number: string; location?: string } | null>(null);
  const [showAllTentsModal, setShowAllTentsModal] = useState(false);
  const [tentsState, setTentsState] = useState<Tent[]>(mockMinaTents);
  
  // Mashair features state
  const [mashairTents, setMashairTents] = useState<MashairTent[]>(getMinaTents());
  const [mashairAssignments, setMashairAssignments] = useState<MashairTentAssignment[]>(getMinaAssignments());
  const [isAddTentsModalOpen, setIsAddTentsModalOpen] = useState(false);
  const [isAssignmentsModalOpen, setIsAssignmentsModalOpen] = useState(false);
  const [uploadedTentsFile, setUploadedTentsFile] = useState<File | null>(null);
  const [uploadedAssignmentsFile, setUploadedAssignmentsFile] = useState<File | null>(null);
  const [extractedTentsData, setExtractedTentsData] = useState<MashairTent[]>([]);
  const [extractedAssignmentsData, setExtractedAssignmentsData] = useState<Partial<MashairTentAssignment>[]>([]);
  const [isProcessingTents, setIsProcessingTents] = useState(false);
  const [isProcessingAssignments, setIsProcessingAssignments] = useState(false);
  const [unifiedFilters, setUnifiedFilters] = useState<UnifiedFilterState>({
    searchTerm: '',
    gender: 'all',
    capacity: 'all',
    emptyRooms: false,
    section: 'all',
    minCapacity: 'all',
    maxCapacity: 'all',
    pilgrimName: '',
    roomNumber: '',
    nationality: 'all',
    passportNumber: '',
    organizerNumber: '',
    mobileNumber: '',
    visaNumber: '',
    enabledAdvancedFilters: {
      pilgrimName: false,
      roomNumber: false,
      nationality: false,
      passportNumber: false,
      organizerNumber: false,
      mobileNumber: false,
      visaNumber: false,
    }
  });

  const filteredTents = useMemo(() => {
    return tentsState.filter((tent: Tent) => {
      // Basic search filter
      if (unifiedFilters.searchTerm && !tent.tentNumber.toLowerCase().includes(unifiedFilters.searchTerm.toLowerCase())) {
        return false;
      }

      // Advanced filters - Tent number
      if (unifiedFilters.enabledAdvancedFilters.roomNumber && unifiedFilters.roomNumber) {
        if (!tent.tentNumber.toLowerCase().includes(unifiedFilters.roomNumber.toLowerCase())) {
          return false;
        }
      }

      // Advanced filters - Pilgrim attributes
      if (unifiedFilters.enabledAdvancedFilters.pilgrimName || 
          unifiedFilters.enabledAdvancedFilters.nationality || 
          unifiedFilters.enabledAdvancedFilters.passportNumber ||
          unifiedFilters.enabledAdvancedFilters.organizerNumber ||
          unifiedFilters.enabledAdvancedFilters.mobileNumber ||
          unifiedFilters.enabledAdvancedFilters.visaNumber) {
        const tentPilgrims = tent.beds
          .filter(b => b.occupied && b.pilgrimId)
          .map(b => mockPilgrims.find(p => p.id === b.pilgrimId))
          .filter(Boolean);

        if (tentPilgrims.length === 0) {
          if (unifiedFilters.enabledAdvancedFilters.pilgrimName || 
              unifiedFilters.enabledAdvancedFilters.nationality || 
              unifiedFilters.enabledAdvancedFilters.passportNumber ||
              unifiedFilters.enabledAdvancedFilters.organizerNumber ||
              unifiedFilters.enabledAdvancedFilters.mobileNumber ||
              unifiedFilters.enabledAdvancedFilters.visaNumber) {
            return false;
          }
        } else {
          const matchesAdvancedFilters = tentPilgrims.some(pilgrim => {
            if (!pilgrim) return false;
            if (unifiedFilters.enabledAdvancedFilters.pilgrimName && unifiedFilters.pilgrimName) {
              if (!pilgrim.name.toLowerCase().includes(unifiedFilters.pilgrimName.toLowerCase())) return false;
            }
            if (unifiedFilters.enabledAdvancedFilters.nationality && unifiedFilters.nationality !== 'all') {
              if (pilgrim.nationality !== unifiedFilters.nationality) return false;
            }
            if (unifiedFilters.enabledAdvancedFilters.mobileNumber && unifiedFilters.mobileNumber) {
              if (!pilgrim.phone?.includes(unifiedFilters.mobileNumber)) return false;
            }
            if (unifiedFilters.enabledAdvancedFilters.organizerNumber && unifiedFilters.organizerNumber) {
              if (!pilgrim.organizer?.toLowerCase().includes(unifiedFilters.organizerNumber.toLowerCase())) return false;
            }
            return true;
          });
          if (!matchesAdvancedFilters) return false;
        }
      }

      // Section filter
      if (unifiedFilters.section && unifiedFilters.section !== 'all' && tent.section !== unifiedFilters.section) {
        return false;
      }

      // Capacity filters
      if (unifiedFilters.minCapacity && unifiedFilters.minCapacity !== 'all' && tent.totalBeds < parseInt(unifiedFilters.minCapacity)) {
        return false;
      }
      if (unifiedFilters.maxCapacity && unifiedFilters.maxCapacity !== 'all' && tent.totalBeds > parseInt(unifiedFilters.maxCapacity)) {
        return false;
      }

      // Empty tents filter
      if (unifiedFilters.emptyRooms && tent.beds.filter(b => b.occupied).length > 0) {
        return false;
      }

      // Gender filter
      if (unifiedFilters.gender && unifiedFilters.gender !== 'all') {
        const tentPilgrims = tent.beds
          .filter(b => b.occupied && b.pilgrimId)
          .map(b => mockPilgrims.find(p => p.id === b.pilgrimId))
          .filter(Boolean);
        if (tentPilgrims.length > 0) {
          const hasMatchingGender = tentPilgrims.some(p => p?.gender === unifiedFilters.gender);
          if (!hasMatchingGender) return false;
        }
      }

      return true;
    });
  }, [unifiedFilters, tentsState]);

  const stats = useMemo(() => {
    const totalTents = tentsState.length;
    const totalBeds = tentsState.reduce((sum, t) => sum + t.totalBeds, 0);
    const occupiedBeds = tentsState.reduce((sum, t) => sum + t.beds.filter(b => b.occupied).length, 0);
    const availableBeds = totalBeds - occupiedBeds;
    return { totalTents, totalBeds, occupiedBeds, availableBeds };
  }, [tentsState]);


  const handleTentClick = (tent: Tent) => {
    setSelectedTent(tent);
  };

  const getPilgrimsInTent = (tent: Tent) => {
    return tent.beds.filter(b => b.occupied && b.pilgrimName).map(b => ({
      id: b.pilgrimId || '',
      name: b.pilgrimName || t('housing.unknown'),
      bedId: b.id
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 overflow-x-hidden">
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 break-words">
              {t('housing.mina')} — {t('housing.managementAndBedAssignment')}
            </h1>
            <p className="text-customgray text-sm sm:text-base break-words">
              {t('housing.manageMinaTents')}
            </p>
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <HousingActionsMenu 
              type="mina" 
              onAddSite={() => setIsAddTentsModalOpen(true)}
              onUploadAssignmentPDF={() => setIsAssignmentsModalOpen(true)}
            />
          </div>
        </div>

        {/* Stats Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          <HousingStatsCard
            title={t('housing.totalTents')}
            value={stats.totalTents}
            color="mainColor"
            icon={<FaCampground />}
          />
          <HousingStatsCard
            title={t('housing.totalBeds')}
            value={stats.totalBeds}
            color="primaryColor"
            icon={<FaBed />}
          />
          <HousingStatsCard
            title={t('housing.occupiedBeds')}
            value={stats.occupiedBeds}
            color="secondaryColor"
            icon={<UserOutlined />}
          />
          <HousingStatsCard
            title={t('housing.availableBeds')}
            value={stats.availableBeds}
            color="success"
            icon={<FaBed />}
          />
        </div>

        {/* Mini Charts Section */}
        <MiniChartsSection type="mina" roomsOrTents={tentsState} />

        {/* Unified Filters */}
        <UnifiedFilters type="mina" onFilterChange={setUnifiedFilters} initialFilters={{ section: 'all', minCapacity: 'all', maxCapacity: 'all' }} />

        {/* Mashair Section: Add Mina Tents */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('mashair.addMinaTents')}</h2>
          {mashairTents.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {mashairTents.map((tent) => (
                <GlassCard key={tent.id} className="p-3 relative overflow-hidden group">
                  {/* Decorative Background Shape */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primaryColor/10 to-secondaryColor/5 rounded-full blur-xl -z-0"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primaryColor/5 to-transparent rounded-full blur-lg -z-0"></div>
                  
                  <div className="relative z-10 space-y-2">
                    {/* Header with Icon */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 bg-gradient-to-br from-primaryColor to-primaryColor/80 rounded-lg shadow-md">
                        <FaCampground className="text-white text-sm" />
                      </div>
                      <Button 
                        type="text" 
                        danger 
                        size="small"
                        icon={<DeleteOutlined />} 
                        className="hover:bg-red-50 rounded p-1 h-auto"
                        onClick={() => {
                          const newTents = mashairTents.filter(t => t.id !== tent.id);
                          setMashairTents(newTents);
                          deleteMinaTent(tent.id);
                          message.success(t('mashair.tentDeleted'));
                        }}
                      />
                    </div>
                    
                    <h3 className="text-sm font-bold text-gray-800 truncate mb-2">{tent.tentNameOrNumber}</h3>
                    
                    {/* Info Cards */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 p-1.5 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-md border border-blue-100">
                        <AppstoreOutlined className="text-primaryColor text-xs" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-customgray truncate">{t('mashair.area')}</p>
                          <p className="text-xs font-semibold text-gray-800 truncate">{tent.area} {t('mashair.squareMeters')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 p-1.5 bg-gradient-to-r from-green-50 to-green-50/50 rounded-md border border-green-100">
                        <TeamOutlined className="text-success text-xs" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-customgray truncate">{t('mashair.capacity')}</p>
                          <p className="text-xs font-semibold text-gray-800 truncate">{tent.capacity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <GlassCard className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <FaCampground className="text-3xl text-customgray/50" />
                <p className="text-customgray">{t('mashair.noTents')}</p>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Mashair Section: Assign Mina Tents to Campaigns */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('mashair.assignMinaTents')}</h2>
          {mashairAssignments.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {mashairAssignments.map((assignment) => {
                const getCampaignInfo = () => {
                  switch (assignment.campaign) {
                    case 'office':
                      return { 
                        label: t('mashair.office'), 
                        icon: <BankOutlined />, 
                        color: 'from-blue-500 to-blue-600',
                        bgColor: 'from-blue-50 to-blue-50/50',
                        borderColor: 'border-blue-100',
                        iconBg: 'bg-blue-100',
                        iconColor: 'text-blue-600'
                      };
                    case 'kitchen':
                      return { 
                        label: t('mashair.kitchen'), 
                        icon: <HomeOutlined />, 
                        color: 'from-orange-500 to-orange-600',
                        bgColor: 'from-orange-50 to-orange-50/50',
                        borderColor: 'border-orange-100',
                        iconBg: 'bg-orange-100',
                        iconColor: 'text-orange-600'
                      };
                    case 'campaignNumber':
                      return { 
                        label: `${t('mashair.campaignNumber')}: ${assignment.campaignNumber}`, 
                        icon: <FileTextOutlined />, 
                        color: 'from-purple-500 to-purple-600',
                        bgColor: 'from-purple-50 to-purple-50/50',
                        borderColor: 'border-purple-100',
                        iconBg: 'bg-purple-100',
                        iconColor: 'text-purple-600'
                      };
                    case 'other':
                      return { 
                        label: `${t('mashair.other')}: ${assignment.otherCampaignName}`, 
                        icon: <AppstoreOutlined />, 
                        color: 'from-gray-500 to-gray-600',
                        bgColor: 'from-gray-50 to-gray-50/50',
                        borderColor: 'border-gray-100',
                        iconBg: 'bg-gray-100',
                        iconColor: 'text-gray-600'
                      };
                    default:
                      return { 
                        label: assignment.campaign, 
                        icon: <AppstoreOutlined />, 
                        color: 'from-gray-500 to-gray-600',
                        bgColor: 'from-gray-50 to-gray-50/50',
                        borderColor: 'border-gray-100',
                        iconBg: 'bg-gray-100',
                        iconColor: 'text-gray-600'
                      };
                  }
                };
                const campaignInfo = getCampaignInfo();
                
                return (
                  <GlassCard key={assignment.id} className="p-3 relative overflow-hidden group">
                    {/* Decorative Background Shape */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${campaignInfo.color} opacity-10 rounded-full blur-xl -z-0`}></div>
                    <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr ${campaignInfo.color} opacity-5 rounded-full blur-lg -z-0`}></div>
                    
                    <div className="relative z-10 space-y-2">
                      {/* Header with Icon */}
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-1.5 bg-gradient-to-br ${campaignInfo.color} rounded-lg shadow-md`}>
                          <FaCampground className="text-white text-sm" />
                        </div>
                        <Button 
                          type="text" 
                          danger 
                          size="small"
                          icon={<DeleteOutlined />} 
                          className="hover:bg-red-50 rounded p-1 h-auto"
                          onClick={() => {
                            const newAssignments = mashairAssignments.filter(a => a.id !== assignment.id);
                            setMashairAssignments(newAssignments);
                            deleteMinaAssignment(assignment.id);
                            message.success(t('mashair.assignmentDeleted'));
                          }}
                        />
                      </div>
                      
                      <h3 className="text-sm font-bold text-gray-800 truncate mb-2">{assignment.tentNameOrNumber}</h3>
                      
                      {/* Campaign Info Card */}
                      <div className={`flex items-center gap-1.5 p-1.5 bg-gradient-to-r ${campaignInfo.bgColor} rounded-md border ${campaignInfo.borderColor}`}>
                        <span className={`${campaignInfo.iconColor} text-xs`}>{campaignInfo.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-customgray truncate">{t('mashair.campaign')}</p>
                          <p className="text-xs font-semibold text-gray-800 truncate">{campaignInfo.label}</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          ) : (
            <GlassCard className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <FileTextOutlined className="text-3xl text-customgray/50" />
                <p className="text-customgray">{t('mashair.noAssignments')}</p>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Show All Tents Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg bg-primaryColor text-white hover:bg-primaryColor/90 border-2 border-primaryColor font-medium transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
            onClick={() => setShowAllTentsModal(true)}
          >
            <UnorderedListOutlined />
            {t('housing.showAllTents')}
          </button>
        </div>

        {/* Tents Grid */}
        {filteredTents.length > 0 && (
          <div>
            <p className="text-xs sm:text-sm text-customgray">
              {t('housing.showingResults')} {filteredTents.length} {t('housing.of')} {tentsState.length} {t('housing.totalTents')}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {filteredTents.map((tent) => (
            <GlassCard key={tent.id} className="p-3 sm:p-4 md:p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[380px] sm:min-h-[400px] md:min-h-[420px]">
              <div className="flex-1">
                <TentBedVisualizer
                  beds={tent.beds}
                  tentNumber={tent.tentNumber}
                  totalBeds={tent.totalBeds}
                  onBedClick={(bed) => {
                    setSelectedBed(bed);
                    setSelectedBedRoomInfo({
                      type: 'tent',
                      number: tent.tentNumber,
                      location: t('housing.minaCamp')
                    });
                  }}
                />
              </div>
              <div className="mt-auto pt-4 border-t border-bordergray">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-customgray">{t('housing.tentNumber')}:</span>
                    <span className="font-semibold text-gray-800">{tent.tentNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-customgray">{t('housing.section')}:</span>
                    <span className="font-semibold text-gray-800">{tent.section || t('housing.notAvailable')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-customgray">{t('housing.totalBeds')}:</span>
                    <span className="font-semibold text-gray-800">{tent.totalBeds}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-customgray">{t('housing.occupiedBeds')}:</span>
                    <span className="font-semibold text-primaryColor">
                      {tent.beds.filter(b => b.occupied).length}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-primaryColor to-secondaryColor text-white hover:from-primaryColor/90 hover:to-secondaryColor/90 border-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTent3D(tent);
                  }}
                >
                  <EyeOutlined />
                  {t('housing.view3D')}
                </button>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredTents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-customgray text-lg">
              {t('housing.noTentsFound')}
            </p>
          </div>
        )}

        {/* Tent Details Side Panel */}
        {selectedTent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end p-2 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedTent(null);
            }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-md max-h-[95vh] sm:max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
              <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-bordergray bg-gray-50">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 truncate pr-2">
                  {t('housing.tentDetails')} - {selectedTent.tentNumber}
                </h2>
                <button
                  onClick={() => setSelectedTent(null)}
                  className="p-2 text-customgray hover:text-gray-700 hover:bg-gray-200 rounded-lg transition flex-shrink-0"
                >
                  <CloseOutlined className="text-lg" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-80px)] p-3 sm:p-4 md:p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-customgray mb-2">
                      {t('housing.tentInfo')}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-customgray">{t('housing.tentNumber')}:</span>
                        <span className="font-semibold">{selectedTent.tentNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-customgray">{t('housing.section')}:</span>
                        <span className="font-semibold">{selectedTent.section || t('housing.notAvailable')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-customgray">{t('housing.totalBeds')}:</span>
                        <span className="font-semibold">{selectedTent.totalBeds}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-customgray">{t('housing.occupiedBeds')}:</span>
                        <span className="font-semibold text-primaryColor">
                          {selectedTent.beds.filter(b => b.occupied).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-customgray">{t('housing.availableBeds')}:</span>
                        <span className="font-semibold text-success">
                          {selectedTent.beds.filter(b => !b.occupied).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-customgray mb-2">
                      {t('housing.assignedPilgrims')}
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {getPilgrimsInTent(selectedTent).length > 0 ? (
                        getPilgrimsInTent(selectedTent).map((pilgrim) => (
                          <GlassCard key={pilgrim.id} className="p-3" hover={false}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-800">{pilgrim.name}</span>
                              <span className="text-xs text-customgray">{pilgrim.bedId}</span>
                            </div>
                          </GlassCard>
                        ))
                      ) : (
                        <p className="text-sm text-customgray text-center py-4">
                          {t('housing.noPilgrimsAssigned')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show All Tents Modal */}
        <Modal
          title={t('housing.showAllTents')}
          open={showAllTentsModal}
          onCancel={() => setShowAllTentsModal(false)}
          footer={null}
          width={800}
          className="housing-modal"
        >
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {tentsState.map((tent) => (
              <GlassCard
                key={tent.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => {
                  handleTentClick(tent);
                  setShowAllTentsModal(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{tent.tentNumber}</h3>
                    <p className="text-sm text-customgray">{tent.section || t('housing.notAvailable')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{tent.totalBeds} {t('housing.totalBeds')}</p>
                    <p className="text-xs text-customgray">
                      {tent.beds.filter(b => b.occupied).length} {t('housing.occupiedBeds')}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </Modal>

        {/* 3D Tent Viewer */}
        {selectedTent3D && (
          <Tent3DViewer
            tentNumber={selectedTent3D.tentNumber}
            beds={selectedTent3D.beds}
            totalBeds={selectedTent3D.totalBeds}
            location="mina"
            onClose={() => setSelectedTent3D(null)}
          />
        )}

        {/* Pilgrim Details Modal */}
        <PilgrimDetailsModal
          bed={selectedBed}
          open={!!selectedBed}
          onClose={() => {
            setSelectedBed(null);
            setSelectedBedRoomInfo(null);
          }}
          onAssign={(bed, pilgrimId) => {
            const pilgrim = mockPilgrims.find(p => p.id === pilgrimId);
            if (pilgrim && selectedBedRoomInfo) {
              setTentsState(prevTents => 
                prevTents.map(tent => {
                  if (tent.tentNumber === selectedBedRoomInfo.number) {
                    return {
                      ...tent,
                      beds: tent.beds.map(b => 
                        b.id === bed.id 
                          ? {
                              ...b,
                              occupied: true,
                              pilgrimId: pilgrim.id,
                              pilgrimName: pilgrim.name,
                              pilgrimGender: pilgrim.gender
                            }
                          : b
                      )
                    };
                  }
                  return tent;
                })
              );
            }
          }}
          roomOrTentInfo={selectedBedRoomInfo || undefined}
        />


        {/* Add Tents Modal */}
        {isAddTentsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setIsAddTentsModalOpen(false); }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-4xl max-h-[95vh] bg-white rounded-xl shadow-2xl overflow-hidden z-10">
              <div className="flex items-center justify-between p-6 border-b border-bordergray bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-2xl font-bold text-gray-800">{t('mashair.uploadMinaLayout')}</h2>
                <button onClick={() => { setIsAddTentsModalOpen(false); setUploadedTentsFile(null); setExtractedTentsData([]); }} className="p-2 text-customgray hover:text-gray-700 hover:bg-gray-200 rounded-lg transition">
                  <CloseOutlined className="text-lg" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('mashair.uploadPDF')}</label>
                    <div className="border-2 border-dashed border-bordergray rounded-lg p-6 text-center">
                      <input type="file" accept=".pdf" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.type !== 'application/pdf') { message.error(t('mashair.invalidFileType')); return; }
                        setUploadedTentsFile(file);
                        setIsProcessingTents(true);
                        setTimeout(() => {
                          const mockData: MashairTent[] = [
                            { id: `mina-tent-${Date.now()}-1`, tentNameOrNumber: 'خيمة 1', area: 50, capacity: 20, location: 'mina', createdAt: new Date().toISOString() },
                            { id: `mina-tent-${Date.now()}-2`, tentNameOrNumber: 'خيمة 2', area: 60, capacity: 25, location: 'mina', createdAt: new Date().toISOString() },
                          ];
                          setExtractedTentsData(mockData);
                          setIsProcessingTents(false);
                          message.success(t('mashair.dataExtracted'));
                        }, 1500);
                      }} className="hidden" id="pdf-upload-tents" disabled={isProcessingTents} />
                      <label htmlFor="pdf-upload-tents" className="cursor-pointer flex flex-col items-center gap-3">
                        <UploadOutlined className="text-4xl text-primaryColor" />
                        <span className="text-gray-700">{uploadedTentsFile ? uploadedTentsFile.name : t('mashair.selectPDFFile')}</span>
                        {isProcessingTents && <span className="text-customgray">{t('mashair.processing')}...</span>}
                      </label>
                    </div>
                  </div>
                  {extractedTentsData.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('mashair.extractedData')}</h3>
                      <Table columns={[
                        { title: t('mashair.tentNameOrNumber'), dataIndex: 'tentNameOrNumber', key: 'tentNameOrNumber' },
                        { title: t('mashair.area'), dataIndex: 'area', key: 'area', render: (area: number) => `${area} ${t('mashair.squareMeters')}` },
                        { title: t('mashair.capacity'), dataIndex: 'capacity', key: 'capacity' },
                      ]} dataSource={extractedTentsData} rowKey="id" pagination={false} className="mb-4" />
                      <div className="flex gap-3 justify-end">
                        <Button onClick={() => setIsAddTentsModalOpen(false)}>{t('form.cancel')}</Button>
                        <Button type="primary" onClick={() => {
                          const newTents = [...mashairTents, ...extractedTentsData];
                          setMashairTents(newTents);
                          saveMinaTents(newTents);
                          setExtractedTentsData([]);
                          setUploadedTentsFile(null);
                          setIsAddTentsModalOpen(false);
                          message.success(t('mashair.dataSaved'));
                        }}>{t('form.save')}</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assignments Modal */}
        {isAssignmentsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setIsAssignmentsModalOpen(false); }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-4xl max-h-[95vh] bg-white rounded-xl shadow-2xl overflow-hidden z-10">
              <div className="flex items-center justify-between p-6 border-b border-bordergray bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-2xl font-bold text-gray-800">{t('mashair.uploadMinaAssignmentLayout')}</h2>
                <button onClick={() => { setIsAssignmentsModalOpen(false); setUploadedAssignmentsFile(null); setExtractedAssignmentsData([]); }} className="p-2 text-customgray hover:text-gray-700 hover:bg-gray-200 rounded-lg transition">
                  <CloseOutlined className="text-lg" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('mashair.uploadPDF')}</label>
                    <div className="border-2 border-dashed border-bordergray rounded-lg p-6 text-center">
                      <input type="file" accept=".pdf" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.type !== 'application/pdf') { message.error(t('mashair.invalidFileType')); return; }
                        setUploadedAssignmentsFile(file);
                        setIsProcessingAssignments(true);
                        setTimeout(() => {
                          const mockData: Partial<MashairTentAssignment>[] = [
                            { tentNameOrNumber: 'خيمة 1', campaign: 'office' },
                            { tentNameOrNumber: 'خيمة 2', campaign: 'kitchen' },
                          ];
                          setExtractedAssignmentsData(mockData);
                          setIsProcessingAssignments(false);
                          message.success(t('mashair.dataExtracted'));
                        }, 1500);
                      }} className="hidden" id="pdf-upload-assignments" disabled={isProcessingAssignments} />
                      <label htmlFor="pdf-upload-assignments" className="cursor-pointer flex flex-col items-center gap-3">
                        <UploadOutlined className="text-4xl text-primaryColor" />
                        <span className="text-gray-700">{uploadedAssignmentsFile ? uploadedAssignmentsFile.name : t('mashair.selectPDFFile')}</span>
                        {isProcessingAssignments && <span className="text-customgray">{t('mashair.processing')}...</span>}
                      </label>
                    </div>
                  </div>
                  {extractedAssignmentsData.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('mashair.extractedData')}</h3>
                      <div className="space-y-4">
                        {extractedAssignmentsData.map((item, index) => (
                          <GlassCard key={index} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('mashair.tentNameOrNumber')}</label>
                                <Input value={item.tentNameOrNumber} disabled className="bg-gray-50" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('mashair.campaign')}</label>
                                <Select value={item.campaign || 'office'} onChange={(value) => {
                                  const newData = [...extractedAssignmentsData];
                                  newData[index] = { ...newData[index], campaign: value as any, campaignNumber: value === 'campaignNumber' ? newData[index].campaignNumber : undefined, otherCampaignName: value === 'other' ? newData[index].otherCampaignName : undefined };
                                  setExtractedAssignmentsData(newData);
                                }} className="w-full">
                                  <Option value="office">{t('mashair.office')}</Option>
                                  <Option value="kitchen">{t('mashair.kitchen')}</Option>
                                  <Option value="campaignNumber">{t('mashair.campaignNumber')}</Option>
                                  <Option value="other">{t('mashair.other')}</Option>
                                </Select>
                              </div>
                              {item.campaign === 'campaignNumber' && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('mashair.campaignNumber')}</label>
                                  <Input value={item.campaignNumber || ''} onChange={(e) => {
                                    const newData = [...extractedAssignmentsData];
                                    newData[index] = { ...newData[index], campaignNumber: e.target.value };
                                    setExtractedAssignmentsData(newData);
                                  }} placeholder={t('mashair.enterCampaignNumber')} />
                                </div>
                              )}
                              {item.campaign === 'other' && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('mashair.otherCampaignName')}</label>
                                  <Input value={item.otherCampaignName || ''} onChange={(e) => {
                                    const newData = [...extractedAssignmentsData];
                                    newData[index] = { ...newData[index], otherCampaignName: e.target.value };
                                    setExtractedAssignmentsData(newData);
                                  }} placeholder={t('mashair.enterCampaignName')} />
                                </div>
                              )}
                            </div>
                          </GlassCard>
                        ))}
                      </div>
                      <div className="flex gap-3 justify-end mt-6">
                        <Button onClick={() => setIsAssignmentsModalOpen(false)}>{t('form.cancel')}</Button>
                        <Button type="primary" onClick={() => {
                          const newAssignments: MashairTentAssignment[] = extractedAssignmentsData.map((item, idx) => ({
                            id: `mina-assignment-${Date.now()}-${idx}`,
                            tentNameOrNumber: item.tentNameOrNumber || '',
                            campaign: item.campaign || 'office',
                            campaignNumber: item.campaignNumber,
                            otherCampaignName: item.otherCampaignName,
                            location: 'mina',
                            createdAt: new Date().toISOString()
                          }));
                          const updated = [...mashairAssignments, ...newAssignments];
                          setMashairAssignments(updated);
                          saveMinaAssignments(updated);
                          setExtractedAssignmentsData([]);
                          setUploadedAssignmentsFile(null);
                          setIsAssignmentsModalOpen(false);
                          message.success(t('mashair.dataSaved'));
                        }}>{t('form.save')}</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinaHousingPage;

