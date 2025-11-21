import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ClockCircleOutlined,
  ApartmentOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { Employee } from '../../data/mockEmployees';
import { translateDepartment, translateEmployeeName } from '../../utils';

interface ShiftSummaryProps {
  employees: Employee[];
  onEmployeeClick?: (employee: Employee) => void;
}

export const ShiftSummary: React.FC<ShiftSummaryProps> = ({ employees, onEmployeeClick }) => {
  const { t } = useTranslation('common');

  const getEmployeesByShift = (period: 'First' | 'Second' | 'Third') => {
    return employees.filter(emp => emp.shiftPeriod === period);
  };

  const groupByDepartment = (employeesList: Employee[]) => {
    const grouped: Record<string, Employee[]> = {};
    employeesList.forEach(emp => {
      if (!grouped[emp.department]) {
        grouped[emp.department] = [];
      }
      grouped[emp.department].push(emp);
    });
    return grouped;
  };

  const firstShiftEmployees = getEmployeesByShift('First');
  const secondShiftEmployees = getEmployeesByShift('Second');
  const thirdShiftEmployees = getEmployeesByShift('Third');

  const firstShiftGrouped = groupByDepartment(firstShiftEmployees);
  const secondShiftGrouped = groupByDepartment(secondShiftEmployees);
  const thirdShiftGrouped = groupByDepartment(thirdShiftEmployees);

  const renderShiftTable = (
    title: string,
    groupedEmployees: Record<string, Employee[]>,
    shiftLabel: string
  ) => (
    <div className="bg-white rounded-xl shadow-lg shadow-gray-200/50 p-3 border border-gray-100 h-full">
      <div className="flex items-center gap-2 mb-3">
        <ClockCircleOutlined className="text-mainColor text-base" />
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      </div>
      {Object.keys(groupedEmployees).length === 0 ? (
        <div className="text-center py-4">
          <p className="text-xs text-gray-500">{t('hr.shifts.noEmployees')}</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 dept-scrollbar">
          {Object.entries(groupedEmployees).map(([department, deptEmployees]) => (
            <div key={department} className="border border-gray-200 rounded-lg p-2">
              <div className="flex items-center gap-1.5 mb-1.5">
                <ApartmentOutlined className="text-mainColor text-xs" />
                <h4 className="font-semibold text-xs text-gray-900">
                  {translateDepartment(department)}
                </h4>
                <span className="text-[10px] text-gray-500">({deptEmployees.length})</span>
              </div>
              <div className="space-y-1">
                {deptEmployees.map(employee => (
                  <div
                    key={employee.id}
                    onClick={() => onEmployeeClick?.(employee)}
                    className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded hover:bg-mainColor/5 hover:border-mainColor/30 border border-transparent transition cursor-pointer"
                  >
                    {employee.profilePicture ? (
                      <img
                        src={employee.profilePicture}
                        alt={employee.name}
                        className="w-5 h-5 rounded-full object-cover border border-mainColor/20 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-mainColor/20 flex items-center justify-center border border-mainColor/20 flex-shrink-0">
                        <UserOutlined className="text-xs text-mainColor" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p 
                        className="font-medium text-xs text-gray-900 truncate hover:text-mainColor transition leading-tight"
                      >
                        {translateEmployeeName(employee.name, employee.id)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
        <h2 className="text-lg font-bold text-gray-900">{t('hr.shifts.title')}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {renderShiftTable(
          t('hr.shifts.firstShift'),
          firstShiftGrouped,
          'First'
        )}

        {renderShiftTable(
          t('hr.shifts.secondShift'),
          secondShiftGrouped,
          'Second'
        )}

        {renderShiftTable(
          t('hr.shifts.thirdShift'),
          thirdShiftGrouped,
          'Third'
        )}
      </div>
    </div>
  );
};

