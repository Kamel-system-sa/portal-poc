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
import { CloseOutlined, EyeOutlined, UnorderedListOutlined, UserOutlined, ApartmentOutlined } from '@ant-design/icons';
import { FaBed, FaCampground } from 'react-icons/fa';
import { mockArafatTents, mockPilgrims } from '../../data/mockHousing';
import { Tent3DViewer } from '../../components/HousingComponent/Tent3DViewer';
import type { Tent, Bed } from '../../types/housing';


const ArafatHousingPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [selectedTent, setSelectedTent] = useState<Tent | null>(null);
  const [selectedTent3D, setSelectedTent3D] = useState<Tent | null>(null);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [selectedBedRoomInfo, setSelectedBedRoomInfo] = useState<{ type: 'room' | 'tent'; number: string; location?: string } | null>(null);
  const [showAllTentsModal, setShowAllTentsModal] = useState(false);
  const [tentsState, setTentsState] = useState<Tent[]>(mockArafatTents);
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

  const sections = useMemo(() => {
    const uniqueSections = new Set(tentsState.map(t => t.section).filter(Boolean));
    return Array.from(uniqueSections);
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
    <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t('housing.arafat')} — {t('housing.managementAndBedAssignment')}
            </h1>
            <p className="text-customgray">
              {t('housing.manageArafatTents')}
            </p>
          </div>
          <HousingActionsMenu type="arafat" />
        </div>

        {/* Stats Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
        <MiniChartsSection type="arafat" roomsOrTents={tentsState} />

        {/* Unified Filters */}
        <UnifiedFilters type="arafat" onFilterChange={setUnifiedFilters} initialFilters={{ section: 'all', minCapacity: 'all', maxCapacity: 'all' }} />

        {/* Show All Tents Button */}
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            className="h-10 px-4 rounded-lg bg-primaryColor text-white hover:bg-primaryColor/90 border-2 border-primaryColor font-medium transition-all duration-200 flex items-center gap-2"
            onClick={() => setShowAllTentsModal(true)}
          >
            <UnorderedListOutlined />
            {t('housing.showAllTents')}
          </button>
        </div>

        {/* Tents Grid */}
        {filteredTents.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-customgray">
              {t('housing.showingResults')} {filteredTents.length} {t('housing.of')} {tentsState.length} {t('housing.totalTents')}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTents.map((tent) => (
            <GlassCard key={tent.id} className="p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[420px]">
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
                      location: t('housing.arafatCamp')
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
            className="fixed inset-0 z-50 flex items-center justify-end p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedTent(null);
            }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-md max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
              <div className="flex items-center justify-between p-6 border-b border-bordergray bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t('housing.tentDetails')} - {selectedTent.tentNumber}
                </h2>
                <button
                  onClick={() => setSelectedTent(null)}
                  className="p-2 text-customgray hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
                >
                  <CloseOutlined className="text-lg" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
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
            {mockArafatTents.map((tent) => (
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
            location="arafat"
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
      </div>
    </div>
  );
};

export default ArafatHousingPage;

