import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CloseOutlined,
  EyeOutlined,
  FileTextOutlined,
  WarningOutlined,
  HeartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import type { DeathCase, HospitalizedCase, OtherIncident } from '../../data/mockPublicAffairs';

interface CasesListModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  cases: Array<(DeathCase | HospitalizedCase | OtherIncident) & { type: 'death' | 'hospitalized' | 'other' }>;
  onCaseClick: (caseItem: any, type: 'death' | 'hospitalized' | 'other') => void;
}

export const CasesListModal: React.FC<CasesListModalProps> = ({
  open,
  onClose,
  title,
  cases,
  onCaseClick
}) => {
  const { t } = useTranslation('PublicAffairs');

  if (!open) {
    return null;
  }

  const getCaseTypeIcon = (type: string) => {
    switch (type) {
      case 'death':
        return <WarningOutlined className="text-red-600" />;
      case 'hospitalized':
        return <HeartOutlined className="text-amber-600" />;
      case 'other':
        return <FileTextOutlined className="text-primaryColor" />;
      default:
        return <FileTextOutlined />;
    }
  };

  const getCaseTypeLabel = (type: string) => {
    switch (type) {
      case 'death':
        return t('deaths');
      case 'hospitalized':
        return t('hospitalized');
      case 'other':
        return t('otherIncidents');
      default:
        return '';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-7xl max-h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden z-10 transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-bordergray bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-customgray hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            <CloseOutlined className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-4 sm:p-6">
          {cases.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-customgray text-lg">{t('noCases')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {cases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  onClick={() => onCaseClick(caseItem, caseItem.type)}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                    caseItem.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-bordergray hover:border-primaryColor'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base sm:text-lg text-gray-800 mb-1 truncate">{caseItem.name}</div>
                      <div className="text-xs text-customgray truncate">{caseItem.nusukCaseNumber}</div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      {getCaseTypeIcon(caseItem.type)}
                      {caseItem.completed && (
                        <CheckCircleOutlined className="text-green-600 text-base sm:text-xl" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div>
                      <div className="text-xs text-customgray mb-0.5">{t('incidentType')}</div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-700 truncate">{getCaseTypeLabel(caseItem.type)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-customgray mb-0.5">{t('createdAt')}</div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-700">
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-bordergray flex items-center gap-1 sm:gap-2 text-primaryColor text-xs sm:text-sm font-semibold">
                    <EyeOutlined className="text-xs sm:text-sm" />
                    {t('viewDetails')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

