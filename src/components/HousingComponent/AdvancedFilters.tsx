import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Select, Checkbox, Button } from 'antd';
import { SearchOutlined, CloseOutlined, FilterOutlined } from '@ant-design/icons';
import { GlassCard } from './GlassCard';
import { mockPilgrims } from '../../data/mockHousing';

const { Option } = Select;

export interface AdvancedFilterState {
  pilgrimName: string;
  roomNumber: string;
  nationality: string;
  gender: string;
  passportNumber: string;
  organizerNumber: string;
  mobileNumber: string;
  visaNumber: string;
  enabledFilters: {
    pilgrimName: boolean;
    roomNumber: boolean;
    nationality: boolean;
    gender: boolean;
    passportNumber: boolean;
    organizerNumber: boolean;
    mobileNumber: boolean;
    visaNumber: boolean;
  };
}

// Also export as type for ES module compatibility
export type { AdvancedFilterState };

interface AdvancedFiltersProps {
  onFilterChange: (filters: AdvancedFilterState) => void;
  type: 'hotel' | 'building' | 'mina' | 'arafat';
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onFilterChange, type }) => {
  const { t } = useTranslation('common');
  const [filters, setFilters] = useState<AdvancedFilterState>({
    pilgrimName: '',
    roomNumber: '',
    nationality: 'all',
    gender: 'all',
    passportNumber: '',
    organizerNumber: '',
    mobileNumber: '',
    visaNumber: '',
    enabledFilters: {
      pilgrimName: false,
      roomNumber: false,
      nationality: false,
      gender: false,
      passportNumber: false,
      organizerNumber: false,
      mobileNumber: false,
      visaNumber: false,
    }
  });

  const handleFilterChange = (key: keyof AdvancedFilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleToggleFilter = (filterKey: keyof AdvancedFilterState['enabledFilters']) => {
    const newFilters = {
      ...filters,
      enabledFilters: {
        ...filters.enabledFilters,
        [filterKey]: !filters.enabledFilters[filterKey]
      }
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: AdvancedFilterState = {
      pilgrimName: '',
      roomNumber: '',
      nationality: 'all',
      gender: 'all',
      passportNumber: '',
      organizerNumber: '',
      mobileNumber: '',
      visaNumber: '',
      enabledFilters: {
        pilgrimName: false,
        roomNumber: false,
        nationality: false,
        gender: false,
        passportNumber: false,
        organizerNumber: false,
        mobileNumber: false,
        visaNumber: false,
      }
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Get unique nationalities
  const nationalities = Array.from(new Set(mockPilgrims.map(p => p.nationality)));

  return (
    <GlassCard className="p-6 mb-6 border-2 border-bordergray/50 bg-white/90">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <FilterOutlined className="text-primaryColor" />
          {t('housing.advancedFilters') || 'Advanced Filters'}
        </h3>
        <button
          type="button"
          onClick={clearAllFilters}
          className="text-sm text-primaryColor hover:text-primaryColor/80 font-medium"
        >
          {t('housing.clearAll') || 'Clear All'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pilgrim Name */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Checkbox
              checked={filters.enabledFilters.pilgrimName}
              onChange={() => handleToggleFilter('pilgrimName')}
            />
            <label className="text-xs font-semibold text-gray-700">
              {t('housing.searchByPilgrimName')}
            </label>
          </div>
          <Input
            placeholder={t('housing.searchByPilgrimName')}
            prefix={<SearchOutlined className="text-customgray" />}
            value={filters.pilgrimName}
            onChange={(e) => handleFilterChange('pilgrimName', e.target.value)}
            disabled={!filters.enabledFilters.pilgrimName}
            size="large"
            className="border-2 border-bordergray hover:border-primaryColor focus:border-primaryColor"
          />
        </div>

        {/* Room/Tent Number */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Checkbox
              checked={filters.enabledFilters.roomNumber}
              onChange={() => handleToggleFilter('roomNumber')}
            />
            <label className="text-xs font-semibold text-gray-700">
              {type === 'hotel' || type === 'building' ? t('housing.searchByRoomNumber') : t('housing.searchByTentNumber')}
            </label>
          </div>
          <Input
            placeholder={type === 'hotel' || type === 'building' ? t('housing.searchByRoomNumber') : t('housing.searchByTentNumber')}
            prefix={<SearchOutlined className="text-customgray" />}
            value={filters.roomNumber}
            onChange={(e) => handleFilterChange('roomNumber', e.target.value)}
            disabled={!filters.enabledFilters.roomNumber}
            size="large"
            className="border-2 border-bordergray hover:border-primaryColor focus:border-primaryColor"
          />
        </div>

        {/* Nationality */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Checkbox
              checked={filters.enabledFilters.nationality}
              onChange={() => handleToggleFilter('nationality')}
            />
            <label className="text-xs font-semibold text-gray-700">
              {t('housing.searchByNationality')}
            </label>
          </div>
          <Select
            placeholder={t('housing.searchByNationality')}
            value={filters.nationality}
            onChange={(value) => handleFilterChange('nationality', value)}
            disabled={!filters.enabledFilters.nationality}
            className="w-full"
            size="large"
            style={{ borderColor: '#E5E7EB' }}
          >
            <Option value="all">{t('housing.all')}</Option>
            {nationalities.map(nat => (
              <Option key={nat} value={nat}>
                {t(`nationalities.${nat.toLowerCase()}`) || nat}
              </Option>
            ))}
          </Select>
        </div>

        {/* Gender */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Checkbox
              checked={filters.enabledFilters.gender}
              onChange={() => handleToggleFilter('gender')}
            />
            <label className="text-xs font-semibold text-gray-700">
              {t('housing.searchByGender')}
            </label>
          </div>
          <Select
            placeholder={t('housing.searchByGender')}
            value={filters.gender}
            onChange={(value) => handleFilterChange('gender', value)}
            disabled={!filters.enabledFilters.gender}
            className="w-full"
            size="large"
            style={{ borderColor: '#E5E7EB' }}
          >
            <Option value="all">{t('housing.all')}</Option>
            <Option value="male">{t('housing.male')}</Option>
            <Option value="female">{t('housing.female')}</Option>
          </Select>
        </div>

        {/* Passport Number */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Checkbox
              checked={filters.enabledFilters.passportNumber}
              onChange={() => handleToggleFilter('passportNumber')}
            />
            <label className="text-xs font-semibold text-gray-700">
              {t('housing.searchByPassport')}
            </label>
          </div>
          <Input
            placeholder={t('housing.searchByPassport')}
            prefix={<SearchOutlined className="text-customgray" />}
            value={filters.passportNumber}
            onChange={(e) => handleFilterChange('passportNumber', e.target.value)}
            disabled={!filters.enabledFilters.passportNumber}
            size="large"
            className="border-2 border-bordergray hover:border-primaryColor focus:border-primaryColor"
          />
        </div>

        {/* Organizer Number */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Checkbox
              checked={filters.enabledFilters.organizerNumber}
              onChange={() => handleToggleFilter('organizerNumber')}
            />
            <label className="text-xs font-semibold text-gray-700">
              {t('housing.searchByOrganizer')}
            </label>
          </div>
          <Input
            placeholder={t('housing.searchByOrganizer')}
            prefix={<SearchOutlined className="text-customgray" />}
            value={filters.organizerNumber}
            onChange={(e) => handleFilterChange('organizerNumber', e.target.value)}
            disabled={!filters.enabledFilters.organizerNumber}
            size="large"
            className="border-2 border-bordergray hover:border-primaryColor focus:border-primaryColor"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Checkbox
              checked={filters.enabledFilters.mobileNumber}
              onChange={() => handleToggleFilter('mobileNumber')}
            />
            <label className="text-xs font-semibold text-gray-700">
              {t('housing.searchByMobile')}
            </label>
          </div>
          <Input
            placeholder={t('housing.searchByMobile')}
            prefix={<SearchOutlined className="text-customgray" />}
            value={filters.mobileNumber}
            onChange={(e) => handleFilterChange('mobileNumber', e.target.value)}
            disabled={!filters.enabledFilters.mobileNumber}
            size="large"
            className="border-2 border-bordergray hover:border-primaryColor focus:border-primaryColor"
          />
        </div>

        {/* Visa Number */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Checkbox
              checked={filters.enabledFilters.visaNumber}
              onChange={() => handleToggleFilter('visaNumber')}
            />
            <label className="text-xs font-semibold text-gray-700">
              {t('housing.searchByVisa')}
            </label>
          </div>
          <Input
            placeholder={t('housing.searchByVisa')}
            prefix={<SearchOutlined className="text-customgray" />}
            value={filters.visaNumber}
            onChange={(e) => handleFilterChange('visaNumber', e.target.value)}
            disabled={!filters.enabledFilters.visaNumber}
            size="large"
            className="border-2 border-bordergray hover:border-primaryColor focus:border-primaryColor"
          />
        </div>
      </div>
    </GlassCard>
  );
};

