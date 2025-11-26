import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  BarChartOutlined, 
  TeamOutlined, 
  CarOutlined,
  GlobalOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  LoginOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { mockArrivalGroups } from '../../data/mockReception';
import { mockDepartureGroups, mockDepartureKPI } from '../../data/mockDepartures';
import { mockPortEntries } from '../../data/mockPorts';
import { mockCampaigns } from '../../data/mockCampaigns';
import type { ChartData } from '../../types/reception';

const ReceptionDashboardPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  // Calculate summary statistics from all sections
  const summaryStats = useMemo(() => {
    // Pre-Arrival Stats
    const arrivalGroups = mockArrivalGroups;
    const totalArrivalGroups = arrivalGroups.length;
    const totalArrivalPilgrims = arrivalGroups.reduce((sum, g) => sum + g.pilgrimsCount, 0);
    const arrivalGroupsByStatus = {
      scheduled: arrivalGroups.filter(g => g.status === 'scheduled').length,
      arrived: arrivalGroups.filter(g => g.status === 'arrived').length,
      completed: arrivalGroups.filter(g => g.status === 'completed').length
    };

    // Pre-Departure Stats
    const departureGroups = mockDepartureGroups;
    const totalDepartureGroups = departureGroups.length;
    const totalDeparturePilgrims = departureGroups.reduce((sum, g) => sum + g.pilgrimsCount, 0);
    const departureGroupsByStatus = {
      scheduled: departureGroups.filter(g => g.status === 'scheduled').length,
      arrived: departureGroups.filter(g => g.status === 'arrived').length,
      departed: departureGroups.filter(g => g.status === 'departed').length,
      completed: departureGroups.filter(g => g.status === 'completed').length
    };

    // Ports Stats
    const portEntries = mockPortEntries;
    const totalPortEntries = portEntries.length;
    const airportEntries = portEntries.filter(e => e.portType === 'airport').length;
    const landEntries = portEntries.filter(e => e.portType === 'land').length;
    const portEntriesByStatus = {
      pending: portEntries.filter(e => e.status === 'pending').length,
      confirmed: portEntries.filter(e => e.status === 'confirmed').length,
      completed: portEntries.filter(e => e.status === 'completed').length
    };
    const totalPortPilgrims = portEntries.reduce((sum, e) => sum + (e.groupCount || 0), 0);

    // Campaigns Stats
    const campaigns = mockCampaigns;
    const totalCampaigns = campaigns.length;
    const campaignsByStatus = {
      draft: campaigns.filter(c => c.status === 'draft').length,
      registered: campaigns.filter(c => c.status === 'registered').length,
      completed: campaigns.filter(c => c.status === 'completed').length
    };
    const totalCampaignPilgrims = campaigns.reduce((sum, c) => sum + c.totalPilgrims, 0);
    const registeredCampaignPilgrims = campaigns.reduce((sum, c) => sum + c.registeredPilgrims, 0);

    return {
      preArrival: {
        groups: totalArrivalGroups,
        pilgrims: totalArrivalPilgrims,
        byStatus: arrivalGroupsByStatus
      },
      preDeparture: {
        groups: totalDepartureGroups,
        pilgrims: totalDeparturePilgrims,
        byStatus: departureGroupsByStatus,
        kpi: mockDepartureKPI
      },
      ports: {
        entries: totalPortEntries,
        airport: airportEntries,
        land: landEntries,
        pilgrims: totalPortPilgrims,
        byStatus: portEntriesByStatus
      },
      campaigns: {
        total: totalCampaigns,
        pilgrims: totalCampaignPilgrims,
        registeredPilgrims: registeredCampaignPilgrims,
        byStatus: campaignsByStatus
      }
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
                    {segment.percentage > 8 && (
                      <text
                        x={centerX + (radius * 0.6) * Math.cos(((segment.startAngle + segment.endAngle) / 2 * Math.PI) / 180)}
                        y={centerY + (radius * 0.6) * Math.sin(((segment.startAngle + segment.endAngle) / 2 * Math.PI) / 180)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill="white"
                        className="drop-shadow-sm"
                      >
                        {segment.percentage.toFixed(0)}%
                      </text>
                    )}
                  </g>
                ))}
                <circle cx={centerX} cy={centerY} r="38" fill="white" />
                <text
                  x={centerX}
                  y={centerY - 3}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
                  fontWeight="bold"
                  fill="#1F2937"
                >
                  {total}
                </text>
                <text
                  x={centerX}
                  y={centerY + 9}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="8.5"
                  fill="#6B7280"
                >
                  المجموع
                </text>
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
  const preArrivalStatusData: ChartData = {
    labels: ['مجدولة', 'واصلة', 'مكتملة'],
    values: [
      summaryStats.preArrival.byStatus.scheduled,
      summaryStats.preArrival.byStatus.arrived,
      summaryStats.preArrival.byStatus.completed
    ]
  };

  const preDepartureStatusData: ChartData = {
    labels: ['مجدولة', 'واصلة', 'مغادرة', 'مكتملة'],
    values: [
      summaryStats.preDeparture.byStatus.scheduled,
      summaryStats.preDeparture.byStatus.arrived,
      summaryStats.preDeparture.byStatus.departed,
      summaryStats.preDeparture.byStatus.completed
    ]
  };

  const portsTypeData: ChartData = {
    labels: ['جوية', 'برية'],
    values: [summaryStats.ports.airport, summaryStats.ports.land]
  };

  const portsStatusData: ChartData = {
    labels: ['قيد الانتظار', 'مؤكدة', 'مكتملة'],
    values: [
      summaryStats.ports.byStatus.pending,
      summaryStats.ports.byStatus.confirmed,
      summaryStats.ports.byStatus.completed
    ]
  };

  const campaignsStatusData: ChartData = {
    labels: ['مسودة', 'مسجلة', 'مكتملة'],
    values: [
      summaryStats.campaigns.byStatus.draft,
      summaryStats.campaigns.byStatus.registered,
      summaryStats.campaigns.byStatus.completed
    ]
  };

  const sectionsComparisonData: ChartData = useMemo(() => ({
    labels: [
      t('reception.dashboard.preArrivalTitle') || 'الاستعداد المسبق للوصول',
      t('reception.dashboard.preDepartureTitle') || 'الاستعداد المسبق للمغادرة',
      t('reception.dashboard.portsTitle') || 'المنافذ',
      t('reception.dashboard.campaignsTitle') || 'الحملات'
    ],
    values: [
      summaryStats.preArrival.groups,
      summaryStats.preDeparture.groups,
      summaryStats.ports.entries,
      summaryStats.campaigns.total
    ]
  }), [t, summaryStats]);

  const pilgrimsComparisonData: ChartData = useMemo(() => ({
    labels: [
      t('reception.dashboard.preArrivalTitle') || 'الاستعداد المسبق للوصول',
      t('reception.dashboard.preDepartureTitle') || 'الاستعداد المسبق للمغادرة',
      t('reception.dashboard.portsTitle') || 'المنافذ',
      t('reception.dashboard.campaignsTitle') || 'الحملات'
    ],
    values: [
      summaryStats.preArrival.pilgrims,
      summaryStats.preDeparture.pilgrims,
      summaryStats.ports.pilgrims,
      summaryStats.campaigns.pilgrims
    ]
  }), [t, summaryStats]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('reception.dashboard.title') || 'ملخص قسم الاستقبال'}
              </h1>
              <p className="text-gray-600">
                {t('reception.dashboard.subtitle') || 'نظرة شاملة على جميع الأقسام الفرعية'}
              </p>
            </div>
          </div>
        </div>

        {/* Main KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Pre-Arrival Card */}
          <div
            onClick={() => navigate('/reception/pre-arrival')}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <LoginOutlined className="text-white text-xl" />
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-3 py-1 rounded-full">
                {t('reception.dashboard.preArrivalTitle') || 'الاستعداد المسبق للوصول'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{summaryStats.preArrival.groups}</h3>
            <p className="text-sm text-gray-600 mb-2">{t('reception.dashboard.groups') || 'مجموعات'}</p>
            <div className="flex items-center justify-between pt-3 border-t border-blue-200">
              <span className="text-xs text-gray-600">{t('reception.dashboard.pilgrims') || 'الحجاج'}:</span>
              <span className="text-sm font-bold text-blue-700">{summaryStats.preArrival.pilgrims.toLocaleString()}</span>
            </div>
          </div>

          {/* Pre-Departure Card */}
          <div
            onClick={() => navigate('/reception/pre-arrival/departures')}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border border-purple-200 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <LogoutOutlined className="text-white text-xl" />
              </div>
              <span className="text-xs font-semibold text-purple-700 bg-purple-200 px-3 py-1 rounded-full">
                {t('reception.dashboard.preDepartureTitle') || 'الاستعداد المسبق للمغادرة'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{summaryStats.preDeparture.groups}</h3>
            <p className="text-sm text-gray-600 mb-2">{t('reception.dashboard.groups') || 'مجموعات'}</p>
            <div className="flex items-center justify-between pt-3 border-t border-purple-200">
              <span className="text-xs text-gray-600">{t('reception.dashboard.pilgrims') || 'الحجاج'}:</span>
              <span className="text-sm font-bold text-purple-700">{summaryStats.preDeparture.pilgrims.toLocaleString()}</span>
            </div>
          </div>

          {/* Ports Card */}
          <div
            onClick={() => navigate('/reception/ports')}
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <CarOutlined className="text-white text-xl" />
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-200 px-3 py-1 rounded-full">
                {t('reception.dashboard.portsTitle') || 'المنافذ الجوية والبرية'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{summaryStats.ports.entries}</h3>
            <p className="text-sm text-gray-600 mb-2">{t('reception.dashboard.entries') || 'إدخال'}</p>
            <div className="flex items-center justify-between pt-3 border-t border-green-200">
              <span className="text-xs text-gray-600">{t('reception.dashboard.pilgrims') || 'الحجاج'}:</span>
              <span className="text-sm font-bold text-green-700">{summaryStats.ports.pilgrims.toLocaleString()}</span>
            </div>
          </div>

          {/* Campaigns Card */}
          <div
            onClick={() => navigate('/reception/campaigns')}
            className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 border border-orange-200 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <GlobalOutlined className="text-white text-xl" />
              </div>
              <span className="text-xs font-semibold text-orange-700 bg-orange-200 px-3 py-1 rounded-full">
                {t('reception.dashboard.campaignsTitle') || 'الحملات'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{summaryStats.campaigns.total}</h3>
            <p className="text-sm text-gray-600 mb-2">{t('reception.dashboard.campaign') || 'حملة'}</p>
            <div className="flex items-center justify-between pt-3 border-t border-orange-200">
              <span className="text-xs text-gray-600">{t('reception.dashboard.pilgrims') || 'الحجاج'}:</span>
              <span className="text-sm font-bold text-orange-700">{summaryStats.campaigns.pilgrims.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Section Charts */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('reception.dashboard.sectionCharts') || 'مقارنة بين الأقسام'}
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              data={sectionsComparisonData}
              title={t('reception.dashboard.groupsEntriesBySection') || 'عدد المجموعات/الإدخالات حسب القسم'}
              onClick={() => {}}
            />
            <BarChart
              data={pilgrimsComparisonData}
              title={t('reception.dashboard.pilgrimsBySection') || 'عدد الحجاج حسب القسم'}
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Detailed Section Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pre-Arrival Status */}
          <PieChart
            data={preArrivalStatusData}
            title={t('reception.dashboard.preArrivalStatusTitle') || 'حالة مجموعات الاستعداد المسبق للوصول'}
            onClick={() => navigate('/reception/pre-arrival')}
          />

          {/* Pre-Departure Status */}
          <PieChart
            data={preDepartureStatusData}
            title={t('reception.dashboard.preDepartureStatusTitle') || 'حالة مجموعات الاستعداد المسبق للمغادرة'}
            onClick={() => navigate('/reception/pre-arrival/departures')}
          />

          {/* Ports Type */}
          <PieChart
            data={portsTypeData}
            title={t('reception.dashboard.portsTypeTitle') || 'نوع المنافذ (جوية/برية)'}
            onClick={() => navigate('/reception/ports')}
          />

          {/* Ports Status */}
          <PieChart
            data={portsStatusData}
            title={t('reception.dashboard.portsStatusTitle') || 'حالة إدخالات المنافذ'}
            onClick={() => navigate('/reception/ports')}
          />

          {/* Campaigns Status */}
          <PieChart
            data={campaignsStatusData}
            title={t('reception.dashboard.campaignsStatusTitle') || 'حالة الحملات'}
            onClick={() => navigate('/reception/campaigns')}
          />

          {/* Additional KPI - Pre-Departure */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">{t('reception.dashboard.departureKPITitle') || 'مؤشرات أداء الاستعداد المسبق للمغادرة'}</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">الحجاج الواصلين</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-purple-700">
                    {summaryStats.preDeparture.kpi.arrivedPilgrimsCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    {summaryStats.preDeparture.kpi.arrivedPilgrimsPercentage}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">الحجاج المغادرين</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-700">
                    {summaryStats.preDeparture.kpi.departedPilgrimsCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    {summaryStats.preDeparture.kpi.departedPilgrimsPercentage}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">الحجاج المتوقع وصولهم</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-700">
                    {summaryStats.preDeparture.kpi.expectedArrivalsCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    {summaryStats.preDeparture.kpi.expectedArrivalsPercentage}%
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/reception/pre-arrival/departures')}
              className="w-full mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
            >
              {t('reception.dashboard.viewDetails') || 'عرض التفاصيل'}
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <TeamOutlined className="text-2xl text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">{t('reception.dashboard.totalPilgrims') || 'إجمالي الحجاج'}</p>
                <p className="text-xl font-bold text-gray-900">
                  {(
                    summaryStats.preArrival.pilgrims +
                    summaryStats.preDeparture.pilgrims +
                    summaryStats.ports.pilgrims +
                    summaryStats.campaigns.pilgrims
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <CalendarOutlined className="text-2xl text-green-600" />
              <div>
                <p className="text-sm text-gray-600">{t('reception.dashboard.totalGroupsEntries') || 'إجمالي المجموعات/الإدخالات'}</p>
                <p className="text-xl font-bold text-gray-900">
                  {(
                    summaryStats.preArrival.groups +
                    summaryStats.preDeparture.groups +
                    summaryStats.ports.entries +
                    summaryStats.campaigns.total
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircleOutlined className="text-2xl text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">{t('reception.dashboard.completedCampaigns') || 'الحملات المكتملة'}</p>
                <p className="text-xl font-bold text-gray-900">
                  {summaryStats.campaigns.byStatus.completed}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboardPage;

