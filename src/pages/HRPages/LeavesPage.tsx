import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Card, Button, Tag, DatePicker, Select, Input, Badge, Modal, Space, Popconfirm, Dropdown, Tooltip } from 'antd';
import { 
  CalendarOutlined, 
  FilterOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  CloseOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined as CloseIcon,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getEmployees } from '../../data/employeesStorage';
import type { Employee } from '../../data/mockEmployees';
import { translateEmployeeName, translateDepartment } from '../../utils';
import { EmployeeCard } from '../../components/HR/EmployeeCard';

interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'emergency' | 'other';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

const LeavesPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);
  
  // Filters
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const loadedEmployees = getEmployees();
    setEmployees(loadedEmployees);
    
    // Check if there are existing records
    const stored = localStorage.getItem('hr_leaves');
    if (stored) {
      const parsedLeaves = JSON.parse(stored);
      if (parsedLeaves.length > 0) {
        setLeaves(parsedLeaves);
        return;
      }
    }
    
    // Generate mock leave data
    const mockLeaves: Leave[] = [];
    const today = dayjs();
    const leaveTypes: ('annual' | 'sick' | 'emergency' | 'other')[] = ['annual', 'sick', 'emergency', 'other'];
    const statuses: ('pending' | 'approved' | 'rejected')[] = ['pending', 'approved', 'rejected'];
    
    loadedEmployees.forEach((employee, empIndex) => {
      // Generate 2-5 leaves per employee
      const numLeaves = 2 + Math.floor(Math.random() * 4);
      
      for (let i = 0; i < numLeaves; i++) {
        const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Random date in the past 6 months or future 3 months
        const daysOffset = -180 + Math.floor(Math.random() * 270);
        const startDate = today.add(daysOffset, 'day');
        const days = 1 + Math.floor(Math.random() * 7); // 1-7 days
        const endDate = startDate.add(days - 1, 'day');
        
        const reasons: Record<string, string> = {
          annual: 'إجازة سنوية',
          sick: 'إجازة مرضية',
          emergency: 'إجازة طارئة',
          other: 'إجازة شخصية',
        };
        
        mockLeaves.push({
          id: `LEAVE-${employee.id}-${i}-${Date.now()}`,
          employeeId: employee.id,
          employeeName: translateEmployeeName(employee.name, employee.id),
          leaveType,
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          days,
          status,
          reason: reasons[leaveType],
        });
      }
    });
    
    localStorage.setItem('hr_leaves', JSON.stringify(mockLeaves));
    setLeaves(mockLeaves);
  }, []);

  const getLeaveTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      annual: <CalendarOutlined className="text-blue-500" />,
      sick: <MedicineBoxOutlined className="text-red-500" />,
      emergency: <ThunderboltOutlined className="text-orange-500" />,
      other: <FileTextOutlined className="text-gray-500" />,
    };
    return icons[type] || <CalendarOutlined />;
  };

  const getLeaveTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      annual: t('hr.leaves.annual'),
      sick: t('hr.leaves.sick'),
      emergency: t('hr.leaves.emergency'),
      other: t('hr.leaves.other'),
    };
    return types[type] || type;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#faad14',
      approved: '#52c41a',
      rejected: '#ff4d4f',
    };
    return colors[status] || '#d9d9d9';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: t('hr.leaves.pending'),
      approved: t('hr.leaves.approved'),
      rejected: t('hr.leaves.rejected'),
    };
    return labels[status] || status;
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const searchLower = searchValue.toLowerCase();
      return (
        searchValue === '' ||
        translateEmployeeName(emp.name, emp.id).toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower)
      );
    });
  }, [employees, searchValue]);

  const groupedByDepartment = useMemo(() => {
    const groups: Record<string, Employee[]> = {};
    filteredEmployees.forEach(emp => {
      if (!groups[emp.department]) {
        groups[emp.department] = [];
      }
      groups[emp.department].push(emp);
    });
    return groups;
  }, [filteredEmployees]);

  const getEmployeeLeaves = (employeeId: string) => {
    let employeeLeaves = leaves.filter(l => l.employeeId === employeeId);
    
    if (typeFilter !== 'all') {
      employeeLeaves = employeeLeaves.filter(l => l.leaveType === typeFilter);
    }
    if (statusFilter !== 'all') {
      employeeLeaves = employeeLeaves.filter(l => l.status === statusFilter);
    }
    if (dateRange[0] && dateRange[1]) {
      employeeLeaves = employeeLeaves.filter(l => {
        const start = dayjs(l.startDate);
        const end = dayjs(l.endDate);
        return (start.isAfter(dateRange[0]) || start.isSame(dateRange[0], 'day')) &&
               (end.isBefore(dateRange[1]) || end.isSame(dateRange[1], 'day'));
      });
    }
    
    return employeeLeaves;
  };

  const handleEmployeeClick = (employee: Employee, leave?: Leave) => {
    if (leave) {
      // If clicking on a leave, show leave details
      setSelectedLeave(leave);
      setIsLeaveModalOpen(true);
    } else {
      // If clicking on employee card, show dropdown menu
      setSelectedEmployee(employee);
    }
  };

  const handleShowEmployeeDetails = () => {
    if (selectedEmployee) {
      setIsEmployeeModalOpen(true);
    }
  };

  const handleShowLeaveDetails = (leave: Leave) => {
    setSelectedLeave(leave);
    setIsLeaveModalOpen(true);
  };

  const handleApproveLeave = () => {
    if (selectedLeave) {
      const updatedLeaves = leaves.map(l => 
        l.id === selectedLeave.id ? { ...l, status: 'approved' as const } : l
      );
      localStorage.setItem('hr_leaves', JSON.stringify(updatedLeaves));
      setLeaves(updatedLeaves);
      setIsLeaveModalOpen(false);
      setSelectedLeave(null);
      setPendingAction(null);
    }
  };

  const handleRejectLeave = () => {
    if (selectedLeave) {
      const updatedLeaves = leaves.map(l => 
        l.id === selectedLeave.id ? { ...l, status: 'rejected' as const } : l
      );
      localStorage.setItem('hr_leaves', JSON.stringify(updatedLeaves));
      setLeaves(updatedLeaves);
      setIsLeaveModalOpen(false);
      setSelectedLeave(null);
      setPendingAction(null);
    }
  };

  const handleApproveClick = (leave: Leave) => {
    setSelectedLeave(leave);
    setPendingAction('approve');
    setIsLeaveModalOpen(true);
  };

  const handleRejectClick = (leave: Leave) => {
    setSelectedLeave(leave);
    setPendingAction('reject');
    setIsLeaveModalOpen(true);
  };

  const stats = useMemo(() => {
    const totalLeaves = leaves.length;
    const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
    const approvedLeaves = leaves.filter(l => l.status === 'approved').length;
    const rejectedLeaves = leaves.filter(l => l.status === 'rejected').length;
    const annualLeaves = leaves.filter(l => l.leaveType === 'annual').length;
    const sickLeaves = leaves.filter(l => l.leaveType === 'sick').length;
    const emergencyLeaves = leaves.filter(l => l.leaveType === 'emergency').length;

    return {
      total: totalLeaves,
      pending: pendingLeaves,
      approved: approvedLeaves,
      rejected: rejectedLeaves,
      annual: annualLeaves,
      sick: sickLeaves,
      emergency: emergencyLeaves,
    };
  }, [leaves]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-5 space-y-3">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-0">
          <Breadcrumb.Item>
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-mainColor text-xs transition-colors">
              {t('hr.breadcrumbs.home')}
            </button>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <button onClick={() => navigate('/hr')} className="text-gray-500 hover:text-mainColor text-xs transition-colors">
              {t('hr.breadcrumbs.hr')}
            </button>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="text-mainColor font-semibold text-xs">
            {t('hr.leaves.title')}
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <CalendarOutlined className="text-lg text-purple-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t('hr.leaves.title')}
            </h1>
          </div>
          <Button
            type={isFilterOpen ? 'primary' : 'default'}
            size="large"
            icon={<FilterOutlined />}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="rounded-xl"
          >
            {t('hr.filters.status')}
          </Button>
        </div>

        {/* Filter Card - Collapsible */}
        {isFilterOpen && (
          <Card className="bg-white rounded-xl shadow-md border border-gray-100 p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FilterOutlined className="text-mainColor" />
                <span className="font-semibold text-sm text-gray-900">{t('hr.filters.status')}</span>
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
                size="large"
                value={typeFilter}
                onChange={setTypeFilter}
                className="min-w-[120px] rounded-xl"
              >
                <Select.Option value="all">{t('hr.filters.all')}</Select.Option>
                <Select.Option value="annual">{t('hr.leaves.annual')}</Select.Option>
                <Select.Option value="sick">{t('hr.leaves.sick')}</Select.Option>
                <Select.Option value="emergency">{t('hr.leaves.emergency')}</Select.Option>
                <Select.Option value="other">{t('hr.leaves.other')}</Select.Option>
              </Select>
              <Select
                size="large"
                value={statusFilter}
                onChange={setStatusFilter}
                className="min-w-[120px] rounded-xl"
              >
                <Select.Option value="all">{t('hr.filters.all')}</Select.Option>
                <Select.Option value="pending">{t('hr.leaves.pending')}</Select.Option>
                <Select.Option value="approved">{t('hr.leaves.approved')}</Select.Option>
                <Select.Option value="rejected">{t('hr.leaves.rejected')}</Select.Option>
              </Select>
              <DatePicker.RangePicker
                size="large"
                value={dateRange as any}
                onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
                className="rounded-xl"
              />
              <Input
                size="large"
                placeholder={t('hr.searchPlaceholder')}
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                allowClear
                className="flex-1 min-w-[180px] rounded-xl"
              />
            </div>
          </Card>
        )}

        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <CalendarOutlined className="text-purple-600 text-xs" />
              </div>
              <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                {t('hr.attendance.total')}
              </h4>
              <p className="text-lg font-bold text-purple-600">{stats.total}</p>
            </div>
          </Card>
          <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <ClockCircleOutlined className="text-orange-600 text-xs" />
              </div>
              <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                {t('hr.leaves.pending')}
              </h4>
              <p className="text-lg font-bold text-orange-600">{stats.pending}</p>
            </div>
          </Card>
          <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircleOutlined className="text-green-600 text-xs" />
              </div>
              <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                {t('hr.leaves.approved')}
              </h4>
              <p className="text-lg font-bold text-green-600">{stats.approved}</p>
            </div>
          </Card>
          <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <CloseCircleOutlined className="text-red-600 text-xs" />
              </div>
              <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                {t('hr.leaves.rejected')}
              </h4>
              <p className="text-lg font-bold text-red-600">{stats.rejected}</p>
            </div>
          </Card>
          <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <CalendarOutlined className="text-blue-600 text-xs" />
              </div>
              <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                {t('hr.leaves.annual')}
              </h4>
              <p className="text-lg font-bold text-blue-600">{stats.annual}</p>
            </div>
          </Card>
          <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <MedicineBoxOutlined className="text-red-600 text-xs" />
              </div>
              <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                {t('hr.leaves.sick')}
              </h4>
              <p className="text-lg font-bold text-red-600">{stats.sick}</p>
            </div>
          </Card>
          <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <ThunderboltOutlined className="text-orange-600 text-xs" />
              </div>
              <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                {t('hr.leaves.emergency')}
              </h4>
              <p className="text-lg font-bold text-orange-600">{stats.emergency}</p>
            </div>
          </Card>
        </div>

        {/* Departments with Employees */}
        <div className="space-y-3">
          {Object.entries(groupedByDepartment).map(([department, deptEmployees]) => (
            <Card
              key={department}
              className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              bodyStyle={{ padding: '12px' }}
            >
              {/* Department Header */}
              <div className="bg-gradient-to-r from-mainColor/10 to-primary/10 border-b border-gray-200 p-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-mainColor/20 rounded-lg flex items-center justify-center">
                    <ApartmentOutlined className="text-mainColor text-base" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{translateDepartment(department)}</h3>
                </div>
              </div>

              {/* Employees Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
                {deptEmployees.map((employee) => {
                  const employeeLeaves = getEmployeeLeaves(employee.id);

                  const employeeMenuItems = [
                    {
                      key: 'employee-details',
                      label: (
                        <div className="flex items-center gap-2">
                          <UserOutlined />
                          <span>تفاصيل الموظف</span>
                        </div>
                      ),
                      onClick: () => {
                        setSelectedEmployee(employee);
                        setIsEmployeeModalOpen(true);
                      },
                    },
                    {
                      key: 'leaves-list',
                      label: (
                        <div className="flex items-center gap-2">
                          <CalendarOutlined />
                          <span>عرض جميع الإجازات</span>
                        </div>
                      ),
                      onClick: () => {
                        // Show all leaves for this employee
                        const allEmployeeLeaves = leaves.filter(l => l.employeeId === employee.id);
                        if (allEmployeeLeaves.length > 0) {
                          setSelectedLeave(allEmployeeLeaves[0]);
                          setIsLeaveModalOpen(true);
                        }
                      },
                    },
                  ];

                  return (
                    <Card
                      key={employee.id}
                      className="bg-gray-50 rounded-lg border border-gray-200 hover:border-mainColor/30 hover:shadow-sm transition-all duration-200"
                      bodyStyle={{ padding: '10px' }}
                    >
                      {/* Employee Header */}
                      <Dropdown
                        menu={{ items: employeeMenuItems }}
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <div className="flex flex-col items-center gap-1 mb-2 pb-2 border-b border-gray-200 cursor-pointer">
                          <div className="w-8 h-8 rounded-full bg-mainColor/10 flex items-center justify-center">
                            <UserOutlined className="text-mainColor text-xs" />
                          </div>
                          <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                            {translateEmployeeName(employee.name, employee.id)}
                          </h4>
                          <span className="text-[8px] text-gray-500">اضغط للخيارات</span>
                        </div>
                      </Dropdown>

                      {/* Leaves List */}
                      <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                        {employeeLeaves.length > 0 ? (
                          employeeLeaves.map((leave) => (
                            <div
                              key={leave.id}
                              className="bg-white rounded-lg p-1 border border-gray-200 text-center"
                            >
                              <div 
                                className="flex items-center justify-center gap-1 mb-1 cursor-pointer hover:bg-gray-50 rounded p-0.5"
                                onClick={() => handleShowLeaveDetails(leave)}
                              >
                                {getLeaveTypeIcon(leave.leaveType)}
                                <span className="text-[10px] font-semibold text-gray-700">
                                  {dayjs(leave.startDate).format('DD/MM')}
                                </span>
                                <Badge
                                  color={getStatusBadgeColor(leave.status)}
                                  className="text-[8px]"
                                />
                              </div>
                              <div className="space-y-0.5 mb-1">
                                <div className="text-[9px] text-gray-600">
                                  {leave.days} {t('hr.leaves.days')}
                                </div>
                                <div className="text-[9px] text-gray-500 truncate" title={leave.reason}>
                                  {leave.reason}
                                </div>
                              </div>
                              {leave.status === 'pending' && (
                                <div className="flex items-center justify-center gap-1 pt-1 border-t border-gray-100">
                                  <Tooltip title="قبول الإجازة">
                                    <Button
                                      type="text"
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleApproveClick(leave);
                                      }}
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50 px-2 h-6 flex items-center justify-center gap-1 text-[9px]"
                                    >
                                      <CheckOutlined />
                                      <span>قبول</span>
                                    </Button>
                                  </Tooltip>
                                  <Tooltip title="رفض الإجازة">
                                    <Button
                                      type="text"
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRejectClick(leave);
                                      }}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 h-6 flex items-center justify-center gap-1 text-[9px]"
                                    >
                                      <CloseIcon />
                                      <span>رفض</span>
                                    </Button>
                                  </Tooltip>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-[9px] text-gray-400 text-center py-1">
                            لا توجد إجازات
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        {/* Employee Details Modal */}
        {selectedEmployee && (
          <Modal
            title={
              <div className="flex items-center gap-2">
                <UserOutlined className="text-mainColor" />
                <span className="font-bold text-lg">{t('hr.employeeDetails')}</span>
              </div>
            }
            open={isEmployeeModalOpen}
            onCancel={() => {
              setIsEmployeeModalOpen(false);
              setSelectedEmployee(null);
            }}
            footer={null}
            width={900}
            className="rounded-2xl"
          >
            <div className="max-h-[80vh] overflow-y-auto pr-2">
              <EmployeeCard
                employee={selectedEmployee}
                onEdit={() => {}}
                onPrintCard={() => {}}
                onSendOffer={() => {}}
                onPrintContract={() => {}}
              />
            </div>
          </Modal>
        )}

        {/* Leave Details Modal */}
        {selectedLeave && (
          <Modal
            title={
              <div className="flex items-center gap-2">
                <CalendarOutlined className="text-mainColor" />
                <span className="font-bold text-lg">تفاصيل الإجازة</span>
              </div>
            }
            open={isLeaveModalOpen}
            onCancel={() => {
              setIsLeaveModalOpen(false);
              setSelectedLeave(null);
              setPendingAction(null);
            }}
            footer={
              selectedLeave.status === 'pending' && pendingAction ? (
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      setIsLeaveModalOpen(false);
                      setSelectedLeave(null);
                      setPendingAction(null);
                    }}
                    className="rounded-xl"
                  >
                    إلغاء
                  </Button>
                  {pendingAction === 'approve' ? (
                    <Button
                      type="primary"
                      onClick={handleApproveLeave}
                      className="rounded-xl bg-green-600 hover:bg-green-700"
                      icon={<CheckOutlined />}
                    >
                      قبول الإجازة
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      danger
                      onClick={handleRejectLeave}
                      className="rounded-xl"
                      icon={<CloseIcon />}
                    >
                      رفض الإجازة
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setIsLeaveModalOpen(false);
                    setSelectedLeave(null);
                    setPendingAction(null);
                  }}
                  className="rounded-xl"
                >
                  إغلاق
                </Button>
              )
            }
            width={600}
            className="rounded-2xl"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">الموظف</label>
                  <p className="text-base font-bold text-gray-900">{selectedLeave.employeeName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">نوع الإجازة</label>
                  <div className="flex items-center gap-2">
                    {getLeaveTypeIcon(selectedLeave.leaveType)}
                    <p className="text-base font-medium text-gray-900">{getLeaveTypeLabel(selectedLeave.leaveType)}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">تاريخ البدء</label>
                  <p className="text-base font-medium text-gray-900">
                    {dayjs(selectedLeave.startDate).format('DD/MM/YYYY')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">تاريخ الانتهاء</label>
                  <p className="text-base font-medium text-gray-900">
                    {dayjs(selectedLeave.endDate).format('DD/MM/YYYY')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">عدد الأيام</label>
                  <p className="text-base font-medium text-gray-900">{selectedLeave.days} يوم</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">الحالة</label>
                  <div>
                    <Badge
                      color={getStatusBadgeColor(selectedLeave.status)}
                      text={getStatusLabel(selectedLeave.status)}
                    />
                  </div>
                </div>
              </div>
              {selectedLeave.reason && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">السبب</label>
                  <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                    {selectedLeave.reason}
                  </p>
                </div>
              )}
              {pendingAction && (
                <div className={`p-4 rounded-lg ${pendingAction === 'approve' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`text-sm font-semibold ${pendingAction === 'approve' ? 'text-green-800' : 'text-red-800'}`}>
                    {pendingAction === 'approve' 
                      ? 'هل أنت متأكد من قبول هذه الإجازة؟' 
                      : 'هل أنت متأكد من رفض هذه الإجازة؟'}
                  </p>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default LeavesPage;
