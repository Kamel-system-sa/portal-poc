import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Select, Checkbox, Button } from 'antd';
import { SearchOutlined, FilterOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import { GlassCard } from './GlassCard';
import { mockPilgrims } from '../../data/mockHousing';

const { Option } = Select;

export interface UnifiedFilterState {
  // Basic filters
  searchTerm: string;
  gender: 'all' | 'male' | 'female' | 'mixed';
  capacity: 'all' | '2' | '3' | '4';
  emptyRooms: boolean;
  floor?: 'all' | string;
  section?: 'all' | string;
  minCapacity?: 'all' | string;
  maxCapacity?: 'all' | string;
  
  // Advanced filters
  pilgrimName: string;
  roomNumber: string;
  nationality: 'all' | string;
  passportNumber: string;
  organizerNumber: string;
  mobileNumber: string;
  visaNumber: string;
  
  // Enabled advanced filters
  enabledAdvancedFilters: {
    pilgrimName: boolean;
    roomNumber: boolean;
    nationality: boolean;
    passportNumber: boolean;
    organizerNumber: boolean;
    mobileNumber: boolean;
    visaNumber: boolean;
  };
}

export type { UnifiedFilterState };

interface UnifiedFiltersProps {
  type: 'hotel' | 'building' | 'mina' | 'arafat';
  onFilterChange: (filters: UnifiedFilterState) => void;
  initialFilters?: Partial<UnifiedFilterState>;
}

export const UnifiedFilters: React.FC<UnifiedFiltersProps> = ({ 
  type, 
  onFilterChange,
  initialFilters 
}) => {
  const { t } = useTranslation('common');
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false);
  
  const [filters, setFilters] = useState<UnifiedFilterState>({
    searchTerm: '',
    gender: 'all',
    capacity: 'all',
    emptyRooms: false,
    floor: 'all',
    section: 'all',
    minCapacity: 'all',
    maxCapacity: 'all',
    pilgrimName: '',
    roomNumber: '',
    nationality: 'all',
    passportNumber: '',
    organizerNumber: '',
    mobileNumber: '',
    visaNumber: '',
    enabledAdvancedFilters: {
      pilgrimName: false,
      roomNumber: false,
      nationality: false,
      passportNumber: false,
      organizerNumber: false,
      mobileNumber: false,
      visaNumber: false,
    },
    ...initialFilters
  });

  const updateFilter = (key: keyof UnifiedFilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleAdvancedFilter = (key: keyof UnifiedFilterState['enabledAdvancedFilters']) => {
    const newEnabled = {
      ...filters.enabledAdvancedFilters,
      [key]: !filters.enabledAdvancedFilters[key]
    };
    updateFilter('enabledAdvancedFilters', newEnabled);
  };

  const clearAllFilters = () => {
    const resetFilters: UnifiedFilterState = {
      searchTerm: '',
      gender: 'all',
      capacity: 'all',
      emptyRooms: false,
      floor: 'all',
      section: 'all',
      minCapacity: 'all',
      maxCapacity: 'all',
      pilgrimName: '',
      roomNumber: '',
      nationality: 'all',
      passportNumber: '',
      organizerNumber: '',
      mobileNumber: '',
      visaNumber: '',
      enabledAdvancedFilters: {
        pilgrimName: false,
        roomNumber: false,
        nationality: false,
        passportNumber: false,
        organizerNumber: false,
        mobileNumber: false,
        visaNumber: false,
      }
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = 
    filters.searchTerm !== '' ||
    filters.gender !== 'all' ||
    filters.capacity !== 'all' ||
    filters.emptyRooms ||
    (filters.floor && filters.floor !== 'all') ||
    (filters.section && filters.section !== 'all') ||
    (filters.minCapacity && filters.minCapacity !== 'all') ||
    (filters.maxCapacity && filters.maxCapacity !== 'all') ||
    Object.values(filters.enabledAdvancedFilters).some(Boolean);

  // Get unique nationalities from mockPilgrims
  const nationalities = Array.from(new Set(mockPilgrims.map(p => p.nationality))).sort();

  const isRoomType = type === 'hotel' || type === 'building';
  const isTentType = type === 'mina' || type === 'arafat';

  return (
    <GlassCard className="p-6 mb-6 border-2 border-bordergray/50 bg-white/90">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-primaryColor to-secondaryColor rounded-full"></div>
          {t('filters.apply') || 'Filters'}
        </h3>
        {hasActiveFilters && (
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={clearAllFilters}
            className="text-customgray hover:text-primaryColor"
          >
            {t('filters.reset') || 'Clear All'}
          </Button>
        )}
      </div>

      {/* Basic Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            {isRoomType ? t('housing.searchRooms') : t('housing.searchTents')}
          </label>
          <Input
            placeholder={isRoomType ? t('housing.searchRooms') : t('housing.searchTents')}
            prefix={<SearchOutlined className="text-customgray" />}
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            size="large"
            className="border-2 border-bordergray hover:border-primaryColor focus:border-primaryColor"
          />
        </div>

        {/* Gender Filter */}
        <div className="w-full md:w-48">
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            {t('housing.filterByGender')}
          </label>
          <Select
            placeholder={t('housing.filterByGender')}
            value={filters.gender}
            onChange={(value) => updateFilter('gender', value)}
            className="w-full"
            size="large"
            style={{ borderColor: '#E5E7EB' }}
          >
            <Option value="all">{t('housing.all')}</Option>
            <Option value="male">{t('housing.male')}</Option>
            <Option value="female">{t('housing.female')}</Option>
            {isRoomType && <Option value="mixed">{t('housing.mixed')}</Option>}
          </Select>
        </div>

        {/* Capacity Filter (for rooms) */}
        {isRoomType && (
          <div className="w-full md:w-48">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              {t('housing.filterByCapacity')}
            </label>
            <Select
              placeholder={t('housing.filterByCapacity')}
              value={filters.capacity}
              onChange={(value) => updateFilter('capacity', value)}
              className="w-full"
              size="large"
              style={{ borderColor: '#E5E7EB' }}
            >
              <Option value="all">{t('housing.all')}</Option>
              <Option value="2">2 {t('housing.beds')}</Option>
              <Option value="3">3 {t('housing.beds')}</Option>
              <Option value="4">4 {t('housing.beds')}</Option>
            </Select>
          </div>
        )}

        {/* Floor Filter (for buildings) */}
        {type === 'building' && (
          <div className="w-full md:w-48">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              {t('housing.filterByFloor')}
            </label>
            <Select
              placeholder={t('housing.filterByFloor')}
              value={filters.floor}
              onChange={(value) => updateFilter('floor', value)}
              className="w-full"
              size="large"
              style={{ borderColor: '#E5E7EB' }}
            >
              <Option value="all">{t('housing.all')}</Option>
              {/* Floor options would come from actual data */}
            </Select>
          </div>
        )}

        {/* Section Filter (for tents) */}
        {isTentType && (
          <div className="w-full md:w-48">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              {t('housing.filterBySection')}
            </label>
            <Select
              placeholder={t('housing.filterBySection')}
              value={filters.section}
              onChange={(value) => updateFilter('section', value)}
              className="w-full"
              size="large"
              style={{ borderColor: '#E5E7EB' }}
            >
              <Option value="all">{t('housing.all')}</Option>
              {/* Section options would come from actual data */}
            </Select>
          </div>
        )}

        {/* Min/Max Capacity (for tents) */}
        {isTentType && (
          <>
            <div className="w-full md:w-32">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                {t('housing.minCapacity')}
              </label>
              <Select
                placeholder={t('housing.minCapacity')}
                value={filters.minCapacity}
                onChange={(value) => updateFilter('minCapacity', value)}
                className="w-full"
                size="large"
                style={{ borderColor: '#E5E7EB' }}
              >
                <Option value="all">{t('housing.all')}</Option>
                <Option value="20">20</Option>
                <Option value="30">30</Option>
                <Option value="40">40</Option>
                <Option value="50">50</Option>
              </Select>
            </div>
            <div className="w-full md:w-32">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                {t('housing.maxCapacity')}
              </label>
              <Select
                placeholder={t('housing.maxCapacity')}
                value={filters.maxCapacity}
                onChange={(value) => updateFilter('maxCapacity', value)}
                className="w-full"
                size="large"
                style={{ borderColor: '#E5E7EB' }}
              >
                <Option value="all">{t('housing.all')}</Option>
                <Option value="20">20</Option>
                <Option value="30">30</Option>
                <Option value="40">40</Option>
                <Option value="50">50</Option>
              </Select>
            </div>
          </>
        )}

        {/* Empty Rooms/Tents Toggle */}
        <div className="w-full md:w-auto flex items-end">
          <button
            type="button"
            onClick={() => updateFilter('emptyRooms', !filters.emptyRooms)}
            className={`h-10 px-4 rounded-lg font-medium transition-all duration-200 ${
              filters.emptyRooms 
                ? 'bg-primaryColor text-white hover:bg-primaryColor/90 border-2 border-primaryColor' 
                : 'border-2 border-bordergray text-gray-700 hover:border-primaryColor hover:text-primaryColor hover:bg-primaryColor/5'
            }`}
          >
            {isRoomType ? t('housing.emptyRoomsOnly') : t('housing.emptyTentsOnly')}
          </button>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="border-t border-bordergray pt-4">
        <button
          type="button"
          onClick={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
          className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-primaryColor transition-colors"
        >
          <span className="flex items-center gap-2">
            <FilterOutlined />
            {t('housing.advancedFilters') || 'Advanced Filters'}
          </span>
          <DownOutlined 
            className={`transition-transform duration-200 ${isAdvancedExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Advanced Filters Content */}
        {isAdvancedExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Pilgrim Name */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={filters.enabledAdvancedFilters.pilgrimName}
                  onChange={() => toggleAdvancedFilter('pilgrimName')}
                />
                <label className="text-xs font-semibold text-gray-700">
                  {t('form.name')}
                </label>
              </div>
              <Input
                placeholder={t('housing.searchByPilgrimName') || 'Search by pilgrim name'}
                value={filters.pilgrimName}
                onChange={(e) => updateFilter('pilgrimName', e.target.value)}
                disabled={!filters.enabledAdvancedFilters.pilgrimName}
                size="large"
                className="border-2 border-bordergray"
              />
            </div>

            {/* Room/Tent Number */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={filters.enabledAdvancedFilters.roomNumber}
                  onChange={() => toggleAdvancedFilter('roomNumber')}
                />
                <label className="text-xs font-semibold text-gray-700">
                  {isRoomType ? t('housing.room') : t('housing.tent')} {t('form.id') || 'Number'}
                </label>
              </div>
              <Input
                placeholder={isRoomType ? t('housing.searchByRoomNumber') : t('housing.searchByTentNumber')}
                value={filters.roomNumber}
                onChange={(e) => updateFilter('roomNumber', e.target.value)}
                disabled={!filters.enabledAdvancedFilters.roomNumber}
                size="large"
                className="border-2 border-bordergray"
              />
            </div>

            {/* Nationality */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={filters.enabledAdvancedFilters.nationality}
                  onChange={() => toggleAdvancedFilter('nationality')}
                />
                <label className="text-xs font-semibold text-gray-700">
                  {t('form.nationality')}
                </label>
              </div>
              <Select
                placeholder={t('housing.selectNationality') || 'Select nationality'}
                value={filters.nationality}
                onChange={(value) => updateFilter('nationality', value)}
                disabled={!filters.enabledAdvancedFilters.nationality}
                className="w-full"
                size="large"
                style={{ borderColor: '#E5E7EB' }}
              >
                <Option value="all">{t('housing.all')}</Option>
                {nationalities.map(nat => {
                  const translationKey = `nationalities.${nat.toLowerCase()}`;
                  const translated = t(translationKey);
                  const displayName = translated && translated !== translationKey ? translated : nat;
                  return (
                    <Option key={nat} value={nat}>
                      {displayName}
                    </Option>
                  );
                })}
              </Select>
            </div>

            {/* Mobile Number */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={filters.enabledAdvancedFilters.mobileNumber}
                  onChange={() => toggleAdvancedFilter('mobileNumber')}
                />
                <label className="text-xs font-semibold text-gray-700">
                  {t('housing.phone')}
                </label>
              </div>
              <Input
                placeholder={t('housing.searchByPhone') || 'Search by phone'}
                value={filters.mobileNumber}
                onChange={(e) => updateFilter('mobileNumber', e.target.value)}
                disabled={!filters.enabledAdvancedFilters.mobileNumber}
                size="large"
                className="border-2 border-bordergray"
              />
            </div>

            {/* Organizer Number */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={filters.enabledAdvancedFilters.organizerNumber}
                  onChange={() => toggleAdvancedFilter('organizerNumber')}
                />
                <label className="text-xs font-semibold text-gray-700">
                  {t('housing.organizerNumber')}
                </label>
              </div>
              <Input
                placeholder={t('housing.searchByOrganizer') || 'Search by organizer'}
                value={filters.organizerNumber}
                onChange={(e) => updateFilter('organizerNumber', e.target.value)}
                disabled={!filters.enabledAdvancedFilters.organizerNumber}
                size="large"
                className="border-2 border-bordergray"
              />
            </div>

            {/* Passport Number */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={filters.enabledAdvancedFilters.passportNumber}
                  onChange={() => toggleAdvancedFilter('passportNumber')}
                />
                <label className="text-xs font-semibold text-gray-700">
                  {t('housing.passportNumber')}
                </label>
              </div>
              <Input
                placeholder={t('housing.searchByPassport') || 'Search by passport'}
                value={filters.passportNumber}
                onChange={(e) => updateFilter('passportNumber', e.target.value)}
                disabled={!filters.enabledAdvancedFilters.passportNumber}
                size="large"
                className="border-2 border-bordergray"
              />
            </div>

            {/* Visa Number */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={filters.enabledAdvancedFilters.visaNumber}
                  onChange={() => toggleAdvancedFilter('visaNumber')}
                />
                <label className="text-xs font-semibold text-gray-700">
                  {t('housing.visaNumber')}
                </label>
              </div>
              <Input
                placeholder={t('housing.searchByVisa') || 'Search by visa'}
                value={filters.visaNumber}
                onChange={(e) => updateFilter('visaNumber', e.target.value)}
                disabled={!filters.enabledAdvancedFilters.visaNumber}
                size="large"
                className="border-2 border-bordergray"
              />
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

