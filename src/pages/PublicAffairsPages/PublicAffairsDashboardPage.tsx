import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { HousingStatsCard } from '../../components/HousingComponent/HousingStatsCard';
import { CaseDetailsModal } from '../../components/PublicAffairs/CaseDetailsModal';
import { CasesListModal } from '../../components/PublicAffairs/CasesListModal';
import { 
  HomeOutlined, 
  UserOutlined,
  HeartOutlined,
  FileTextOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  WarningOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { 
  getDeathCasesCount, 
  getHospitalizedCasesCount, 
  getOtherIncidentsCount,
  getTotalCasesCount,
  getTodayDeathCases,
  getTodayHospitalizedCases,
  getTodayOtherIncidents,
  getCasesByNationality,
  getCasesByLocation,
  getCompletedDeathCasesCount,
  getCompletedHospitalizedCasesCount,
  getCompletedOtherIncidentsCount,
  getRecentAllCases,
  getCompletedDeathCases,
  getCompletedHospitalizedCases,
  getCompletedOtherIncidents,
  getCasesByNationalityList,
  getCasesByLocationList
} from '../../data/mockPublicAffairs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  primary: '#00796B',
  secondary: '#00A896',
  accent: '#005B4F',
  teal: '#4DB6AC',
  amber: '#FFB74D',
  danger: '#EF4444'
};

const PublicAffairsDashboardPage: React.FC = () => {
  const { t } = useTranslation('PublicAffairs');
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [selectedCaseType, setSelectedCaseType] = useState<'death' | 'hospitalized' | 'other' | null>(null);
  const [nationalityModalOpen, setNationalityModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedNationality, setSelectedNationality] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const totalDeaths = getDeathCasesCount();
  const totalHospitalized = getHospitalizedCasesCount();
  const totalOtherIncidents = getOtherIncidentsCount();
  const totalCases = getTotalCasesCount();
  const todayDeaths = getTodayDeathCases();
  const todayHospitalized = getTodayHospitalizedCases();
  const todayOtherIncidents = getTodayOtherIncidents();
  
  const completedDeaths = getCompletedDeathCasesCount();
  const completedHospitalized = getCompletedHospitalizedCasesCount();
  const completedOtherIncidents = getCompletedOtherIncidentsCount();
  const totalCompleted = completedDeaths + completedHospitalized + completedOtherIncidents;

  const recentCases = getRecentAllCases(10);
  const completedDeathCases = getCompletedDeathCases().slice(0, 5);
  const completedHospitalizedCases = getCompletedHospitalizedCases().slice(0, 5);
  const completedOtherIncidentsList = getCompletedOtherIncidents().slice(0, 5);

  const nationalityStats = getCasesByNationality();
  const locationStats = getCasesByLocation();

  // Chart data for case types
  const caseTypesChartData = useMemo(() => [
    { 
      name: t('deaths'), 
      value: totalDeaths, 
      color: COLORS.danger 
    },
    { 
      name: t('hospitalized'), 
      value: totalHospitalized, 
      color: COLORS.amber 
    },
    { 
      name: t('otherIncidents'), 
      value: totalOtherIncidents, 
      color: COLORS.primary 
    },
  ], [totalDeaths, totalHospitalized, totalOtherIncidents, t]);

  // Chart data for nationality distribution - improved spacing
  const nationalityChartData = useMemo(() => {
    const data = nationalityStats.slice(0, 8).map(stat => ({
      name: tCommon(`nationalities.${stat.nationality}`) || stat.nationality,
      fullName: tCommon(`nationalities.${stat.nationality}`) || stat.nationality,
      value: stat.count,
      color: COLORS.primary
    }));
    return data;
  }, [nationalityStats, t]);

  // Chart data for location distribution
  const locationChartData = useMemo(() => 
    locationStats.map(stat => ({
      name: stat.location,
      value: stat.count,
      color: COLORS.secondary
    })),
    [locationStats]
  );

  // Section Card Component (similar to Housing)
  const SectionCard = ({ 
    title, 
    route,
    icon,
    stats
  }: { 
    title: string; 
    route: string;
    icon: React.ReactNode;
    stats: { total: number; today: number; completed: number };
  }) => {
    const active = stats.total - stats.completed;
    const donutData = [
      { name: t('active'), value: active, fill: COLORS.primary },
      { name: t('completed'), value: stats.completed, fill: COLORS.secondary }
    ];
    const completedPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    const activePercentage = stats.total > 0 ? Math.round((active / stats.total) * 100) : 0;

    return (
      <GlassCard 
        className="p-6 border-2 border-bordergray/50 bg-white/90 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col" 
        onClick={() => navigate(route)}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {icon}
            {title}
          </h3>
          <span className="text-primaryColor transform hover:translate-x-1 transition-transform text-xl">→</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-bordergray">
            <div className="text-xl font-bold text-primaryColor">{stats.total}</div>
            <div className="text-xs text-customgray mt-1">{t('total')}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-bordergray">
            <div className="text-xl font-bold text-secondaryColor">{stats.today}</div>
            <div className="text-xs text-customgray mt-1">{t('today')}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-bordergray">
            <div className="text-xl font-bold text-secondaryColor">{stats.completed}</div>
            <div className="text-xs text-customgray mt-1">{t('completed')}</div>
          </div>
        </div>

        {/* Chart with Legend */}
        <div className="flex gap-4 items-center flex-1">
          <div className="flex-1" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={65}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {donutData.map((item, index) => {
              const total = donutData.reduce((sum, d) => sum + d.value, 0);
              const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: item.fill }}></div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-700">{item.name}</div>
                    <div className="text-xs text-customgray">{item.value} ({percentage}%)</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 overflow-x-hidden">
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 break-words">
                {t('dashboardTitle')}
              </h1>
              <p className="text-customgray text-sm sm:text-base break-words">
                {t('dashboardSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 items-stretch">
          <HousingStatsCard
            title={t('totalCases')}
            value={totalCases}
            icon={<FileTextOutlined />}
            color="mainColor"
          />
          <HousingStatsCard
            title={t('totalDeaths')}
            value={totalDeaths}
            icon={<WarningOutlined />}
            color="danger"
          />
          <HousingStatsCard
            title={t('totalHospitalized')}
            value={totalHospitalized}
            icon={<HeartOutlined />}
            color="warning"
          />
          <HousingStatsCard
            title={t('totalOtherIncidents')}
            value={totalOtherIncidents}
            icon={<FileTextOutlined />}
            color="primaryColor"
          />
        </div>

        {/* 4 Main Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <SectionCard
            title={t('deaths')}
            route="/public-affairs/deaths"
            icon={<WarningOutlined className="text-red-600 text-xl" />}
            stats={{ total: totalDeaths, today: todayDeaths, completed: completedDeaths }}
          />
          <SectionCard
            title={t('hospitalized')}
            route="/public-affairs/hospitalized"
            icon={<HeartOutlined className="text-amber-600 text-xl" />}
            stats={{ total: totalHospitalized, today: todayHospitalized, completed: completedHospitalized }}
          />
          <SectionCard
            title={t('otherIncidents')}
            route="/public-affairs/other-incidents"
            icon={<FileTextOutlined className="text-primaryColor text-xl" />}
            stats={{ total: totalOtherIncidents, today: todayOtherIncidents, completed: completedOtherIncidents }}
          />
          <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
            <div className="flex items-center gap-2 mb-4">
              <ClockCircleOutlined className="text-primaryColor text-xl" />
              <h3 className="text-xl font-bold text-gray-800">
                {t('recentCases')}
              </h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentCases.slice(0, 5).map((caseItem: any) => (
                <div 
                  key={caseItem.id} 
                  className="p-3 bg-gray-50 rounded-lg border border-bordergray cursor-pointer hover:bg-gray-100 hover:border-primaryColor transition-all duration-200"
                  onClick={() => {
                    setSelectedCase(caseItem);
                    setSelectedCaseType(caseItem.type);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 text-sm">{caseItem.name}</div>
                      <div className="text-xs text-customgray mt-1">
                        {caseItem.type === 'death' ? t('deaths') :
                         caseItem.type === 'hospitalized' ? t('hospitalized') :
                         t('otherIncidents')}
                      </div>
                    </div>
                    <div className="text-xs text-customgray">
                      {new Date(caseItem.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {recentCases.length === 0 && (
                <p className="text-customgray text-sm text-center py-4">{t('noRecentCases')}</p>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Completed Cases Section */}
        {totalCompleted > 0 && (
          <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircleOutlined className="text-green-600 text-xl" />
              <h3 className="text-xl font-bold text-gray-800">
                {t('completedCases')}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-customgray">{t('completedDeaths')}</span>
                  <CheckCircleOutlined className="text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{completedDeaths}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-customgray">{t('completedHospitalized')}</span>
                  <CheckCircleOutlined className="text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{completedHospitalized}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-customgray">{t('completedOtherIncidents')}</span>
                  <CheckCircleOutlined className="text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{completedOtherIncidents}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {completedDeathCases.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">{t('recentCompletedDeaths')}</h4>
                  <div className="space-y-2">
                    {completedDeathCases.map((caseItem) => (
                      <div 
                        key={caseItem.id} 
                        className="p-3 bg-gray-50 rounded-lg border border-bordergray cursor-pointer hover:bg-gray-100 hover:border-primaryColor transition-all duration-200"
                        onClick={() => {
                          setSelectedCase({ ...caseItem, type: 'death' });
                          setSelectedCaseType('death');
                        }}
                      >
                        <div className="font-semibold text-gray-800 text-sm">{caseItem.name}</div>
                        <div className="text-xs text-customgray mt-1">{caseItem.nusukCaseNumber}</div>
                        {caseItem.completedAt && (
                          <div className="text-xs text-green-600 mt-1">
                            {t('completedOn')}: {new Date(caseItem.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {completedHospitalizedCases.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">{t('recentCompletedHospitalized')}</h4>
                  <div className="space-y-2">
                    {completedHospitalizedCases.map((caseItem) => (
                      <div 
                        key={caseItem.id} 
                        className="p-3 bg-gray-50 rounded-lg border border-bordergray cursor-pointer hover:bg-gray-100 hover:border-primaryColor transition-all duration-200"
                        onClick={() => {
                          setSelectedCase({ ...caseItem, type: 'hospitalized' });
                          setSelectedCaseType('hospitalized');
                        }}
                      >
                        <div className="font-semibold text-gray-800 text-sm">{caseItem.name}</div>
                        <div className="text-xs text-customgray mt-1">{caseItem.nusukCaseNumber}</div>
                        {caseItem.completedAt && (
                          <div className="text-xs text-green-600 mt-1">
                            {t('completedOn')}: {new Date(caseItem.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {completedOtherIncidentsList.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">{t('recentCompletedIncidents')}</h4>
                  <div className="space-y-2">
                    {completedOtherIncidentsList.map((caseItem) => (
                      <div 
                        key={caseItem.id} 
                        className="p-3 bg-gray-50 rounded-lg border border-bordergray cursor-pointer hover:bg-gray-100 hover:border-primaryColor transition-all duration-200"
                        onClick={() => {
                          setSelectedCase({ ...caseItem, type: 'other' });
                          setSelectedCaseType('other');
                        }}
                      >
                        <div className="font-semibold text-gray-800 text-sm">{caseItem.name}</div>
                        <div className="text-xs text-customgray mt-1">{caseItem.nusukCaseNumber}</div>
                        {caseItem.completedAt && (
                          <div className="text-xs text-green-600 mt-1">
                            {t('completedOn')}: {new Date(caseItem.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* Statistics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Case Types Distribution */}
          <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChartOutlined className="text-primaryColor text-xl" />
              {t('caseTypesDistribution')}
            </h3>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-4 bg-gradient-to-br from-red-100 to-red-50 rounded-lg border border-red-200 text-center">
                <WarningOutlined className="text-red-600 text-2xl mx-auto mb-2" />
                <div className="text-xl font-bold text-red-600 mb-1">{totalDeaths}</div>
                <div className="text-xs text-customgray">{t('deaths')}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg border border-amber-200 text-center">
                <HeartOutlined className="text-amber-600 text-2xl mx-auto mb-2" />
                <div className="text-xl font-bold text-amber-600 mb-1">{totalHospitalized}</div>
                <div className="text-xs text-customgray">{t('hospitalized')}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-primaryColor/10 to-primaryColor/5 rounded-lg border border-primaryColor/20 text-center">
                <FileTextOutlined className="text-primaryColor text-2xl mx-auto mb-2" />
                <div className="text-xl font-bold text-primaryColor mb-1">{totalOtherIncidents}</div>
                <div className="text-xs text-customgray">{t('otherIncidents')}</div>
              </div>
            </div>

            {/* Chart with Legend */}
            <div className="flex flex-col items-center justify-center pt-8 pb-4">
              <div className="w-full flex justify-center" style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={caseTypesChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {caseTypesChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full flex justify-center gap-6 mt-4">
                {caseTypesChartData.map((item, index) => {
                  const total = caseTypesChartData.reduce((sum, d) => sum + d.value, 0);
                  const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                      <div>
                        <div className="text-sm font-semibold text-gray-700">{item.name}</div>
                        <div className="text-xs text-customgray">{item.value} ({percentage}%)</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>

          {/* Nationality Distribution - Improved */}
          <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <GlobalOutlined className="text-primaryColor text-xl" />
              {t('casesByNationality')}
            </h3>
            {nationalityChartData.length > 0 ? (
              <div className="space-y-4">
                <div style={{ height: '250px', marginBottom: '20px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart 
                      data={nationalityChartData} 
                      layout="vertical" 
                      margin={{ left: 80, right: 20, top: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={80}
                        tick={{ fontSize: 11 }}
                        interval={0}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          padding: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill={COLORS.primary} radius={[0, 8, 8, 0]}>
                        {nationalityChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.primary} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {nationalityChartData.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-primaryColor transition-all duration-200 border border-transparent"
                      onClick={() => {
                        setSelectedNationality(nationalityStats[index].nationality);
                        setNationalityModalOpen(true);
                      }}
                    >
                      <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                      <span className="text-sm font-bold text-primaryColor">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-customgray text-sm">{t('noData')}</p>
            )}
          </GlassCard>
        </div>

        {/* Location Distribution - Improved */}
        {locationChartData.length > 0 && (
          <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <EnvironmentOutlined className="text-primaryColor text-xl" />
              {t('casesByLocation')}
            </h3>
            <div className="space-y-4">
              <div style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={locationChartData} margin={{ left: 20, right: 20, top: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11, angle: -45, textAnchor: 'end' }}
                      interval={0}
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      label={{ value: t('casesCount'), angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '8px'
                      }}
                      formatter={(value: any) => [value, t('casesCount')]}
                    />
                    <Bar dataKey="value" fill={COLORS.secondary} radius={[8, 8, 0, 0]}>
                      {locationChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.secondary} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {locationChartData.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-gray-50 rounded-lg border border-bordergray text-center cursor-pointer hover:bg-gray-100 hover:border-primaryColor transition-all duration-200"
                    onClick={() => {
                      setSelectedLocation(locationStats[index].location);
                      setLocationModalOpen(true);
                    }}
                  >
                    <div className="text-xs text-customgray mb-1">{item.name}</div>
                    <div className="text-lg font-bold text-secondaryColor">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Case Details Modal */}
        {selectedCase && selectedCaseType && (
          <CaseDetailsModal
            open={!!selectedCase}
            onClose={() => {
              setSelectedCase(null);
              setSelectedCaseType(null);
            }}
            onDelete={() => {
              // Handle delete if needed
              setSelectedCase(null);
              setSelectedCaseType(null);
            }}
            onComplete={() => {
              // Handle complete if needed
              setSelectedCase(null);
              setSelectedCaseType(null);
            }}
            caseType={selectedCaseType}
            caseData={selectedCase}
          />
        )}

        {/* Cases by Nationality Modal */}
        {selectedNationality && (
          <CasesListModal
            open={nationalityModalOpen}
            onClose={() => {
              setNationalityModalOpen(false);
              setSelectedNationality('');
            }}
            title={`${t('casesByNationality')}: ${tCommon(`nationalities.${selectedNationality}`) || selectedNationality}`}
            cases={getCasesByNationalityList(selectedNationality)}
            onCaseClick={(caseItem, type) => {
              setNationalityModalOpen(false);
              setSelectedCase(caseItem);
              setSelectedCaseType(type);
            }}
          />
        )}

        {/* Cases by Location Modal */}
        {selectedLocation && (
          <CasesListModal
            open={locationModalOpen}
            onClose={() => {
              setLocationModalOpen(false);
              setSelectedLocation('');
            }}
            title={`${t('casesByLocation')}: ${selectedLocation}`}
            cases={getCasesByLocationList(selectedLocation)}
            onCaseClick={(caseItem, type) => {
              setLocationModalOpen(false);
              setSelectedCase(caseItem);
              setSelectedCaseType(type);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PublicAffairsDashboardPage;

