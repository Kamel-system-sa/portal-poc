import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  ApartmentOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Card, Button, Tag, Select, DatePicker, Input, Badge, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { getEmployees } from '../../data/employeesStorage';
import type { Employee } from '../../data/mockEmployees';
import { translateEmployeeName, translateDepartment } from '../../utils';
import { EmployeeCard } from '../../components/HR/EmployeeCard';

type AttendanceStatus = 'present' | 'late' | 'absent' | 'leave';
type ViewMode = 'daily' | 'weekly' | 'monthly';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  notes?: string;
}

const AttendancePage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [searchValue, setSearchValue] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  useEffect(() => {
    const loadedEmployees = getEmployees();
    setEmployees(loadedEmployees);
    
    // Check if there are existing records
    const stored = localStorage.getItem('hr_attendance');
    if (stored) {
      const parsedRecords = JSON.parse(stored);
      if (parsedRecords.length > 0) {
        setAttendanceRecords(parsedRecords);
        return;
      }
    }
    
    // Generate comprehensive mock attendance data
    const mockRecords: AttendanceRecord[] = [];
    const today = dayjs();
    
    loadedEmployees.forEach((employee, empIndex) => {
      // Generate records for the last 30 days
      for (let i = 0; i < 30; i++) {
        const date = today.subtract(i, 'day');
        const dayOfWeek = date.day(); // 0 = Sunday, 6 = Saturday
        
        // Skip weekends (Friday = 5, Saturday = 6)
        if (dayOfWeek === 5 || dayOfWeek === 6) {
          continue;
        }
        
        // Determine status based on employee index and day
        let status: AttendanceStatus;
        const random = Math.random();
        
        if (random < 0.7) {
          status = 'present';
        } else if (random < 0.85) {
          status = 'late';
        } else if (random < 0.95) {
          status = 'absent';
        } else {
          status = 'leave';
        }
        
        let checkIn: string | undefined;
        let checkOut: string | undefined;
        let notes: string | undefined;
        
        if (status === 'present') {
          // Normal check-in: 7:30 - 8:30
          const checkInHour = 7 + Math.floor(Math.random() * 2);
          const checkInMinute = Math.floor(Math.random() * 60);
          checkIn = `${String(checkInHour).padStart(2, '0')}:${String(checkInMinute).padStart(2, '0')}`;
          
          // Normal check-out: 15:30 - 17:00
          const checkOutHour = 15 + Math.floor(Math.random() * 2);
          const checkOutMinute = Math.floor(Math.random() * 60);
          checkOut = `${String(checkOutHour).padStart(2, '0')}:${String(checkOutMinute).padStart(2, '0')}`;
        } else if (status === 'late') {
          // Late check-in: 8:30 - 10:00
          const checkInHour = 8 + Math.floor(Math.random() * 2);
          const checkInMinute = 30 + Math.floor(Math.random() * 30);
          checkIn = `${String(checkInHour).padStart(2, '0')}:${String(Math.min(checkInMinute, 59)).padStart(2, '0')}`;
          
          // Normal check-out
          const checkOutHour = 15 + Math.floor(Math.random() * 2);
          const checkOutMinute = Math.floor(Math.random() * 60);
          checkOut = `${String(checkOutHour).padStart(2, '0')}:${String(checkOutMinute).padStart(2, '0')}`;
          
          notes = 'تأخر في الحضور';
        } else if (status === 'absent') {
          notes = 'غياب بدون عذر';
        } else if (status === 'leave') {
          notes = 'إجازة رسمية';
        }
        
        mockRecords.push({
          id: `ATT-${employee.id}-${date.format('YYYY-MM-DD')}`,
          employeeId: employee.id,
          employeeName: translateEmployeeName(employee.name, employee.id),
          date: date.format('YYYY-MM-DD'),
          checkIn,
          checkOut,
          status,
          notes,
        });
      }
    });
    
    localStorage.setItem('hr_attendance', JSON.stringify(mockRecords));
    setAttendanceRecords(mockRecords);
  }, []);

  const getDateRange = () => {
    switch (viewMode) {
      case 'daily':
        return [selectedDate];
      case 'weekly':
        const start = selectedDate.startOf('week');
        return Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));
      case 'monthly':
        const monthStart = selectedDate.startOf('month');
        const daysInMonth = selectedDate.daysInMonth();
        return Array.from({ length: daysInMonth }, (_, i) => monthStart.add(i, 'day'));
      default:
        return [selectedDate];
    }
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

  const getAttendanceForDate = (date: Dayjs, employeeId: string): AttendanceRecord | undefined => {
    return attendanceRecords.find(
      record => record.employeeId === employeeId && record.date === date.format('YYYY-MM-DD')
    );
  };

  const getStatusColor = (status: AttendanceStatus) => {
    const colors: Record<AttendanceStatus, string> = {
      present: 'success',
      late: 'warning',
      absent: 'error',
      leave: 'processing',
    };
    return colors[status];
  };

  const getStatusLabel = (status: AttendanceStatus) => {
    const labels: Record<AttendanceStatus, string> = {
      present: t('hr.attendance.present'),
      late: t('hr.attendance.late'),
      absent: t('hr.attendance.absent'),
      leave: t('hr.attendance.onLeave'),
    };
    return labels[status];
  };

  const getStatusBadgeColor = (status: AttendanceStatus) => {
    const colors: Record<AttendanceStatus, string> = {
      present: '#52c41a',
      late: '#faad14',
      absent: '#ff4d4f',
      leave: '#1890ff',
    };
    return colors[status];
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEmployeeModalOpen(true);
  };

  const stats = useMemo(() => {
    const dateRange = getDateRange();
    const dateStrings = dateRange.map(d => d.format('YYYY-MM-DD'));
    const relevantRecords = attendanceRecords.filter(r => dateStrings.includes(r.date));

    const presentCount = relevantRecords.filter(r => r.status === 'present').length;
    const lateCount = relevantRecords.filter(r => r.status === 'late').length;
    const absentCount = relevantRecords.filter(r => r.status === 'absent').length;
    const leaveCount = relevantRecords.filter(r => r.status === 'leave').length;
    const totalEmployees = filteredEmployees.length;
    const totalRecords = relevantRecords.length;

    const checkInTimes = relevantRecords
      .filter(r => (r.status === 'present' || r.status === 'late') && r.checkIn)
      .map(r => {
        const [hours, minutes] = r.checkIn!.split(':').map(Number);
        return hours * 60 + minutes;
      });
    const avgCheckInMinutes = checkInTimes.length > 0
      ? Math.round(checkInTimes.reduce((a, b) => a + b, 0) / checkInTimes.length)
      : null;
    const avgCheckInTime = avgCheckInMinutes
      ? `${Math.floor(avgCheckInMinutes / 60)}:${String(avgCheckInMinutes % 60).padStart(2, '0')}`
      : '-';

    return {
      present: presentCount,
      late: lateCount,
      absent: absentCount,
      leave: leaveCount,
      total: totalRecords,
      totalEmployees,
      attendanceRate: totalEmployees > 0 ? Math.round((presentCount + lateCount) / totalEmployees * 100) : 0,
      avgCheckInTime,
    };
  }, [attendanceRecords, viewMode, selectedDate, filteredEmployees]);

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
            {t('hr.attendance.title')}
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ClockCircleOutlined className="text-lg text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t('hr.attendance.title')}
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
                value={viewMode}
                onChange={(value) => setViewMode(value)}
                className="min-w-[120px] rounded-xl"
              >
                <Select.Option value="daily">{t('hr.attendance.daily')}</Select.Option>
                <Select.Option value="weekly">{t('hr.attendance.weekly')}</Select.Option>
                <Select.Option value="monthly">{t('hr.attendance.monthly')}</Select.Option>
              </Select>
              <DatePicker
                size="large"
                value={selectedDate}
                onChange={(date) => date && setSelectedDate(date)}
                picker={viewMode === 'monthly' ? 'month' : 'date'}
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
          <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircleOutlined className="text-green-600 text-xs" />
              </div>
              <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                {t('hr.attendance.present')}
              </h4>
              <p className="text-lg font-bold text-green-600">{stats.present}</p>
            </div>
          </Card>
          <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <ClockCircleOutlined className="text-orange-600 text-xs" />
              </div>
              <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                {t('hr.attendance.late')}
              </h4>
              <p className="text-lg font-bold text-orange-600">{stats.late}</p>
            </div>
          </Card>
          <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <CloseCircleOutlined className="text-red-600 text-xs" />
              </div>
              <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                {t('hr.attendance.absent')}
              </h4>
              <p className="text-lg font-bold text-red-600">{stats.absent}</p>
            </div>
          </Card>
          <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <CalendarOutlined className="text-blue-600 text-xs" />
              </div>
              <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                {t('hr.attendance.onLeave')}
              </h4>
              <p className="text-lg font-bold text-blue-600">{stats.leave}</p>
            </div>
          </Card>
          <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <ExclamationCircleOutlined className="text-purple-600 text-xs" />
              </div>
              <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                {t('hr.attendance.total')}
              </h4>
              <p className="text-lg font-bold text-purple-600">{stats.total}</p>
            </div>
          </Card>
          <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserOutlined className="text-indigo-600 text-xs" />
              </div>
              <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                نسبة الحضور
              </h4>
              <p className="text-lg font-bold text-indigo-600">{stats.attendanceRate}%</p>
            </div>
          </Card>
          <Card className="bg-gray-50 rounded-lg border border-gray-200 hover:border-cyan-300 hover:shadow-sm transition-all duration-200" bodyStyle={{ padding: '10px' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                <ClockCircleOutlined className="text-cyan-600 text-xs" />
              </div>
              <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                متوسط الحضور
              </h4>
              <p className="text-base font-bold text-cyan-600">{stats.avgCheckInTime}</p>
            </div>
          </Card>
        </div>

        {/* Departments with Employees */}
        <div className="space-y-3">
          {Object.entries(groupedByDepartment).map(([department, deptEmployees]) => {
            const dateRange = getDateRange();
            
            return (
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
                    const attendanceRecordsForEmployee = dateRange.map(date => ({
                      date,
                      record: getAttendanceForDate(date, employee.id),
                    }));

                    return (
                      <Card
                        key={employee.id}
                        onClick={() => handleEmployeeClick(employee)}
                        className="bg-gray-50 rounded-lg border border-gray-200 hover:border-mainColor/30 hover:shadow-sm transition-all duration-200 cursor-pointer"
                        bodyStyle={{ padding: '10px' }}
                      >
                        {/* Employee Header */}
                        <div className="flex flex-col items-center gap-1 mb-2 pb-2 border-b border-gray-200">
                          <div className="w-8 h-8 rounded-full bg-mainColor/10 flex items-center justify-center">
                            <UserOutlined className="text-mainColor text-xs" />
                          </div>
                          <h4 className="font-semibold text-gray-900 text-xs text-center truncate w-full">
                            {translateEmployeeName(employee.name, employee.id)}
                          </h4>
                        </div>

                        {/* Attendance Records */}
                        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                          {attendanceRecordsForEmployee.map(({ date, record }) => (
                            <div
                              key={date.format('YYYY-MM-DD')}
                              className="bg-white rounded-lg p-1 border border-gray-200 text-center"
                            >
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <span className="text-[10px] font-semibold text-gray-700">
                                  {date.format('DD/MM')}
                                </span>
                                {record && (
                                  <Badge
                                    color={getStatusBadgeColor(record.status)}
                                    className="text-[8px]"
                                  />
                                )}
                              </div>
                              {record ? (
                                <div className="space-y-0.5">
                                  {record.checkIn && (
                                    <div className="flex items-center justify-center gap-1 text-[9px]">
                                      <ClockCircleOutlined className="text-green-600 text-[8px]" />
                                      <span className="text-gray-700 font-medium text-green-600">
                                        {record.checkIn}
                                      </span>
                                    </div>
                                  )}
                                  {record.checkOut && (
                                    <div className="flex items-center justify-center gap-1 text-[9px]">
                                      <ClockCircleOutlined className="text-red-600 text-[8px]" />
                                      <span className="text-gray-700 font-medium text-red-600">
                                        {record.checkOut}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-[9px] text-gray-400 text-center py-0.5">
                                  -
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </Card>
            );
          })}
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
      </div>
    </div>
  );
};

export default AttendancePage;
