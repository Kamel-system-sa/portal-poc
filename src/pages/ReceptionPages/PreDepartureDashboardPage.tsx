import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { PlusOutlined, UploadOutlined, BarChartOutlined, OrderedListOutlined, HomeOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import type { DepartureDashboardKPI, ChartData, DepartureGroup } from '../../types/reception';
import { PreDepartureKPICards } from '../../components/Reception/PreDepartureKPICards';
import { DepartureRegistrationForm } from '../../components/Reception/DepartureRegistrationForm';
import { DepartureExcelUpload } from '../../components/Reception/DepartureExcelUpload';
import { DepartureGroupsList } from '../../components/Reception/DepartureGroupsList';
import { DepartureDetailsModal } from '../../components/Reception/DepartureDetailsModal';
import DepartureNationalityStatistics from '../../components/Reception/DepartureNationalityStatistics';
import { mockDepartureGroups } from '../../data/mockDepartures';
import { mockOrganizers, mockNationalityStatistics } from '../../data/mockReception';
import { mockCampaigns } from '../../data/mockCampaigns';

const PreDepartureDashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'dashboard' | 'table'>(
    location.pathname.includes('/list') ? 'table' : 'dashboard'
  );
  
  // Modals states
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);
  const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false);
  const [departureGroups, setDepartureGroups] = useState(mockDepartureGroups);
  const [selectedDepartureGroup, setSelectedDepartureGroup] = useState<DepartureGroup | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Update view mode when URL changes
  useEffect(() => {
    if (location.pathname.includes('/list')) {
      setViewMode('table');
    } else {
      setViewMode('dashboard');
    }
  }, [location.pathname]);

  // Calculate KPI from actual departure groups data
  const calculatedKPI: DepartureDashboardKPI = useMemo(() => {
    const registeredPilgrimsInCenter = 5000; // Base number from system
    const departedPilgrimsCount = departureGroups.filter(g => g.status === 'departed' || g.status === 'completed').reduce((sum, g) => sum + g.pilgrimsCount, 0);
    const uniqueOrganizers = new Set(departureGroups.map(g => g.organizerId));
    const uniqueCampaigns = new Set(departureGroups.map(g => g.campaignNumber));
    const pilgrimsInMakkah = departureGroups.filter(g => g.departurePoint === 'makkah').reduce((sum, g) => sum + g.pilgrimsCount, 0);
    const pilgrimsInMadinah = departureGroups.filter(g => g.departurePoint === 'madinah').reduce((sum, g) => sum + g.pilgrimsCount, 0);
    
    return {
      registeredPilgrimsInCenter,
      arrivedPilgrimsCount: 0,
      arrivedPilgrimsPercentage: 0,
      organizersCount: uniqueOrganizers.size || mockOrganizers.length,
      pilgrimsInMakkah,
      registeredCampaigns: uniqueCampaigns.size || mockCampaigns.length,
      pilgrimsInMadinah,
      expectedArrivalsCount: 0,
      expectedArrivalsPercentage: 0,
      departedPilgrimsCount,
      departedPilgrimsPercentage: registeredPilgrimsInCenter > 0 ? Math.round((departedPilgrimsCount / registeredPilgrimsInCenter) * 100 * 10) / 10 : 0
    };
  }, [departureGroups]);

  // Use calculated KPI or fallback to mock
  const displayKPI = calculatedKPI;

  // Pie Chart Component for Percentages - Enhanced Design
  const PieChart: React.FC<{ data: ChartData; title: string; onClick?: () => void }> = ({ data, title, onClick }) => {
    const total = data.values.reduce((sum, val) => sum + val, 0);
    const colors = ['#00796B', '#00A896', '#4ECDC4', '#26A69A'];
    const radius = 80; // Larger radius for better visibility
    const centerX = 120;
    const centerY = 120;
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
        className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
        style={{ minHeight: '320px' }}
      >
        <div className="flex items-center justify-between mb-5 flex-shrink-0">
          <h4 className="text-xl font-bold text-gray-900 line-clamp-2">{title}</h4>
          {total > 0 && (
            <span className="text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
              إجمالي: {total}
            </span>
          )}
        </div>
        {total > 0 ? (
          <div className="flex flex-col items-center gap-5 flex-1">
            <div className="flex-shrink-0" style={{ width: '240px', height: '240px' }}>
              <svg viewBox="0 0 240 240" className="w-full h-full">
                {segments.map((segment, index) => (
                  <g key={index}>
                    <path
                      d={segment.path}
                      fill={segment.color}
                      stroke="white"
                      strokeWidth="3"
                      className="hover:opacity-90 hover:brightness-110 transition-all duration-200"
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                    />
                  </g>
                ))}
                <circle cx={centerX} cy={centerY} r="45" fill="white" stroke="#E5E7EB" strokeWidth="2" />
              </svg>
            </div>
            
            <div className="w-full space-y-3 mt-auto pt-4 border-t border-gray-100">
              {segments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div 
                      className="w-4 h-4 rounded-md flex-shrink-0 shadow-sm" 
                      style={{ backgroundColor: segment.color }}
                    ></div>
                    <span className="text-base font-semibold text-gray-900 truncate">{segment.label}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                      {segment.percentage.toFixed(1)}%
                    </span>
                    <span className="text-base font-bold text-gray-900 min-w-[2.5rem] text-left">
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

  // Enhanced Bar Chart Component
  const SimpleChart: React.FC<{ data: ChartData; title: string; onClick?: () => void }> = ({ data, title, onClick }) => {
    const total = data.values.reduce((sum, val) => sum + val, 0);
    const colors = ['#00796B', '#00A896', '#4ECDC4', '#26A69A'];
    
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
        style={{ minHeight: '240px' }}
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
              const valuePercentage = total > 0 ? ((data.values[index] / total) * 100).toFixed(1) : 0;
              const isLast = index === data.labels.length - 1;
              return (
                <div key={index} className={isLast ? 'mb-0' : ''}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div 
                        className="w-3.5 h-3.5 rounded flex-shrink-0" 
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <span className="text-sm font-semibold text-gray-900 truncate">{label}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                        {valuePercentage}%
                      </span>
                      <span className="text-sm font-bold text-gray-900 min-w-[2rem] text-left">
                        {data.values[index]}
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${valuePercentage}%`,
                        backgroundColor: colors[index % colors.length],
                        boxShadow: `0 1px 3px ${colors[index % colors.length]}30`
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
        {onClick && total > 0 && (
          <p className="text-xs text-gray-400 mt-3 text-center">{t('reception.preArrival.dashboard.clickToView') || 'انقر لعرض القائمة المفلترة'}</p>
        )}
      </div>
    );
  };


  // Calculate chart data from actual departure groups
  const departedPilgrimsData: ChartData = useMemo(() => ({
    labels: ['مغادرين', 'غير مغادرين'],
    values: [
      displayKPI.departedPilgrimsCount,
      Math.max(0, displayKPI.registeredPilgrimsInCenter - displayKPI.departedPilgrimsCount)
    ]
  }), [displayKPI]);

  // Departures by destination (departure point)
  const departuresByDestinationData: ChartData = useMemo(() => ({
    labels: ['مكة', 'المدينة'],
    values: [
      departureGroups.filter(g => g.departurePoint === 'makkah').length,
      departureGroups.filter(g => g.departurePoint === 'madinah').length
    ]
  }), [departureGroups]);

  // Departures by campaign
  const departuresByCampaignData: ChartData = useMemo(() => {
    const campaignGroups = departureGroups.reduce((acc, group) => {
      const campaign = group.campaignNumber || 'بدون حملة';
      acc[campaign] = (acc[campaign] || 0) + group.pilgrimsCount;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      labels: Object.keys(campaignGroups).slice(0, 5),
      values: Object.values(campaignGroups).slice(0, 5)
    };
  }, [departureGroups]);


  // Upcoming departures - from actual groups data
  const upcomingDepartures = useMemo(() => {
    return departureGroups
      .filter(g => g.status === 'scheduled' && new Date(g.departureDate) >= new Date())
      .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
      .slice(0, 5);
  }, [departureGroups]);

  // Accommodations usage - calculated from actual departure groups
  const accommodationsUsage = useMemo(() => {
    const accommodationMap = new Map<string, { name: string; pilgrims: number }>();
    departureGroups.forEach(group => {
      group.accommodations.forEach(acc => {
        const existing = accommodationMap.get(acc.accommodationId) || { name: acc.accommodationName, pilgrims: 0 };
        existing.pilgrims += acc.pilgrimsDeparting;
        accommodationMap.set(acc.accommodationId, existing);
      });
    });
    
    return Array.from(accommodationMap.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        pilgrims: data.pilgrims,
        capacity: Math.ceil(data.pilgrims / 0.75),
        occupied: data.pilgrims,
        percentage: Math.min(100, Math.round((data.pilgrims / Math.ceil(data.pilgrims / 0.75)) * 100))
      }))
      .sort((a, b) => b.pilgrims - a.pilgrims)
      .slice(0, 5);
  }, [departureGroups]);

  // Recent entries
  const recentEntries = useMemo(() => {
    return departureGroups
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [departureGroups]);

  const handleAddDeparture = () => {
    setIsRegistrationFormOpen(true);
  };

  const handleUploadExcel = () => {
    setIsExcelUploadOpen(true);
  };

  const handleRegistrationComplete = (data: any) => {
    // Add new departure group
    const newGroup = {
      id: `dep-${Date.now()}`,
      ...data,
      status: 'scheduled' as const,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDepartureGroups([...departureGroups, newGroup]);
    setIsRegistrationFormOpen(false);
  };

  const handleExcelUploadComplete = (data: any[]) => {
    // Process uploaded data and create departure groups
    const newGroups: DepartureGroup[] = data.map((row, index) => ({
      id: `dep-excel-${Date.now()}-${index}`,
      organizerId: `org-${index + 1}`, // Would come from actual organizer lookup
      organizerNumber: row.organizerNumber,
      organizerName: row.organizerName,
      organizerCompany: row.organizerCompany,
      organizerNationality: row.organizerNationality || 'saudi',
      organizerPhone: row.organizerPhone,
      organizerEmail: '', // Would come from organizer lookup
      campaignNumber: row.campaignNumber,
      campaignManagerPhone: row.campaignManagerPhone,
      departurePoint: (row.route.includes('مكة') ? 'makkah' : 'madinah') as 'makkah' | 'madinah',
      arrivalDestination: (row.route.includes('جدة') ? 'jeddah' : row.route.includes('مطار') ? 'madinah-airport' : row.route.includes('المدينة') ? 'madinah' : 'makkah') as 'makkah' | 'madinah' | 'jeddah' | 'madinah-airport',
      departureDate: row.departureDate,
      departureTime: row.departureTime,
      pilgrimsCount: row.pilgrimsCount,
      accommodations: [],
      arrivalAccommodations: [],
      status: 'scheduled' as const,
      createdAt: new Date().toISOString().split('T')[0]
    }));
    
    // Add new groups to the list
    setDepartureGroups([...departureGroups, ...newGroups]);
    setIsExcelUploadOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
                {t('reception.preArrival.departures.title') || 'الاستعداد المسبق للمغادرة'}
              </h1>
              <p className="text-sm text-gray-600">
                {t('reception.preArrival.departures.subtitle') || 'إدارة مجموعات المغادرة والمواعيد'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('dashboard')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    viewMode === 'dashboard'
                      ? 'bg-white text-mainColor shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChartOutlined className="mr-2" />
                  {t('reception.preArrival.dashboard.title') || 'Dashboard'}
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    viewMode === 'table'
                      ? 'bg-white text-mainColor shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <OrderedListOutlined className="mr-2" />
                  {t('reception.preArrival.table.title') || 'رفع التقارير'}
                </button>
              </div>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <option value="all">{t('reception.preArrival.dashboard.allTime') || 'All Time'}</option>
                <option value="today">{t('reception.preArrival.dashboard.today') || 'Today'}</option>
                <option value="week">{t('reception.preArrival.dashboard.thisWeek') || 'This Week'}</option>
                <option value="month">{t('reception.preArrival.dashboard.thisMonth') || 'This Month'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dashboard View */}
        {viewMode === 'dashboard' && (
          <>
            {/* KPI Cards */}
            <PreDepartureKPICards kpi={displayKPI} />

            {/* Nationality Statistics - Departures */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">
                  المغادرة حسب الجنسيات
                </h2>
              </div>
              <DepartureNationalityStatistics data={mockNationalityStatistics} />
            </div>

            {/* Charts & Analytics */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t('reception.preArrival.dashboard.charts') || 'Charts & Analytics'}
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch mb-5">
                <PieChart
                  data={departuresByDestinationData}
                  title="المغادرات حسب نقطة الانطلاق"
                />
                <SimpleChart
                  data={departuresByCampaignData.values.length > 0 ? departuresByCampaignData : { labels: [], values: [] }}
                  title="المغادرات حسب الحملة"
                />
              </div>
              
              {/* Bar Graph for Departure Percentage */}
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-2xl font-bold text-gray-900">
                      {t('reception.preArrival.departures.dashboard.departedPilgrimsPercentage') || 'نسبة الحجاج المغادرين'}
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(99, 102, 241))' }}></div>
                        <span className="text-sm font-semibold text-gray-600">مغادرين</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-400"></div>
                        <span className="text-sm font-semibold text-gray-600">غير مغادرين</span>
                      </div>
                    </div>
                  </div>
                  
                  {departedPilgrimsData.values.reduce((sum, val) => sum + val, 0) > 0 ? (
                    <div className="space-y-6">
                      {/* Bar Graph */}
                      <div className="relative" style={{ height: '320px' }}>
                        <svg viewBox="0 0 600 320" className="w-full h-full">
                          {/* Grid Lines */}
                          {[0, 1, 2, 3, 4].map((i) => (
                            <g key={i}>
                              <line
                                x1="80"
                                y1={40 + i * 60}
                                x2="580"
                                y2={40 + i * 60}
                                stroke="#E5E7EB"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                              />
                              <text
                                x="70"
                                y={47 + i * 60}
                                textAnchor="end"
                                fontSize="13"
                                fill="#6B7280"
                                fontWeight="600"
                              >
                                {100 - i * 25}%
                              </text>
                            </g>
                          ))}
                          
                          {/* Bar Chart */}
                          {(() => {
                            const departedPercentage = displayKPI.departedPilgrimsPercentage;
                            const notDepartedPercentage = 100 - departedPercentage;
                            const maxHeight = 240;
                            const barWidth = 200;
                            const barSpacing = 80;
                            const startX = 200;
                            
                            const departedBarHeight = (departedPercentage / 100) * maxHeight;
                            const notDepartedBarHeight = (notDepartedPercentage / 100) * maxHeight;
                            
                            return (
                              <>
                                <defs>
                                  <linearGradient id="departedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                                    <stop offset="100%" stopColor="rgb(99, 102, 241)" />
                                  </linearGradient>
                                  <linearGradient id="notDepartedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#9CA3AF" />
                                    <stop offset="100%" stopColor="#6B7280" />
                                  </linearGradient>
                                </defs>
                                
                                {/* Bar for Departed */}
                                <g>
                                  <rect
                                    x={startX}
                                    y={280 - departedBarHeight}
                                    width={barWidth}
                                    height={departedBarHeight}
                                    fill="url(#departedGradient)"
                                    rx="8"
                                    style={{ filter: 'drop-shadow(0 4px 6px rgba(59, 130, 246, 0.3))' }}
                                  />
                                  <text
                                    x={startX + barWidth / 2}
                                    y={280 - departedBarHeight - 10}
                                    textAnchor="middle"
                                    fontSize="16"
                                    fontWeight="bold"
                                    fill="rgb(99, 102, 241)"
                                  >
                                    {departedPercentage.toFixed(1)}%
                                  </text>
                                  <text
                                    x={startX + barWidth / 2}
                                    y={280 - departedBarHeight / 2}
                                    textAnchor="middle"
                                    fontSize="20"
                                    fontWeight="bold"
                                    fill="white"
                                    className="drop-shadow-lg"
                                  >
                                    {displayKPI.departedPilgrimsCount.toLocaleString()}
                                  </text>
                                  <text
                                    x={startX + barWidth / 2}
                                    y={300}
                                    textAnchor="middle"
                                    fontSize="14"
                                    fontWeight="600"
                                    fill="#374151"
                                  >
                                    مغادرين
                                  </text>
                                </g>
                                
                                {/* Bar for Not Departed */}
                                <g>
                                  <rect
                                    x={startX + barWidth + barSpacing}
                                    y={280 - notDepartedBarHeight}
                                    width={barWidth}
                                    height={notDepartedBarHeight}
                                    fill="url(#notDepartedGradient)"
                                    rx="8"
                                    style={{ filter: 'drop-shadow(0 4px 6px rgba(107, 114, 128, 0.3))' }}
                                  />
                                  <text
                                    x={startX + barWidth + barSpacing + barWidth / 2}
                                    y={280 - notDepartedBarHeight - 10}
                                    textAnchor="middle"
                                    fontSize="16"
                                    fontWeight="bold"
                                    fill="#6B7280"
                                  >
                                    {notDepartedPercentage.toFixed(1)}%
                                  </text>
                                  <text
                                    x={startX + barWidth + barSpacing + barWidth / 2}
                                    y={280 - notDepartedBarHeight / 2}
                                    textAnchor="middle"
                                    fontSize="20"
                                    fontWeight="bold"
                                    fill="white"
                                    className="drop-shadow-lg"
                                  >
                                    {(displayKPI.registeredPilgrimsInCenter - displayKPI.departedPilgrimsCount).toLocaleString()}
                                  </text>
                                  <text
                                    x={startX + barWidth + barSpacing + barWidth / 2}
                                    y={300}
                                    textAnchor="middle"
                                    fontSize="14"
                                    fontWeight="600"
                                    fill="#374151"
                                  >
                                    غير مغادرين
                                  </text>
                                </g>
                              </>
                            );
                          })()}
                        </svg>
                      </div>
                      
                      {/* Statistics Summary */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">المغادرين</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {displayKPI.departedPilgrimsCount.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">النسبة</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {displayKPI.departedPilgrimsPercentage.toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">المتبقي</p>
                          <p className="text-2xl font-bold text-gray-700">
                            {(displayKPI.registeredPilgrimsInCenter - displayKPI.departedPilgrimsCount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BarChartOutlined className="text-gray-300 text-5xl mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">لا توجد بيانات للمغادرين</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming Departures & Accommodations Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Upcoming Departures */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-cyan-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CalendarOutlined className="text-cyan-600 text-lg" />
                    المغادرات القادمة
                  </h3>
                  {upcomingDepartures.length > 0 && (
                    <span className="text-xs font-medium text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full">
                      {upcomingDepartures.length}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {upcomingDepartures.length > 0 ? (
                    upcomingDepartures.map((group) => (
                      <div
                        key={group.id}
                        className="p-3 bg-gradient-to-r from-cyan-50/50 to-white rounded-lg hover:from-cyan-100/50 hover:to-cyan-50/50 transition-all cursor-pointer border border-cyan-200/50 hover:border-cyan-300 hover:shadow-sm"
                        onClick={() => {
                          setSelectedDepartureGroup(group);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0"></div>
                            <span className="font-semibold text-gray-900 text-sm truncate">{group.organizerName}</span>
                          </div>
                          <span className="text-xs font-medium text-gray-700 bg-white px-2 py-0.5 rounded flex-shrink-0">
                            {new Date(group.departureDate).toLocaleDateString('ar-SA', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} {group.departureTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600 mt-2 flex-wrap">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{group.organizerNumber}</span>
                          <span>•</span>
                          <span className="font-medium">{group.pilgrimsCount} حاج</span>
                          <span>•</span>
                          <span className="text-mainColor font-semibold">{group.campaignNumber}</span>
                          <span>•</span>
                          <span className="text-blue-600 font-semibold">المركز: {String(group.id).slice(-1) || '001'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CalendarOutlined className="text-gray-300 text-4xl mx-auto mb-2" />
                      <p className="text-gray-500">لا توجد مغادرات قادمة</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Accommodations Usage */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-emerald-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BarChartOutlined className="text-emerald-600 text-lg" />
                    مغادرين الإسكان
                  </h3>
                  {accommodationsUsage.length > 0 && (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      {accommodationsUsage.length}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {accommodationsUsage.length > 0 ? (
                    accommodationsUsage.map((acc, index) => (
                      <div 
                        key={acc.id || index} 
                        className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-mainColor/30 hover:shadow-sm transition-all" 
                        onClick={() => {
                          // Find first departure group using this accommodation
                          const firstGroup = departureGroups.find(g => 
                            g.accommodations.some(a => a.accommodationId === acc.id)
                          );
                          if (firstGroup) {
                            setSelectedDepartureGroup(firstGroup);
                            setIsDetailsModalOpen(true);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              acc.percentage >= 90 ? 'bg-red-500' : acc.percentage >= 75 ? 'bg-orange-500' : 'bg-green-500'
                            }`}></div>
                            <span className="font-medium text-gray-900">{acc.name}</span>
                          </div>
                          <span className={`text-sm font-bold px-2 py-1 rounded ${
                            acc.percentage >= 90 ? 'bg-red-100 text-red-700' : 
                            acc.percentage >= 75 ? 'bg-orange-100 text-orange-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {acc.percentage}%
                          </span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              acc.percentage >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                              acc.percentage >= 75 ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 
                              'bg-gradient-to-r from-green-500 to-green-600'
                            }`}
                            style={{ width: `${acc.percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>الحجاج: <span className="font-semibold text-gray-900">{acc.occupied}</span></span>
                          <span>السعة: <span className="font-semibold text-gray-900">{acc.capacity}</span></span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <HomeOutlined className="text-gray-300 text-4xl mx-auto mb-2" />
                      <p className="text-gray-500">لا يوجد إسكان مستخدم</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Entries */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-violet-200/50 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ClockCircleOutlined className="text-violet-600 text-lg" />
                  الإدخالات الأخيرة
                </h3>
                {recentEntries.length > 0 && (
                  <button
                    onClick={() => setViewMode('table')}
                    className="text-xs text-violet-600 hover:text-violet-700 font-semibold transition-colors"
                  >
                    {t('reception.preArrival.dashboard.clickToView') || 'عرض الكل'}
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {recentEntries.length > 0 ? (
                  recentEntries.map((group) => (
                    <div
                      key={group.id}
                      className="p-3 bg-gradient-to-r from-violet-50/50 to-white rounded-lg hover:from-violet-100/50 hover:to-violet-50/50 transition-all cursor-pointer border border-violet-200/50 hover:border-violet-300 hover:shadow-sm"
                      onClick={() => {
                        setSelectedDepartureGroup(group);
                        setIsDetailsModalOpen(true);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-mainColor to-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {group.organizerNumber.slice(-2)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-gray-900 block text-sm truncate">{group.organizerName}</span>
                            <span className="text-xs text-gray-500">{group.organizerNumber}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex-shrink-0">
                          {new Date(group.createdAt).toLocaleDateString('ar-SA', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5 mt-2.5 pt-2.5 border-t border-gray-200">
                        <div>
                          <span className="text-xs text-gray-500 block mb-0.5">عدد الحجاج</span>
                          <span className="text-sm font-semibold text-gray-900">{group.pilgrimsCount}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block mb-0.5">نقطة الانطلاق</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {group.departurePoint === 'makkah' ? 'مكة' : 'المدينة'}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block mb-0.5">رقم المركز</span>
                          <span className="text-sm font-semibold text-blue-600">{String(group.id).slice(-1) || '001'}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          رقم الحملة: <span className="font-medium text-gray-700">{group.campaignNumber}</span>
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <ClockCircleOutlined className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-gray-500 font-medium">لا توجد إدخالات حديثة</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Table View - رفع التقارير */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {t('reception.preArrival.table.title') || 'رفع التقارير'}
              </h3>
              <div className="flex items-center gap-3">
                {/* Action Buttons */}
                <button
                  onClick={handleAddDeparture}
                  className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all font-semibold flex items-center gap-2"
                >
                  <PlusOutlined />
                  {t('reception.preArrival.departures.dashboard.addDeparture') || 'إضافة تسجيل مغادرة'}
                </button>
                
                <button
                  onClick={handleUploadExcel}
                  className="px-6 py-3 bg-white border-2 border-mainColor text-mainColor rounded-xl hover:bg-mainColor/5 transition-all font-semibold flex items-center gap-2"
                >
                  <UploadOutlined />
                  {t('reception.preArrival.departures.dashboard.uploadDepartureReport') || 'رفع تقرير المغادرة'}
                </button>
              </div>
            </div>
            
            {/* Departure Groups List */}
            <DepartureGroupsList
              groups={departureGroups}
              onViewGroup={(group) => {
                setSelectedDepartureGroup(group);
                setIsDetailsModalOpen(true);
              }}
              onEditGroup={(group) => console.log('Edit group', group)}
              onDeleteGroup={(groupId) => {
                setDepartureGroups(prev => prev.filter(g => g.id !== groupId));
              }}
            />
          </div>
        )}
      </div>

      {/* Registration Form Modal */}
      {isRegistrationFormOpen && (
        <DepartureRegistrationForm
          onComplete={handleRegistrationComplete}
          onClose={() => setIsRegistrationFormOpen(false)}
        />
      )}

      {/* Excel Upload Modal */}
      {isExcelUploadOpen && (
        <DepartureExcelUpload
          onComplete={handleExcelUploadComplete}
          onClose={() => setIsExcelUploadOpen(false)}
        />
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedDepartureGroup && (
        <DepartureDetailsModal
          group={selectedDepartureGroup}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedDepartureGroup(null);
          }}
        />
      )}
    </div>
  );
};

export default PreDepartureDashboardPage;

