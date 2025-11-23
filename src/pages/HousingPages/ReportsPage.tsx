import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/HousingComponent/GlassCard';
import { ReportBuilder } from '../../components/HousingComponent/ReportBuilder';
import { FilterBar } from '../../components/HousingComponent/FilterBar';
import type { FilterState } from '../../components/HousingComponent/FilterBar';
import { Table, Tag, Button } from 'antd';
import { 
  FileTextOutlined,
  PlusOutlined,
  CloseOutlined,
  SendOutlined,
  InboxOutlined,
  EyeOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { mockPilgrims } from '../../data/mockHousing';
import type { Pilgrim } from '../../types/housing';
import type { ColumnsType } from 'antd/es/table';

const ReportsPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [isReportBuilderOpen, setIsReportBuilderOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    gender: [],
    nationality: [],
    ageRange: null,
    serviceCenter: [],
    organizer: []
  });

  // Reports summary mock data
  const reportsSummary = useMemo(() => ({
    totalCreated: 24,
    inDraft: 5,
    sent: 18,
    received: 12
  }), []);

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
      render: (nationality: string) => (
        <Tag>{t(`nationalities.${nationality.toLowerCase()}`) || nationality}</Tag>
      ),
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
    <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 overflow-x-hidden">
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 break-words">
            {t('housing.reports') || 'Reports'}
          </h1>
          <p className="text-customgray text-sm sm:text-base break-words">
            {t('housing.reportsDescription') || 'View reports and manage pilgrims list'}
          </p>
        </div>

        {/* Report Overview Section */}
        <div>
          <GlassCard className="p-4 sm:p-5 md:p-6 border-2 border-bordergray/50 bg-white/90">
            <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
              <FileTextOutlined className="text-primaryColor text-xl" />
              {t('housing.reportsOverview') || 'Reports Overview'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 sm:mb-5 md:mb-6">
              <div className="p-4 bg-gradient-to-br from-primaryColor/10 to-primaryColor/5 rounded-lg border border-primaryColor/20">
                <div className="flex items-center gap-3 mb-2">
                  <FileTextOutlined className="text-primaryColor text-xl" />
                  <div className="text-2xl font-bold text-primaryColor">{reportsSummary.totalCreated}</div>
                </div>
                <div className="text-sm text-customgray">{t('housing.totalReportsCreated') || 'Total Reports Created'}</div>
              </div>

              <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3 mb-2">
                  <FileTextOutlined className="text-amber-600 text-xl" />
                  <div className="text-2xl font-bold text-amber-600">{reportsSummary.inDraft}</div>
                </div>
                <div className="text-sm text-customgray">{t('housing.reportsInDraft') || 'Reports In Draft'}</div>
              </div>

              <div className="p-4 bg-gradient-to-br from-secondaryColor/10 to-secondaryColor/5 rounded-lg border border-secondaryColor/20">
                <div className="flex items-center gap-3 mb-2">
                  <SendOutlined className="text-secondaryColor text-xl" />
                  <div className="text-2xl font-bold text-secondaryColor">{reportsSummary.sent}</div>
                </div>
                <div className="text-sm text-customgray">{t('housing.reportsSent') || 'Reports Sent'}</div>
              </div>

              <div className="p-4 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-3 mb-2">
                  <InboxOutlined className="text-cyan-600 text-xl" />
                  <div className="text-2xl font-bold text-cyan-600">{reportsSummary.received}</div>
                </div>
                <div className="text-sm text-customgray">{t('housing.reportsReceived') || 'Reports Received'}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsReportBuilderOpen(true)}
              className="w-full px-6 py-3 bg-gradient-to-r from-primaryColor to-secondaryColor text-white rounded-xl hover:shadow-lg hover:shadow-primaryColor/30 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <PlusOutlined />
              {t('housing.createReport') || 'Create Report'}
            </button>
          </GlassCard>
        </div>

        {/* Pilgrims List Section */}
        <div>
          <GlassCard className="p-4 sm:p-5 md:p-6 border-2 border-bordergray/50 bg-white/90">
            <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
              <TeamOutlined className="text-primaryColor text-xl" />
              {t('housing.pilgrimsList') || 'Pilgrims List'}
            </h3>

            {/* Filter Bar */}
            <div className="mb-4 sm:mb-5 md:mb-6">
              <FilterBar
                onFilterChange={setFilters}
                availableNationalities={availableNationalities}
                availableServiceCenters={availableServiceCenters}
                availableOrganizers={availableOrganizers}
              />
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-xs sm:text-sm text-customgray">
                {t('housing.showingResults')} {filteredPilgrims.length} {t('housing.of')} {mockPilgrims.length} {t('housing.pilgrims')}
              </p>
            </div>

            {/* Table */}
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

      {/* Report Builder Modal */}
      {isReportBuilderOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsReportBuilderOpen(false);
          }}
        >
          <div className="relative w-full max-w-5xl max-h-[95vh] bg-white rounded-xl shadow-2xl overflow-hidden z-10">
            <div className="flex items-center justify-between p-6 border-b border-bordergray bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-800">
                {t('housing.reportBuilder') || 'Report Builder'}
              </h2>
              <button
                onClick={() => setIsReportBuilderOpen(false)}
                className="p-2 text-customgray hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
              <ReportBuilder />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;

