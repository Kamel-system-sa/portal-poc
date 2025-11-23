import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  IdcardOutlined,
  PlusOutlined,
  SearchOutlined,
  InboxOutlined,
  BuildOutlined
} from '@ant-design/icons';
import { PassportKPICards } from '../../components/Passport/PassportKPICards';
import { calculatePassportKPIs } from '../../utils/passportHelpers';
import type { PassportKPI, Pilgrim, StoredPassport } from '../../types/passport';
import Breadcrumb from '../../components/common/Breadcrumb';

// Mock data - will be replaced with API calls
const mockPilgrims: Pilgrim[] = [];
const mockStoredPassports: StoredPassport[] = [];

const PassportDashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';

  const kpi: PassportKPI = useMemo(() => {
    return calculatePassportKPIs(mockPilgrims, mockStoredPassports);
  }, []);

  const handleCardClick = (metric: string) => {
    // Navigate to filtered views based on metric
    console.log('Card clicked:', metric);
  };

  const quickActions = [
    {
      key: 'new',
      title: t('passport.new'),
      icon: <PlusOutlined />,
      onClick: () => navigate('/passport/new'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      key: 'search',
      title: t('passport.search'),
      icon: <SearchOutlined />,
      onClick: () => navigate('/passport/search'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      key: 'storage',
      title: t('passport.storage'),
      icon: <InboxOutlined />,
      onClick: () => navigate('/passport/storage'),
      color: 'from-green-500 to-green-600'
    },
    {
      key: 'builder',
      title: t('passport.storageBuilder'),
      icon: <BuildOutlined />,
      onClick: () => navigate('/passport/storage/builder'),
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 ${isRtl ? 'rtl' : 'ltr'}`}>
      <Breadcrumb />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <IdcardOutlined className="text-3xl sm:text-4xl text-primaryColor" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              {t('passport.title')}
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            {t('passport.dashboard.subtitle')}
          </p>
        </div>

        {/* KPI Cards */}
        <PassportKPICards 
          kpi={kpi} 
          onCardClick={handleCardClick}
          showCenterDistribution={false} // Would be based on user role
        />

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t('passport.dashboard.quickActions')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <div
                key={action.key}
                onClick={action.onClick}
                className={`
                  relative overflow-hidden rounded-xl border border-gray-200
                  bg-gradient-to-br ${action.color} to-white
                  p-6 transition-all duration-300 cursor-pointer
                  hover:shadow-lg hover:scale-[1.02]
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                    <div className="text-2xl text-white">
                      {action.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {action.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t('passport.dashboard.summary')}
          </h2>
          <p className="text-gray-600">
            {t('passport.dashboard.summaryDescription')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PassportDashboardPage;

