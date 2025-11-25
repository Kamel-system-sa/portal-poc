import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { CalendarOutlined, BarChartOutlined, ClockCircleOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CloseOutlined, OrderedListOutlined, TeamOutlined, HomeOutlined } from '@ant-design/icons';
import { PreArrivalKPICards } from '../../components/Reception/PreArrivalKPICards';
import { ArrivalGroupsList } from '../../components/Reception/ArrivalGroupsList';
import { ExcelUploadFlow } from '../../components/Reception/ExcelUploadFlow';
import { DataConfirmationScreen } from '../../components/Reception/DataConfirmationScreen';
import { EditGroupDataModal } from '../../components/Reception/EditGroupDataModal';
import ArrivalNationalityStatistics from '../../components/Reception/ArrivalNationalityStatistics';
import { mockArrivalGroups, mockDashboardKPI, mockArrivalsByDestination, mockArrivalsTrend, mockArrivalsByCampaign, mockActivityTimeline, mockNationalityStatistics } from '../../data/mockReception';
import type { DashboardKPI, ChartData, ActivityTimelineItem, ArrivalGroup } from '../../types/reception';

const PreArrivalDashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [dateFilter, setDateFilter] = useState<string>('all');
  // Auto-set view mode based on URL path
  const [viewMode, setViewMode] = useState<'dashboard' | 'table'>(
    location.pathname.includes('/list') ? 'table' : 'dashboard'
  );
  const [selectedGroup, setSelectedGroup] = useState<ArrivalGroup | null>(null);
  const [groups, setGroups] = useState<ArrivalGroup[]>(mockArrivalGroups);
  
  // Excel Upload Flow States
  const [isExcelUploadOpen, setIsExcelUploadOpen] = useState(false);
  const [uploadedData, setUploadedData] = useState<Partial<ArrivalGroup> | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Update view mode when URL changes
  useEffect(() => {
    if (location.pathname.includes('/list')) {
      setViewMode('table');
    } else {
      setViewMode('dashboard');
    }
  }, [location.pathname]);

  // Handlers for ArrivalGroupsList
  const handleAddGroup = () => {
    setIsExcelUploadOpen(true);
  };

  const handleExcelUploadComplete = (data: Partial<ArrivalGroup>) => {
    setUploadedData(data);
    setIsExcelUploadOpen(false);
    setIsConfirmationOpen(true);
  };

  const handleConfirmData = () => {
    if (uploadedData) {
      // Create new group from uploaded data
      const newGroup: ArrivalGroup = {
        id: `group-${Date.now()}`,
        groupNumber: uploadedData.groupNumber || 'GRP-NEW',
        groupName: uploadedData.groupName || 'New Group',
        arrivalDate: uploadedData.arrivalDate || new Date().toISOString().split('T')[0],
        arrivalTime: uploadedData.arrivalTime || '14:30',
        flightNumber: uploadedData.flightNumber,
        tripNumber: uploadedData.tripNumber,
        pilgrimsCount: uploadedData.pilgrimsCount || 0,
        arrivedCount: 0,
        destination: uploadedData.destination || 'makkah',
        organizer: uploadedData.organizer || {
          id: 'org-default',
          number: 'ORG-000',
          name: 'Default Organizer',
          company: 'Default Company',
          phone: '+966500000000',
          email: 'default@example.com'
        },
        accommodations: uploadedData.accommodations || [],
        status: 'scheduled',
        campaignNumber: uploadedData.campaignNumber,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setGroups([...groups, newGroup]);
      setUploadedData(null);
      setIsConfirmationOpen(false);
    }
  };

  const handleEditData = () => {
    setIsConfirmationOpen(false);
    setIsEditModalOpen(true);
  };

  const handleSaveGroupData = (data: Partial<ArrivalGroup>) => {
    setUploadedData(data);
    setIsEditModalOpen(false);
    setIsConfirmationOpen(true);
  };

  const handleEditGroup = (group: ArrivalGroup) => {
    console.log('Edit group', group.id);
    // In real app, open edit form modal
  };

  const handleDeleteGroup = (groupId: string) => {
    const confirmMessage = t('form.confirmDeleteMessage') || 'Are you sure you want to delete this group?';
    if (window.confirm(confirmMessage)) {
      console.log('Delete group', groupId);
      // In real app, this would call an API
    }
  };

  const handleViewGroup = (group: ArrivalGroup) => {
    setSelectedGroup(group);
    // In real app, open details modal
  };

  // Pie Chart Component for Arrivals by Destination - More Visual and Clear
  const PieChart: React.FC<{ data: ChartData; title: string; onClick?: () => void }> = ({ data, title, onClick }) => {
    const total = data.values.reduce((sum, val) => sum + val, 0);
    const colors = ['#00796B', '#00A896', '#4ECDC4', '#26A69A'];
    const radius = 65;
    const centerX = 100;
    const centerY = 100;
    let currentAngle = -90; // Start from top
    
    const segments = data.values.map((value, index) => {
      const percentage = total > 0 ? (value / total) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      // Calculate path for pie segment
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
          <div className="flex items-center justify-between gap-4 flex-1">
            {/* Pie Chart SVG */}
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
                    {/* Percentage text in center of segment */}
                  </g>
                ))}
                {/* Center circle for donut effect */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="38"
                  fill="white"
                />
              </svg>
            </div>
            
            {/* Legend */}
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
        {onClick && total > 0 && (
          <p className="text-xs text-gray-400 mt-3 text-center">{t('reception.preArrival.dashboard.clickToView')}</p>
        )}
      </div>
    );
  };

  // Enhanced Bar Chart Component - Modern Clean Design (for other charts)
  const SimpleChart: React.FC<{ data: ChartData; title: string; onClick?: () => void }> = ({ data, title, onClick }) => {
    const maxValue = Math.max(...data.values, 1);
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
          <p className="text-xs text-gray-400 mt-3 text-center">{t('reception.preArrival.dashboard.clickToView')}</p>
        )}
      </div>
    );
  };

  const SimpleLineChart: React.FC<{ data: ChartData; title: string; onClick?: () => void }> = ({ data, title, onClick }) => {
    const hasData = data.values.length > 0 && data.values.some(v => v > 0);
    const maxValue = hasData ? Math.max(...data.values, 1) : 1;
    const minValue = hasData ? Math.min(...data.values.filter(v => v > 0), maxValue) : 0;
    const range = maxValue - minValue || 1;
    const total = data.values.reduce((a, b) => a + b, 0);
    
    // Chart dimensions with balanced margins
    const chartMargin = { left: 14, right: 10, top: 10, bottom: 22 };
    const chartWidth = 100 - chartMargin.left - chartMargin.right;
    const chartHeight = 100 - chartMargin.top - chartMargin.bottom;
    const chartStartX = chartMargin.left;
    const chartEndX = 100 - chartMargin.right;
    const chartStartY = chartMargin.top;
    const chartEndY = 100 - chartMargin.bottom;
    
    // Generate smooth points with proper margins
    const points = data.values.map((value, index) => {
      const x = data.values.length > 1 
        ? chartStartX + (index / (data.values.length - 1)) * chartWidth 
        : chartStartX + chartWidth / 2;
      const y = hasData 
        ? chartEndY - ((value - minValue) / range) * (chartEndY - chartStartY)
        : chartStartY + (chartEndY - chartStartY) / 2;
      return { x, y, value };
    });

    // Generate Y-axis labels
    const yAxisSteps = 5;
    const yAxisLabels: number[] = [];
    for (let i = 0; i <= yAxisSteps; i++) {
      yAxisLabels.push(Math.round(minValue + (range / yAxisSteps) * i));
    }

    // Create smooth curve using cubic bezier
    const createSmoothPath = (points: { x: number; y: number }[]) => {
      if (points.length < 2) return '';
      if (points.length === 2) {
        return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
      }
      
      let path = `M ${points[0].x},${points[0].y}`;
      
      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        
        let cp1x, cp1y, cp2x, cp2y;
        
        if (i === 0) {
          const dx = (next.x - current.x) * 0.35;
          const dy = (next.y - current.y) * 0.35;
          cp1x = current.x + dx;
          cp1y = current.y + dy;
          cp2x = next.x - dx;
          cp2y = next.y - dy;
        } else if (i === points.length - 2) {
          const prev = points[i - 1];
          const dx = (next.x - prev.x) * 0.3;
          const dy = (next.y - prev.y) * 0.3;
          cp1x = current.x + dx;
          cp1y = current.y + dy;
          cp2x = next.x - dx * 0.5;
          cp2y = next.y - dy * 0.5;
        } else {
          const prev = points[i - 1];
          const after = points[i + 2];
          const dx1 = (next.x - prev.x) * 0.25;
          const dy1 = (next.y - prev.y) * 0.25;
          const dx2 = (after.x - current.x) * 0.25;
          const dy2 = (after.y - current.y) * 0.25;
          cp1x = current.x + dx1;
          cp1y = current.y + dy1;
          cp2x = next.x - dx2;
          cp2y = next.y - dy2;
        }
        
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
      }
      
      return path;
    };

    return (
      <div
        onClick={onClick}
        className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
        style={{ minHeight: '200px' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-bold text-gray-900">{title}</h4>
          {hasData && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-600">المجموع:</span>
              <span className="font-bold text-mainColor">{total}</span>
            </div>
          )}
        </div>
        {hasData ? (
          <div className="relative" style={{ height: '150px', minHeight: '150px' }}>
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradientTrend" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00796B" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#00A896" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#00A896" stopOpacity="0.04" />
                </linearGradient>
                <linearGradient id="lineGradientTrend" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00796B" />
                  <stop offset="50%" stopColor="#00A896" />
                  <stop offset="100%" stopColor="#4ECDC4" />
                </linearGradient>
              </defs>
              
              {/* Clean professional grid - horizontal */}
              {yAxisLabels.map((label, i) => {
                const y = chartEndY - ((i / yAxisSteps) * (chartEndY - chartStartY));
                return (
                  <g key={`h-grid-${i}`}>
                    <line
                      x1={chartStartX}
                      y1={y}
                      x2={chartEndX}
                      y2={y}
                      stroke={i === 0 || i === yAxisSteps ? "#D1D5DB" : "#E5E7EB"}
                      strokeWidth={i === 0 || i === yAxisSteps ? "0.35" : "0.25"}
                      strokeDasharray={i === 0 || i === yAxisSteps ? "0" : "1.5,1.5"}
                      opacity="0.7"
                    />
                  </g>
                );
              })}
              
              {/* Clean professional grid - vertical */}
              {points.map((point, i) => (
                <line
                  key={`v-grid-${i}`}
                  x1={point.x}
                  y1={chartStartY}
                  x2={point.x}
                  y2={chartEndY}
                  stroke="#F3F4F6"
                  strokeWidth="0.2"
                  strokeDasharray="1,1"
                  opacity="0.6"
                />
              ))}
              
              {/* Area fill under smooth curve */}
              <path
                d={`${createSmoothPath(points)} L ${points[points.length - 1].x},${chartEndY} L ${points[0].x},${chartEndY} Z`}
                fill="url(#areaGradientTrend)"
              />
              
              {/* Smooth professional line */}
              <path
                d={createSmoothPath(points)}
                fill="none"
                stroke="url(#lineGradientTrend)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Clear data points */}
              {points.map((point, index) => (
                <g key={index}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="3.5"
                    fill="#00796B"
                    opacity="0.2"
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="2.5"
                    fill="#00A896"
                    opacity="0.4"
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="2"
                    fill="#00796B"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </g>
              ))}
              
              {/* Y-axis labels */}
              {yAxisLabels.map((label, i) => {
                const y = chartEndY - ((i / yAxisSteps) * (chartEndY - chartStartY));
                return (
                  <text
                    key={i}
                    x={chartStartX - 1.5}
                    y={y + 0.5}
                    fontSize="7.5"
                    fill="#6B7280"
                    textAnchor="end"
                    alignmentBaseline="middle"
                    fontWeight="500"
                  >
                    {label}
                  </text>
                );
              })}
            </svg>
            
            {/* X-axis labels with balanced spacing */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between pb-1.5" style={{ paddingLeft: `${chartMargin.left}%`, paddingRight: `${chartMargin.right}%` }}>
              {data.labels.map((label, index) => (
                <span
                  key={index}
                  className="text-[10px] text-gray-500 font-medium"
                  style={{ 
                    transform: `translateX(${index === 0 ? '0' : index === data.labels.length - 1 ? '0' : '-50%'})`,
                    marginLeft: index === 0 ? '0' : index === data.labels.length - 1 ? 'auto' : '0'
                  }}
                >
                  {label.length > 10 ? label.substring(0, 8) + '...' : label}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChartOutlined className="text-gray-300 text-3xl mx-auto mb-2" />
            <p className="text-xs text-gray-400">لا توجد بيانات للعرض</p>
            <p className="text-xs text-gray-300 mt-1">أضف مجموعات وصول لعرض الاتجاه</p>
          </div>
        )}
        {onClick && hasData && (
          <p className="text-xs text-gray-400 mt-3 text-center">{t('reception.preArrival.dashboard.clickToView')}</p>
        )}
      </div>
    );
  };

  // Upcoming arrivals - from actual groups data
  const upcomingArrivals = groups
    .filter(g => g.status === 'scheduled' && new Date(g.arrivalDate) >= new Date())
    .sort((a, b) => new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime())
    .slice(0, 5);

  // Accommodations usage - calculated from actual groups data
  const accommodationMap = new Map<string, { name: string; pilgrims: number }>();
  groups.forEach(group => {
    group.accommodations.forEach(acc => {
      const existing = accommodationMap.get(acc.accommodationId) || { name: acc.accommodationName, pilgrims: 0 };
      existing.pilgrims += acc.pilgrimsAssigned;
      accommodationMap.set(acc.accommodationId, existing);
    });
  });
  
  const accommodationsUsage = Array.from(accommodationMap.entries())
    .map(([id, data]) => ({
      id,
      name: data.name,
      pilgrims: data.pilgrims,
      capacity: Math.ceil(data.pilgrims / 0.75), // Estimate capacity based on 75% usage
      occupied: data.pilgrims,
      percentage: Math.min(100, Math.round((data.pilgrims / Math.ceil(data.pilgrims / 0.75)) * 100))
    }))
    .sort((a, b) => b.pilgrims - a.pilgrims)
      .slice(0, 5);

  // Calculate chart data from actual groups
  const arrivalsByDestinationData: ChartData = {
    labels: ['مكة', 'المدينة'],
    values: [
      groups.filter(g => g.destination === 'makkah').length,
      groups.filter(g => g.destination === 'madinah').length
    ]
  };

  // Group by date for trend chart - show last 7 days or generate sample data if needed
  const dateGroups = groups.reduce((acc, group) => {
    const date = group.arrivalDate;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const sortedDates = Object.keys(dateGroups).sort();
  
  // If we have data, use it. Otherwise, generate last 7 days with zeros or sample data
  let arrivalsTrendData: ChartData;
  if (sortedDates.length > 0) {
    // Get last 7 dates from data
    const last7Dates = sortedDates.slice(-7);
    arrivalsTrendData = {
      labels: last7Dates.map(d => new Date(d).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })),
      values: last7Dates.map(d => dateGroups[d] || 0)
    };
  } else {
    // Generate last 7 days with sample data for demonstration
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });
    arrivalsTrendData = {
      labels: last7Days.map(d => new Date(d).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })),
      values: last7Days.map(() => 0) // All zeros if no data
    };
  }

  // Group by campaign for campaign chart
  const campaignGroups = groups.reduce((acc, group) => {
    const campaign = group.campaignNumber || 'بدون حملة';
    acc[campaign] = (acc[campaign] || 0) + group.pilgrimsCount;
    return acc;
  }, {} as Record<string, number>);
  
  const arrivalsByCampaignData: ChartData = {
    labels: Object.keys(campaignGroups).slice(0, 5),
    values: Object.values(campaignGroups).slice(0, 5)
  };

  // Calculate summary statistics
  const totalGroups = groups.length;
  const totalPilgrims = groups.reduce((sum, g) => sum + g.pilgrimsCount, 0);
  const uniqueAccommodations = new Set(
    groups.flatMap(g => g.accommodations.map(a => a.accommodationId))
  );
  const totalAccommodationsUsed = uniqueAccommodations.size;
  const recentEntries = groups
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
                {t('reception.preArrival.arrivals.title') || 'Pre-Arrival for Arrivals'}
            </h1>
              <p className="text-sm text-gray-600">{t('reception.preArrival.arrivals.subtitle') || 'Manage arrival groups and schedules'}</p>
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
                  {t('reception.preArrival.table.title') || 'Table'}
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

        {/* Table View */}
        {viewMode === 'table' && (
          <ArrivalGroupsList
            groups={groups}
            onAddGroup={handleAddGroup}
            onEditGroup={handleEditGroup}
            onDeleteGroup={handleDeleteGroup}
            onViewGroup={handleViewGroup}
          />
        )}

        {/* Dashboard View */}
        {viewMode === 'dashboard' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
              {[
                {
                  title: t('reception.preArrival.dashboard.totalGroups'),
                  value: totalGroups,
                  icon: <TeamOutlined />,
                  colorScheme: {
                    border: 'border-blue-200',
                    bgGradient: 'from-blue-100',
                    iconBg: 'bg-blue-200',
                    iconColor: 'text-blue-600',
                    lineColor: 'bg-blue-600',
                    hoverShadow: 'hover:shadow-blue-200/30'
                  }
                },
                {
                  title: t('reception.preArrival.dashboard.totalPilgrims'),
                  value: totalPilgrims.toLocaleString(),
                  icon: <TeamOutlined />,
                  colorScheme: {
                    border: 'border-mainColor/30',
                    bgGradient: 'from-mainColor/20',
                    iconBg: 'bg-mainColor/20',
                    iconColor: 'text-mainColor',
                    lineColor: 'bg-mainColor',
                    hoverShadow: 'hover:shadow-mainColor/20'
                  }
                },
                {
                  title: t('reception.preArrival.dashboard.totalAccommodations'),
                  value: totalAccommodationsUsed,
                  icon: <HomeOutlined />,
                  colorScheme: {
                    border: 'border-emerald-200',
                    bgGradient: 'from-emerald-100',
                    iconBg: 'bg-emerald-200',
                    iconColor: 'text-emerald-600',
                    lineColor: 'bg-emerald-600',
                    hoverShadow: 'hover:shadow-emerald-200/30'
                  }
                },
                {
                  title: t('reception.preArrival.dashboard.recentEntries'),
                  value: recentEntries.length,
                  icon: <ClockCircleOutlined />,
                  colorScheme: {
                    border: 'border-violet-200',
                    bgGradient: 'from-violet-100',
                    iconBg: 'bg-violet-200',
                    iconColor: 'text-violet-600',
                    lineColor: 'bg-violet-600',
                    hoverShadow: 'hover:shadow-violet-200/30'
                  }
                }
              ].map((card, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-xl shadow-md p-3 border ${card.colorScheme.border} hover:shadow-lg ${card.colorScheme.hoverShadow} hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col items-center justify-center`}
                  style={{ minHeight: '100px' }}
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.colorScheme.bgGradient} to-transparent rounded-full -mr-10 -mt-10 opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                  <div className={`relative w-10 h-10 rounded-lg ${card.colorScheme.iconBg} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0`}>
                    <div className={`${card.colorScheme.iconColor} text-base`}>{card.icon}</div>
                  </div>
                  <h3 className="text-xs font-medium text-gray-700 mb-1.5 leading-tight text-center">{card.title}</h3>
                  <span className="text-xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent text-center">{card.value}</span>
                  <div className={`mt-1.5 w-8 h-0.5 ${card.colorScheme.lineColor} rounded-full flex-shrink-0`}></div>
                </div>
              ))}
        </div>

            {/* KPI Cards */}
            <PreArrivalKPICards kpi={mockDashboardKPI} />

            {/* Nationality Statistics - Arrivals */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">
                  الوصول حسب الجنسيات
                </h2>
              </div>
              <ArrivalNationalityStatistics data={mockNationalityStatistics} />
            </div>

            {/* Charts & Analytics */}
        <div className="mb-5">
              <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t('reception.preArrival.dashboard.charts') || 'Charts & Analytics'}
            </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                <PieChart
                  data={arrivalsByDestinationData}
                  title={t('reception.preArrival.dashboard.arrivalsByDestination')}
                  onClick={() => setViewMode('table')}
                />
                <SimpleChart
                  data={arrivalsByCampaignData.values.length > 0 ? arrivalsByCampaignData : mockArrivalsByCampaign}
                  title={t('reception.preArrival.dashboard.arrivalsByCampaign')}
                  onClick={() => setViewMode('table')}
                />
          </div>
        </div>

            {/* Upcoming Arrivals & Accommodations Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Upcoming Arrivals */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-cyan-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <CalendarOutlined className="text-cyan-600 text-lg" />
              {t('reception.preArrival.dashboard.upcomingArrivals')}
                  </h3>
                  {upcomingArrivals.length > 0 && (
                    <span className="text-xs font-medium text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full">
                      {upcomingArrivals.length}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {upcomingArrivals.length > 0 ? (
                    upcomingArrivals.map((group) => (
                      <div
                        key={group.id}
                        className="p-3 bg-gradient-to-r from-cyan-50/50 to-white rounded-lg hover:from-cyan-100/50 hover:to-cyan-50/50 transition-all cursor-pointer border border-cyan-200/50 hover:border-cyan-300 hover:shadow-sm"
                        onClick={() => {
                          setSelectedGroup(group);
                          setViewMode('table');
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0"></div>
                            <span className="font-semibold text-gray-900 text-sm truncate">{group.groupName}</span>
                          </div>
                          <span className="text-xs font-medium text-gray-700 bg-white px-2 py-0.5 rounded flex-shrink-0">
                            {new Date(group.arrivalDate).toLocaleDateString('ar-SA', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} {group.arrivalTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600 mt-2 flex-wrap">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{group.groupNumber}</span>
                          <span>•</span>
                          <span className="font-medium">{group.pilgrimsCount} {t('reception.preArrival.form.pilgrimsCount')}</span>
                          {group.flightNumber && (
                            <>
                              <span>•</span>
                              <span className="text-mainColor font-semibold">{group.flightNumber}</span>
                            </>
                          )}
                          <span>•</span>
                          <span className="text-gray-500">تاريخ الميلاد: {group.rawPassengerData?.[0]?.age ? `${2024 - (group.rawPassengerData[0].age || 0)}-01-01` : 'غير متوفر'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CalendarOutlined className="text-gray-300 text-4xl mx-auto mb-2" />
                      <p className="text-gray-500">{t('reception.preArrival.dashboard.upcomingArrivals') || 'لا توجد وصولات قادمة'}</p>
                    </div>
                  )}
                </div>
          </div>

          {/* Accommodations Usage */}
          <div className="bg-white rounded-xl shadow-md p-5 border border-emerald-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BarChartOutlined className="text-emerald-600 text-lg" />
              {t('reception.preArrival.dashboard.accommodationsUsage')}
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
                          setViewMode('table');
                          // Filter by accommodation in real app
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
                          <span>{t('reception.preArrival.form.pilgrimsCount')}: <span className="font-semibold text-gray-900">{acc.occupied}</span></span>
                          <span>{t('reception.preArrival.dashboard.totalAccommodations')}: <span className="font-semibold text-gray-900">{acc.capacity}</span></span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <HomeOutlined className="text-gray-300 text-4xl mx-auto mb-2" />
                      <p className="text-gray-500">{t('reception.preArrival.confirmation.noAccommodations') || 'لا يوجد إسكان مستخدم'}</p>
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
                  {t('reception.preArrival.dashboard.recentEntries')}
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
                        setSelectedGroup(group);
                        setViewMode('table');
                      }}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-mainColor to-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {group.groupNumber.slice(-2)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-gray-900 block text-sm truncate">{group.groupName}</span>
                            <span className="text-xs text-gray-500">{group.groupNumber}</span>
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
                          <span className="text-xs text-gray-500 block mb-0.5">{t('reception.preArrival.form.pilgrimsCount')}</span>
                          <span className="text-sm font-semibold text-gray-900">{group.pilgrimsCount}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block mb-0.5">{t('reception.preArrival.form.accommodations')}</span>
                          <span className="text-sm font-semibold text-gray-900">{group.accommodations.length}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block mb-0.5">{t('reception.preArrival.table.destination')}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {group.destination === 'makkah' ? 'مكة' : 'المدينة'}
                          </span>
                        </div>
                      </div>
                      {group.organizer && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500">
                            {t('reception.preArrival.table.organizer')}: <span className="font-medium text-gray-700">{group.organizer.name}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <ClockCircleOutlined className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-gray-500 font-medium">{t('reception.preArrival.list.emptyMessage') || 'لا توجد إدخالات حديثة'}</p>
                    <button
                      onClick={handleAddGroup}
                      className="mt-4 px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-primary transition-colors font-semibold"
                    >
                      {t('reception.preArrival.addGroup') || 'إضافة مجموعة جديدة'}
                    </button>
                  </div>
                )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-slate-200/50">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ClockCircleOutlined className="text-slate-600 text-lg" />
            {t('reception.preArrival.dashboard.activityTimeline')}
              </h3>
              <div className="space-y-3">
                {mockActivityTimeline.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-lg hover:bg-slate-100/50 transition-colors cursor-pointer border border-slate-200/50"
                    onClick={() => activity.groupId && setViewMode('table')}
                  >
                    <div className="w-2 h-2 rounded-full bg-slate-600 mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 text-sm truncate">{activity.title}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {new Date(activity.timestamp).toLocaleDateString('ar-SA', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}{' '}
                          {new Date(activity.timestamp).toLocaleTimeString('ar-SA', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">بواسطة {activity.userName}</p>
                    </div>
                  </div>
                ))}
              </div>
        </div>
          </>
        )}
      </div>

      {/* Excel Upload Flow Modal */}
      {isExcelUploadOpen && (
        <ExcelUploadFlow
          onUploadComplete={handleExcelUploadComplete}
          onClose={() => setIsExcelUploadOpen(false)}
        />
      )}

      {/* Data Confirmation Screen */}
      {isConfirmationOpen && uploadedData && (
        <DataConfirmationScreen
          groupData={uploadedData}
          onConfirm={handleConfirmData}
          onEdit={handleEditData}
          onClose={() => {
            setIsConfirmationOpen(false);
            setUploadedData(null);
          }}
        />
      )}

      {/* Edit Group Data Modal */}
      {isEditModalOpen && uploadedData && (
        <EditGroupDataModal
          groupData={uploadedData}
          onSave={handleSaveGroupData}
          onClose={() => {
            setIsEditModalOpen(false);
            // Return to confirmation screen if data exists
            if (uploadedData) {
              setIsConfirmationOpen(true);
            }
          }}
        />
      )}
    </div>
  );
};

export default PreArrivalDashboardPage;
