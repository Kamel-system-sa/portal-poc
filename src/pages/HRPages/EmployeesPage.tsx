import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  MailOutlined,
  CloseOutlined,
  InboxOutlined,
  ApartmentOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Input, Button, Card } from 'antd';
import { getEmployees, saveEmployee, deleteEmployee, type Employee } from '../../data/employeesStorage';
import { translateNationality, translateDepartment, translateJobRank, translateEmployeeName } from '../../utils';
import { ConfirmDeleteModal } from '../../components/Centers/ConfirmDeleteModal';
import { EmploymentForm } from '../../components/HR/EmploymentForm';
import { EmployeeCard } from '../../components/HR/EmployeeCard';
import { JobOfferScreen } from '../../components/HR/JobOfferScreen';
import { EmployeeCardPrint } from '../../components/HR/EmployeeCardPrint';

const EmployeesPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editEmployeeData, setEditEmployeeData] = useState<Employee | null>(null);
  const [isJobOfferOpen, setIsJobOfferOpen] = useState(false);
  const [isCardPrintOpen, setIsCardPrintOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Employee | null>(null);
  const [departmentPage, setDepartmentPage] = useState(1);
  const departmentsPerPage = 2;

  useEffect(() => {
    const loadedEmployees = getEmployees();
    setEmployees(loadedEmployees);
  }, []);

  // Filter employees with real-time search
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const searchLower = searchValue.toLowerCase();
      return (
        searchValue === '' ||
        translateEmployeeName(emp.name, emp.id).toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.idNumber.includes(searchValue) ||
        emp.mobile.includes(searchValue)
      );
    });
  }, [employees, searchValue]);

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

  // Reset department page when search changes
  useEffect(() => {
    setDepartmentPage(1);
  }, [searchValue]);

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
      deleteEmployee(deleteConfirm.id);
      setEmployees(employees.filter(e => e.id !== deleteConfirm.id));
      if (selectedEmployee?.id === deleteConfirm.id) {
        setSelectedEmployee(null);
      }
      setDeleteConfirm(null);
    }
  };

  const handleSubmitEmployee = (employee: Employee) => {
    saveEmployee(employee);
    if (editEmployeeData) {
      setEmployees(employees.map(e => (e.id === employee.id ? employee : e)));
    } else {
      setEmployees([...employees, employee]);
    }
    setIsAddFormOpen(false);
    setEditEmployeeData(null);
  };

  const handleSendJobOffer = (email: string, subject: string, body: string) => {
    console.log('Sending job offer to:', email, subject, body);
    alert(t('hr.jobOffer.send') + ' ' + email);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-x-hidden">
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        <Breadcrumb className="mb-0">
          <Breadcrumb.Item>
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-mainColor text-xs sm:text-sm">
              {t('hr.breadcrumbs.home')}
            </button>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <button onClick={() => navigate('/hr')} className="text-gray-500 hover:text-mainColor text-xs sm:text-sm">
              {t('hr.breadcrumbs.hr')}
            </button>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="text-mainColor font-semibold text-xs sm:text-sm">
            {t('hr.employees')}
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">
              {t('hr.employees')}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base break-words">
              {t('hr.employees')}
            </p>
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
              onClick={handleAddEmployee}
              className="rounded-xl"
            >
              {t('hr.addEmployee')}
            </Button>
          </div>
        </div>

        {/* Search - Collapsible */}
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
            <Input
              size="large"
              placeholder={t('hr.searchPlaceholder')}
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              allowClear
              className="rounded-xl"
            />
          </Card>
        )}

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {/* Employee List - Grouped by Department */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 sm:p-5 md:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{t('hr.employees')}</h2>
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
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setTimeout(() => {
                                const detailsSection = document.getElementById('employee-details-section');
                                if (detailsSection) {
                                  detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }, 100);
                            }}
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
                                <h4 className="font-semibold text-xs text-gray-900 truncate">
                                  {translateEmployeeName(employee.name, employee.id)}
                                </h4>
                                <p className="text-[10px] text-gray-500 truncate">
                                  {translateJobRank(employee.jobRank)}
                                </p>
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
                onPrintContract={() => {}}
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

export default EmployeesPage;
