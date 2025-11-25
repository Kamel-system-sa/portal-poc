import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  BankOutlined,
  ShopOutlined,
  TeamOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  PieChartOutlined,
  EyeOutlined,
  CloseOutlined,
  NumberOutlined,
  ApartmentOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { mockCenters } from '../../data/mockCenters';
import type { Center } from '../../data/mockCenters';
import type { ChartData } from '../../types/reception';
import { mockArrivalGroups } from '../../data/mockReception';
import { mockDepartureGroups } from '../../data/mockDepartures';
import { mockCampaigns } from '../../data/mockCampaigns';
import { CentersTable } from '../../components/Centers/CentersTable';

const CentersDashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const centers = mockCenters;
    const totalCenters = centers.length;
    const activeCenters = centers.filter(c => c.status === 'active').length;
    const inactiveCenters = centers.filter(c => c.status === 'inactive').length;
    
    const b2bCenters = centers.filter(c => c.serviceType === 'B2B').length;
    const b2cCenters = centers.filter(c => c.serviceType === 'B2C').length;
    const b2gCenters = centers.filter(c => c.serviceType === 'B2G').length;
    
    const totalCapacity = centers.reduce((sum, c) => sum + c.capacity, 0);
    const totalMembers = centers.reduce((sum, c) => sum + c.members.length, 0);
    
    // Locations statistics
    const meccaCount = centers.filter(c => c.locations.mecca).length;
    const minaCount = centers.filter(c => c.locations.mina).length;
    const arafatCount = centers.filter(c => c.locations.arafat).length;
    const muzdalifahCount = centers.filter(c => c.locations.muzdalifah).length;
    
    // Service detail statistics
    const tourismCount = centers.filter(c => c.serviceDetail === 'سياحة').length;
    const missionCount = centers.filter(c => c.serviceDetail === 'بعثة').length;
    
    // Mission nationality statistics
    const missionNationalities = centers
      .filter(c => c.missionNationality)
      .reduce((acc, c) => {
        const nat = c.missionNationality!;
        acc[nat] = (acc[nat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalCenters,
      activeCenters,
      inactiveCenters,
      b2bCenters,
      b2cCenters,
      b2gCenters,
      totalCapacity,
      totalMembers,
      meccaCount,
      minaCount,
      arafatCount,
      muzdalifahCount,
      tourismCount,
      missionCount,
      missionNationalities
    };
  }, []);

  // Chart Components
  const PieChart: React.FC<{ data: ChartData; title: string; onClick?: () => void }> = ({ data, title, onClick }) => {
    const total = data.values.reduce((sum, val) => sum + val, 0);
    const colors = ['#00796B', '#00A896', '#4ECDC4', '#26A69A', '#10B981', '#059669'];
    const radius = 65;
    const centerX = 100;
    const centerY = 100;
    let currentAngle = -90;
    
    const segments = data.values.map((value, index) => {
      const percentage = total > 0 ? (value / total) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      currentAngle += angle;
      
      return {
        path: pathData,
        percentage,
        value,
        label: data.labels[index],
        color: colors[index % colors.length],
        startAngle,
        endAngle
      };
    });
    
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
        style={{ minHeight: '280px' }}
      >
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h4 className="text-lg font-bold text-gray-900">{title}</h4>
          {total > 0 && (
            <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md">
              إجمالي: {total}
            </span>
          )}
        </div>
        {total > 0 ? (
          <div className="flex items-center justify-between gap-4 flex-1">
            <div className="flex-shrink-0" style={{ width: '140px', height: '140px' }}>
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {segments.map((segment, index) => (
                  <g key={index}>
                    <path
                      d={segment.path}
                      fill={segment.color}
                      stroke="white"
                      strokeWidth="2.5"
                      className="hover:opacity-80 transition-opacity"
                    />
                  </g>
                ))}
                <circle cx={centerX} cy={centerY} r="38" fill="white" />
              </svg>
            </div>
            
            <div className="flex-1 space-y-3">
              {segments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div 
                      className="w-4 h-4 rounded flex-shrink-0" 
                      style={{ backgroundColor: segment.color }}
                    ></div>
                    <span className="text-sm font-semibold text-gray-900 truncate">{segment.label}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                      {segment.percentage.toFixed(1)}%
                    </span>
                    <span className="text-sm font-bold text-gray-900 min-w-[2rem] text-left">
                      {segment.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChartOutlined className="text-gray-300 text-3xl mx-auto mb-2" />
            <p className="text-xs text-gray-400">لا توجد بيانات</p>
          </div>
        )}
      </div>
    );
  };

  const BarChart: React.FC<{ data: ChartData; title: string; onClick?: () => void }> = ({ data, title, onClick }) => {
    const maxValue = Math.max(...data.values, 1);
    const total = data.values.reduce((sum, val) => sum + val, 0);
    const colors = ['#00796B', '#00A896', '#4ECDC4', '#26A69A', '#10B981'];
    
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
        style={{ minHeight: '280px' }}
      >
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h4 className="text-lg font-bold text-gray-900">{title}</h4>
          {total > 0 && (
            <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md">
              إجمالي: {total}
            </span>
          )}
        </div>
        {total > 0 ? (
          <div className="space-y-3 pb-0 flex-1">
            {data.labels.map((label, index) => {
              const value = data.values[index];
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              const barWidth = (value / maxValue) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div 
                        className="w-3.5 h-3.5 rounded flex-shrink-0" 
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <span className="text-sm font-semibold text-gray-900 truncate">{label}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                        {percentage}%
                      </span>
                      <span className="text-sm font-bold text-gray-900 min-w-[2rem] text-left">
                        {value}
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${barWidth}%`,
                        backgroundColor: colors[index % colors.length],
                        boxShadow: `0 2px 4px ${colors[index % colors.length]}40`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChartOutlined className="text-gray-300 text-3xl mx-auto mb-2" />
            <p className="text-xs text-gray-400">لا توجد بيانات</p>
          </div>
        )}
      </div>
    );
  };

  // Prepare chart data
  const serviceTypeData: ChartData = {
    labels: ['B2B', 'B2C', 'B2G'],
    values: [summaryStats.b2bCenters, summaryStats.b2cCenters, summaryStats.b2gCenters]
  };

  const statusData: ChartData = {
    labels: ['نشط', 'غير نشط'],
    values: [summaryStats.activeCenters, summaryStats.inactiveCenters]
  };

  const locationsData: ChartData = {
    labels: ['مكة', 'منى', 'عرفات', 'مزدلفة'],
    values: [summaryStats.meccaCount, summaryStats.minaCount, summaryStats.arafatCount, summaryStats.muzdalifahCount]
  };

  const serviceDetailData: ChartData = {
    labels: ['سياحة', 'بعثة'],
    values: [summaryStats.tourismCount, summaryStats.missionCount]
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('reception.centersDashboard.title') || 'لوحة تحكم المراكز'}
            </h1>
            <p className="text-gray-600">
              {t('reception.centersDashboard.subtitle') || 'نظرة شاملة على جميع بيانات المراكز'}
            </p>
          </div>
        </div>

        {/* Main KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {/* Total Centers */}
          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-cyan-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
              <BankOutlined className="text-lg text-cyan-600" />
            </div>
            <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('centers.totalCenters')}</h4>
            <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{summaryStats.totalCenters}</span>
            <div className="mt-2 w-10 h-0.5 bg-cyan-600 rounded-full flex-shrink-0"></div>
          </div>

          {/* Total Capacity */}
          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-emerald-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
              <TeamOutlined className="text-lg text-emerald-600" />
            </div>
            <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('reception.centersDashboard.totalCapacity') || 'إجمالي الطاقة'}</h4>
            <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{summaryStats.totalCapacity.toLocaleString()}</span>
            <div className="mt-2 w-10 h-0.5 bg-emerald-600 rounded-full flex-shrink-0"></div>
          </div>

          {/* Total Members */}
          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-violet-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
              <UserOutlined className="text-lg text-violet-600" />
            </div>
            <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('reception.centersDashboard.totalMembers') || 'إجمالي الأعضاء'}</h4>
            <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{summaryStats.totalMembers}</span>
            <div className="mt-2 w-10 h-0.5 bg-violet-600 rounded-full flex-shrink-0"></div>
          </div>

          {/* Active Centers */}
          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-amber-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
              <CheckCircleOutlined className="text-lg text-amber-600" />
            </div>
            <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('reception.centersDashboard.activeCenters') || 'مراكز نشطة'}</h4>
            <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{summaryStats.activeCenters}</span>
            <div className="mt-2 w-10 h-0.5 bg-amber-600 rounded-full flex-shrink-0"></div>
          </div>
        </div>

        {/* Service Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-indigo-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
              <ShopOutlined className="text-lg text-indigo-600" />
            </div>
            <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('centers.b2bCenters')}</h4>
            <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{summaryStats.b2bCenters}</span>
            <div className="mt-2 w-10 h-0.5 bg-indigo-600 rounded-full flex-shrink-0"></div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-emerald-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
              <TeamOutlined className="text-lg text-emerald-600" />
            </div>
            <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('centers.b2cCenters')}</h4>
            <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{summaryStats.b2cCenters}</span>
            <div className="mt-2 w-10 h-0.5 bg-emerald-600 rounded-full flex-shrink-0"></div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-teal-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
              <GlobalOutlined className="text-lg text-teal-600" />
            </div>
            <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('centers.b2gCenters')}</h4>
            <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{summaryStats.b2gCenters}</span>
            <div className="mt-2 w-10 h-0.5 bg-teal-600 rounded-full flex-shrink-0"></div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('reception.centersDashboard.charts') || 'التحليلات والإحصائيات'}
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChart
              data={serviceTypeData}
              title={t('reception.centersDashboard.serviceTypeDistribution') || 'توزيع أنواع الخدمة'}
              onClick={() => navigate('/service-centers')}
            />
            <PieChart
              data={statusData}
              title={t('reception.centersDashboard.statusDistribution') || 'توزيع الحالة'}
              onClick={() => navigate('/service-centers')}
            />
            <BarChart
              data={locationsData}
              title={t('reception.centersDashboard.locationsDistribution') || 'توزيع المواقع'}
              onClick={() => navigate('/service-centers')}
            />
            <PieChart
              data={serviceDetailData}
              title={t('reception.centersDashboard.serviceDetailDistribution') || 'توزيع تفاصيل الخدمة'}
              onClick={() => navigate('/service-centers')}
            />
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <EnvironmentOutlined className="text-2xl text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">{t('form.mecca')}</p>
                <p className="text-xl font-bold text-gray-900">{summaryStats.meccaCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <EnvironmentOutlined className="text-2xl text-green-600" />
              <div>
                <p className="text-sm text-gray-600">{t('form.mina')}</p>
                <p className="text-xl font-bold text-gray-900">{summaryStats.minaCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <EnvironmentOutlined className="text-2xl text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">{t('form.arafat')}</p>
                <p className="text-xl font-bold text-gray-900">{summaryStats.arafatCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <EnvironmentOutlined className="text-2xl text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">{t('form.muzdalifah')}</p>
                <p className="text-xl font-bold text-gray-900">{summaryStats.muzdalifahCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Centers List Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('reception.centersDashboard.centersList') || 'قائمة المراكز'}
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6">
            <CentersTable
              centers={mockCenters}
              onSelectCenter={setSelectedCenter}
            />
          </div>
        </div>
      </div>

      {/* Center Reception Details Modal */}
      {selectedCenter && (() => {
        // Find related campaigns, arrivals, and departures
        // We'll link them by organizer number or center number
        const centerNumber = selectedCenter.number;
        
        // Get campaigns (we'll simulate linking by center number)
        const relatedCampaigns = mockCampaigns.filter((campaign, index) => {
          // Simulate linking: first few campaigns for first centers
          const centerIndex = mockCenters.findIndex(c => c.id === selectedCenter.id);
          return index % 3 === centerIndex % 3 || index === centerIndex;
        }).slice(0, 3);

        // Get arrival groups related to campaigns
        const relatedArrivals = mockArrivalGroups.filter(arrival => 
          relatedCampaigns.some(camp => camp.campaignNumber === arrival.campaignNumber)
        );

        // Get departure groups related to campaigns
        const relatedDepartures = mockDepartureGroups.filter(departure =>
          relatedCampaigns.some(camp => camp.campaignNumber === departure.campaignNumber)
        );

        // Calculate statistics
        const totalArrivals = relatedArrivals.length;
        const totalArrivalPilgrims = relatedArrivals.reduce((sum, a) => sum + a.pilgrimsCount, 0);
        const arrivedPilgrims = relatedArrivals.reduce((sum, a) => sum + a.arrivedCount, 0);
        
        const totalDepartures = relatedDepartures.length;
        const totalDeparturePilgrims = relatedDepartures.reduce((sum, d) => sum + d.pilgrimsCount, 0);
        const departedPilgrims = relatedDepartures.filter(d => d.status === 'departed' || d.status === 'completed').length;

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              if (e.target === e.currentTarget) setSelectedCenter(null);
            }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-6xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
              <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-gray-200 bg-gradient-to-r from-mainColor to-primary">
                <div>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-white truncate pr-2">
                    {t('reception.centersDashboard.centerReceptionDetails') || 'تفاصيل المركز - الاستقبال'} - {selectedCenter.number}
                  </h2>
                  <p className="text-sm text-white/90 mt-1">{selectedCenter.responsible.name}</p>
                </div>
                <button
                  onClick={() => setSelectedCenter(null)}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition flex-shrink-0"
                  aria-label={t('ariaLabels.closeModal')}
                >
                  <CloseOutlined className="text-lg" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(95vh-100px)] p-3 sm:p-4 md:p-6 bg-gray-50">
                {/* Center Basic Info */}
                <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                    <h3 className="text-xl font-bold text-gray-900">{t('reception.centersDashboard.centerInfo') || 'معلومات المركز'}</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t('centers.serviceType')}</p>
                      <p className="text-sm font-bold text-gray-900">{selectedCenter.serviceType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t('centers.capacity')}</p>
                      <p className="text-sm font-bold text-gray-900">{selectedCenter.capacity.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t('centers.status')}</p>
                      <p className={`text-sm font-bold ${selectedCenter.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedCenter.status === 'active' ? t('centers.active') : t('centers.inactive')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t('centers.responsible')}</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{selectedCenter.responsible.name}</p>
                    </div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <GlobalOutlined className="text-blue-600" />
                      <p className="text-xs text-gray-600">{t('reception.centersDashboard.totalCampaigns') || 'إجمالي الحملات'}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{relatedCampaigns.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircleOutlined className="text-green-600" />
                      <p className="text-xs text-gray-600">{t('reception.centersDashboard.arrivalGroups') || 'مجموعات الوصول'}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totalArrivals}</p>
                    <p className="text-xs text-gray-600 mt-1">{arrivedPilgrims.toLocaleString()} {t('reception.dashboard.pilgrims') || 'حاج'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CloseCircleOutlined className="text-purple-600" />
                      <p className="text-xs text-gray-600">{t('reception.centersDashboard.departureGroups') || 'مجموعات المغادرة'}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totalDepartures}</p>
                    <p className="text-xs text-gray-600 mt-1">{totalDeparturePilgrims.toLocaleString()} {t('reception.dashboard.pilgrims') || 'حاج'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TeamOutlined className="text-orange-600" />
                      <p className="text-xs text-gray-600">{t('reception.centersDashboard.totalPilgrims') || 'إجمالي الحجاج'}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{(totalArrivalPilgrims + totalDeparturePilgrims).toLocaleString()}</p>
                  </div>
                </div>

                {/* Campaigns Section */}
                <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                      <h3 className="text-xl font-bold text-gray-900">{t('reception.campaigns.title') || 'الحملات المرتبطة'}</h3>
                    </div>
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {relatedCampaigns.length} {t('reception.dashboard.campaign') || 'حملة'}
                    </span>
                  </div>
                  {relatedCampaigns.length > 0 ? (
                    <div className="space-y-3">
                      {relatedCampaigns.map((campaign) => (
                        <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-bold text-gray-900">{campaign.campaignNumber}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  campaign.status === 'registered' ? 'bg-green-100 text-green-700' :
                                  campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {campaign.status === 'registered' ? t('reception.campaigns.status.registered') || 'مسجل' :
                                   campaign.status === 'completed' ? t('reception.campaigns.status.completed') || 'مكتمل' :
                                   t('reception.campaigns.status.draft') || 'مسودة'}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-gray-800 mb-1">{campaign.campaignName}</p>
                              <p className="text-xs text-gray-600 mb-2">{campaign.organizerName} - {campaign.organizerCompany}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-600">
                                <span>{t('reception.campaigns.details.totalPilgrims') || 'إجمالي الحجاج'}: <strong className="text-gray-900">{campaign.totalPilgrims}</strong></span>
                                <span>{t('reception.campaigns.details.registeredPilgrims') || 'المسجلين'}: <strong className="text-gray-900">{campaign.registeredPilgrims}</strong></span>
                                <span>{t('reception.campaigns.details.registrationPercentage') || 'نسبة التسجيل'}: <strong className="text-gray-900">{campaign.registrationPercentage}%</strong></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <GlobalOutlined className="text-gray-300 text-3xl mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{t('reception.centersDashboard.noCampaigns') || 'لا توجد حملات مرتبطة'}</p>
                    </div>
                  )}
                </div>

                {/* Arrivals Section */}
                <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                      <h3 className="text-xl font-bold text-gray-900">{t('reception.preArrival.arrivals.title') || 'مجموعات الوصول'}</h3>
                    </div>
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {totalArrivals} {t('reception.dashboard.groups') || 'مجموعة'}
                    </span>
                  </div>
                  {relatedArrivals.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {relatedArrivals.map((arrival) => (
                        <div key={arrival.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-bold text-gray-900">{arrival.groupNumber}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  arrival.status === 'arrived' ? 'bg-green-100 text-green-700' :
                                  arrival.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {arrival.status === 'arrived' ? t('reception.preArrival.status.arrived') || 'وصلت' :
                                   arrival.status === 'completed' ? t('reception.preArrival.status.completed') || 'مكتملة' :
                                   t('reception.preArrival.status.scheduled') || 'مجدولة'}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-gray-800 mb-1">{arrival.groupName}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-600">
                                <span>{t('reception.preArrival.table.arrivalDate') || 'تاريخ الوصول'}: <strong className="text-gray-900">{arrival.arrivalDate}</strong></span>
                                <span>{t('reception.preArrival.table.arrivalTime') || 'وقت الوصول'}: <strong className="text-gray-900">{arrival.arrivalTime}</strong></span>
                                {arrival.flightNumber && <span>{t('reception.preArrival.table.flightNumber') || 'رقم الرحلة'}: <strong className="text-gray-900">{arrival.flightNumber}</strong></span>}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                                <span>{t('reception.preArrival.table.pilgrimsCount') || 'عدد الحجاج'}: <strong className="text-gray-900">{arrival.pilgrimsCount}</strong></span>
                                <span>{t('reception.preArrival.table.arrivedCount') || 'الواصلين'}: <strong className="text-gray-900">{arrival.arrivedCount}</strong></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircleOutlined className="text-gray-300 text-3xl mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{t('reception.centersDashboard.noArrivals') || 'لا توجد مجموعات وصول'}</p>
                    </div>
                  )}
                </div>

                {/* Departures Section */}
                <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                      <h3 className="text-xl font-bold text-gray-900">{t('reception.preArrival.departures.title') || 'مجموعات المغادرة'}</h3>
                    </div>
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {totalDepartures} {t('reception.dashboard.groups') || 'مجموعة'}
                    </span>
                  </div>
                  {relatedDepartures.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {relatedDepartures.map((departure) => (
                        <div key={departure.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-bold text-gray-900">{departure.campaignNumber}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  departure.status === 'departed' ? 'bg-green-100 text-green-700' :
                                  departure.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                  departure.status === 'arrived' ? 'bg-purple-100 text-purple-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {departure.status === 'departed' ? t('reception.preArrival.departures.dashboard.departedPilgrimsCount') || 'مغادرة' :
                                   departure.status === 'completed' ? t('reception.preArrival.status.completed') || 'مكتملة' :
                                   departure.status === 'arrived' ? t('reception.preArrival.status.arrived') || 'واصلة' :
                                   t('reception.preArrival.status.scheduled') || 'مجدولة'}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-gray-800 mb-1">{departure.organizerName}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-600">
                                <span>{t('reception.preArrival.departures.form.step1.departureDate') || 'تاريخ المغادرة'}: <strong className="text-gray-900">{departure.departureDate}</strong></span>
                                <span>{t('reception.preArrival.departures.form.step1.departureTime') || 'وقت المغادرة'}: <strong className="text-gray-900">{departure.departureTime}</strong></span>
                                <span>{t('reception.preArrival.departures.form.step1.departurePoint') || 'نقطة الانطلاق'}: <strong className="text-gray-900">{departure.departurePoint === 'makkah' ? t('form.mecca') || 'مكة' : t('housing.madinah') || 'المدينة'}</strong></span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                                <span>{t('reception.preArrival.table.pilgrimsCount') || 'عدد الحجاج'}: <strong className="text-gray-900">{departure.pilgrimsCount}</strong></span>
                                <span>{t('reception.preArrival.departures.form.step2.arrivalDestination') || 'جهة الوصول'}: <strong className="text-gray-900">{departure.arrivalDestination}</strong></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CloseCircleOutlined className="text-gray-300 text-3xl mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{t('reception.centersDashboard.noDepartures') || 'لا توجد مجموعات مغادرة'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default CentersDashboardPage;

