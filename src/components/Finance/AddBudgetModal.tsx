import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseOutlined, DollarOutlined, UserOutlined, HomeOutlined, ToolOutlined, CarOutlined, AppstoreOutlined, BankOutlined, PlusOutlined } from '@ant-design/icons';
import { getCenters } from '../../data/centersStorage';
import type { CenterBudget, CenterFinancialData } from '../../data/mockFinancialCenters';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (centerId: string, budget: CenterBudget) => void;
  initialData?: CenterFinancialData;
  isEditMode?: boolean;
}

export const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    centerId: '',
    totalBudget: '',
    salaries: '',
    rent: '',
    furniture: '',
    cars: '',
    other: ''
  });

  const [autoDistributed, setAutoDistributed] = useState(false);
  const [centers, setCenters] = useState(getCenters());

  useEffect(() => {
    // Load centers from localStorage when modal opens
    if (isOpen) {
      setCenters(getCenters());
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        // وضع التعديل - تعبئة البيانات الحالية
        setFormData({
          centerId: initialData.centerId,
          totalBudget: initialData.totalBudget.toString(),
          salaries: initialData.budgetDetails.salaries.toString(),
          rent: initialData.budgetDetails.rent.toString(),
          furniture: initialData.budgetDetails.furniture.toString(),
          cars: initialData.budgetDetails.cars.toString(),
          other: initialData.budgetDetails.other.toString()
        });
        setAutoDistributed(false);
      } else {
        // وضع الإضافة - بيانات فارغة
        setFormData({
          centerId: '',
          totalBudget: '',
          salaries: '',
          rent: '',
          furniture: '',
          cars: '',
          other: ''
        });
        setAutoDistributed(false);
      }
    }
  }, [isOpen, isEditMode, initialData]);

  const handleTotalBudgetChange = (value: string) => {
    const total = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      totalBudget: value,
      salaries: total > 0 ? Math.floor(total * 0.4).toString() : '',
      rent: total > 0 ? Math.floor(total * 0.25).toString() : '',
      furniture: total > 0 ? Math.floor(total * 0.15).toString() : '',
      cars: total > 0 ? Math.floor(total * 0.1).toString() : '',
      other: total > 0 ? (total - Math.floor(total * 0.4) - Math.floor(total * 0.25) - Math.floor(total * 0.15) - Math.floor(total * 0.1)).toString() : ''
    }));
    setAutoDistributed(total > 0);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // إذا تم تعديل أي حقل بعد التوزيع التلقائي، نلغي حالة التوزيع التلقائي
    if (autoDistributed && field !== 'totalBudget' && field !== 'centerId') {
      setAutoDistributed(false);
    }
  };

  const calculateTotal = (): number => {
    const salaries = parseFloat(formData.salaries) || 0;
    const rent = parseFloat(formData.rent) || 0;
    const furniture = parseFloat(formData.furniture) || 0;
    const cars = parseFloat(formData.cars) || 0;
    const other = parseFloat(formData.other) || 0;
    return salaries + rent + furniture + cars + other;
  };

  const handleSubmit = () => {
    if (!formData.centerId) return;

    const budget: CenterBudget = {
      salaries: parseFloat(formData.salaries) || 0,
      rent: parseFloat(formData.rent) || 0,
      furniture: parseFloat(formData.furniture) || 0,
      cars: parseFloat(formData.cars) || 0,
      other: parseFloat(formData.other) || 0
    };

    onSubmit(formData.centerId, budget);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-4xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
            {isEditMode ? t('finance.editBudget') : t('finance.addBudget')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition flex-shrink-0"
            aria-label={t('ariaLabels.closeModal')}
          >
            <CloseOutlined className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-160px)] p-4 sm:p-5 md:p-6">
          <div className="space-y-6">
            {/* Center Selection */}
            <div>
              <label className="block mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <BankOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('finance.selectCenter')}</span>
                </div>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={formData.centerId}
                  onChange={(e) => handleInputChange('centerId', e.target.value)}
                  disabled={isEditMode}
                >
                  <option value="">{t('finance.selectCenterPlaceholder')}</option>
                  {centers.map(center => (
                    <option key={center.id} value={center.id}>
                      {center.number} - {center.serviceType}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Total Budget Field */}
            <div>
              <label className="block mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <DollarOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('finance.totalBudget')}</span>
                </div>
                <input
                  type="number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
                  placeholder="0"
                  value={formData.totalBudget}
                  onChange={(e) => handleTotalBudgetChange(e.target.value)}
                />
                {autoDistributed && (
                  <p className="text-xs text-gray-500 mt-1">{t('finance.autoDistributedNote')}</p>
                )}
              </label>
            </div>

            {/* Budget Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Salaries */}
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('finance.salaries')}</span>
                </div>
                <input
                  type="number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  placeholder="0"
                  value={formData.salaries}
                  onChange={(e) => handleInputChange('salaries', e.target.value)}
                />
              </label>

              {/* Rent */}
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <HomeOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('finance.rent')}</span>
                </div>
                <input
                  type="number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  placeholder="0"
                  value={formData.rent}
                  onChange={(e) => handleInputChange('rent', e.target.value)}
                />
              </label>

              {/* Furniture */}
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <ToolOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('finance.furniture')}</span>
                </div>
                <input
                  type="number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  placeholder="0"
                  value={formData.furniture}
                  onChange={(e) => handleInputChange('furniture', e.target.value)}
                />
              </label>

              {/* Cars */}
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <CarOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('finance.cars')}</span>
                </div>
                <input
                  type="number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  placeholder="0"
                  value={formData.cars}
                  onChange={(e) => handleInputChange('cars', e.target.value)}
                />
              </label>

              {/* Other */}
              <label className="block md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <AppstoreOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('finance.other')}</span>
                </div>
                <input
                  type="number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  placeholder="0"
                  value={formData.other}
                  onChange={(e) => handleInputChange('other', e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-4 sm:p-5 md:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold"
          >
            {t('form.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.centerId || calculateTotal() === 0}
            className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusOutlined />
            {isEditMode ? t('form.saveChanges') : t('finance.add')}
          </button>
        </div>
      </div>
    </div>
  );
};

