import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  IdcardOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ApartmentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { Employee } from '../../data/mockEmployees';
import { translateNationality, translateDepartment, translateJobRank, translateShiftPeriod, translateEmployeeName, translateTask, translateRecommendations } from '../../utils';

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: () => void;
  onPrintCard?: () => void;
  onSendOffer?: () => void;
  onPrintContract?: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onPrintCard,
  onSendOffer,
  onPrintContract
}) => {
  const { t, i18n } = useTranslation('common');

  // Get translations based on current site language
  const getText = (key: string) => {
    const currentLang = i18n.language;
    const resources = i18n.getResourceBundle(currentLang, 'common');
    
    // Navigate through nested keys (e.g., 'hr.form.name')
    const keys = key.split('.');
    let value: any = resources;
    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }
    
    return value || t(key);
  };

  const isRtl = i18n.language === 'ar';

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header with Profile Picture */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
        {employee.profilePicture ? (
          <img
            src={employee.profilePicture}
            alt={employee.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-mainColor/20"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-mainColor/20 flex items-center justify-center border-4 border-mainColor/20">
            <UserOutlined className="text-3xl text-mainColor" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{translateEmployeeName(employee.name, employee.id)}</h3>
          <p className="text-sm text-gray-600">{employee.email}</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
          <IdcardOutlined className="text-mainColor" />
          {getText('hr.form.personalInfo')}
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">{getText('hr.form.nationality')}:</span>
            <p className="font-medium text-gray-900">{translateNationality(employee.nationality)}</p>
          </div>
          <div>
            <span className="text-gray-500">{getText('hr.form.id')}:</span>
            <p className="font-medium text-gray-900">{employee.idNumber}</p>
          </div>
          <div>
            <span className="text-gray-500">{getText('hr.form.gender')}:</span>
            <p className="font-medium text-gray-900">
              {employee.gender === 'male' ? getText('hr.form.male') : getText('hr.form.female')}
            </p>
          </div>
          <div>
            <span className="text-gray-500">{getText('hr.form.age')}:</span>
            <p className="font-medium text-gray-900">{employee.age}</p>
          </div>
          <div>
            <span className="text-gray-500">{getText('hr.form.mobile')}:</span>
            <p className="font-medium text-gray-900">{employee.mobile}</p>
          </div>
        </div>
      </div>

      {/* Department & Role Information */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
          <ApartmentOutlined className="text-mainColor" />
          {getText('hr.form.departmentRole')}
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">{getText('hr.form.department')}:</span>
            <p className="font-medium text-gray-900">
              {translateDepartment(employee.department)}
            </p>
          </div>
          <div>
            <span className="text-gray-500">{getText('hr.form.jobRank')}:</span>
            <p className="font-medium text-gray-900">
              {translateJobRank(employee.jobRank)}
            </p>
          </div>
          <div>
            <span className="text-gray-500">{getText('hr.form.shiftPeriod')}:</span>
            <p className="font-medium text-gray-900">
              {translateShiftPeriod(employee.shiftPeriod)}
            </p>
          </div>
          <div>
            <span className="text-gray-500">{getText('hr.form.shiftDuration')}:</span>
            <p className="font-medium text-gray-900">{employee.shiftDuration === '8h' ? getText('hr.form.8h') : getText('hr.form.12h')}</p>
          </div>
        </div>
      </div>

      {/* Contract Information */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
          <CalendarOutlined className="text-mainColor" />
          {getText('hr.form.contractInfo')}
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">{getText('hr.form.contractStartDate')}:</span>
            <p className="font-medium text-gray-900">{employee.contractStartDate}</p>
          </div>
          <div>
            <span className="text-gray-500">{getText('hr.form.contractEndDate')}:</span>
            <p className="font-medium text-gray-900">{employee.contractEndDate}</p>
          </div>
          <div>
            <span className="text-gray-500">{getText('hr.form.numberOfDays')}:</span>
            <p className="font-medium text-gray-900">{employee.numberOfDays}</p>
          </div>
        </div>
      </div>

      {/* Salary Information */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
          <DollarOutlined className="text-mainColor" />
          {getText('hr.form.salaryInfo')}
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">{getText('hr.form.dailySalary')}:</span>
            <p className="font-medium text-gray-900">{employee.dailySalary} SAR</p>
          </div>
          <div>
            <span className="text-gray-500">{getText('hr.form.seasonalSalary')}:</span>
            <p className="font-medium text-gray-900">{employee.seasonalSalary} SAR</p>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
          <UserOutlined className="text-mainColor" />
          {getText('hr.form.tasks')}
        </h4>
        <div className="text-sm">
          <p className="text-gray-500 mb-2">{getText('hr.form.mainTasks')}:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
            {employee.mainTasks.map((task, index) => (
              <li key={index}>{translateTask(task, employee.id, 'main', index)}</li>
            ))}
          </ul>
          <p className="text-gray-500 mb-2">{getText('hr.form.additionalTasks')}:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
            {employee.additionalTasks.map((task, index) => (
              <li key={index}>{translateTask(task, employee.id, 'additional', index)}</li>
            ))}
          </ul>
          {employee.recommendations && (
            <>
              <p className="text-gray-500 mb-2">{getText('hr.form.recommendations')}:</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{translateRecommendations(employee.recommendations, employee.id)}</p>
            </>
          )}
        </div>
      </div>

      {/* Administrative Checkboxes */}
      <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-xl">
        <h4 className="font-semibold text-gray-700 mb-3">{getText('hr.checkboxes.title')}</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {employee.employeeCardPrinted ? (
              <CheckCircleOutlined className="text-success text-lg" />
            ) : (
              <CloseCircleOutlined className="text-gray-400 text-lg" />
            )}
            <span className="text-sm text-gray-700">{getText('hr.checkboxes.employeeCardPrinted')}</span>
          </div>
          <div className="flex items-center gap-2">
            {employee.registeredInAjir ? (
              <CheckCircleOutlined className="text-success text-lg" />
            ) : (
              <CloseCircleOutlined className="text-gray-400 text-lg" />
            )}
            <span className="text-sm text-gray-700">{getText('hr.checkboxes.registeredInAjir')}</span>
          </div>
          <div className="flex items-center gap-2">
            {employee.nuskCardIssued ? (
              <CheckCircleOutlined className="text-success text-lg" />
            ) : (
              <CloseCircleOutlined className="text-gray-400 text-lg" />
            )}
            <span className="text-sm text-gray-700">{getText('hr.checkboxes.nuskCardIssued')}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-200">
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-mainColor text-white rounded-xl hover:bg-primary transition-all duration-200 font-semibold text-sm"
          >
            {getText('hr.actions.edit')}
          </button>
        )}
        {onPrintCard && (
          <button
            onClick={onPrintCard}
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 font-semibold text-sm"
          >
            {getText('hr.actions.printCard')}
          </button>
        )}
        {onSendOffer && (
          <button
            onClick={onSendOffer}
            className="px-4 py-2 bg-info text-white rounded-xl hover:bg-info/90 transition-all duration-200 font-semibold text-sm"
          >
            {getText('hr.actions.sendOffer')}
          </button>
        )}
        {onPrintContract && (
          <button
            onClick={onPrintContract}
            className="px-4 py-2 bg-warning text-gray-900 rounded-xl hover:bg-warning/90 transition-all duration-200 font-semibold text-sm"
          >
            {getText('hr.form.printContract')}
          </button>
        )}
      </div>
    </div>
  );
};

