import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckOutlined } from '@ant-design/icons';
import type { FilterState } from '../../../types';

interface FiltersFormProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  onApply: () => void;
}

export const FiltersForm: React.FC<FiltersFormProps> = ({
  filters,
  onChange,
  onReset,
  onApply
}) => {
  const { t } = useTranslation('common');
  
  const updateFilter = (group: keyof FilterState, value: string): void => {
    const set = new Set(filters[group]);
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
    onChange({ ...filters, [group]: Array.from(set) });
  };

  const groups = [
    {
      id: 'serviceType' as const,
      title: t('filters.serviceType'),
      options: [
        { value: 'B2B', label: t('serviceTypes.b2b') },
        { value: 'B2C', label: t('serviceTypes.b2c') },
        { value: 'B2G', label: t('serviceTypes.b2g') }
      ]
    },
    {
      id: 'status' as const,
      title: t('filters.status'),
      options: [
        { value: 'active', label: t('centers.active') },
        { value: 'inactive', label: t('centers.inactive') }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.id}>
          <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            {group.title}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {group.options.map((option) => {
              const isChecked = filters[group.id].includes(option.value);
              return (
                <label 
                  key={option.value} 
                  className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 ${
                    isChecked
                      ? 'bg-gradient-to-r from-mainColor/10 to-primary/10 border-mainColor shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:border-mainColor/30 hover:bg-gray-100'
                  }`}
                >
                  <div className={`relative w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    isChecked 
                      ? 'bg-gradient-to-r from-mainColor to-primary border-mainColor' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {isChecked && <CheckOutlined className="text-white text-xs" />}
                  </div>
                  <span className={`text-sm font-medium ${
                    isChecked ? 'text-gray-900' : 'text-gray-600'
                  }`}>{option.label}</span>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isChecked}
                    onChange={() => updateFilter(group.id, option.value)}
                  />
                </label>
              );
            })}
          </div>
        </section>
      ))}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button 
          className="flex-1 px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold"
          onClick={onReset}
        >
          {t('filters.reset')}
        </button>
        <button 
          className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold"
          onClick={onApply}
        >
          {t('filters.apply')}
        </button>
      </div>
    </div>
  );
};

