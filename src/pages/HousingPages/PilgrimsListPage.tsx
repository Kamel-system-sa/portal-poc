import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FilterBar } from '../../components/HousingComponent/FilterBar';
import type { FilterState } from '../../components/HousingComponent/FilterBar';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { Table, Tag, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { mockPilgrims } from '../../data/mockHousing';
import type { Pilgrim } from '../../types/housing';
import type { ColumnsType } from 'antd/es/table';

const PilgrimsListPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    gender: [],
    nationality: [],
    ageRange: null,
    serviceCenter: [],
    organizer: []
  });

  // Get unique values for filter options
  const availableNationalities = useMemo(() => {
    const nats = new Set(mockPilgrims.map(p => p.nationality));
    return Array.from(nats);
  }, []);

  const availableServiceCenters = useMemo(() => {
    const centers = new Set(mockPilgrims.map(p => p.serviceCenter).filter(Boolean));
    return Array.from(centers) as string[];
  }, []);

  const availableOrganizers = useMemo(() => {
    const orgs = new Set(mockPilgrims.map(p => p.organizer).filter(Boolean));
    return Array.from(orgs) as string[];
  }, []);

  // Filter pilgrims
  const filteredPilgrims = useMemo(() => {
    return mockPilgrims.filter((pilgrim: Pilgrim) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          pilgrim.name.toLowerCase().includes(searchLower) ||
          pilgrim.hawiya?.toLowerCase().includes(searchLower) ||
          pilgrim.phone?.toLowerCase().includes(searchLower) ||
          pilgrim.email?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Gender filter
      if (filters.gender.length > 0 && !filters.gender.includes(pilgrim.gender)) {
        return false;
      }

      // Nationality filter
      if (filters.nationality.length > 0 && !filters.nationality.includes(pilgrim.nationality)) {
        return false;
      }

      // Age range filter
      if (filters.ageRange) {
        const [min, max] = filters.ageRange;
        if (pilgrim.age < min || (max && pilgrim.age > max)) {
          return false;
        }
      }

      // Service center filter
      if (filters.serviceCenter.length > 0 && 
          (!pilgrim.serviceCenter || !filters.serviceCenter.includes(pilgrim.serviceCenter))) {
        return false;
      }

      // Organizer filter
      if (filters.organizer.length > 0 && 
          (!pilgrim.organizer || !filters.organizer.includes(pilgrim.organizer))) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const columns: ColumnsType<Pilgrim> = [
    {
      title: t('labels.name') || 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('housing.gender'),
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (
        <Tag color={gender === 'male' ? 'default' : 'default'} className={gender === 'male' ? 'bg-primaryColor/10 text-primaryColor border-primaryColor/30' : 'bg-pink-100 text-pink-600 border-pink-300'}>
          {gender === 'male' ? t('housing.male') : t('housing.female')}
        </Tag>
      ),
      filters: [
        { text: t('housing.male'), value: 'male' },
        { text: t('housing.female'), value: 'female' },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: t('labels.age') || 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: t('form.nationality') || 'Nationality',
      dataIndex: 'nationality',
      key: 'nationality',
      render: (nationality: string) => {
        const translationKey = `nationalities.${nationality.toLowerCase()}`;
        const translated = t(translationKey);
        const displayName = translated && translated !== translationKey ? translated : nationality;
        return <Tag>{displayName}</Tag>;
      },
    },
    {
      title: t('housing.assignment'),
      key: 'assignment',
      render: (_, record: Pilgrim) => {
        if (record.assignedRoom) {
          return (
            <Tag className="bg-success/10 text-success border-success/30">
              {record.assignedRoom.type === 'hotel' ? t('housing.hotel') : t('housing.building')} - 
              {t('housing.room')} {record.assignedRoom.roomNumber}
            </Tag>
          );
        }
        if (record.assignedTent) {
          return (
            <Tag className="bg-warning/10 text-warning border-warning/30">
              {record.assignedTent.location === 'mina' ? t('housing.mina') : t('housing.arafat')} - 
              {t('housing.tent')} {record.assignedTent.tentNumber}
            </Tag>
          );
        }
        return <Tag className="bg-gray-100 text-gray-600 border-gray-300">{t('housing.notAssigned')}</Tag>;
      },
    },
    {
      title: t('centers.viewDetails') || 'Actions',
      key: 'actions',
      render: (_, record: Pilgrim) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/housing/pilgrims/${record.id}`)}
        >
          {t('centers.viewDetails') || 'View'}
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('housing.pilgrimsList')}
          </h1>
          <p className="text-customgray">
            {t('housing.managePilgrims')}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar
            onFilterChange={setFilters}
            availableNationalities={availableNationalities}
            availableServiceCenters={availableServiceCenters}
            availableOrganizers={availableOrganizers}
          />
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-customgray">
            {t('housing.showingResults')} {filteredPilgrims.length} {t('housing.of')} {mockPilgrims.length} {t('housing.pilgrims')}
          </p>
        </div>

        {/* Table */}
        <GlassCard className="p-6" hover={false}>
          <Table
            columns={columns}
            dataSource={filteredPilgrims}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${t('housing.total')}: ${total}`,
            }}
            scroll={{ x: 'max-content' }}
          />
        </GlassCard>
      </div>
    </div>
  );
};

export default PilgrimsListPage;

