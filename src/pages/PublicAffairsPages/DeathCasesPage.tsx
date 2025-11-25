import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { HousingStatsCard } from '../../components/HousingComponent/HousingStatsCard';
import { CaseDetailsModal } from '../../components/PublicAffairs/CaseDetailsModal';
import { ConfirmDeleteModal } from '../../components/Centers/ConfirmDeleteModal';
import { 
  PlusOutlined, 
  WarningOutlined,
  CalendarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  MoreOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { Dropdown, Button } from 'antd';
import { DeathCaseForm } from '../../components/PublicAffairs/DeathCaseForm';
import { ConfirmCompleteModal } from '../../components/PublicAffairs/ConfirmCompleteModal';
import { 
  getDeathCasesCount, 
  getTodayDeathCases, 
  type DeathCase 
} from '../../data/mockPublicAffairs';
import { getDeathCases, saveDeathCase, deleteDeathCase } from '../../data/publicAffairsStorage';
import { useEffect } from 'react';

const DeathCasesPage: React.FC = () => {
  const { t } = useTranslation('PublicAffairs');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<DeathCase | null>(null);
  const [caseToDelete, setCaseToDelete] = useState<DeathCase | null>(null);
  const [caseToComplete, setCaseToComplete] = useState<DeathCase | null>(null);
  const [deathCases, setDeathCases] = useState<DeathCase[]>([]);

  // Load death cases from localStorage on mount
  useEffect(() => {
    const loadedCases = getDeathCases();
    setDeathCases(loadedCases);
  }, []);
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'active' | 'completed'>('active');

  const activeCases = deathCases.filter(c => !c.completed);
  const completedCases = deathCases.filter(c => c.completed);
  const displayedCases = filterCompleted === 'all' ? deathCases :
                         filterCompleted === 'completed' ? completedCases : activeCases;

  const totalDeaths = deathCases.length;
  const activeDeaths = activeCases.length;
  const completedDeaths = completedCases.length;
  const todayDeaths = getTodayDeathCases();
  const thisWeekDeaths = deathCases.filter(c => {
    const caseDate = new Date(c.dateOfDeath);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return caseDate >= weekAgo && !c.completed;
  }).length;

  const handleCaseClick = (caseItem: DeathCase) => {
    setSelectedCase(caseItem);
  };

  const handleCloseModal = () => {
    setSelectedCase(null);
  };

  const handleDelete = () => {
    if (caseToDelete) {
      deleteDeathCase(caseToDelete.id);
      setDeathCases(deathCases.filter(c => c.id !== caseToDelete.id));
      setCaseToDelete(null);
      setSelectedCase(null);
    }
  };

  const handleComplete = () => {
    if (caseToComplete) {
      const updatedCase = { 
        ...caseToComplete, 
        completed: true, 
        completedAt: new Date().toISOString(), 
        burialCompleted: true 
      };
      saveDeathCase(updatedCase);
      setDeathCases(deathCases.map(c => 
        c.id === caseToComplete.id ? updatedCase : c
      ));
      setCaseToComplete(null);
      setSelectedCase(null);
    }
  };

  const handleCompleteClick = () => {
    if (selectedCase) {
      setCaseToComplete(selectedCase);
    }
  };

  const handleFormSubmit = (formData: Omit<DeathCase, 'id' | 'createdAt' | 'completed' | 'completedAt' | 'burialCompleted'>) => {
    const newCase: DeathCase = {
      ...formData,
      id: `death-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completed: false
    };
    // Save to localStorage
    saveDeathCase(newCase);
    // Update state to reflect changes immediately
    setDeathCases([...deathCases, newCase]);
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 overflow-x-hidden">
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 break-words">
                {t('deaths')}
              </h1>
              <p className="text-customgray text-sm sm:text-base break-words">
                {t('deathsSubtitle')}
              </p>
            </div>
            
            {/* Add Button & Actions */}
            <GlassCard className="p-3 sm:p-4 lg:p-5 flex-shrink-0 w-full lg:w-auto">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(true)}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-primaryColor to-primaryColor/90 text-white rounded-xl hover:shadow-lg hover:shadow-primaryColor/30 transition-all duration-200 flex items-center gap-2 font-medium text-xs sm:text-sm flex-1 sm:flex-initial"
                >
                  <PlusOutlined />
                  <span>{t('addNewCase')}</span>
                </button>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'export',
                        label: t('exportData'),
                        icon: <DownloadOutlined />,
                        onClick: () => {
                          // Handle export
                          console.log('Export clicked');
                        }
                      },
                      {
                        key: 'import',
                        label: t('importData'),
                        icon: <UploadOutlined />,
                        onClick: () => {
                          // Handle import
                          console.log('Import clicked');
                        }
                      }
                    ]
                  }}
                  trigger={['click']}
                >
                  <Button
                    className="px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-primaryColor transition-all duration-200 flex items-center gap-2 font-medium text-xs sm:text-sm"
                  >
                    <MoreOutlined />
                    <span>{t('actions')}</span>
                  </Button>
                </Dropdown>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 items-stretch">
          <HousingStatsCard
            title={t('totalDeaths')}
            value={totalDeaths}
            icon={<WarningOutlined />}
            color="danger"
          />
          <HousingStatsCard
            title={t('activeDeaths')}
            value={activeDeaths}
            icon={<WarningOutlined />}
            color="warning"
          />
          <HousingStatsCard
            title={t('completedDeaths')}
            value={completedDeaths}
            icon={<CheckCircleOutlined />}
            color="success"
          />
          <HousingStatsCard
            title={t('todayDeaths')}
            value={todayDeaths}
            icon={<CalendarOutlined />}
            color="primaryColor"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterCompleted('active')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filterCompleted === 'active'
                ? 'bg-primaryColor text-white shadow-lg'
                : 'bg-white text-gray-700 border border-bordergray hover:bg-gray-50'
            }`}
          >
            {t('active')} ({activeDeaths})
          </button>
          <button
            onClick={() => setFilterCompleted('completed')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filterCompleted === 'completed'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-bordergray hover:bg-gray-50'
            }`}
          >
            {t('completed')} ({completedDeaths})
          </button>
          <button
            onClick={() => setFilterCompleted('all')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filterCompleted === 'all'
                ? 'bg-gray-700 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-bordergray hover:bg-gray-50'
            }`}
          >
            {t('all')} ({totalDeaths})
          </button>
        </div>

        {/* Cases List */}
        <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileTextOutlined className="text-primaryColor text-xl" />
            {filterCompleted === 'completed' ? t('completedDeathCasesList') :
             filterCompleted === 'all' ? t('allDeathCasesList') :
             t('deathCasesList')}
          </h3>
          {displayedCases.length === 0 ? (
            <p className="text-customgray text-center py-8">{t('noCases')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {displayedCases.map((caseItem) => (
                <GlassCard
                  key={caseItem.id}
                  onClick={() => handleCaseClick(caseItem)}
                  className={`p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[380px] ${
                    caseItem.completed ? 'border-green-300/50' : ''
                  }`}
                >
                  <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          caseItem.completed 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {caseItem.completed ? (
                            <CheckCircleOutlined className="text-xl" />
                          ) : (
                            <WarningOutlined className="text-xl" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-lg text-gray-800 truncate mb-1">{caseItem.name}</div>
                          <div className="text-xs text-customgray font-mono">{caseItem.nusukCaseNumber}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Details Section */}
                    <div className="mt-4 pt-4 border-t border-bordergray flex-1 flex flex-col">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-customgray">{t('causeOfDeath')}:</span>
                          <span className="font-semibold text-gray-800 text-right max-w-[60%] line-clamp-2">{caseItem.causeOfDeath}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-customgray">{t('placeOfDeath')}:</span>
                          <span className="font-semibold text-gray-800 text-right max-w-[60%] truncate">{caseItem.placeOfDeath}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-customgray">{t('dateOfDeath')}:</span>
                          <span className="font-semibold text-gray-800">{caseItem.dateOfDeath}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-customgray">{t('timeOfDeath')}:</span>
                          <span className="font-semibold text-gray-800">{caseItem.timeOfDeath}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCaseClick(caseItem);
                        }}
                        className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-primaryColor to-secondaryColor text-white hover:from-primaryColor/90 hover:to-secondaryColor/90 border-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                      >
                        <EyeOutlined />
                        {t('viewDetails')}
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <CaseDetailsModal
          open={!!selectedCase}
          onClose={handleCloseModal}
          onDelete={() => {
            setCaseToDelete(selectedCase);
          }}
          onComplete={handleCompleteClick}
          caseType="death"
          caseData={selectedCase}
        />
      )}

      {/* Delete Confirmation Modal */}
      {caseToDelete && (
        <ConfirmDeleteModal
          open={!!caseToDelete}
          onCancel={() => setCaseToDelete(null)}
          onConfirm={() => {
            handleDelete();
          }}
          title={t('deleteCase')}
          message={t('deleteCaseMessage')}
        />
      )}

      {/* Complete Confirmation Modal */}
      {caseToComplete && (
        <ConfirmCompleteModal
          open={!!caseToComplete}
          onClose={() => setCaseToComplete(null)}
          onConfirm={handleComplete}
          title={t('markBurialCompleted')}
          message={t('confirmCompleteDeathMessage')}
        />
      )}

      {/* Add Case Form Modal */}
      <DeathCaseForm
        open={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default DeathCasesPage;
