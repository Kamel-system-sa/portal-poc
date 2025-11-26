import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Select, DatePicker, Card, Table, Tag, Button, Space } from 'antd';
import { SearchOutlined, UserOutlined, TeamOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { mockVerifiedPilgrims, groupByOrganizer, type VerifiedPilgrim } from '../../data/mockVerifiedPilgrims';
import type { ColumnsType } from 'antd/es/table';
// Using dayjs from antd
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const VerifiedPilgrimsPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [searchText, setSearchText] = useState('');
  const [selectedOrganizer, setSelectedOrganizer] = useState<string>('all');
  const [selectedNationality, setSelectedNationality] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Get unique organizers and nationalities
  const organizers = useMemo(() => {
    const orgs = new Map<string, { id: string; number: string; name: string }>();
    mockVerifiedPilgrims.forEach(p => {
      if (!orgs.has(p.organizer.id)) {
        orgs.set(p.organizer.id, {
          id: p.organizer.id,
          number: p.organizer.number,
          name: p.organizer.name
        });
      }
    });
    return Array.from(orgs.values());
  }, []);

  const nationalities = useMemo(() => {
    const nats = new Set<string>();
    mockVerifiedPilgrims.forEach(p => nats.add(p.nationality));
    return Array.from(nats).sort();
  }, []);

  // Filter data
  const filteredPilgrims = useMemo(() => {
    let filtered = [...mockVerifiedPilgrims];

    // Search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.passportNumber.toLowerCase().includes(searchLower)
      );
    }

    // Organizer filter
    if (selectedOrganizer !== 'all') {
      filtered = filtered.filter(p => p.organizer.id === selectedOrganizer);
    }

    // Nationality filter
    if (selectedNationality !== 'all') {
      filtered = filtered.filter(p => p.nationality === selectedNationality);
    }

    // Date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(p => {
        const verifiedDate = dayjs(p.verifiedAt);
        return verifiedDate.isAfter(dateRange[0]!.subtract(1, 'day')) &&
               verifiedDate.isBefore(dateRange[1]!.add(1, 'day'));
      });
    }

    return filtered;
  }, [searchText, selectedOrganizer, selectedNationality, dateRange]);

  // Group by organizer
  const groupedData = useMemo(() => {
    return groupByOrganizer(filteredPilgrims);
  }, [filteredPilgrims]);

  const columns: ColumnsType<VerifiedPilgrim> = [
    {
      title: t('labels.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('passport.passportNumber'),
      dataIndex: 'passportNumber',
      key: 'passportNumber',
      sorter: (a, b) => a.passportNumber.localeCompare(b.passportNumber),
    },
    {
      title: t('form.nationality'),
      dataIndex: 'nationality',
      key: 'nationality',
      render: (nationality: string) => (
        <Tag color="blue">
          {t(`nationalities.${nationality.toLowerCase()}`) || nationality}
        </Tag>
      ),
    },
    {
      title: t('passport.timeVerified'),
      dataIndex: 'verifiedAt',
      key: 'verifiedAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => dayjs(a.verifiedAt).unix() - dayjs(b.verifiedAt).unix(),
    },
    {
      title: t('passport.operator'),
      dataIndex: 'verifiedBy',
      key: 'verifiedBy',
    },
    {
      title: t('passport.serviceCenter'),
      dataIndex: 'centerName',
      key: 'centerName',
    },
  ];

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = filteredPilgrims.length;
    const today = dayjs().startOf('day');
    const thisWeek = dayjs().startOf('week');
    const thisMonth = dayjs().startOf('month');
    
    const verifiedToday = filteredPilgrims.filter(p => 
      dayjs(p.verifiedAt).isSame(today, 'day')
    ).length;
    
    const verifiedThisWeek = filteredPilgrims.filter(p => 
      dayjs(p.verifiedAt).isAfter(thisWeek) || dayjs(p.verifiedAt).isSame(thisWeek, 'day')
    ).length;
    
    const verifiedThisMonth = filteredPilgrims.filter(p => 
      dayjs(p.verifiedAt).isAfter(thisMonth) || dayjs(p.verifiedAt).isSame(thisMonth, 'day')
    ).length;
    
    return { total, verifiedToday, verifiedThisWeek, verifiedThisMonth };
  }, [filteredPilgrims]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t('passport.verifiedPilgrims')}
        </h1>
        <p className="text-gray-600">{t('passport.verifiedPilgrimsSubtitle')}</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-mainColor to-primaryColor flex items-center justify-center shadow-md shadow-mainColor/20">
              <UserOutlined className="text-white text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">{t('passport.totalVerified')}</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md shadow-green-500/20">
              <UserOutlined className="text-white text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">{t('passport.verifiedToday')}</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.verifiedToday}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <UserOutlined className="text-white text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">{t('passport.verifiedThisWeek')}</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.verifiedThisWeek}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-500/20">
              <UserOutlined className="text-white text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">{t('passport.verifiedThisMonth')}</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.verifiedThisMonth}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
        <div className="space-y-4">
          {/* Search and Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1">
              <Input
                placeholder={t('passport.searchPlaceholder')}
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="large"
                className="w-full"
              />
            </div>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              size="large"
              className={`${
                isFiltersExpanded
                  ? 'bg-mainColor text-white border-mainColor hover:bg-mainColor/90'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-mainColor'
              } ${
                (selectedOrganizer !== 'all' || selectedNationality !== 'all' || dateRange)
                  ? 'border-mainColor text-mainColor'
                  : ''
              }`}
            >
              {t('passport.filters')}
              {(selectedOrganizer !== 'all' || selectedNationality !== 'all' || dateRange) && (
                <span className="ml-2 px-2 py-0.5 bg-mainColor/20 text-mainColor rounded-full text-xs font-bold">
                  {[
                    selectedOrganizer !== 'all' ? 1 : 0,
                    selectedNationality !== 'all' ? 1 : 0,
                    dateRange ? 1 : 0
                  ].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </Button>
            {(selectedOrganizer !== 'all' || selectedNationality !== 'all' || dateRange || searchText) && (
              <Button
                icon={<ClearOutlined />}
                onClick={() => {
                  setSearchText('');
                  setSelectedOrganizer('all');
                  setSelectedNationality('all');
                  setDateRange(null);
                }}
                size="large"
                className="bg-white text-gray-700 border-gray-300 hover:border-red-400 hover:text-red-500"
              >
                {t('filters.reset')}
              </Button>
            )}
          </div>

          {/* Expanded Filters */}
          {isFiltersExpanded && (
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('passport.filterByOrganizer')}
                  </label>
                  <Select
                    placeholder={t('passport.selectOrganizer')}
                    value={selectedOrganizer}
                    onChange={setSelectedOrganizer}
                    size="large"
                    className="w-full"
                    allowClear
                  >
                    {organizers.map(org => (
                      <Select.Option key={org.id} value={org.id}>
                        {org.number} - {org.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('passport.filterByNationality')}
                  </label>
                  <Select
                    placeholder={t('passport.selectNationality')}
                    value={selectedNationality}
                    onChange={setSelectedNationality}
                    size="large"
                    className="w-full"
                    allowClear
                  >
                    {nationalities.map(nat => (
                      <Select.Option key={nat} value={nat}>
                        {t(`nationalities.${nat.toLowerCase()}`) || nat}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('passport.filterByDate')}
                  </label>
                  <RangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    size="large"
                    className="w-full"
                    format="YYYY-MM-DD"
                    placeholder={[t('passport.startDate'), t('passport.endDate')]}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Grouped Tables */}
      {Object.keys(groupedData).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedData).map(([organizerId, pilgrims]) => {
            const organizer = pilgrims[0].organizer;
            return (
              <Card
                key={organizerId}
                className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mainColor to-primaryColor flex items-center justify-center shadow-md shadow-mainColor/20">
                    <TeamOutlined className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {organizer.number} - {organizer.name}
                    </h3>
                    <p className="text-sm text-gray-500">{organizer.company}</p>
                  </div>
                  <Tag color="green" className="ml-auto">
                    {pilgrims.length} {t('passport.pilgrims')}
                  </Tag>
                </div>

                <Table
                  columns={columns}
                  dataSource={pilgrims}
                  rowKey="id"
                  pagination={false}
                  size="middle"
                />
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
          <div className="text-center py-12">
            <UserOutlined className="text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500">{t('passport.noVerifiedPilgrims')}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VerifiedPilgrimsPage;

