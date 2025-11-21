import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined
} from '@ant-design/icons';
import type { Employee } from '../../data/mockEmployees';
import { translateEmployeeName } from '../../utils';

interface DataExportScreenProps {
  employees: Employee[];
  onClose: () => void;
}

const getExportableFields = (t: any) => [
  { key: 'name', label: t('hr.form.name') },
  { key: 'nationality', label: t('hr.form.nationality') },
  { key: 'idNumber', label: t('hr.form.id') },
  { key: 'gender', label: t('hr.form.gender') },
  { key: 'age', label: t('hr.form.age') },
  { key: 'mobile', label: t('hr.form.mobile') },
  { key: 'email', label: t('hr.form.email') },
  { key: 'department', label: t('hr.form.department') },
  { key: 'jobRank', label: t('hr.form.jobRank') },
  { key: 'shiftDuration', label: t('hr.form.shiftDuration') },
  { key: 'shiftPeriod', label: t('hr.form.shiftPeriod') },
  { key: 'contractStartDate', label: t('hr.form.contractStartDate') },
  { key: 'contractEndDate', label: t('hr.form.contractEndDate') },
  { key: 'numberOfDays', label: t('hr.form.numberOfDays') },
  { key: 'seasonalSalary', label: t('hr.form.seasonalSalary') },
  { key: 'dailySalary', label: t('hr.form.dailySalary') },
  { key: 'mainTasks', label: t('hr.form.mainTasks') },
  { key: 'additionalTasks', label: t('hr.form.additionalTasks') },
  { key: 'recommendations', label: t('hr.form.recommendations') }
];

export const DataExportScreen: React.FC<DataExportScreenProps> = ({
  employees,
  onClose
}) => {
  const { t } = useTranslation('common');
  const exportableFields = getExportableFields(t);
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | 'csv'>('excel');
  const [selectedFields, setSelectedFields] = useState<string[]>(exportableFields.map(f => f.key));
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(employees.map(e => e.id));
  const [isExporting, setIsExporting] = useState(false);

  const toggleField = (fieldKey: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldKey)
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const toggleEmployee = (employeeId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const selectAllFields = () => {
    setSelectedFields(exportableFields.map(f => f.key));
  };

  const deselectAllFields = () => {
    setSelectedFields([]);
  };

  const selectAllEmployees = () => {
    setSelectedEmployees(employees.map(e => e.id));
  };

  const deselectAllEmployees = () => {
    setSelectedEmployees([]);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const filteredEmployees = employees.filter(e => selectedEmployees.includes(e.id));
      const data = filteredEmployees.map(emp => {
        const row: Record<string, any> = {};
        selectedFields.forEach(field => {
          if (field === 'mainTasks' || field === 'additionalTasks') {
            row[field] = (emp[field as keyof Employee] as string[]).join('; ');
          } else {
            row[field] = emp[field as keyof Employee] || '';
          }
        });
        return row;
      });

      const fieldLabels = exportableFields
        .filter(f => selectedFields.includes(f.key))
        .map(f => f.label);

      if (exportFormat === 'csv') {
        // CSV Export with proper formatting
        const csvRows = [
          fieldLabels.map(label => `"${label}"`).join(','),
          ...data.map(row => 
            selectedFields.map(field => {
              const value = String(row[field] || '').replace(/"/g, '""');
              return `"${value}"`;
            }).join(',')
          )
        ];
        const csvContent = csvRows.join('\n');
        const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `employees_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else if (exportFormat === 'excel') {
        // Excel export - Create proper HTML table structure
        const headerRow = `<tr>${fieldLabels.map(label => 
          `<th style="background-color: #005B4F; color: white; padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${String(label).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</th>`
        ).join('')}</tr>`;
        
        const dataRows = data.map(row => {
          return `<tr>${selectedFields.map(field => {
            let value = String(row[field] || '');
            if (Array.isArray(row[field])) {
              value = (row[field] as string[]).join('; ');
            }
            value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            return `<td style="padding: 6px; border: 1px solid #ddd; text-align: right;">${value}</td>`;
          }).join('')}</tr>`;
        }).join('');
        
        // Create Excel-compatible HTML
        const excelHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8">
<!--[if gte mso 9]><xml>
<x:ExcelWorkbook>
<x:ExcelWorksheets>
<x:ExcelWorksheet>
<x:Name>الموظفون</x:Name>
</x:ExcelWorksheet>
</x:ExcelWorksheets>
</x:ExcelWorkbook>
</xml><![endif]-->
<style>
table { border-collapse: collapse; width: 100%; font-family: Arial, Tahoma, sans-serif; direction: rtl; }
th { background-color: #005B4F; color: white; padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold; }
td { padding: 6px; border: 1px solid #ddd; text-align: right; }
tr:nth-child(even) { background-color: #f9f9f9; }
</style>
</head>
<body>
<table>
<thead>${headerRow}</thead>
<tbody>${dataRows}</tbody>
</table>
</body>
</html>`;
        
        const blob = new Blob(['\uFEFF' + excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export_employees_${new Date().toISOString().split('T')[0]}.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else if (exportFormat === 'pdf') {
        // PDF Export using window.print with properly formatted table
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          const htmlContent = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>تصدير الموظفين</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  font-family: Arial, Tahoma, sans-serif; 
  padding: 20px;
  direction: rtl;
}
h1 { 
  color: #005B4F; 
  margin-bottom: 10px;
  font-size: 24px;
  text-align: right;
}
p { 
  margin-bottom: 20px;
  color: #666;
  text-align: right;
}
table { 
  width: 100%; 
  border-collapse: collapse; 
  margin-top: 20px;
  font-size: 11px;
  direction: rtl;
}
th, td { 
  border: 1px solid #ddd; 
  padding: 8px 6px; 
  text-align: right;
  word-wrap: break-word;
  max-width: 150px;
}
th { 
  background-color: #005B4F; 
  color: white; 
  font-weight: bold;
  position: sticky;
  top: 0;
}
tr:nth-child(even) { 
  background-color: #f9f9f9; 
}
@media print {
  @page { 
    size: A4 landscape;
    margin: 1cm; 
  }
  body {
    padding: 0;
  }
  table {
    font-size: 9px;
  }
  th, td {
    padding: 5px 3px;
  }
}
</style>
</head>
<body>
<h1>تصدير الموظفين</h1>
<p>تاريخ التصدير: ${new Date().toLocaleDateString('ar-SA')}</p>
<p>إجمالي السجلات: ${data.length}</p>
<table>
<thead>
<tr>
${fieldLabels.map(label => `<th>${String(label).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</th>`).join('')}
</tr>
</thead>
<tbody>
${data.map(row => 
  `<tr>${selectedFields.map(field => {
    let value = String(row[field] || '');
    if (Array.isArray(row[field])) {
      value = (row[field] as string[]).join('; ');
    }
    value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    return `<td>${value}</td>`;
  }).join('')}</tr>`
).join('')}
</tbody>
</table>
</body>
</html>`;
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          setTimeout(() => {
            printWindow.print();
          }, 500);
        }
      }

      setIsExporting(false);
      alert(t('hr.export.exportSuccess'));
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">{t('hr.export.title')}</h3>
        </div>
      </div>

      {/* Format Selection */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <label className="block mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileTextOutlined className="text-mainColor text-base" />
            <span className="block text-sm font-semibold text-gray-700">{t('hr.export.format')}</span>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setExportFormat('excel')}
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 font-semibold flex items-center justify-center gap-2 ${
                exportFormat === 'excel'
                  ? 'bg-gradient-to-r from-mainColor to-primary text-white border-mainColor'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-mainColor/40'
              }`}
            >
              <FileExcelOutlined />
              {t('hr.export.excel')}
            </button>
            <button
              type="button"
              onClick={() => setExportFormat('pdf')}
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 font-semibold flex items-center justify-center gap-2 ${
                exportFormat === 'pdf'
                  ? 'bg-gradient-to-r from-mainColor to-primary text-white border-mainColor'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-mainColor/40'
              }`}
            >
              <FilePdfOutlined />
              {t('hr.export.pdf')}
            </button>
            <button
              type="button"
              onClick={() => setExportFormat('csv')}
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 font-semibold flex items-center justify-center gap-2 ${
                exportFormat === 'csv'
                  ? 'bg-gradient-to-r from-mainColor to-primary text-white border-mainColor'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-mainColor/40'
              }`}
            >
              <FileTextOutlined />
              {t('hr.export.csv')}
            </button>
          </div>
        </label>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field Selection */}
        <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquareOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('hr.export.selectFields')}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAllFields}
                className="px-3 py-1 text-xs bg-mainColor/10 text-mainColor rounded-lg hover:bg-mainColor/20 transition"
              >
                {t('hr.export.selectAll')}
              </button>
              <button
                type="button"
                onClick={deselectAllFields}
                className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                {t('hr.export.deselectAll')}
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {exportableFields.map(field => (
              <label key={field.key} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field.key)}
                  onChange={() => toggleField(field.key)}
                  className="w-4 h-4 text-mainColor rounded focus:ring-mainColor"
                />
                <span className="text-sm text-gray-700">{field.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Employee Selection */}
        <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquareOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('hr.export.selectEmployees')}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAllEmployees}
                className="px-3 py-1 text-xs bg-mainColor/10 text-mainColor rounded-lg hover:bg-mainColor/20 transition"
              >
                {t('hr.export.selectAll')}
              </button>
              <button
                type="button"
                onClick={deselectAllEmployees}
                className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                {t('hr.export.deselectAll')}
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {employees.map(employee => (
              <label key={employee.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedEmployees.includes(employee.id)}
                  onChange={() => toggleEmployee(employee.id)}
                  className="w-4 h-4 text-mainColor rounded focus:ring-mainColor"
                />
                <div className="flex items-center gap-2 flex-1">
                  {employee.profilePicture && (
                    <img
                      src={employee.profilePicture}
                      alt={employee.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm text-gray-700">{translateEmployeeName(employee.name, employee.id)}</span>
                </div>
              </label>
            ))}
          </div>
        </section>
      </div>

      {/* Export Button */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold"
        >
          {t('hr.form.close')}
        </button>
        <button
          onClick={handleExport}
          disabled={isExporting || selectedFields.length === 0 || selectedEmployees.length === 0}
          className="flex-1 px-6 py-3.5 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DownloadOutlined />
          {isExporting ? t('hr.export.exporting') : t('hr.export.export')}
        </button>
      </div>
    </div>
  );
};

