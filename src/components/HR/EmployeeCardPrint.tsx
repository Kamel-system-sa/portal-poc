import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PrinterOutlined,
  IdcardOutlined,
  CloseOutlined
} from '@ant-design/icons';
import type { Employee } from '../../data/mockEmployees';
import { translateEmployeeName, translateNationality, translateDepartment, translateJobRank } from '../../utils';

interface EmployeeCardPrintProps {
  employee: Employee;
  onClose: () => void;
}

export const EmployeeCardPrint: React.FC<EmployeeCardPrintProps> = ({
  employee,
  onClose
}) => {
  const { t } = useTranslation('common');
  const [cardSize, setCardSize] = useState<'long' | 'standard'>('long');

  const handlePrint = () => {
    const printContent = document.getElementById('card-print-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const cardWidth = '85.6mm';
        const cardHeight = cardSize === 'long' ? '125mm' : '53.98mm';
        const isLong = cardSize === 'long';
        
        // Get image source
        const imgSrc = employee.profilePicture || '';
        const imgHtml = imgSrc 
          ? `<img src="${imgSrc}" alt="${employee.name}" style="width: ${isLong ? '96px' : '64px'}; height: ${isLong ? '96px' : '64px'}; border-radius: 50%; object-cover; border: 3px solid #005B4F;" />`
          : `<div style="width: ${isLong ? '96px' : '64px'}; height: ${isLong ? '96px' : '64px'}; border-radius: 50%; background: rgba(0,91,79,0.2); border: 3px solid #005B4F; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
               <svg width="${isLong ? '48' : '32'}" height="${isLong ? '48' : '32'}" viewBox="0 0 1024 1024" fill="#005B4F">
                 <path d="M858.5 763.6c-18.9-44.8-46.1-85-80.6-119.5-34.5-34.5-74.7-61.6-119.5-80.6-0.4-0.2-0.8-0.3-1.2-0.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-0.4 0.2-0.8 0.3-1.2 0.5-44.8 18.9-85 46-119.5 80.6-34.5 34.5-61.6 74.7-80.6 119.5C146.9 807.5 137 854 136 901.8c0 6.5 5.2 11.7 11.7 11.7h707.2c6.5 0 11.7-5.2 11.7-11.7-0.1-47.8-10.9-94.3-28.1-138.2zM512 534c-79.5 0-144-64.5-144-144s64.5-144 144-144 144 64.5 144 144-64.5 144-144 144zm335.8 314.3c-2.9-44.2-14.3-87.4-33.7-128.2-17.3-41.1-42.3-78.1-73.7-109.4s-68.3-56.4-109.4-73.7c-40.8-19.4-84-30.8-128.2-33.7-1.1-0.1-2.1-0.5-2.9-1.2-28.3-25.1-62.8-39.1-98.6-39.1s-70.3 14-98.6 39.1c-0.8 0.7-1.8 1.1-2.9 1.2-44.2 2.9-87.4 14.3-128.2 33.7-41.1 17.3-78.1 42.3-109.4 73.7s-56.4 68.3-73.7 109.4c-19.4 40.8-30.8 84-33.7 128.2-0.1 1.1-0.5 2.1-1.2 2.9h707.8c-0.7-0.8-1.1-1.8-1.2-2.9z"/>
               </svg>
             </div>`;
        
        printWindow.document.write(`
          <!DOCTYPE html>
          <html dir="${document.documentElement.dir || 'ltr'}">
            <head>
              <meta charset="UTF-8">
              <title>${t('hr.employeeCard.title')}</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                  font-family: Arial, sans-serif; 
                  padding: 20px; 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  min-height: 100vh;
                  background: #f5f5f5;
                }
                @media print {
                  @page { 
                    size: ${cardWidth} ${cardHeight}; 
                    margin: 0; 
                  }
                  body { 
                    padding: 0;
                    background: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                }
                .card { 
                  width: ${cardWidth}; 
                  height: ${cardHeight}; 
                  border: 4px solid #005B4F; 
                  border-radius: 12px; 
                  padding: ${isLong ? '16px' : '10px'};
                  background: white;
                  display: flex;
                  flex-direction: column;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                  margin: 0 auto;
                }
                .card-header {
                  text-align: center;
                  margin-bottom: ${isLong ? '16px' : '12px'};
                  padding-bottom: ${isLong ? '12px' : '8px'};
                  border-bottom: 2px solid #005B4F;
                }
                .card-header-title {
                  font-size: 10px;
                  color: #005B4F;
                  font-weight: bold;
                  margin-bottom: 4px;
                }
                .card-header-company {
                  font-size: 9px;
                  color: #666;
                }
                .card-body {
                  flex: 1;
                  display: flex;
                  flex-direction: ${isLong ? 'column' : 'row'};
                  align-items: ${isLong ? 'center' : 'flex-start'};
                  gap: ${isLong ? '16px' : '12px'};
                }
                .card-image-container {
                  ${isLong ? 'margin-bottom: 16px;' : ''}
                }
                .card-info {
                  flex: 1;
                  text-align: ${isLong ? 'center' : 'left'};
                }
                .card-info h3 {
                  font-size: ${isLong ? '20px' : '18px'};
                  font-weight: bold;
                  color: #005B4F;
                  margin-bottom: ${isLong ? '12px' : '8px'};
                }
                .card-info p {
                  font-size: ${isLong ? '14px' : '12px'};
                  color: #374151;
                  margin-bottom: ${isLong ? '8px' : '4px'};
                  line-height: 1.5;
                }
                .card-info strong {
                  font-weight: 600;
                }
                .card-footer {
                  margin-top: ${isLong ? '16px' : '8px'};
                  padding-top: ${isLong ? '12px' : '8px'};
                  border-top: 2px solid #ddd;
                  text-align: center;
                }
                .card-footer p {
                  font-size: 10px;
                  color: #666;
                  margin: 4px 0;
                }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="card-header">
                  <div class="card-header-title">EMPLOYEE ID CARD</div>
                  <div class="card-header-company">Kamel Portal</div>
                </div>
                <div class="card-body">
                  <div class="card-image-container">
                    ${imgHtml}
                  </div>
                  <div class="card-info">
                    <h3>${translateEmployeeName(employee.name, employee.id)}</h3>
                    <p><strong>${t('hr.form.department')}:</strong> ${translateDepartment(employee.department)}</p>
                    <p><strong>${t('hr.form.jobRank')}:</strong> ${translateJobRank(employee.jobRank)}</p>
                    <p><strong>ID:</strong> ${employee.idNumber}</p>
                    <p><strong>${t('hr.form.nationality')}:</strong> ${translateNationality(employee.nationality)}</p>
                  </div>
                </div>
                <div class="card-footer">
                  <p>Employee ID: ${employee.id}</p>
                  ${isLong ? `<p style="font-size: 9px; color: #999; margin-top: 4px;">Valid until: ${employee.contractEndDate}</p>` : ''}
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">{t('hr.employeeCard.title')}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
        >
          <CloseOutlined className="text-lg" />
        </button>
      </div>

      {/* Card Settings */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <label className="block">
          <div className="flex items-center gap-2 mb-2">
            <IdcardOutlined className="text-mainColor text-base" />
            <span className="block text-sm font-semibold text-gray-700">{t('hr.employeeCard.cardSize')}</span>
          </div>
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
            value={cardSize}
            onChange={e => setCardSize(e.target.value as 'long' | 'standard')}
          >
            <option value="long">{t('hr.employeeCard.long')}</option>
            <option value="standard">{t('hr.employeeCard.standard')}</option>
          </select>
        </label>
      </section>

      {/* Card Preview */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <IdcardOutlined className="text-mainColor text-base" />
          <span className="block text-sm font-semibold text-gray-700">{t('hr.employeeCard.preview')}</span>
        </div>
        <div className="flex justify-center">
          <div
            id="card-print-content"
            className="bg-white border-4 border-mainColor rounded-xl shadow-lg flex flex-col"
            style={{
              width: '85.6mm',
              height: cardSize === 'long' ? '125mm' : '53.98mm',
              minHeight: cardSize === 'long' ? '125mm' : '53.98mm',
              padding: cardSize === 'long' ? '16px' : '10px'
            }}
          >
            {/* Header with Logo/Company Info */}
            <div className="text-center mb-4 pb-3 border-b-2 border-mainColor">
              <div className="text-xs text-mainColor font-bold mb-1">EMPLOYEE ID CARD</div>
              <div className="text-xs text-gray-600">Kamel Portal</div>
            </div>

            {/* Main Content */}
            <div className={`flex ${cardSize === 'long' ? 'flex-col items-center' : 'items-center gap-3'} flex-1`}>
              {/* Profile Picture */}
              <div className={cardSize === 'long' ? 'mb-4' : ''}>
                {employee.profilePicture ? (
                  <img
                    src={employee.profilePicture}
                    alt={employee.name}
                    className={`${cardSize === 'long' ? 'w-24 h-24' : 'w-16 h-16'} rounded-full object-cover border-3 border-mainColor mx-auto`}
                  />
                ) : (
                  <div className={`${cardSize === 'long' ? 'w-24 h-24' : 'w-16 h-16'} rounded-full bg-mainColor/20 flex items-center justify-center border-3 border-mainColor mx-auto`}>
                    <IdcardOutlined className={`${cardSize === 'long' ? 'text-3xl' : 'text-2xl'} text-mainColor`} />
                  </div>
                )}
              </div>

              {/* Employee Info */}
              <div className={`flex-1 ${cardSize === 'long' ? 'text-center space-y-2' : ''}`}>
                <h3 className={`${cardSize === 'long' ? 'text-xl' : 'text-lg'} font-bold text-mainColor mb-2`}>{translateEmployeeName(employee.name, employee.id)}</h3>
                <div className={cardSize === 'long' ? 'space-y-2' : 'space-y-1'}>
                  <p className={cardSize === 'long' ? 'text-sm text-gray-700' : 'text-xs text-gray-700'}>
                    <strong>{t('hr.form.department')}:</strong> {translateDepartment(employee.department)}
                  </p>
                  <p className={cardSize === 'long' ? 'text-sm text-gray-700' : 'text-xs text-gray-700'}>
                    <strong>{t('hr.form.jobRank')}:</strong> {translateJobRank(employee.jobRank)}
                  </p>
                  <p className={cardSize === 'long' ? 'text-sm text-gray-700' : 'text-xs text-gray-700'}>
                    <strong>ID:</strong> {employee.idNumber}
                  </p>
                  <p className={cardSize === 'long' ? 'text-sm text-gray-700' : 'text-xs text-gray-700'}>
                    <strong>{t('hr.form.nationality')}:</strong> {translateNationality(employee.nationality)}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={cardSize === 'long' ? 'mt-4 pt-3 border-t-2 border-gray-300' : 'mt-2 pt-2 border-t-2 border-gray-300'}>
              <p className="text-xs text-gray-500 text-center">Employee ID: {employee.id}</p>
              {cardSize === 'long' && (
                <p className="text-xs text-gray-400 text-center mt-1">
                  Valid until: {employee.contractEndDate}
                </p>
              )}
            </div>
          </div>
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
          {t('hr.employeeCard.print')}
        </button>
      </div>
    </div>
  );
};

