import React from 'react';
import { useTranslation } from 'react-i18next';
import { SearchOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
import PreArrivalFilters from './PreArrivalFilters';

interface PreArrivalToolbarProps {
  searchValue: string;
  onSearch: (val: string) => void;
  onOpenAdd: () => void;
  filters: {
    status: string[];
    destination: string[];
    dateRange: [string, string] | null;
  };
  onFiltersChange: (filters: {
    status: string[];
    destination: string[];
    dateRange: [string, string] | null;
  }) => void;
  isFiltersOpen: boolean;
  onToggleFilters: () => void;
}

const PreArrivalToolbar: React.FC<PreArrivalToolbarProps> = ({
  searchValue,
  onSearch,
  onOpenAdd,
  filters,
  onFiltersChange,
  isFiltersOpen,
  onToggleFilters
}) => {
  const { t } = useTranslation('common');
  
  const activeFiltersCount = filters.status.length + filters.destination.length + (filters.dateRange ? 1 : 0);
  
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
            placeholder={t('reception.preArrival.searchPlaceholder')}
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
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
          <span>{t('reception.preArrival.filters.status')}</span>
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
          <span>{t('reception.preArrival.addGroup')}</span>
        </button>
      </div>
      
      {isFiltersOpen && (
        <div className="mt-4 bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <PreArrivalFilters
            filters={filters}
            onChange={onFiltersChange}
            onReset={() => onFiltersChange({ status: [], destination: [], dateRange: null })}
            onApply={onToggleFilters}
          />
        </div>
      )}
    </div>
  );
};

export default PreArrivalToolbar;

