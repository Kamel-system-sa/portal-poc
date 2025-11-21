import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  MailOutlined,
  ExportOutlined,
  FileTextOutlined,
  CloseOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Input, Select, Checkbox, Space, Button } from 'antd';
import { ShiftSummary } from '../components/HR/ShiftSummary';
import { EmploymentForm } from '../components/HR/EmploymentForm';
import { EmployeeCard } from '../components/HR/EmployeeCard';
import { JobOfferScreen } from '../components/HR/JobOfferScreen';
import { DataExportScreen } from '../components/HR/DataExportScreen';
import { PrintScreen } from '../components/HR/PrintScreen';
import { EmployeeCardPrint } from '../components/HR/EmployeeCardPrint';
import { mockEmployees, type Employee } from '../data/mockEmployees';
import { ConfirmDeleteModal } from '../components/Centers/ConfirmDeleteModal';
import { translateNationality, translateDepartment, translateJobRank, translateEmployeeName } from '../utils';

const HRDashboardPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editEmployeeData, setEditEmployeeData] = useState<Employee | null>(null);
  const [isJobOfferOpen, setIsJobOfferOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isCardPrintOpen, setIsCardPrintOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Employee | null>(null);
  const [departmentPage, setDepartmentPage] = useState(1);
  const departmentsPerPage = 2;
  const [filters, setFilters] = useState({
    nationality: [] as string[],
    gender: [] as string[]
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setEmployees(mockEmployees);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter employees with real-time search
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const searchLower = searchValue.toLowerCase();
      const matchesSearch =
        searchValue === '' ||
        translateEmployeeName(emp.name, emp.id).toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.idNumber.includes(searchValue) ||
        emp.mobile.includes(searchValue);
      
      const matchesNationality =
        filters.nationality.length === 0 || filters.nationality.includes(emp.nationality);
      
      const matchesGender =
        filters.gender.length === 0 || filters.gender.includes(emp.gender);
      
      return matchesSearch && matchesNationality && matchesGender;
    });
  }, [employees, searchValue, filters]);

  // Group employees by department
  const groupedByDept = useMemo(() => {
    const grouped: Record<string, typeof filteredEmployees> = {};
    filteredEmployees.forEach(emp => {
      if (!grouped[emp.department]) {
        grouped[emp.department] = [];
      }
      grouped[emp.department].push(emp);
    });
    return grouped;
  }, [filteredEmployees]);

  // Get departments for current page
  const departmentEntries = Object.entries(groupedByDept);
  const totalDepartmentPages = Math.ceil(departmentEntries.length / departmentsPerPage);
  const startDeptIndex = (departmentPage - 1) * departmentsPerPage;
  const paginatedDepartments = departmentEntries.slice(startDeptIndex, startDeptIndex + departmentsPerPage);

  // Reset department page when filters change
  useEffect(() => {
    setDepartmentPage(1);
  }, [searchValue, filters]);

  const handleAddEmployee = () => {
    setEditEmployeeData(null);
    setIsAddFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditEmployeeData(employee);
    setIsAddFormOpen(true);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setDeleteConfirm(employee);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setEmployees(employees.filter(e => e.id !== deleteConfirm.id));
      if (selectedEmployee?.id === deleteConfirm.id) {
        setSelectedEmployee(null);
      }
      setDeleteConfirm(null);
    }
  };

  const handleSubmitEmployee = (employee: Employee) => {
    if (editEmployeeData) {
      setEmployees(employees.map(e => (e.id === employee.id ? employee : e)));
    } else {
      setEmployees([...employees, employee]);
    }
    setIsAddFormOpen(false);
    setEditEmployeeData(null);
  };

  const handleSendJobOffer = (email: string, subject: string, body: string) => {
    // Placeholder: In real app, this would send an email
    console.log('Sending job offer to:', email, subject, body);
    alert(t('hr.jobOffer.send') + ' ' + email);
  };

  // Summary calculations
  const totalEmployees = employees.length;
  const pendingContracts = employees.filter(
    e => new Date(e.contractEndDate) > new Date() && new Date(e.contractStartDate) <= new Date()
  ).length;
  const cardsPrinted = employees.filter(e => e.employeeCardPrinted).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingOutlined className="text-4xl text-mainColor mb-4" spin />
          <p className="text-gray-600">{t('hr.states.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ExclamationCircleOutlined className="text-4xl text-danger mb-4" />
          <p className="text-xl font-semibold text-gray-900 mb-2">{t('hr.states.error')}</p>
          <p className="text-gray-600">{t('hr.states.errorMessage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-mainColor">
              {t('hr.breadcrumbs.home')}
            </button>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="text-mainColor font-semibold">
            {t('hr.breadcrumbs.hr')}
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t('hr.breadcrumbs.dashboard')}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('hr.dashboard')}</h1>
            <p className="text-gray-600">{t('hr.title')}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setIsExportOpen(true)}
              className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-mainColor transition-all duration-200 font-semibold flex items-center gap-2 text-gray-700"
            >
              <ExportOutlined />
              {t('hr.actions.export')}
            </button>
            <button
              onClick={handleAddEmployee}
              className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center gap-2"
            >
              <PlusOutlined />
              {t('hr.addEmployee')}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('hr.totalEmployees')}</p>
                <p className="text-3xl font-bold text-mainColor">{totalEmployees}</p>
              </div>
              <div className="w-12 h-12 bg-mainColor/10 rounded-xl flex items-center justify-center">
                <UserOutlined className="text-2xl text-mainColor" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('hr.pendingContracts')}</p>
                <p className="text-3xl font-bold text-warning">{pendingContracts}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <FileTextOutlined className="text-2xl text-warning" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('hr.cardsPrinted')}</p>
                <p className="text-3xl font-bold text-success">{cardsPrinted}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <PrinterOutlined className="text-2xl text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                size="large"
                placeholder={t('hr.searchPlaceholder')}
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                allowClear
                className="rounded-xl"
              />
            </div>
            <Button
              type={isFiltersOpen ? 'primary' : 'default'}
              icon={<FilterOutlined />}
              size="large"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="rounded-xl"
            >
              {t('hr.filters.status')}
            </Button>
          </div>

          {/* Filters Panel */}
          {isFiltersOpen && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Space direction="vertical" size="middle" className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('hr.filters.nationality')}
                    </label>
                    <Select
                      mode="multiple"
                      size="large"
                      placeholder={t('hr.filters.selectNationality') || 'اختر الجنسية'}
                      value={filters.nationality}
                      onChange={(values) => setFilters({ ...filters, nationality: values })}
                      className="w-full"
                      style={{ borderRadius: '12px' }}
                      options={['السعودية', 'مصرية', 'أردنية', 'لبنانية', 'سورية', 'عراقية'].map(nat => ({
                        label: translateNationality(nat),
                        value: nat
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('hr.filters.gender')}
                    </label>
                    <Space>
                      <Checkbox
                        checked={filters.gender.includes('male')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, gender: [...filters.gender, 'male'] });
                          } else {
                            setFilters({ ...filters, gender: filters.gender.filter(g => g !== 'male') });
                          }
                        }}
                      >
                        {t('hr.form.male')}
                      </Checkbox>
                      <Checkbox
                        checked={filters.gender.includes('female')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, gender: [...filters.gender, 'female'] });
                          } else {
                            setFilters({ ...filters, gender: filters.gender.filter(g => g !== 'female') });
                          }
                        }}
                      >
                        {t('hr.form.female')}
                      </Checkbox>
                    </Space>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setFilters({ nationality: [], gender: [] });
                    setSearchValue('');
                  }}
                  className="rounded-xl"
                >
                  {t('hr.filters.reset')}
                </Button>
              </Space>
            </div>
          )}
        </div>

        {/* Shift Summary Tables - Always Visible */}
        <ShiftSummary 
          employees={employees} 
          onEmployeeClick={(employee) => {
            setSelectedEmployee(employee);
            // Scroll to employee details section
            setTimeout(() => {
              const detailsSection = document.getElementById('employee-details-section');
              if (detailsSection) {
                detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }}
        />

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee List - Grouped by Department */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('hr.employees')}</h2>
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <InboxOutlined className="text-5xl text-gray-400 mb-4" />
                <p className="text-gray-600 font-semibold mb-2">{t('hr.states.empty')}</p>
                <p className="text-sm text-gray-500 mb-4">{t('hr.states.emptyMessage')}</p>
                <button
                  onClick={handleAddEmployee}
                  className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 font-semibold"
                >
                  <PlusOutlined className="mr-2" />
                  {t('hr.addEmployee')}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {paginatedDepartments.map(([department, deptEmployees]) => {
                    // Find the department manager (Department Head)
                    const manager = deptEmployees.find(emp => emp.jobRank === 'Department Head');
                    
                    return (
                      <div key={department} className="border-2 border-gray-200 rounded-lg p-2">
                        <div className="mb-1.5 pb-1.5 border-b border-gray-200">
                          <div className="flex items-center gap-1.5 mb-1">
                            <ApartmentOutlined className="text-mainColor text-xs" />
                            <h3 className="font-bold text-xs text-gray-900">
                              {translateDepartment(department)}
                            </h3>
                            <span className="text-[10px] text-gray-500">({deptEmployees.length})</span>
                          </div>
                          {manager && (
                            <div className="flex items-center gap-1.5 mt-1 px-1.5 py-0.5 bg-gradient-to-r from-mainColor/5 to-primary/5 rounded border border-mainColor/20">
                              <UserOutlined className="text-mainColor text-[10px]" />
                              <span className="text-[10px] font-semibold text-gray-700">
                                {t('hr.departmentManager')}:
                              </span>
                              <span className="text-[10px] font-bold text-mainColor">
                                {translateEmployeeName(manager.name, manager.id)}
                              </span>
                            </div>
                          )}
                        </div>
                      <div className="space-y-1 max-h-64 overflow-y-auto pr-1 dept-scrollbar">
                        {deptEmployees.map(employee => (
                          <div
                            key={employee.id}
                            onClick={() => setSelectedEmployee(employee)}
                            className={`p-1.5 rounded border transition-all duration-200 cursor-pointer ${
                              selectedEmployee?.id === employee.id
                                ? 'border-mainColor bg-mainColor/5'
                                : 'border-gray-200 hover:border-mainColor/40 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              {employee.profilePicture ? (
                                <img
                                  src={employee.profilePicture}
                                  alt={employee.name}
                                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-mainColor/20 flex items-center justify-center flex-shrink-0">
                                  <UserOutlined className="text-xs text-mainColor" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-xs text-gray-900 truncate">{translateEmployeeName(employee.name, employee.id)}</h4>
                                <p className="text-[10px] text-gray-500 truncate">{translateJobRank(employee.jobRank)}</p>
                              </div>
                              <div className="flex gap-0.5 flex-shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditEmployee(employee);
                                  }}
                                  className="p-0.5 text-mainColor hover:bg-mainColor/10 rounded transition"
                                  title={t('hr.actions.edit')}
                                >
                                  <EditOutlined className="text-xs" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCardPrintOpen(true);
                                    setSelectedEmployee(employee);
                                  }}
                                  className="p-0.5 text-primary hover:bg-primary/10 rounded transition"
                                  title={t('hr.actions.printCard')}
                                >
                                  <PrinterOutlined className="text-xs" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsJobOfferOpen(true);
                                    setSelectedEmployee(employee);
                                  }}
                                  className="p-0.5 text-info hover:bg-info/10 rounded transition"
                                  title={t('hr.actions.sendOffer')}
                                >
                                  <MailOutlined className="text-xs" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteEmployee(employee);
                                  }}
                                  className="p-0.5 text-danger hover:bg-danger/10 rounded transition"
                                  title={t('hr.actions.delete')}
                                >
                                  <DeleteOutlined className="text-xs" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    );
                  })}

                {/* Department Pagination */}
                {totalDepartmentPages > 1 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <button
                      onClick={() => setDepartmentPage(prev => Math.max(1, prev - 1))}
                      disabled={departmentPage === 1}
                      className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-mainColor transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm text-gray-700"
                    >
                      {t('hr.pagination.previous')}
                    </button>
                    <span className="text-sm text-gray-600 font-medium">
                      {t('hr.pagination.showing')} {startDeptIndex + 1}-{Math.min(startDeptIndex + departmentsPerPage, departmentEntries.length)} {t('hr.pagination.of')} {departmentEntries.length} {t('hr.departments.all')}
                    </span>
                    <button
                      onClick={() => setDepartmentPage(prev => Math.min(totalDepartmentPages, prev + 1))}
                      disabled={departmentPage === totalDepartmentPages}
                      className="px-4 py-2 bg-gradient-to-r from-mainColor to-primary text-white rounded-lg hover:from-mainColor/90 hover:to-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm shadow-md shadow-mainColor/20"
                    >
                      {t('hr.pagination.next')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Employee Card Preview */}
          <div id="employee-details-section">
            {selectedEmployee ? (
              <EmployeeCard
                employee={selectedEmployee}
                onEdit={() => handleEditEmployee(selectedEmployee)}
                onPrintCard={() => setIsCardPrintOpen(true)}
                onSendOffer={() => setIsJobOfferOpen(true)}
                onPrintContract={() => {
                  setIsPrintOpen(true);
                  // Set print type to contract
                }}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-12 border border-gray-100 text-center">
                <UserOutlined className="text-5xl text-gray-400 mb-4" />
                <p className="text-gray-600 font-semibold mb-2">{t('hr.employeeDetails')}</p>
                <p className="text-sm text-gray-500">{t('hr.noEmployees')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsAddFormOpen(false)} />
          <div className="relative w-full max-w-7xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                {editEmployeeData ? t('hr.editEmployee') : t('hr.addEmployee')}
              </h2>
              <button
                onClick={() => setIsAddFormOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
              <EmploymentForm
                initialData={editEmployeeData ?? undefined}
                onCancel={() => setIsAddFormOpen(false)}
                onSubmit={handleSubmitEmployee}
              />
            </div>
          </div>
        </div>
      )}

      {isJobOfferOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsJobOfferOpen(false)} />
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <div className="overflow-y-auto max-h-[90vh] p-6">
              <JobOfferScreen
                employee={selectedEmployee}
                onClose={() => setIsJobOfferOpen(false)}
                onSend={handleSendJobOffer}
              />
            </div>
          </div>
        </div>
      )}

      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsExportOpen(false)} />
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <div className="overflow-y-auto max-h-[90vh] p-6">
              <DataExportScreen
                employees={employees}
                onClose={() => setIsExportOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {isPrintOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsPrintOpen(false)} />
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <div className="overflow-y-auto max-h-[90vh] p-6">
              <PrintScreen
                employee={selectedEmployee ?? undefined}
                employees={employees}
                type={selectedEmployee ? 'contract' : 'report'}
                onClose={() => setIsPrintOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {isCardPrintOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsCardPrintOpen(false)} />
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <div className="overflow-y-auto max-h-[90vh] p-6">
              <EmployeeCardPrint
                employee={selectedEmployee}
                onClose={() => setIsCardPrintOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        message={deleteConfirm ? t('hr.deleteConfirmMessage', { name: deleteConfirm.name }) : undefined}
      />
    </div>
  );
};

export default HRDashboardPage;

