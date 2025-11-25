import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  FileTextOutlined,
  PrinterOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  DashboardOutlined,
  PlusOutlined,
  FilterOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  BellOutlined,
  ThunderboltOutlined,
  IdcardOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Card, Select, Button, Tag, Badge, Alert, Space, Drawer, Table } from 'antd';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminChecklist from '../components/HR/AdminChecklist';
import { getEmployees, type Employee } from '../data/employeesStorage';
import { translateDepartment, translateJobRank } from '../utils';

const HRDashboardPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [jobRankFilter, setJobRankFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [alertDetailsOpen, setAlertDetailsOpen] = useState(false);
  const [selectedAlertType, setSelectedAlertType] = useState<'incompleteFiles' | 'expiringContracts' | 'repeatedLate' | null>(null);

  useEffect(() => {
    const loadedEmployees = getEmployees();
    setEmployees(loadedEmployees);
  }, []);

  // Filter employees based on filters
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
      const matchesJobRank = jobRankFilter === 'all' || emp.jobRank === jobRankFilter;
      // Status filter would need attendance data - for now, we'll use a placeholder
      return matchesDepartment && matchesJobRank;
    });
  }, [employees, departmentFilter, jobRankFilter, statusFilter]);

  // Mock attendance data (in real app, this would come from attendance storage)
  const today = new Date().toISOString().split('T')[0];
  const mockAttendance = useMemo(() => {
    const total = filteredEmployees.length;
    const present = Math.floor(total * 0.75);
    const absent = Math.floor(total * 0.15);
    const late = Math.floor(total * 0.08);
    const onLeave = total - present - absent - late;
    
    return {
      present,
      absent,
      late,
      onLeave,
      lateDetails: Array.from({ length: late }, (_, i) => ({
        name: `موظف ${i + 1}`,
        delay: Math.floor(Math.random() * 60) + 5
      }))
    };
  }, [filteredEmployees.length]);

  // Mock leave data
  const mockLeaves = useMemo(() => {
    return {
      today: 3,
      upcoming: 8,
      completed: 12
    };
  }, []);

  // Mock shift schedules data
  const mockShifts = useMemo(() => {
    return {
      active: 15,
      today: 5,
      alerts: 2 // Number of shifts with insufficient staff
    };
  }, []);

  // Administrative operations stats
  const adminStats = useMemo(() => {
    return {
      nuskCardsPrinted: employees.filter(e => e.nuskCardIssued).length,
      registeredInAjir: employees.filter(e => e.registeredInAjir).length,
      incompleteFiles: employees.filter(e => 
        !e.employeeCardPrinted || !e.registeredInAjir || !e.nuskCardIssued
      ).length
    };
  }, [employees]);

  // Job rank distribution
  const jobRankStats = useMemo(() => {
    return {
      departmentHead: filteredEmployees.filter(e => e.jobRank === 'Department Head').length,
      supervisor: filteredEmployees.filter(e => e.jobRank === 'Supervisor').length,
      field: filteredEmployees.filter(e => e.jobRank === 'Field').length,
    };
  }, [filteredEmployees]);

  // Department distribution
  const departmentStats = useMemo(() => {
    const deptCount: Record<string, number> = {};
    filteredEmployees.forEach(emp => {
      deptCount[emp.department] = (deptCount[emp.department] || 0) + 1;
    });
    return deptCount;
  }, [filteredEmployees]);

  // Alerts data
  const alerts = useMemo(() => {
    const alertList: Array<{ type: 'warning' | 'error' | 'info'; message: string; count: number; alertType: 'incompleteFiles' | 'expiringContracts' | 'repeatedLate' }> = [];
    
    // Incomplete files
    const incompleteFiles = employees.filter(e => 
      !e.employeeCardPrinted || !e.registeredInAjir || !e.nuskCardIssued
    ).length;
    if (incompleteFiles > 0) {
      alertList.push({
        type: 'warning',
        message: t('hr.dashboard.alerts.incompleteFiles'),
        count: incompleteFiles,
        alertType: 'incompleteFiles'
      });
    }

    // Expiring contracts (within 30 days)
    const expiringContracts = employees.filter(e => {
      const endDate = new Date(e.contractEndDate);
      const today = new Date();
      const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }).length;
    if (expiringContracts > 0) {
      alertList.push({
        type: 'error',
        message: t('hr.dashboard.alerts.expiringContracts'),
        count: expiringContracts,
        alertType: 'expiringContracts'
      });
    }

    // Repeated late arrivals (mock - would need real attendance data)
    const repeatedLate = mockAttendance.lateDetails.length;
    if (repeatedLate > 0) {
      alertList.push({
        type: 'warning',
        message: t('hr.dashboard.alerts.repeatedLate'),
        count: repeatedLate,
        alertType: 'repeatedLate'
      });
    }

    return alertList;
  }, [employees, mockAttendance.lateDetails.length, t]);

  // Get alert details based on type
  const getAlertDetails = useMemo(() => {
    if (!selectedAlertType) return [];

    switch (selectedAlertType) {
      case 'incompleteFiles':
        return employees.filter(e => 
          !e.employeeCardPrinted || !e.registeredInAjir || !e.nuskCardIssued
        ).map(emp => ({
          ...emp,
          missingItems: [
            !emp.employeeCardPrinted && t('hr.checkboxes.employeeCardPrinted'),
            !emp.registeredInAjir && t('hr.checkboxes.registeredInAjir'),
            !emp.nuskCardIssued && t('hr.checkboxes.nuskCardIssued')
          ].filter(Boolean).join(', ')
        }));
      
      case 'expiringContracts':
        return employees.filter(e => {
          const endDate = new Date(e.contractEndDate);
          const today = new Date();
          const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays <= 30 && diffDays > 0;
        }).map(emp => {
          const endDate = new Date(emp.contractEndDate);
          const today = new Date();
          const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return {
            ...emp,
            daysRemaining: diffDays
          };
        });
      
      case 'repeatedLate':
        return mockAttendance.lateDetails.map((detail, index) => ({
          id: `late-${index}`,
          name: detail.name,
          delay: detail.delay,
          department: 'Reception', // Mock data
          jobRank: 'Field' // Mock data
        }));
      
      default:
        return [];
    }
  }, [selectedAlertType, employees, mockAttendance.lateDetails, t]);

  // Handle alert click
  const handleAlertClick = (alertType: 'incompleteFiles' | 'expiringContracts' | 'repeatedLate') => {
    setSelectedAlertType(alertType);
    setAlertDetailsOpen(true);
  };

  // Chart data for daily attendance
  const attendanceChartData = useMemo(() => {
    // Mock data for last 7 days
    return [
      { date: 'السبت', present: 45, absent: 5, late: 3 },
      { date: 'الأحد', present: 48, absent: 2, late: 2 },
      { date: 'الإثنين', present: 47, absent: 3, late: 4 },
      { date: 'الثلاثاء', present: 49, absent: 1, late: 2 },
      { date: 'الأربعاء', present: 46, absent: 4, late: 3 },
      { date: 'الخميس', present: 48, absent: 2, late: 2 },
      { date: 'اليوم', present: mockAttendance.present, absent: mockAttendance.absent, late: mockAttendance.late },
    ];
  }, [mockAttendance]);

  // Chart data for job rank distribution
  const jobRankChartData = useMemo(() => {
    return [
      { name: t('hr.form.departmentHead'), value: jobRankStats.departmentHead, color: '#00796B' },
      { name: t('hr.form.supervisor'), value: jobRankStats.supervisor, color: '#00ACC1' },
      { name: t('hr.form.field'), value: jobRankStats.field, color: '#26A69A' },
    ];
  }, [jobRankStats, t]);

  // Chart data for leaves
  const leavesChartData = useMemo(() => {
    return [
      { month: 'يناير', leaves: 5 },
      { month: 'فبراير', leaves: 8 },
      { month: 'مارس', leaves: 12 },
      { month: 'أبريل', leaves: 10 },
      { month: 'مايو', leaves: 15 },
      { month: 'يونيو', leaves: mockLeaves.today + mockLeaves.upcoming },
    ];
  }, [mockLeaves]);

  const COLORS = ['#00796B', '#00ACC1', '#26A69A', '#4DB6AC', '#80CBC4'];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-x-hidden">
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:gap-6">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-0">
          <Breadcrumb.Item>
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-mainColor text-xs sm:text-sm">
              {t('hr.breadcrumbs.home')}
            </button>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="text-mainColor font-semibold text-xs sm:text-sm">
            {t('hr.breadcrumbs.hr')}
          </Breadcrumb.Item>
          <Breadcrumb.Item className="text-xs sm:text-sm">{t('hr.breadcrumbs.dashboard')}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">
              {t('hr.dashboardTitle')}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base break-words">{t('hr.dashboardSubtitle')}</p>
          </div>
          <Button
            type={isFilterOpen ? 'primary' : 'default'}
            icon={<FilterOutlined />}
            size="large"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="rounded-xl"
          >
            {t('hr.filters.status')}
          </Button>
        </div>

        {/* Filters - Collapsible */}
        {isFilterOpen && (
          <Card className="bg-white rounded-xl shadow-md border border-gray-100 p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FilterOutlined className="text-mainColor" />
                <span className="font-semibold text-sm text-gray-900">{t('hr.dashboard.filters')}</span>
              </div>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setIsFilterOpen(false)}
                className="p-0"
                size="small"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                placeholder={t('hr.dashboard.filterByDepartment')}
                value={departmentFilter}
                onChange={setDepartmentFilter}
                className="min-w-[150px] rounded-xl"
                size="large"
              >
                <Select.Option value="all">{t('hr.dashboard.allDepartments')}</Select.Option>
                <Select.Option value="Transport">{translateDepartment('Transport')}</Select.Option>
                <Select.Option value="Reception">{translateDepartment('Reception')}</Select.Option>
                <Select.Option value="Accommodation">{translateDepartment('Accommodation')}</Select.Option>
                <Select.Option value="Field Services">{translateDepartment('Field Services')}</Select.Option>
                <Select.Option value="Other">{translateDepartment('Other')}</Select.Option>
              </Select>
              <Select
                placeholder={t('hr.dashboard.filterByJobRank')}
                value={jobRankFilter}
                onChange={setJobRankFilter}
                className="min-w-[150px] rounded-xl"
                size="large"
              >
                <Select.Option value="all">{t('hr.dashboard.allJobRanks')}</Select.Option>
                <Select.Option value="Department Head">{translateJobRank('Department Head')}</Select.Option>
                <Select.Option value="Supervisor">{translateJobRank('Supervisor')}</Select.Option>
                <Select.Option value="Field">{translateJobRank('Field')}</Select.Option>
              </Select>
              <Select
                placeholder={t('hr.dashboard.filterByStatus')}
                value={statusFilter}
                onChange={setStatusFilter}
                className="min-w-[150px] rounded-xl"
                size="large"
              >
                <Select.Option value="all">{t('hr.dashboard.allStatuses')}</Select.Option>
                <Select.Option value="present">{t('hr.dashboard.present')}</Select.Option>
                <Select.Option value="absent">{t('hr.dashboard.absent')}</Select.Option>
                <Select.Option value="leave">{t('hr.dashboard.onLeave')}</Select.Option>
                <Select.Option value="late">{t('hr.dashboard.late')}</Select.Option>
              </Select>
            </div>
          </Card>
        )}

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BellOutlined className="text-warning text-xl" />
              <h3 className="text-lg font-bold text-gray-900">{t('hr.dashboard.alerts.title')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {alerts.map((alert, index) => (
                <Alert
                  key={index}
                  message={
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => handleAlertClick(alert.alertType)}
                    >
                      <span className="font-semibold">{alert.message}</span>
                      <Badge count={alert.count} showZero style={{ backgroundColor: alert.type === 'error' ? '#ff4d4f' : '#faad14' }} />
                    </div>
                  }
                  type={alert.type}
                  showIcon
                  className="rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                />
              ))}
          </div>
        </div>
        )}

        {/* Alert Details Drawer */}
        <Drawer
          title={
            <div className="flex items-center gap-2">
              <BellOutlined className="text-warning text-xl" />
              <span>
                {selectedAlertType === 'incompleteFiles' && t('hr.dashboard.alerts.incompleteFiles')}
                {selectedAlertType === 'expiringContracts' && t('hr.dashboard.alerts.expiringContracts')}
                {selectedAlertType === 'repeatedLate' && t('hr.dashboard.alerts.repeatedLate')}
              </span>
            </div>
          }
          placement="right"
          onClose={() => {
            setAlertDetailsOpen(false);
            setSelectedAlertType(null);
          }}
          open={alertDetailsOpen}
          width={window.innerWidth < 768 ? '100%' : 600}
        >
          <Table
            dataSource={getAlertDetails}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            columns={selectedAlertType === 'incompleteFiles' ? [
              {
                title: t('hr.form.name'),
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: t('hr.form.department'),
                dataIndex: 'department',
                key: 'department',
                render: (dept: string) => translateDepartment(dept),
              },
              {
                title: t('hr.form.jobRank'),
                dataIndex: 'jobRank',
                key: 'jobRank',
                render: (rank: string) => translateJobRank(rank),
              },
              {
                title: t('hr.dashboard.missingItems') || 'الملفات الناقصة',
                dataIndex: 'missingItems',
                key: 'missingItems',
                render: (items: string) => (
                  <Tag color="warning">{items}</Tag>
                ),
              },
              {
                title: t('centers.viewDetails') || 'الإجراءات',
                key: 'actions',
                render: (_, record: Employee) => (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => navigate(`/hr/employees?employeeId=${record.id}`)}
                  >
                    {t('centers.viewDetails') || 'عرض التفاصيل'}
                  </Button>
                ),
              },
            ] : selectedAlertType === 'expiringContracts' ? [
              {
                title: t('hr.form.name'),
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: t('hr.form.department'),
                dataIndex: 'department',
                key: 'department',
                render: (dept: string) => translateDepartment(dept),
              },
              {
                title: t('hr.form.contractEndDate'),
                dataIndex: 'contractEndDate',
                key: 'contractEndDate',
              },
              {
                title: t('hr.dashboard.daysRemaining') || 'الأيام المتبقية',
                dataIndex: 'daysRemaining',
                key: 'daysRemaining',
                render: (days: number) => (
                  <Tag color={days <= 7 ? 'error' : days <= 15 ? 'warning' : 'default'}>
                    {days} {t('hr.dashboard.days') || 'يوم'}
                  </Tag>
                ),
              },
              {
                title: t('centers.viewDetails') || 'الإجراءات',
                key: 'actions',
                render: (_, record: Employee) => (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => navigate(`/hr/employees?employeeId=${record.id}`)}
                  >
                    {t('centers.viewDetails') || 'عرض التفاصيل'}
                  </Button>
                ),
              },
            ] : [
              {
                title: t('hr.form.name'),
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: t('hr.form.department'),
                dataIndex: 'department',
                key: 'department',
                render: (dept: string) => translateDepartment(dept),
              },
              {
                title: t('hr.dashboard.delayMinutes') || 'دقائق التأخير',
                dataIndex: 'delay',
                key: 'delay',
                render: (delay: number) => (
                  <Tag color="warning">{delay} {t('hr.dashboard.minutes') || 'دقيقة'}</Tag>
                ),
              },
              {
                title: t('centers.viewDetails') || 'الإجراءات',
                key: 'actions',
                render: (_, record: any) => (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => navigate(`/hr/attendance`)}
                  >
                    {t('centers.viewDetails') || 'عرض التفاصيل'}
                  </Button>
                ),
              },
            ]}
          />
        </Drawer>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Employees Card */}
          <Card 
            className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
            onClick={() => navigate('/hr/employees')}
          >
            <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('hr.totalEmployees')}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-mainColor">{filteredEmployees.length}</p>
                </div>
                <div className="w-12 h-12 bg-mainColor/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TeamOutlined className="text-2xl text-mainColor" />
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('hr.form.departmentHead')}</span>
                  <span className="font-bold text-mainColor">{jobRankStats.departmentHead}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('hr.form.supervisor')}</span>
                  <span className="font-bold text-primary">{jobRankStats.supervisor}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('hr.form.field')}</span>
                  <span className="font-bold text-info">{jobRankStats.field}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Attendance Card */}
          <Card 
            className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
            onClick={() => navigate('/hr/attendance')}
          >
            <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('hr.attendance.title')}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">{mockAttendance.present}</p>
                  <p className="text-xs text-gray-500 mt-1">{t('hr.dashboard.presentToday')}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircleOutlined className="text-2xl text-primary" />
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('hr.dashboard.absent')}</span>
                  <Tag color="error">{mockAttendance.absent}</Tag>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('hr.dashboard.late')}</span>
                  <Tag color="warning">{mockAttendance.late}</Tag>
                </div>
                {mockAttendance.lateDetails.length > 0 && (
                  <div className="text-xs text-gray-500 mt-2">
                    {t('hr.dashboard.lateDetails')}: {Math.round(mockAttendance.lateDetails.reduce((sum, d) => sum + d.delay, 0) / mockAttendance.lateDetails.length)} {t('hr.dashboard.minutes') || 'دقيقة'}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Leaves Card */}
          <Card 
            className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
            onClick={() => navigate('/hr/leaves')}
          >
            <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('hr.leaves.title')}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">{mockLeaves.today}</p>
                  <p className="text-xs text-gray-500 mt-1">{t('hr.dashboard.leavesToday')}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CalendarOutlined className="text-2xl text-purple-600" />
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('hr.dashboard.upcomingLeaves')}</span>
                  <Tag color="blue">{mockLeaves.upcoming}</Tag>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('hr.dashboard.completedLeaves')}</span>
                  <Tag color="default">{mockLeaves.completed}</Tag>
                </div>
              </div>
            </div>
          </Card>

          {/* Shift Schedules Card */}
          <Card 
            className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
            onClick={() => navigate('/hr/shift-schedules')}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('hr.shifts.title')}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-info">{mockShifts.active}</p>
                  <p className="text-xs text-gray-500 mt-1">{t('hr.dashboard.activeShifts')}</p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ClockCircleOutlined className="text-2xl text-info" />
          </div>
        </div>
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('hr.dashboard.shiftsToday')}</span>
                  <Tag color="processing">{mockShifts.today}</Tag>
                </div>
                {mockShifts.alerts > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('hr.dashboard.staffShortage')}</span>
                    <Tag color="error">{mockShifts.alerts}</Tag>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Administrative Operations Card */}
          <Card className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                  <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('hr.dashboard.adminOperations')}</p>
                </div>
                <div className="w-12 h-12 bg-mainColor/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileTextOutlined className="text-2xl text-mainColor" />
                </div>
              </div>
              <div className="pt-3 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('hr.checkboxes.nuskCardIssued')}</span>
                  <Tag color="success">{adminStats.nuskCardsPrinted}</Tag>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('hr.checkboxes.registeredInAjir')}</span>
                  <Tag color="success">{adminStats.registeredInAjir}</Tag>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('hr.dashboard.incompleteFiles')}</span>
                  <Tag color="error">{adminStats.incompleteFiles}</Tag>
                </div>
              </div>
                  </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                  <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">{t('hr.dashboard.quickActions')}</p>
                  </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ThunderboltOutlined className="text-2xl text-primary" />
                </div>
              </div>
              <div className="pt-3 space-y-2">
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  block 
                  className="mb-2"
                  onClick={() => navigate('/hr/employees')}
                >
                  {t('hr.addEmployee')}
                </Button>
                <Button 
                  icon={<CheckCircleOutlined />} 
                  block 
                  className="mb-2"
                  onClick={() => navigate('/hr/attendance')}
                >
                  {t('hr.dashboard.manualAttendance')}
                </Button>
                <Button 
                  icon={<CalendarOutlined />} 
                  block 
                  className="mb-2"
                  onClick={() => navigate('/hr/leaves')}
                >
                  {t('hr.dashboard.addLeave')}
                </Button>
                <Button
                  icon={<FileTextOutlined />} 
                  block
                  onClick={() => navigate('/hr/employees')}
                >
                  {t('hr.dashboard.reviewPending')}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {/* Daily Attendance Chart */}
          <Card className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('hr.dashboard.dailyAttendanceChart')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#00796B" name={t('hr.dashboard.present')} />
                <Bar dataKey="absent" fill="#f5222d" name={t('hr.dashboard.absent')} />
                <Bar dataKey="late" fill="#faad14" name={t('hr.dashboard.late')} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Job Rank Distribution Chart */}
          <Card className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('hr.dashboard.jobRankDistribution')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jobRankChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jobRankChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Leaves Chart */}
          <Card className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('hr.dashboard.leavesChart')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leavesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="leaves" stroke="#00796B" strokeWidth={2} name={t('hr.leaves.title')} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
              </div>

        {/* Checklist Status */}
        <Card className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <IdcardOutlined className="text-mainColor text-xl" />
            <h3 className="text-lg font-bold text-gray-900">{t('hr.dashboard.checklistStatus')}</h3>
                          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{t('hr.checkboxes.nuskCardIssued')}</span>
                {adminStats.nuskCardsPrinted === employees.length ? (
                  <CheckOutlined className="text-success text-lg" />
                ) : (
                  <CloseOutlined className="text-danger text-lg" />
                          )}
                        </div>
              <div className="text-2xl font-bold text-mainColor">{adminStats.nuskCardsPrinted}/{employees.length}</div>
              <div className="text-xs text-gray-500 mt-1">
                {adminStats.nuskCardsPrinted === employees.length 
                  ? t('hr.dashboard.completed')
                  : t('hr.dashboard.incomplete')
                }
                              </div>
                            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{t('hr.checkboxes.registeredInAjir')}</span>
                {adminStats.registeredInAjir === employees.length ? (
                  <CheckOutlined className="text-success text-lg" />
                ) : (
                  <CloseOutlined className="text-danger text-lg" />
                )}
              </div>
              <div className="text-2xl font-bold text-primary">{adminStats.registeredInAjir}/{employees.length}</div>
              <div className="text-xs text-gray-500 mt-1">
                {adminStats.registeredInAjir === employees.length 
                  ? t('hr.dashboard.completed')
                  : t('hr.dashboard.incomplete')
                }
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{t('hr.checkboxes.employeeCardPrinted')}</span>
                {adminStats.nuskCardsPrinted === employees.length ? (
                  <CheckOutlined className="text-success text-lg" />
                ) : (
                  <CloseOutlined className="text-danger text-lg" />
                )}
            </div>
              <div className="text-2xl font-bold text-info">
                {employees.filter(e => e.employeeCardPrinted).length}/{employees.length}
          </div>
              <div className="text-xs text-gray-500 mt-1">
                {employees.filter(e => e.employeeCardPrinted).length === employees.length 
                  ? t('hr.dashboard.completed')
                  : t('hr.dashboard.incomplete')
                }
        </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{t('hr.dashboard.completeFile')}</span>
                {adminStats.incompleteFiles === 0 ? (
                  <CheckOutlined className="text-success text-lg" />
                ) : (
                  <CloseOutlined className="text-danger text-lg" />
                )}
            </div>
              <div className="text-2xl font-bold text-warning">
                {employees.length - adminStats.incompleteFiles}/{employees.length}
          </div>
              <div className="text-xs text-gray-500 mt-1">
                {adminStats.incompleteFiles === 0 
                  ? t('hr.dashboard.completed')
                  : t('hr.dashboard.incomplete')
                }
        </div>
            </div>
          </div>
        </Card>

        {/* Admin Checklist Table */}
        <AdminChecklist employees={filteredEmployees} />
        </div>
    </div>
  );
};

export default HRDashboardPage;
