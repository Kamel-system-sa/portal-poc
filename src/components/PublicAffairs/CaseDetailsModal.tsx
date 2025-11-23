import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CloseOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined,
  UserOutlined,
  IdcardOutlined,
  GlobalOutlined,
  WarningOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  PictureOutlined,
  NumberOutlined,
  FileTextOutlined,
  HomeOutlined,
  PhoneOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { GlassCard } from '../HousingComponent/GlassCard';
import type { DeathCase, HospitalizedCase, OtherIncident } from '../../data/mockPublicAffairs';

interface CaseDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  onComplete: () => void;
  caseType: 'death' | 'hospitalized' | 'other';
  caseData: DeathCase | HospitalizedCase | OtherIncident | null;
}

export const CaseDetailsModal: React.FC<CaseDetailsModalProps> = ({
  open,
  onClose,
  onDelete,
  onComplete,
  caseType,
  caseData
}) => {
  const { t } = useTranslation('PublicAffairs');
  const { t: tCommon } = useTranslation('common');

  if (!open || !caseData) {
    return null;
  }

  const isCompleted = (caseData as any).completed === true;

  const getCompleteButtonLabel = () => {
    switch (caseType) {
      case 'death':
        return t('markBurialCompleted');
      case 'hospitalized':
        return t('markDischarged');
      case 'other':
        return t('markResolved');
      default:
        return t('markCompleted');
    }
  };

  const getCompleteButtonIcon = () => {
    switch (caseType) {
      case 'death':
        return <CheckCircleOutlined />;
      case 'hospitalized':
        return <CheckCircleOutlined />;
      case 'other':
        return <CheckCircleOutlined />;
      default:
        return <CheckCircleOutlined />;
    }
  };

  const renderDeathCaseDetails = (data: DeathCase) => (
    <div className="space-y-6">
      {/* Personal Information */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('personalInfo')}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <UserOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('name')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.name}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <IdcardOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('passportNumber')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.passportNumber}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GlobalOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('nationality')}</span>
            </div>
            <p className="text-gray-800 font-medium">{tCommon(`nationalities.${data.nationality}`) || data.nationality}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <NumberOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('nusukCaseNumber')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.nusukCaseNumber}</p>
          </div>
        </div>
      </section>

      {/* Death Information */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('deathInfo')}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <WarningOutlined className="text-red-600 text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('causeOfDeath')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.causeOfDeath}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <EnvironmentOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('placeOfDeath')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.placeOfDeath}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CalendarOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('dateOfDeath')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.dateOfDeath}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ClockCircleOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('timeOfDeath')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.timeOfDeath}</p>
          </div>
          {data.imageUrl && (
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <PictureOutlined className="text-mainColor text-base" />
                <span className="text-sm font-semibold text-gray-700">{t('image')}</span>
              </div>
              <img src={data.imageUrl} alt={t('image')} className="w-full max-w-md h-64 object-cover rounded-xl" />
            </div>
          )}
        </div>
      </section>

      {data.completed && data.completedAt && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircleOutlined />
            <span className="font-semibold">{t('burialCompleted')} - {new Date(data.completedAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderHospitalizedCaseDetails = (data: HospitalizedCase) => (
    <div className="space-y-6">
      {/* Personal Information */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('personalInfo')}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <UserOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('pilgrimName')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.name}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <IdcardOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('passportNumber')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.passportNumber}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GlobalOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('nationality')}</span>
            </div>
            <p className="text-gray-800 font-medium">{tCommon(`nationalities.${data.nationality}`) || data.nationality}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <NumberOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('nusukCaseNumber')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.nusukCaseNumber}</p>
          </div>
        </div>
      </section>

      {/* Hospitalization Information */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('hospitalizationInfo')}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HomeOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('hospital')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.hospital}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <WarningOutlined className={`text-base ${
                data.status === 'حرجة' || data.status === 'critical' || data.statusType === 'critical'
                  ? 'text-red-600'
                  : data.status === 'مستقر' || data.status === 'stable' || data.statusType === 'stable'
                  ? 'text-amber-600'
                  : data.status === 'تحسن' || data.status === 'improving' || data.statusType === 'improving'
                  ? 'text-green-600'
                  : 'text-green-600'
              }`} />
              <span className="text-sm font-semibold text-gray-700">{t('status')}</span>
            </div>
            <p className={`font-medium ${
              data.status === 'حرجة' || data.status === 'critical' || data.statusType === 'critical'
                ? 'text-red-600'
                : data.status === 'مستقر' || data.status === 'stable' || data.statusType === 'stable'
                ? 'text-amber-600'
                : data.status === 'تحسن' || data.status === 'improving' || data.statusType === 'improving'
                ? 'text-green-600'
                : 'text-green-600'
            }`}>{data.status}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PhoneOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('contactDelegate')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.contactDelegate}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CalendarOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('createdAt')}</span>
            </div>
            <p className="text-gray-800 font-medium">{new Date(data.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <FileTextOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('detailedReport')}</span>
            </div>
            <p className="text-gray-800 bg-gray-50 p-4 rounded-xl">{data.detailedReport}</p>
          </div>
        </div>
      </section>

      {data.completed && data.completedAt && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircleOutlined />
            <span className="font-semibold">{t('discharged')} - {new Date(data.completedAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderOtherIncidentDetails = (data: OtherIncident) => (
    <div className="space-y-6">
      {/* Personal Information */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('personalInfo')}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <UserOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('name')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.name}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <IdcardOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('passportNumber')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.passportNumber}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GlobalOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('nationality')}</span>
            </div>
            <p className="text-gray-800 font-medium">{tCommon(`nationalities.${data.nationality}`) || data.nationality}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <NumberOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('nusukCaseNumber')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.nusukCaseNumber}</p>
          </div>
        </div>
      </section>

      {/* Incident Information */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('incidentInfo')}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <WarningOutlined className={`text-base ${data.incidentType === 'arrest' ? 'text-red-600' : 'text-amber-600'}`} />
              <span className="text-sm font-semibold text-gray-700">{t('incidentType')}</span>
            </div>
            <p className={`font-medium ${data.incidentType === 'arrest' ? 'text-red-600' : 'text-amber-600'}`}>
              {data.incidentType === 'missing' ? t('missing') : 
               data.incidentType === 'arrest' ? t('arrest') :
               t('lostPassport')}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <NumberOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('organizerNumber')}</span>
            </div>
            <p className="text-gray-800 font-medium">{data.organizerNumber}</p>
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <FileTextOutlined className="text-mainColor text-base" />
              <span className="text-sm font-semibold text-gray-700">{t('description')}</span>
            </div>
            <p className="text-gray-800 bg-gray-50 p-4 rounded-xl">{data.description || t('noDescription')}</p>
          </div>
        </div>
      </section>

      {data.completed && data.completedAt && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircleOutlined />
            <span className="font-semibold">{t('resolved')} - {new Date(data.completedAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );

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
      <div className="relative w-full max-w-5xl max-h-[95vh] bg-white rounded-xl shadow-2xl overflow-hidden z-10 transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-bordergray bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-2xl font-bold text-gray-800">
            {caseType === 'death' ? t('deathCaseDetails') :
             caseType === 'hospitalized' ? t('hospitalizedCaseDetails') :
             t('incidentDetails')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-customgray hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            <CloseOutlined className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] p-6">
          {caseType === 'death' && renderDeathCaseDetails(caseData as DeathCase)}
          {caseType === 'hospitalized' && renderHospitalizedCaseDetails(caseData as HospitalizedCase)}
          {caseType === 'other' && renderOtherIncidentDetails(caseData as OtherIncident)}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-bordergray bg-gray-50">
          <button
            onClick={onDelete}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:shadow-lg transition-all duration-200 font-semibold flex items-center gap-2"
          >
            <DeleteOutlined />
            {t('delete')}
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
            >
              {t('close')}
            </button>
            {!isCompleted && (
              <button
                onClick={onComplete}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg hover:shadow-green-600/30 transition-all duration-200 font-semibold flex items-center gap-2"
              >
                {getCompleteButtonIcon()}
                {getCompleteButtonLabel()}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

