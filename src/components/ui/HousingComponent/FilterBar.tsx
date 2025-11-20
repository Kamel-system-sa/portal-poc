import React, { useState, useEffect } from 'react';
import { Input, Select, Button } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

export interface FilterState {
  search: string;
  gender: string[];
  nationality: string[];
  ageRange: [number, number] | null;
  serviceCenter: string[];
  organizer: string[];
}

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  availableNationalities?: string[];
  availableServiceCenters?: string[];
  availableOrganizers?: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  availableNationalities = [],
  availableServiceCenters = [],
  availableOrganizers = []
}) => {
  const { t } = useTranslation('common');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    gender: [],
    nationality: [],
    ageRange: null,
    serviceCenter: [],
    organizer: []
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      search: '',
      gender: [],
      nationality: [],
      ageRange: null,
      serviceCenter: [],
      organizer: []
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.gender.length > 0 ||
    filters.nationality.length > 0 ||
    filters.ageRange !== null ||
    filters.serviceCenter.length > 0 ||
    filters.organizer.length > 0;

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-xl border border-bordergray/50 p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <Input
            placeholder={t('housing.searchPilgrims')}
            prefix={<SearchOutlined className="text-customgray" />}
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1"
            size="large"
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => setIsExpanded(!isExpanded)}
            className={isExpanded ? 'bg-primaryColor text-white' : ''}
            size="large"
          >
            {t('filters.apply') || 'Filters'}
          </Button>
          {hasActiveFilters && (
            <Button
              icon={<ClearOutlined />}
              onClick={handleReset}
              size="large"
            >
              {t('filters.reset') || 'Reset'}
            </Button>
          )}
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-bordergray">
            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('housing.gender')}
              </label>
              <Select
                mode="multiple"
                placeholder={t('housing.selectGender')}
                value={filters.gender}
                onChange={(value) => handleFilterChange('gender', value)}
                className="w-full"
                allowClear
              >
                <Option value="male">{t('housing.male')}</Option>
                <Option value="female">{t('housing.female')}</Option>
              </Select>
            </div>

            {/* Nationality Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.nationality') || 'Nationality'}
              </label>
              <Select
                mode="multiple"
                placeholder={t('form.selectNationality') || 'Select nationality'}
                value={filters.nationality}
                onChange={(value) => handleFilterChange('nationality', value)}
                className="w-full"
                allowClear
              >
                {availableNationalities.map(nat => (
                  <Option key={nat} value={nat}>
                    {t(`nationalities.${nat.toLowerCase()}`) || nat}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Service Center Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('serviceCentersTitle') || 'Service Center'}
              </label>
              <Select
                mode="multiple"
                placeholder={t('housing.selectServiceCenter')}
                value={filters.serviceCenter}
                onChange={(value) => handleFilterChange('serviceCenter', value)}
                className="w-full"
                allowClear
              >
                {availableServiceCenters.map(center => (
                  <Option key={center} value={center}>{center}</Option>
                ))}
              </Select>
            </div>

            {/* Organizer Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('housing.organizer')}
              </label>
              <Select
                mode="multiple"
                placeholder={t('housing.selectOrganizer')}
                value={filters.organizer}
                onChange={(value) => handleFilterChange('organizer', value)}
                className="w-full"
                allowClear
              >
                {availableOrganizers.map(org => (
                  <Option key={org} value={org}>{org}</Option>
                ))}
              </Select>
            </div>

            {/* Age Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('labels.age') || 'Age Range'}
              </label>
              <Select
                placeholder={t('housing.selectAgeRange')}
                value={filters.ageRange ? `${filters.ageRange[0]}-${filters.ageRange[1]}` : null}
                onChange={(value) => {
                  if (value) {
                    const [min, max] = value.split('-').map(Number);
                    handleFilterChange('ageRange', [min, max]);
                  } else {
                    handleFilterChange('ageRange', null);
                  }
                }}
                className="w-full"
                allowClear
              >
                <Option value="18-30">18-30</Option>
                <Option value="31-45">31-45</Option>
                <Option value="46-60">46-60</Option>
                <Option value="61-75">61-75</Option>
                <Option value="76+">76+</Option>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

