import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PrinterOutlined,
  FileTextOutlined,
  CloseOutlined
} from '@ant-design/icons';
import type { Employee } from '../../data/mockEmployees';
import { translateEmployeeName, translateNationality, translateDepartment, translateJobRank, translateShiftPeriod, translateTask } from '../../utils';

interface PrintScreenProps {
  employee?: Employee;
  employees?: Employee[];
  type: 'contract' | 'report' | 'all';
  onClose: () => void;
}

export const PrintScreen: React.FC<PrintScreenProps> = ({
  employee,
  employees = [],
  type,
  onClose
}) => {
  const { t } = useTranslation('common');
  const [paperSize, setPaperSize] = useState<'a4' | 'a3' | 'letter'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [template, setTemplate] = useState('default');

  const handlePrint = () => {
    const printContent = document.getElementById('print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${t('hr.print.title')}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                @media print {
                  @page { size: ${paperSize} ${orientation}; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">{t('hr.print.title')}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
        >
          <CloseOutlined className="text-lg" />
        </button>
      </div>

      {/* Print Settings */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <FileTextOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('hr.print.paperSize')}</span>
            </div>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
              value={paperSize}
              onChange={e => setPaperSize(e.target.value as 'a4' | 'a3' | 'letter')}
            >
              <option value="a4">{t('hr.print.a4')}</option>
              <option value="a3">{t('hr.print.a3')}</option>
              <option value="letter">{t('hr.print.letter')}</option>
            </select>
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <FileTextOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('hr.print.orientation')}</span>
            </div>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
              value={orientation}
              onChange={e => setOrientation(e.target.value as 'portrait' | 'landscape')}
            >
              <option value="portrait">{t('hr.print.portrait')}</option>
              <option value="landscape">{t('hr.print.landscape')}</option>
            </select>
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <FileTextOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('hr.print.template')}</span>
            </div>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
              value={template}
              onChange={e => setTemplate(e.target.value)}
            >
              <option value="default">{t('hr.print.templates.default') || 'القالب الافتراضي'}</option>
              <option value="company">{t('hr.print.templates.company') || 'قالب الشركة'}</option>
              <option value="custom">{t('hr.print.templates.custom') || 'قالب مخصص'}</option>
            </select>
          </label>
        </div>
      </section>

      {/* Print Preview */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <FileTextOutlined className="text-mainColor text-base" />
          <span className="block text-sm font-semibold text-gray-700">{t('hr.print.preview')}</span>
        </div>
        <div
          id="print-content"
          className="bg-white border-2 border-gray-200 rounded-xl p-6 min-h-[400px]"
          style={{
            width: paperSize === 'a4' ? '210mm' : paperSize === 'a3' ? '297mm' : '8.5in',
            minHeight: orientation === 'portrait' ? '297mm' : '210mm'
          }}
        >
          {type === 'contract' && employee && (
            <div className="space-y-4">
              {template === 'company' ? (
                // Company Template
                <>
                  <div className="text-center border-b-4 border-mainColor pb-4 mb-6">
                    <div className="mb-4">
                      <h1 className="text-3xl font-bold text-mainColor mb-2">بوابة كامل</h1>
                      <p className="text-lg text-gray-600">Kamel Portal</p>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-4">{t('hr.contract')}</h2>
                  </div>
                  <div className="bg-mainColor/5 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-600 mb-2"><strong>{t('hr.print.contractNumber') || 'رقم العقد'}:</strong> CONTRACT-{employee.id}-{new Date().getFullYear()}</p>
                    <p className="text-sm text-gray-600"><strong>{t('hr.print.contractDate') || 'تاريخ العقد'}:</strong> {new Date().toLocaleDateString('ar-SA')}</p>
                  </div>
                </>
              ) : (
                // Default Template
                <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
                  <h1 className="text-2xl font-bold text-mainColor">{t('hr.contract')}</h1>
                </div>
              )}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>{t('hr.form.name')}:</strong> {translateEmployeeName(employee.name, employee.id)}</p>
                    <p><strong>{t('hr.form.nationality')}:</strong> {translateNationality(employee.nationality)}</p>
                    <p><strong>{t('hr.form.id')}:</strong> {employee.idNumber}</p>
                  </div>
                  <div>
                    <p><strong>{t('hr.form.department')}:</strong> {translateDepartment(employee.department)}</p>
                    <p><strong>{t('hr.form.jobRank')}:</strong> {translateJobRank(employee.jobRank)}</p>
                    <p><strong>{t('hr.form.shiftPeriod')}:</strong> {translateShiftPeriod(employee.shiftPeriod)}</p>
                    <p><strong>{t('hr.form.shiftDuration')}:</strong> {employee.shiftDuration === '8h' ? t('hr.form.8h') : t('hr.form.12h')}</p>
                  </div>
                </div>
                <div className="border-t-2 border-gray-300 pt-3 mt-3">
                  <h3 className="font-semibold mb-2">{t('hr.form.contractInfo')}:</h3>
                  <p><strong>{t('hr.form.contractStartDate')}:</strong> {employee.contractStartDate}</p>
                  <p><strong>{t('hr.form.contractEndDate')}:</strong> {employee.contractEndDate}</p>
                  <p><strong>{t('hr.form.numberOfDays')}:</strong> {employee.numberOfDays}</p>
                </div>
                <div className="border-t-2 border-gray-300 pt-3 mt-3">
                  <h3 className="font-semibold mb-2">{t('hr.form.salaryInfo')}:</h3>
                  <p><strong>{t('hr.form.seasonalSalary')}:</strong> {employee.seasonalSalary} SAR</p>
                  <p><strong>{t('hr.form.dailySalary')}:</strong> {employee.dailySalary} SAR</p>
                </div>
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">{t('hr.form.mainTasks')}:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {employee.mainTasks.map((task, index) => (
                      <li key={index}>{translateTask(task, employee.id, 'main', index)}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">{t('hr.form.additionalTasks')}:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {employee.additionalTasks.map((task, index) => (
                      <li key={index}>{translateTask(task, employee.id, 'additional', index)}</li>
                    ))}
                  </ul>
                </div>
                {employee.recommendations && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">{t('hr.form.recommendations')}:</h3>
                    <p className="text-gray-700">{employee.recommendations}</p>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-4 border-t-2 border-gray-300">
                {template === 'company' ? (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold text-mainColor mb-2">{t('hr.print.termsAndConditions') || 'الشروط والأحكام'}</h3>
                      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                        <li>{t('hr.print.term1') || 'يجب على الموظف الالتزام بجميع القوانين واللوائح المعمول بها'}</li>
                        <li>{t('hr.print.term2') || 'يجب الحفاظ على سرية المعلومات الخاصة بالشركة'}</li>
                        <li>{t('hr.print.term3') || 'يجب الالتزام بمواعيد العمل المحددة'}</li>
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-6">
                      <div className="text-center">
                        <p className="font-semibold text-gray-700 mb-2">{t('hr.print.employeeSignature') || 'توقيع الموظف'}</p>
                        <div className="border-t-2 border-gray-400 mt-2 h-16"></div>
                        <p className="text-sm text-gray-600 mt-2">{translateEmployeeName(employee.name, employee.id)}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-mainColor mb-2">{t('hr.print.companySignature') || 'توقيع الشركة'}</p>
                        <div className="border-t-2 border-mainColor mt-2 h-16"></div>
                        <p className="text-sm text-gray-600 mt-2">بوابة كامل - قسم الموارد البشرية</p>
                      </div>
                    </div>
                    <div className="text-center mt-6 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        {t('hr.print.companyAddress') || 'العنوان: المملكة العربية السعودية'} | 
                        {t('hr.print.companyContact') || 'البريد الإلكتروني: info@kamelportal.com'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <p className="font-semibold">{t('hr.print.employeeSignature') || 'Employee Signature'}</p>
                        <div className="border-t-2 border-gray-400 mt-2 w-48"></div>
                      </div>
                      <div>
                        <p className="font-semibold">{t('hr.print.companySignature') || 'Company Signature'}</p>
                        <div className="border-t-2 border-gray-400 mt-2 w-48"></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {type === 'report' && employees.length > 0 && (
            <div className="space-y-4">
              <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
                <h1 className="text-2xl font-bold text-mainColor">{t('hr.employees')} {t('hr.summary')}</h1>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-right">{t('hr.form.name')}</th>
                      <th className="border border-gray-300 p-2 text-right">{t('hr.form.department')}</th>
                      <th className="border border-gray-300 p-2 text-right">{t('hr.form.jobRank')}</th>
                      <th className="border border-gray-300 p-2 text-right">{t('hr.form.nationality')}</th>
                      <th className="border border-gray-300 p-2 text-right">{t('hr.form.contractStartDate')}</th>
                      <th className="border border-gray-300 p-2 text-right">{t('hr.form.contractEndDate')}</th>
                      <th className="border border-gray-300 p-2 text-right">{t('hr.form.seasonalSalary')}</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td className="border border-gray-300 p-2">{emp.name}</td>
                      <td className="border border-gray-300 p-2">{emp.department}</td>
                      <td className="border border-gray-300 p-2">{emp.jobRank}</td>
                      <td className="border border-gray-300 p-2">{emp.nationality}</td>
                      <td className="border border-gray-300 p-2">{emp.contractStartDate}</td>
                      <td className="border border-gray-300 p-2">{emp.contractEndDate}</td>
                      <td className="border border-gray-300 p-2">{emp.seasonalSalary} SAR</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Print Button */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold"
        >
          {t('hr.form.close')}
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 px-6 py-3.5 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center justify-center gap-2"
        >
          <PrinterOutlined />
          {t('hr.print.print')}
        </button>
      </div>
    </div>
  );
};

