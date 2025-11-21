import React, { useState, useMemo } from 'react';
import { Modal, Input, Select, Button, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlassCard } from './GlassCard';
import { UserOutlined, PhoneOutlined, GlobalOutlined, ManOutlined, WomanOutlined, CloseOutlined, CalendarOutlined, TeamOutlined, HomeOutlined, ApartmentOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { mockPilgrims } from '../../data/mockHousing';
import type { Bed, Pilgrim } from '../../types/housing';

const { Option } = Select;

interface PilgrimDetailsModalProps {
  bed: Bed | null;
  open: boolean;
  onClose: () => void;
  onAssign?: (bed: Bed, pilgrimId: string) => void;
  roomOrTentInfo?: {
    type: 'room' | 'tent';
    number: string;
    location?: string;
  };
}

export const PilgrimDetailsModal: React.FC<PilgrimDetailsModalProps> = ({
  bed,
  open,
  onClose,
  onAssign,
  roomOrTentInfo
}) => {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPilgrimId, setSelectedPilgrimId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('select');

  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setSearchTerm('');
      setSelectedPilgrimId('');
      setActiveTab('select');
    }
  }, [open]);

  // Get unassigned pilgrims for selection (must be before early return)
  const unassignedPilgrims = useMemo(() => {
    if (!open) return [];
    return mockPilgrims.filter(p => 
      !p.assignedRoom && !p.assignedTent &&
      (searchTerm === '' || 
       p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       p.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       p.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, open]);

  if (!bed || !open) {
    return null;
  }

  // Check occupancy from bed data - bed.occupied is the source of truth
  const isOccupied = bed.occupied === true;
  
  // Try to find pilgrim if pilgrimId exists, but don't require it for occupancy
  const pilgrim = isOccupied && bed.pilgrimId ? mockPilgrims.find(p => p.id === bed.pilgrimId) : null;

  const handleAssignPilgrim = () => {
    if (selectedPilgrimId && onAssign && bed) {
      onAssign(bed, selectedPilgrimId);
      setSelectedPilgrimId('');
      setSearchTerm('');
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={900}
      className="pilgrim-details-modal"
      closeIcon={<CloseOutlined className="text-gray-500 hover:text-gray-700" />}
    >
      <GlassCard className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Profile Section */}
          <div className="lg:w-1/3 bg-gradient-to-br from-primaryColor/10 to-secondaryColor/10 p-6 lg:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-bordergray">
            {isOccupied ? (
              <>
                {pilgrim ? (
                  <>
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primaryColor to-secondaryColor flex items-center justify-center shadow-xl mb-4 overflow-hidden">
                      {pilgrim.photo ? (
                        <img 
                          src={pilgrim.photo} 
                          alt={pilgrim.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          {pilgrim.gender === 'female' ? (
                            <WomanOutlined className="text-white text-4xl" />
                          ) : (
                            <ManOutlined className="text-white text-4xl" />
                          )}
                        </>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                      {pilgrim.name}
                    </h3>
                    <p className="text-sm text-customgray mb-4 text-center">
                      {t(`housing.${pilgrim.gender}`)}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primaryColor to-secondaryColor flex items-center justify-center shadow-xl mb-4 overflow-hidden">
                      {bed.pilgrimGender === 'female' ? (
                        <WomanOutlined className="text-white text-4xl" />
                      ) : (
                        <ManOutlined className="text-white text-4xl" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                      {bed.pilgrimName || t('housing.unknown')}
                    </h3>
                    {bed.pilgrimGender && (
                      <p className="text-sm text-customgray mb-4 text-center">
                        {t(`housing.${bed.pilgrimGender}`)}
                      </p>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center shadow-xl mb-4">
                  <HomeOutlined className="text-gray-400 text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {t('housing.emptyBed')}
                </h3>
                <p className="text-sm text-customgray mb-4 text-center">
                  {t('housing.noPilgrimAssigned')}
                </p>
              </>
            )}
            {roomOrTentInfo && (
              <div className="w-full mt-4 p-3 bg-white/80 rounded-lg border border-bordergray">
                <div className="flex items-center gap-2 mb-2">
                  {roomOrTentInfo.type === 'room' ? (
                    <HomeOutlined className="text-primaryColor" />
                  ) : (
                    <ApartmentOutlined className="text-primaryColor" />
                  )}
                  <span className="text-xs font-semibold text-customgray uppercase">
                    {t(`housing.${roomOrTentInfo.type}`)}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  {roomOrTentInfo.number}
                </p>
                {roomOrTentInfo.location && (
                  <p className="text-xs text-customgray mt-1">
                    {roomOrTentInfo.location}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Details Section */}
          <div className="lg:w-2/3 p-6 lg:p-8">
            {isOccupied ? (
              <>
                {pilgrim ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-6 bg-gradient-to-b from-primaryColor to-secondaryColor rounded-full"></div>
                      <h3 className="text-xl font-bold text-gray-900">{t('housing.personalInformation')}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined className="text-primaryColor" />
                  <span className="text-xs font-semibold text-customgray uppercase">{t('form.name')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{pilgrim.name}</p>
              </div>

              {/* Gender */}
              <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="flex items-center gap-2 mb-2">
                  {pilgrim.gender === 'female' ? (
                    <WomanOutlined className="text-primaryColor" />
                  ) : (
                    <ManOutlined className="text-primaryColor" />
                  )}
                  <span className="text-xs font-semibold text-customgray uppercase">{t('housing.gender')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{t(`housing.${pilgrim.gender}`)}</p>
              </div>

              {/* Age */}
              <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarOutlined className="text-primaryColor" />
                  <span className="text-xs font-semibold text-customgray uppercase">{t('form.age')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{pilgrim.age}</p>
              </div>

              {/* Nationality */}
              <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="flex items-center gap-2 mb-2">
                  <GlobalOutlined className="text-primaryColor" />
                  <span className="text-xs font-semibold text-customgray uppercase">{t('form.nationality')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {t(`nationalities.${pilgrim.nationality.toLowerCase()}`) || pilgrim.nationality}
                </p>
              </div>

              {/* Phone */}
              <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="flex items-center gap-2 mb-2">
                  <PhoneOutlined className="text-primaryColor" />
                  <span className="text-xs font-semibold text-customgray uppercase">{t('housing.phone')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {pilgrim.phone || t('housing.notAvailable')}
                </p>
              </div>

              {/* Email */}
              <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined className="text-primaryColor" />
                  <span className="text-xs font-semibold text-customgray uppercase">{t('form.email')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {pilgrim.email || t('housing.notAvailable')}
                </p>
              </div>

              {/* Organizer */}
              {pilgrim.organizer && (
                <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                  <div className="flex items-center gap-2 mb-2">
                    <TeamOutlined className="text-primaryColor" />
                    <span className="text-xs font-semibold text-customgray uppercase">{t('housing.organizer')}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{pilgrim.organizer}</p>
                </div>
              )}

              {/* Group */}
              {pilgrim.group && (
                <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                  <div className="flex items-center gap-2 mb-2">
                    <TeamOutlined className="text-primaryColor" />
                    <span className="text-xs font-semibold text-customgray uppercase">{t('housing.group')}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{pilgrim.group}</p>
                </div>
              )}

              {/* Passport Number */}
              <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined className="text-primaryColor" />
                  <span className="text-xs font-semibold text-customgray uppercase">{t('housing.passportNumber')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {pilgrim.passportNumber || t('housing.notAvailable')}
                </p>
              </div>

              {/* Visa Number */}
              <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined className="text-primaryColor" />
                  <span className="text-xs font-semibold text-customgray uppercase">{t('housing.visaNumber')}</span>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  {pilgrim.visaNumber || t('housing.notAvailable')}
                </p>
              </div>
            </div>

                {/* Assignment Information */}
                {(pilgrim.assignedRoom || pilgrim.assignedTent) && (
                  <div className="mt-6 pt-6 border-t border-bordergray">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-6 bg-gradient-to-b from-primaryColor to-secondaryColor rounded-full"></div>
                      <h3 className="text-lg font-bold text-gray-900">{t('housing.assignmentInformation')}</h3>
                    </div>
                    <div className="p-4 bg-primaryColor/5 rounded-lg border border-primaryColor/20">
                      {pilgrim.assignedRoom && (
                        <div className="flex items-center gap-3">
                          <HomeOutlined className="text-primaryColor text-xl" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {pilgrim.assignedRoom.type === 'hotel' ? t('housing.hotel') : t('housing.building')} - {t('housing.room')} {pilgrim.assignedRoom.roomNumber}
                            </p>
                            <p className="text-xs text-customgray">{t('housing.bedId')}: {pilgrim.assignedRoom.bedId}</p>
                          </div>
                        </div>
                      )}
                      {pilgrim.assignedTent && (
                        <div className="flex items-center gap-3">
                          <ApartmentOutlined className="text-primaryColor text-xl" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {pilgrim.assignedTent.location === 'mina' ? t('housing.minaCamp') : t('housing.arafatCamp')} - {t('housing.tent')} {pilgrim.assignedTent.tentNumber}
                            </p>
                            <p className="text-xs text-customgray">{t('housing.bedId')}: {pilgrim.assignedTent.bedId}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Current Bed Assignment */}
                {roomOrTentInfo && (
                  <div className="mt-6 pt-6 border-t border-bordergray">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-6 bg-gradient-to-b from-primaryColor to-secondaryColor rounded-full"></div>
                      <h3 className="text-lg font-bold text-gray-900">{t('housing.currentAssignment')}</h3>
                    </div>
                    <div className="p-4 bg-primaryColor/5 rounded-lg border border-primaryColor/20">
                      <div className="flex items-center gap-3">
                        {roomOrTentInfo.type === 'room' ? (
                          <HomeOutlined className="text-primaryColor text-xl" />
                        ) : (
                          <ApartmentOutlined className="text-primaryColor text-xl" />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {t(`housing.${roomOrTentInfo.type}`)} {roomOrTentInfo.number}
                          </p>
                          {roomOrTentInfo.location && (
                            <p className="text-xs text-customgray">{roomOrTentInfo.location}</p>
                          )}
                          <p className="text-xs text-customgray mt-1">{t('housing.bedId')}: {bed.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                  </>
                ) : (
                  // Bed is occupied but pilgrim not found in mockPilgrims - show basic info from bed
                  <div className="py-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-6 bg-gradient-to-b from-primaryColor to-secondaryColor rounded-full"></div>
                      <h3 className="text-xl font-bold text-gray-900">{t('housing.pilgrimInformation')}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                        <div className="flex items-center gap-2 mb-2">
                          <UserOutlined className="text-primaryColor" />
                          <span className="text-xs font-semibold text-customgray uppercase">{t('form.name')}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800">{bed.pilgrimName || t('housing.unknown')}</p>
                      </div>
                      {bed.pilgrimGender && (
                        <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                          <div className="flex items-center gap-2 mb-2">
                            {bed.pilgrimGender === 'female' ? (
                              <WomanOutlined className="text-primaryColor" />
                            ) : (
                              <ManOutlined className="text-primaryColor" />
                            )}
                            <span className="text-xs font-semibold text-customgray uppercase">{t('housing.gender')}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-800">{t(`housing.${bed.pilgrimGender}`)}</p>
                        </div>
                      )}
                      {bed.pilgrimId && (
                        <div className="p-4 bg-gray-50 rounded-lg border border-bordergray">
                          <div className="flex items-center gap-2 mb-2">
                            <UserOutlined className="text-primaryColor" />
                            <span className="text-xs font-semibold text-customgray uppercase">{t('housing.pilgrimId')}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-800">{bed.pilgrimId}</p>
                        </div>
                      )}
                    </div>
                    {roomOrTentInfo && (
                      <div className="mt-6 pt-6 border-t border-bordergray">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-1 h-6 bg-gradient-to-b from-primaryColor to-secondaryColor rounded-full"></div>
                          <h3 className="text-lg font-bold text-gray-900">{t('housing.currentAssignment')}</h3>
                        </div>
                        <div className="p-4 bg-primaryColor/5 rounded-lg border border-primaryColor/20">
                          <div className="flex items-center gap-3">
                            {roomOrTentInfo.type === 'room' ? (
                              <HomeOutlined className="text-primaryColor text-xl" />
                            ) : (
                              <ApartmentOutlined className="text-primaryColor text-xl" />
                            )}
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {t(`housing.${roomOrTentInfo.type}`)} {roomOrTentInfo.number}
                              </p>
                              {roomOrTentInfo.location && (
                                <p className="text-xs text-customgray">{roomOrTentInfo.location}</p>
                              )}
                              <p className="text-xs text-customgray mt-1">{t('housing.bedId')}: {bed.id}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="py-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-primaryColor to-secondaryColor rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">{t('housing.assignPilgrimToBed')}</h3>
                </div>

                {/* Bed Information */}
                {roomOrTentInfo && (
                  <div className="mb-6 p-4 bg-primaryColor/5 rounded-lg border border-primaryColor/20">
                    <div className="flex items-center gap-3">
                      {roomOrTentInfo.type === 'room' ? (
                        <HomeOutlined className="text-primaryColor text-xl" />
                      ) : (
                        <ApartmentOutlined className="text-primaryColor text-xl" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {t(`housing.${roomOrTentInfo.type}`)} {roomOrTentInfo.number}
                        </p>
                        {roomOrTentInfo.location && (
                          <p className="text-xs text-customgray mt-1">{roomOrTentInfo.location}</p>
                        )}
                        <p className="text-xs text-customgray mt-1">{t('housing.bedId')}: {bed.id}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Assignment Options */}
                <Tabs 
                  activeKey={activeTab} 
                  onChange={setActiveTab} 
                  className="assignment-tabs"
                  items={[
                    {
                      key: 'select',
                      label: t('housing.selectExistingPilgrim'),
                      children: (
                        <div className="space-y-4 mt-4">
                          <Input
                            placeholder={t('housing.searchPilgrims')}
                            prefix={<SearchOutlined className="text-customgray" />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="large"
                            className="border-2 border-bordergray hover:border-primaryColor focus:border-primaryColor"
                          />
                          
                          <div className="max-h-64 overflow-y-auto space-y-2">
                            {unassignedPilgrims.length > 0 ? (
                              unassignedPilgrims.map((p) => (
                                <div
                                  key={p.id}
                                  onClick={() => setSelectedPilgrimId(p.id)}
                                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    selectedPilgrimId === p.id
                                      ? 'border-primaryColor bg-primaryColor/5'
                                      : 'border-bordergray hover:border-primaryColor/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primaryColor to-secondaryColor flex items-center justify-center">
                                      {p.gender === 'female' ? (
                                        <WomanOutlined className="text-white" />
                                      ) : (
                                        <ManOutlined className="text-white" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-800">{p.name}</p>
                                      <p className="text-xs text-customgray">
                                        {t(`housing.${p.gender}`)} • {t(`nationalities.${p.nationality.toLowerCase()}`) || p.nationality} • {p.age} {t('form.age')}
                                      </p>
                                      {p.phone && (
                                        <p className="text-xs text-customgray">{p.phone}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8 text-customgray">
                                {searchTerm ? t('housing.noPilgrimsFound') : t('housing.noUnassignedPilgrims')}
                              </div>
                            )}
                          </div>

                          {selectedPilgrimId && (
                            <Button
                              type="primary"
                              size="large"
                              onClick={handleAssignPilgrim}
                              className="w-full bg-gradient-to-r from-primaryColor to-secondaryColor border-0 hover:from-primaryColor/90 hover:to-secondaryColor/90"
                              icon={<UserOutlined />}
                            >
                              {t('housing.assignSelectedPilgrim')}
                            </Button>
                          )}
                        </div>
                      )
                    },
                    {
                      key: 'add',
                      label: t('housing.addNewPilgrim'),
                      children: (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-bordergray">
                          <p className="text-sm text-customgray text-center">
                            {t('housing.newPilgrimFormComingSoon')}
                          </p>
                          <p className="text-xs text-customgray text-center mt-2">
                            {t('housing.useSelectExistingForNow')}
                          </p>
                        </div>
                      )
                    }
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </Modal>
  );
};

