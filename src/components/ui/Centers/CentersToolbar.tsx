import React from 'react';
import { useTranslation } from 'react-i18next';
import { SearchOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
import type { FilterState } from '../../../types';
import { FiltersForm } from './FiltersForm';

interface CentersToolbarProps {
  searchValue: string;
  onSearch: (val: string) => void;
  onOpenAdd: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isFiltersOpen: boolean;
  onToggleFilters: () => void;
  onResetFilters: () => void;
}

export const CentersToolbar: React.FC<CentersToolbarProps> = ({
  searchValue,
  onSearch,
  onOpenAdd,
  filters,
  onFiltersChange,
  isFiltersOpen,
  onToggleFilters,
  onResetFilters
}) => {
  const { t } = useTranslation('common');
  
  const activeFiltersCount = filters.serviceType.length + filters.status.length;
  
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <SearchOutlined className="text-gray-400 text-lg" />
          </div>
          <input
            type="search"
            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 placeholder-gray-400 font-medium"
            placeholder={t('centers.searchPlaceholder')}
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
          />
        </div>
        <button 
          className={`px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 font-semibold text-base border-2 ${
            isFiltersOpen 
              ? 'bg-white text-mainColor border-mainColor shadow-lg shadow-mainColor/20 hover:shadow-xl' 
              : 'bg-white text-gray-700 border-gray-200 hover:border-mainColor/50 hover:bg-gray-50 shadow-sm hover:shadow-md'
          } ${activeFiltersCount > 0 ? 'relative' : ''}`}
          onClick={onToggleFilters}
        >
          <FilterOutlined className="text-lg" />
          <span>{t('filters.serviceType')}</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-mainColor to-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
              {activeFiltersCount}
            </span>
          )}
        </button>
        <button 
          className="px-8 py-3.5 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-mainColor/25 hover:shadow-xl hover:shadow-mainColor/30 transform hover:-translate-y-0.5 font-semibold text-base"
          onClick={onOpenAdd}
        >
          <PlusOutlined className="text-lg" />
          <span>{t('centers.addNewCenter')}</span>
        </button>
      </div>
      
      {isFiltersOpen && (
        <div className="mt-4 bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <FiltersForm
            filters={filters}
            onChange={onFiltersChange}
            onReset={onResetFilters}
            onApply={onToggleFilters}
          />
        </div>
      )}
    </div>
  );
};

