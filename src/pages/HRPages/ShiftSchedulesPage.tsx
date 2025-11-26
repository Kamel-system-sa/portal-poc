import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Card, Tag, Select, Button, Modal, Form, Input, TimePicker } from 'antd';
import { 
  ClockCircleOutlined, 
  PlusOutlined,
  UserOutlined,
  ApartmentOutlined,
  FilterOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { getEmployees } from '../../data/employeesStorage';
import type { Employee } from '../../data/mockEmployees';
import { translateEmployeeName, translateDepartment, translateJobRank, translateShiftPeriod } from '../../utils';
import { EmployeeCard } from '../../components/HR/EmployeeCard';

const ShiftSchedulesPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'First' | 'Second' | 'Third' | 'All'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const loadedEmployees = getEmployees();
    setEmployees(loadedEmployees);
  }, []);

  const filteredEmployees = selectedPeriod === 'All'
    ? employees
    : employees.filter(emp => emp.shiftPeriod === selectedPeriod);

  const groupedByPeriodAndDepartment = useMemo(() => {
    const groups: Record<string, Record<string, Employee[]>> = {
      First: {},
      Second: {},
      Third: {},
    };
    
    filteredEmployees.forEach(emp => {
      if (groups[emp.shiftPeriod]) {
        if (!groups[emp.shiftPeriod][emp.department]) {
          groups[emp.shiftPeriod][emp.department] = [];
        }
        groups[emp.shiftPeriod][emp.department].push(emp);
      }
    });
    
    return groups;
  }, [filteredEmployees]);

  const getPeriodColor = (period: string) => {
    const colors: Record<string, string> = {
      First: 'blue',
      Second: 'green',
      Third: 'purple',
    };
    return colors[period] || 'default';
  };

  const getPeriodTime = (period: string) => {
    const times: Record<string, string> = {
      First: '8:00 - 14:00',
      Second: '14:00 - 22:00',
      Third: '22:00 - 8:00',
    };
    return times[period] || '';
  };

  const getPeriodBorderColor = (period: string) => {
    const colors: Record<string, string> = {
      First: 'border-blue-200',
      Second: 'border-green-200',
      Third: 'border-purple-200',
    };
    return colors[period] || 'border-gray-200';
  };

  const getPeriodBgColor = (period: string) => {
    const colors: Record<string, string> = {
      First: 'bg-blue-50',
      Second: 'bg-green-50',
      Third: 'bg-purple-50',
    };
    return colors[period] || 'bg-gray-50';
  };

  const handleAddShift = () => {
    form.resetFields();
    setIsAddModalOpen(true);
  };

  const handleSaveShift = (values: any) => {
    console.log('Saving shift:', values);
    setIsAddModalOpen(false);
    form.resetFields();
  };

  const getTotalEmployeesInPeriod = (period: string) => {
    const deptGroups = groupedByPeriodAndDepartment[period] || {};
    return Object.values(deptGroups).reduce((sum, dept) => sum + dept.length, 0);
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEmployeeModalOpen(true);
  };

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
            {t('hr.shifts.title')}
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
              <ClockCircleOutlined className="text-lg text-info" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t('hr.shifts.titleShort') || 'الفترات'}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              type={isFilterOpen ? 'primary' : 'default'}
              icon={<FilterOutlined />}
              size="large"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="rounded-xl"
            >
              {t('hr.filters.status')}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={handleAddShift}
              className="rounded-xl bg-gradient-to-r from-mainColor to-primary hover:from-mainColor/90 hover:to-primary/90"
            >
              {t('hr.shifts.addShift') || 'إضافة فترة جديدة'}
            </Button>
          </div>
        </div>

        {/* Filter Card - Collapsible */}
        {isFilterOpen && (
          <Card className="bg-white rounded-xl shadow-md border border-gray-100 p-3">
            <div className="flex items-center justify-between mb-2">
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
            <Select
              size="large"
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value)}
              className="w-full rounded-xl"
            >
              <Select.Option value="All">{t('hr.filters.all')}</Select.Option>
              <Select.Option value="First">{t('hr.shifts.firstShift')}</Select.Option>
              <Select.Option value="Second">{t('hr.shifts.secondShift')}</Select.Option>
              <Select.Option value="Third">{t('hr.shifts.thirdShift')}</Select.Option>
            </Select>
          </Card>
        )}

        {/* Shift Cards - Vertical Layout */}
        <div className="space-y-3">
          {(['First', 'Second', 'Third'] as const).map((period) => {
            const deptGroups = groupedByPeriodAndDepartment[period] || {};
            const totalEmployees = getTotalEmployeesInPeriod(period);
            
            return (
              <Card 
                key={period} 
                className={`bg-white rounded-xl shadow-md border-2 ${getPeriodBorderColor(period)} overflow-hidden`}
                bodyStyle={{ padding: '12px' }}
              >
                {/* Period Header */}
                <div className={`${getPeriodBgColor(period)} p-2 border-b-2 ${getPeriodBorderColor(period)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        period === 'First' ? 'bg-blue-100' : 
                        period === 'Second' ? 'bg-green-100' : 
                        'bg-purple-100'
                      }`}>
                        <ClockCircleOutlined className={`text-base ${
                          period === 'First' ? 'text-blue-600' : 
                          period === 'Second' ? 'text-green-600' : 
                          'text-purple-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                          {translateShiftPeriod(period)}
                        </h3>
                        <p className="text-xs text-gray-600 leading-tight">{getPeriodTime(period)}</p>
                      </div>
                    </div>
                    <Tag color={getPeriodColor(period)} className="text-xs font-semibold px-2 py-0.5">
                      {totalEmployees}
                    </Tag>
                  </div>
                </div>

                {/* Departments and Employees */}
                <div className="p-2">
                  {Object.keys(deptGroups).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {Object.entries(deptGroups).map(([department, deptEmployees], index, array) => {
                        const isLastInRow = (index + 1) % 3 === 0;
                        const isLastRow = index >= array.length - (array.length % 3 || 3);
                        return (
                        <div 
                          key={department} 
                          className={`space-y-1.5 ${
                            !isLastInRow && array.length > 1
                              ? 'md:border-r lg:border-r border-gray-200 pr-2'
                              : ''
                          } ${
                            !isLastRow && array.length > 3
                              ? 'pb-2 mb-2 border-b border-gray-200 md:border-b-0 lg:border-b-0'
                              : ''
                          }`}
                        >
                          {/* Department Header */}
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-lg border border-gray-200">
                            <ApartmentOutlined className="text-mainColor text-xs" />
                            <span className="text-xs font-bold text-gray-900">{translateDepartment(department)}</span>
                            <Tag color="default" className="text-[10px] px-1.5 py-0 h-4 leading-4">
                              {deptEmployees.length}
                            </Tag>
                          </div>
                          
                          {/* Employees Grid - Compact */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                            {deptEmployees.map((employee) => (
                              <Card
                                key={employee.id}
                                onClick={() => handleEmployeeClick(employee)}
                                className={`bg-white rounded-lg border transition-all duration-200 p-1.5 cursor-pointer text-center ${
                                  selectedEmployee?.id === employee.id
                                    ? 'border-mainColor bg-mainColor/5 shadow-sm'
                                    : 'border-gray-200 hover:shadow-sm hover:border-mainColor/30'
                                }`}
                                bodyStyle={{ padding: '8px' }}
                              >
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-8 h-8 rounded-full bg-mainColor/10 flex items-center justify-center">
                                    <UserOutlined className="text-mainColor text-xs" />
                                  </div>
                                  <div className="w-full">
                                    <h4 className="font-semibold text-gray-900 text-xs leading-tight mb-0.5 truncate">
                                      {translateEmployeeName(employee.name, employee.id)}
                                    </h4>
                                    <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500">
                                      <span>{translateJobRank(employee.jobRank)}</span>
                                      <span>•</span>
                                      <span>{employee.shiftDuration === '8h' ? t('hr.form.8h') : t('hr.form.12h')}</span>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <ClockCircleOutlined className="text-2xl text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">{t('hr.shifts.noEmployees')}</p>
                    </div>
                  )}
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

        {/* Add Shift Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <ClockCircleOutlined className="text-mainColor" />
              <span className="font-bold text-lg">{t('hr.shifts.addShift') || 'إضافة فترة جديدة'}</span>
            </div>
          }
          open={isAddModalOpen}
          onCancel={() => {
            setIsAddModalOpen(false);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          width={600}
          className="rounded-2xl"
          okButtonProps={{ className: 'rounded-xl' }}
          cancelButtonProps={{ className: 'rounded-xl' }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveShift}
            className="mt-4"
          >
            <Form.Item
              name="employeeId"
              label={<span className="font-semibold">{t('hr.form.name')}</span>}
              rules={[{ required: true }]}
            >
              <Select
                placeholder={t('hr.attendance.selectEmployee')}
                showSearch
                size="large"
                className="rounded-xl"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={employees.map(emp => ({
                  label: translateEmployeeName(emp.name, emp.id),
                  value: emp.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="shiftPeriod"
              label={<span className="font-semibold">{t('hr.form.shiftPeriod')}</span>}
              rules={[{ required: true }]}
            >
              <Select size="large" className="rounded-xl">
                <Select.Option value="First">{t('hr.shifts.firstShift')}</Select.Option>
                <Select.Option value="Second">{t('hr.shifts.secondShift')}</Select.Option>
                <Select.Option value="Third">{t('hr.shifts.thirdShift')}</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="shiftDuration"
              label={<span className="font-semibold">{t('hr.form.shiftDuration')}</span>}
              rules={[{ required: true }]}
            >
              <Select size="large" className="rounded-xl">
                <Select.Option value="8h">{t('hr.form.8h')}</Select.Option>
                <Select.Option value="12h">{t('hr.form.12h')}</Select.Option>
              </Select>
            </Form.Item>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="startTime"
                label={<span className="font-semibold">{t('hr.attendance.checkIn') || 'وقت البدء'}</span>}
              >
                <TimePicker format="HH:mm" className="w-full rounded-xl" size="large" />
              </Form.Item>
              <Form.Item
                name="endTime"
                label={<span className="font-semibold">{t('hr.attendance.checkOut') || 'وقت الانتهاء'}</span>}
              >
                <TimePicker format="HH:mm" className="w-full rounded-xl" size="large" />
              </Form.Item>
            </div>
            <Form.Item
              name="location"
              label={<span className="font-semibold">{t('hr.shifts.location') || 'الموقع'}</span>}
            >
              <Input size="large" className="rounded-xl" placeholder={t('hr.shifts.location') || 'الموقع'} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ShiftSchedulesPage;
