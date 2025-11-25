import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BankOutlined, 
  EyeOutlined, 
  DollarOutlined,
  UserOutlined,
  HomeOutlined,
  ToolOutlined,
  CarOutlined,
  AppstoreOutlined,
  EditOutlined
} from '@ant-design/icons';
import type { CenterFinancialData } from '../../data/mockFinancialCenters';

interface FinanceCenterCardProps {
  financialData: CenterFinancialData;
  onEdit?: (center: CenterFinancialData) => void;
}

export const FinanceCenterCard: React.FC<FinanceCenterCardProps> = ({ financialData, onEdit }) => {
  const { t } = useTranslation('common');
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <article className="bg-white rounded-xl shadow-md shadow-gray-200/50 border border-gray-100 p-4 sm:p-6 hover:shadow-xl hover:shadow-mainColor/10 hover:border-mainColor/30 transition-all duration-300 group relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-mainColor to-primary flex items-center justify-center shadow-md shadow-mainColor/20">
            <BankOutlined className="text-white text-lg" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">{financialData.centerName}</h4>
            <p className="text-xs text-gray-500">رقم المركز: {financialData.centerNumber}</p>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={() => onEdit(financialData)}
            className="p-2 text-mainColor hover:bg-mainColor/10 rounded-lg transition-all duration-200"
            title={t('finance.edit')}
          >
            <EditOutlined className="text-lg" />
          </button>
        )}
      </div>

      {/* Total Budget */}
      <div className="mb-4 p-4 bg-gradient-to-r from-mainColor/10 to-primary/10 rounded-lg border border-mainColor/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarOutlined className="text-mainColor text-base" />
            <span className="text-sm font-semibold text-gray-700">{t('finance.totalBudget')}</span>
          </div>
          <span className="text-xl font-bold text-mainColor">{formatCurrency(financialData.totalBudget)}</span>
        </div>
      </div>

      {/* View Details Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-mainColor to-primary rounded-lg hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-mainColor/20 hover:shadow-lg hover:shadow-mainColor/30"
      >
        <EyeOutlined className="text-sm" />
        <span>{showDetails ? t('finance.hideDetails') : t('finance.viewDetails')}</span>
      </button>

      {/* Details Section */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 transition-all duration-300">
          <div className="grid grid-cols-2 gap-3">
            {/* Salaries */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <UserOutlined className="text-blue-600 text-sm" />
                <span className="text-xs font-semibold text-gray-700">{t('finance.salaries')}</span>
              </div>
              <p className="text-sm font-bold text-blue-700">{formatCurrency(financialData.budgetDetails.salaries)}</p>
            </div>

            {/* Rent */}
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 mb-1">
                <HomeOutlined className="text-green-600 text-sm" />
                <span className="text-xs font-semibold text-gray-700">{t('finance.rent')}</span>
              </div>
              <p className="text-sm font-bold text-green-700">{formatCurrency(financialData.budgetDetails.rent)}</p>
            </div>

            {/* Furniture */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 mb-1">
                <ToolOutlined className="text-purple-600 text-sm" />
                <span className="text-xs font-semibold text-gray-700">{t('finance.furniture')}</span>
              </div>
              <p className="text-sm font-bold text-purple-700">{formatCurrency(financialData.budgetDetails.furniture)}</p>
            </div>

            {/* Cars */}
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-center gap-2 mb-1">
                <CarOutlined className="text-orange-600 text-sm" />
                <span className="text-xs font-semibold text-gray-700">{t('finance.cars')}</span>
              </div>
              <p className="text-sm font-bold text-orange-700">{formatCurrency(financialData.budgetDetails.cars)}</p>
            </div>
          </div>

          {/* Other */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <AppstoreOutlined className="text-gray-600 text-sm" />
              <span className="text-xs font-semibold text-gray-700">{t('finance.other')}</span>
            </div>
            <p className="text-sm font-bold text-gray-700">{formatCurrency(financialData.budgetDetails.other)}</p>
          </div>

          {/* Reserved and Remaining */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center gap-2 mb-1">
                <DollarOutlined className="text-red-600 text-sm" />
                <span className="text-xs font-semibold text-gray-700">{t('finance.reservedAmount')}</span>
              </div>
              <p className="text-sm font-bold text-red-700">{formatCurrency(financialData.reservedAmount)}</p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="flex items-center gap-2 mb-1">
                <DollarOutlined className="text-emerald-600 text-sm" />
                <span className="text-xs font-semibold text-gray-700">{t('finance.remainingBudget')}</span>
              </div>
              <p className="text-sm font-bold text-emerald-700">{formatCurrency(financialData.remainingBudget)}</p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

