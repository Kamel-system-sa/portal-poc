import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Table, Tag, Space, Button, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, CloseCircleOutlined, PrinterOutlined, UserOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import type { Employee } from '../../data/mockEmployees';
import { translateEmployeeName, translateDepartment } from '../../utils';

interface AdminChecklistProps {
  employees: Employee[];
}

interface ChecklistData {
  id: string;
  name: string;
  department: string;
  nuskCardPrinted: boolean;
  registeredInAjir: boolean;
  employeeCardPrinted: boolean;
}

const AdminChecklist: React.FC<AdminChecklistProps> = ({ employees }) => {
  const { t } = useTranslation('common');
  const [searchTexts, setSearchTexts] = useState<Record<string, string>>({});
  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});

  const checklistData = useMemo(() => {
    return employees.map(emp => ({
      id: emp.id,
      name: translateEmployeeName(emp.name, emp.id),
      department: translateDepartment(emp.department),
      nuskCardPrinted: emp.nuskCardIssued,
      registeredInAjir: emp.registeredInAjir,
      employeeCardPrinted: emp.employeeCardPrinted,
    }));
  }, [employees]);

  // Get unique values for filter dropdowns
  const nameOptions = useMemo(() => {
    const names = new Set(checklistData.map(item => item.name));
    return Array.from(names).sort().map(name => ({
      text: name,
      value: name
    }));
  }, [checklistData]);

  const departmentOptions = useMemo(() => {
    const departments = new Set(checklistData.map(item => item.department));
    return Array.from(departments).sort().map(dept => ({
      text: dept,
      value: dept
    }));
  }, [checklistData]);

  const nuskCardOptions = useMemo(() => {
    return [
      { text: t('hr.checklist.printed') || 'مطبوعة', value: true },
      { text: t('hr.checklist.notPrinted') || 'غير مطبوعة', value: false }
    ];
  }, [t]);

  const ajirOptions = useMemo(() => {
    return [
      { text: t('hr.checklist.registered') || 'مسجل', value: true },
      { text: t('hr.checklist.notRegistered') || 'غير مسجل', value: false }
    ];
  }, [t]);

  const employeeCardOptions = useMemo(() => {
    return [
      { text: t('hr.checklist.printed') || 'مطبوعة', value: true },
      { text: t('hr.checklist.notPrinted') || 'غير مطبوعة', value: false }
    ];
  }, [t]);

  // Helper function to create filter dropdown with search
  const createFilterDropdown = (
    searchKey: string,
    options: Array<{ text: string; value: any }>,
    setSelectedKeys: (keys: any[]) => void,
    selectedKeys: any[],
    confirm: () => void,
    clearFilters?: () => void
  ) => {
    const searchText = searchTexts[searchKey] || '';
    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={t('centers.searchPlaceholder') || 'البحث...'}
          value={searchText}
          onChange={(e) => {
            setSearchTexts({ ...searchTexts, [searchKey]: e.target.value });
          }}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
          prefix={<SearchOutlined />}
        />
        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
          {options
            .filter(option => 
              !searchText || 
              option.text.toLowerCase().includes(searchText.toLowerCase())
            )
            .map(option => (
              <div
                key={String(option.value)}
                onClick={() => {
                  const newKeys = selectedKeys.includes(option.value)
                    ? selectedKeys.filter((key: any) => key !== option.value)
                    : [...selectedKeys, option.value];
                  setSelectedKeys(newKeys);
                }}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  backgroundColor: selectedKeys.includes(option.value) ? '#E6F7FF' : 'transparent',
                  borderRadius: 4,
                  marginBottom: 4
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedKeys.includes(option.value)}
                  onChange={() => {}}
                  style={{ marginRight: 8 }}
                />
                {option.text}
              </div>
            ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90 }}
          >
            {t('filters.apply') || 'تطبيق'}
          </Button>
          <Button
            onClick={() => {
              setSelectedKeys([]);
              setSearchTexts({ ...searchTexts, [searchKey]: '' });
              clearFilters?.();
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            {t('filters.reset') || 'إعادة'}
          </Button>
        </div>
      </div>
    );
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setFilteredInfo(filters);
  };

  const handleResetAllFilters = () => {
    setFilteredInfo({});
    setSearchTexts({});
  };

  const hasActiveFilters = Object.keys(filteredInfo).some(key => 
    filteredInfo[key] && filteredInfo[key].length > 0
  );

  const stats = useMemo(() => {
    return {
      nuskCardPrinted: employees.filter(e => e.nuskCardIssued).length,
      nuskCardNotPrinted: employees.filter(e => !e.nuskCardIssued).length,
      registeredInAjir: employees.filter(e => e.registeredInAjir).length,
      notRegisteredInAjir: employees.filter(e => !e.registeredInAjir).length,
      employeeCardPrinted: employees.filter(e => e.employeeCardPrinted).length,
      employeeCardNotPrinted: employees.filter(e => !e.employeeCardPrinted).length,
    };
  }, [employees]);

  const columns: ColumnsType<ChecklistData> = [
    {
      title: t('hr.form.name') || 'الاسم',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left' as const,
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        createFilterDropdown('name', nameOptions, setSelectedKeys, selectedKeys, confirm, clearFilters),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#00796B' : undefined }} />
      ),
      onFilter: (value, record) => {
        if (!filteredInfo.name || filteredInfo.name.length === 0) return true;
        return filteredInfo.name.includes(record.name);
      },
      render: (name: string) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mainColor to-primary flex items-center justify-center">
            <UserOutlined className="text-white text-lg" />
          </div>
          <span className="font-semibold text-gray-900">{name}</span>
        </div>
      ),
    },
    {
      title: t('hr.form.department') || 'القسم',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      sorter: (a, b) => a.department.localeCompare(b.department),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        createFilterDropdown('department', departmentOptions, setSelectedKeys, selectedKeys, confirm, clearFilters),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#00796B' : undefined }} />
      ),
      onFilter: (value, record) => {
        if (!filteredInfo.department || filteredInfo.department.length === 0) return true;
        return filteredInfo.department.includes(record.department);
      },
      render: (dept: string) => (
        <span className="text-gray-700 font-medium">{dept}</span>
      ),
    },
    {
      title: t('hr.checklist.nuskCard') || 'بطاقة نسك',
      dataIndex: 'nuskCardPrinted',
      key: 'nuskCardPrinted',
      width: 150,
      align: 'center' as const,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        createFilterDropdown('nuskCard', nuskCardOptions, setSelectedKeys, selectedKeys, confirm, clearFilters),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#00796B' : undefined }} />
      ),
      onFilter: (value, record) => {
        if (!filteredInfo.nuskCardPrinted || filteredInfo.nuskCardPrinted.length === 0) return true;
        return filteredInfo.nuskCardPrinted.includes(record.nuskCardPrinted);
      },
      render: (printed: boolean) => (
        <Tag
          icon={printed ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={printed ? 'success' : 'error'}
          className="px-4 py-1.5 text-sm font-semibold rounded-lg"
        >
          {printed ? t('hr.checklist.printed') || 'مطبوعة' : t('hr.checklist.notPrinted') || 'غير مطبوعة'}
        </Tag>
      ),
    },
    {
      title: t('hr.checklist.ajir') || 'أجير',
      dataIndex: 'registeredInAjir',
      key: 'registeredInAjir',
      width: 150,
      align: 'center' as const,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        createFilterDropdown('ajir', ajirOptions, setSelectedKeys, selectedKeys, confirm, clearFilters),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#00796B' : undefined }} />
      ),
      onFilter: (value, record) => {
        if (!filteredInfo.registeredInAjir || filteredInfo.registeredInAjir.length === 0) return true;
        return filteredInfo.registeredInAjir.includes(record.registeredInAjir);
      },
      render: (registered: boolean) => (
        <Tag
          icon={registered ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={registered ? 'success' : 'error'}
          className="px-4 py-1.5 text-sm font-semibold rounded-lg"
        >
          {registered ? t('hr.checklist.registered') || 'مسجل' : t('hr.checklist.notRegistered') || 'غير مسجل'}
        </Tag>
      ),
    },
    {
      title: t('hr.checklist.employeeCard') || 'بطاقة الموظف',
      dataIndex: 'employeeCardPrinted',
      key: 'employeeCardPrinted',
      width: 150,
      align: 'center' as const,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        createFilterDropdown('employeeCard', employeeCardOptions, setSelectedKeys, selectedKeys, confirm, clearFilters),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#00796B' : undefined }} />
      ),
      onFilter: (value, record) => {
        if (!filteredInfo.employeeCardPrinted || filteredInfo.employeeCardPrinted.length === 0) return true;
        return filteredInfo.employeeCardPrinted.includes(record.employeeCardPrinted);
      },
      render: (printed: boolean) => (
        <Tag
          icon={printed ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={printed ? 'success' : 'error'}
          className="px-4 py-1.5 text-sm font-semibold rounded-lg"
        >
          {printed ? t('hr.checklist.printed') || 'مطبوعة' : t('hr.checklist.notPrinted') || 'غير مطبوعة'}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        <Card className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                {t('hr.checklist.nuskCardPrinted') || 'بطاقات نسك المطبوعة'}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-success">
                {stats.nuskCardPrinted} / {employees.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.nuskCardNotPrinted} {t('hr.checklist.notPrinted') || 'غير مطبوعة'}
              </p>
            </div>
            <PrinterOutlined className="text-2xl text-success" />
          </div>
        </Card>

        <Card className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                {t('hr.checklist.registeredInAjir') || 'المسجلون في أجير'}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-info">
                {stats.registeredInAjir} / {employees.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.notRegisteredInAjir} {t('hr.checklist.notRegistered') || 'غير مسجل'}
              </p>
            </div>
            <UserOutlined className="text-2xl text-info" />
          </div>
        </Card>

        <Card className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                {t('hr.checklist.employeeCardsPrinted') || 'بطاقات الموظفين المطبوعة'}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {stats.employeeCardPrinted} / {employees.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.employeeCardNotPrinted} {t('hr.checklist.notPrinted') || 'غير مطبوعة'}
              </p>
            </div>
            <PrinterOutlined className="text-2xl text-primary" />
          </div>
        </Card>
      </div>

      {/* Checklist Table - Enhanced Design */}
      <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 border border-gray-100 p-4 sm:p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
          {t('hr.checklist.title') || 'قائمة التحقق الإداري'}
        </h3>
        
        {hasActiveFilters && (
          <div className="mb-4 sm:mb-5 md:mb-6 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <span className="text-sm text-blue-700">
              {t('housing.showingResults') || 'عرض النتائج'} {checklistData.length} {t('housing.of') || 'من'} {employees.length} {t('hr.employees') || 'موظف'}
            </span>
            <Button
              icon={<ClearOutlined />}
              onClick={handleResetAllFilters}
              size="small"
            >
              {t('filters.reset') || 'إعادة الضبط'}
            </Button>
          </div>
        )}
        
        {checklistData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('hr.states.empty') || 'لا توجد بيانات'}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg">
            <Table
              dataSource={checklistData}
              columns={columns}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `${t('housing.total') || 'الإجمالي'}: ${total}`,
                className: 'px-4 py-2',
              }}
              scroll={{ x: 'max-content' }}
              onChange={handleTableChange}
              onRow={(record) => ({
                style: { cursor: 'default' },
                className: 'hover:bg-gray-50 transition-colors'
              })}
              className="checklist-table"
              size="middle"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChecklist;

