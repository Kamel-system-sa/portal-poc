import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  SearchOutlined, 
  EyeOutlined, 
  FilterOutlined, 
  InboxOutlined, 
  GlobalOutlined, 
  CarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseOutlined, 
  TeamOutlined, 
  PhoneOutlined, 
  EditOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { mockPortEntries } from '../../data/mockPorts';
import { PortEntryForm } from '../../components/Reception/PortEntryForm';
import type { PortEntry } from '../../types/reception';

// Custom Airplane Icon Component
const AirplaneOutlined: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    style={{ width: '1em', height: '1em', display: 'inline-block' }}
  >
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const PortsDashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [entries, setEntries] = useState<PortEntry[]>(mockPortEntries);
  const [searchValue, setSearchValue] = useState('');
  const [portTypeFilter, setPortTypeFilter] = useState<'all' | 'airport' | 'land'>('all');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalPortType, setModalPortType] = useState<'airport' | 'land'>('airport');
  const [selectedEntry, setSelectedEntry] = useState<PortEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<PortEntry | null>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEntries = entries.length;
    const airportEntries = entries.filter(e => e.portType === 'airport').length;
    const landEntries = entries.filter(e => e.portType === 'land').length;
    const pendingEntries = entries.filter(e => e.status === 'pending').length;
    const confirmedEntries = entries.filter(e => e.status === 'confirmed').length;
    const completedEntries = entries.filter(e => e.status === 'completed').length;
    const totalPilgrims = entries.reduce((sum, e) => sum + (e.groupCount || e.passengersPerBus || 0), 0);

    return {
      totalEntries,
      airportEntries,
      landEntries,
      pendingEntries,
      confirmedEntries,
      completedEntries,
      totalPilgrims
    };
  }, [entries]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.portName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        entry.flightNumber?.toLowerCase().includes(searchValue.toLowerCase()) ||
        entry.busNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
        entry.carrierName.toLowerCase().includes(searchValue.toLowerCase()) ||
        entry.groupName?.toLowerCase().includes(searchValue.toLowerCase());

      const matchesPortType = portTypeFilter === 'all' || entry.portType === portTypeFilter;
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(entry.status);

      return matchesSearch && matchesPortType && matchesStatus;
    });
  }, [entries, searchValue, portTypeFilter, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
      pending: {
        label: t('reception.ports.status.pending') || 'Pending',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      },
      confirmed: {
        label: t('reception.ports.status.confirmed') || 'Confirmed',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      completed: {
        label: t('reception.ports.status.completed') || 'Completed',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      }
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const handleAddEntry = (data: PortEntry) => {
    if (editingEntry) {
      setEntries(entries.map(entry => entry.id === editingEntry.id ? data : entry));
      setEditingEntry(null);
    } else {
      setEntries([...entries, data]);
    }
    setIsAddModalOpen(false);
  };

  const handleOpenModal = (type: 'airport' | 'land') => {
    setModalPortType(type);
    setSelectedEntry(null);
    setEditingEntry(null);
    setIsAddModalOpen(true);
  };

  const handleEditEntry = (entry: PortEntry) => {
    setEditingEntry(entry);
    setModalPortType(entry.portType);
    setSelectedEntry(null);
    setIsAddModalOpen(true);
  };

  return (
    <>
      <section className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('reception.ports.title') || 'Air & Land Ports'}
              </h1>
              <p className="text-gray-600">
                {t('reception.ports.list.subtitle') || 'Manage port entries and arrivals'}
              </p>
            </div>
          </div>

          {/* Summary Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {/* Total Entries */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-cyan-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                <BarChartOutlined className="text-lg text-cyan-600" />
              </div>
              <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('reception.ports.list.totalEntries') || 'إجمالي الإدخالات'}</h4>
              <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{stats.totalEntries}</span>
              <div className="mt-2 w-10 h-0.5 bg-cyan-600 rounded-full flex-shrink-0"></div>
            </div>

            {/* Airport Entries */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                <AirplaneOutlined className="text-lg text-blue-600" />
              </div>
              <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('reception.ports.airports.title') || 'المطارات'}</h4>
              <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{stats.airportEntries}</span>
              <div className="mt-2 w-10 h-0.5 bg-blue-600 rounded-full flex-shrink-0"></div>
            </div>

            {/* Land Port Entries */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-emerald-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                <CarOutlined className="text-lg text-emerald-600" />
              </div>
              <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('reception.ports.landPorts.title') || 'المنافذ البرية'}</h4>
              <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{stats.landEntries}</span>
              <div className="mt-2 w-10 h-0.5 bg-emerald-600 rounded-full flex-shrink-0"></div>
            </div>

            {/* Total Pilgrims */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-violet-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                <TeamOutlined className="text-lg text-violet-600" />
              </div>
              <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('reception.dashboard.pilgrims') || 'الحجاج'}</h4>
              <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{stats.totalPilgrims.toLocaleString()}</span>
              <div className="mt-2 w-10 h-0.5 bg-violet-600 rounded-full flex-shrink-0"></div>
            </div>
          </div>

          {/* Status Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            {/* Pending */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-orange-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                <ClockCircleOutlined className="text-lg text-orange-600" />
              </div>
              <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('reception.ports.status.pending') || 'قيد الانتظار'}</h4>
              <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{stats.pendingEntries}</span>
              <div className="mt-2 w-10 h-0.5 bg-orange-600 rounded-full flex-shrink-0"></div>
            </div>

            {/* Confirmed */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-green-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                <CheckCircleOutlined className="text-lg text-green-600" />
              </div>
              <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('reception.ports.status.confirmed') || 'مؤكد'}</h4>
              <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{stats.confirmedEntries}</span>
              <div className="mt-2 w-10 h-0.5 bg-green-600 rounded-full flex-shrink-0"></div>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200 hover:shadow-lg hover:shadow-blue-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col" style={{ minHeight: '120px' }}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-12 -mt-12 opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
                <CheckCircleOutlined className="text-lg text-blue-600" />
              </div>
              <h4 className="text-xs font-medium text-gray-700 mb-2 leading-tight flex-shrink-0">{t('reception.ports.status.completed') || 'مكتمل'}</h4>
              <span className="text-2xl font-bold bg-gradient-to-r from-mainColor to-primary bg-clip-text text-transparent mt-auto">{stats.completedEntries}</span>
              <div className="mt-2 w-10 h-0.5 bg-blue-600 rounded-full flex-shrink-0"></div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md w-full sm:w-auto">
              <SearchOutlined className={`absolute top-1/2 transform -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} text-gray-400`} />
              <input
                type="text"
                placeholder={t('reception.ports.list.searchPlaceholder') || 'Search by flight number, bus number, carrier...'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700`}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Port Type Filter */}
              <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPortTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    portTypeFilter === 'all'
                      ? 'bg-white text-mainColor shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('reception.ports.list.all') || 'All'}
                </button>
                <button
                  onClick={() => setPortTypeFilter('airport')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    portTypeFilter === 'airport'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('reception.ports.airports.title') || 'Airports'}
                </button>
                <button
                  onClick={() => setPortTypeFilter('land')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    portTypeFilter === 'land'
                      ? 'bg-white text-mainColor shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('reception.ports.landPorts.title') || 'Land Ports'}
                </button>
              </div>
              {/* Status Filter */}
              {['pending', 'confirmed', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(
                      statusFilter.includes(status)
                        ? statusFilter.filter((s) => s !== status)
                        : [...statusFilter, status]
                    );
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter.includes(status)
                      ? 'bg-mainColor text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t(`reception.ports.status.${status}`) || status}
                </button>
              ))}
            </div>
          </div>

          {/* Entries Cards Grid */}
          {filteredEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedEntry(entry)}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {entry.portType === 'airport' ? (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                          <AirplaneOutlined className="text-2xl text-blue-600" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mainColor/20 to-primary/20 flex items-center justify-center flex-shrink-0">
                          <CarOutlined className="text-2xl text-mainColor" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {entry.portName || (entry.portType === 'airport' ? entry.flightNumber : entry.busNumber)}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {entry.portType === 'airport' 
                            ? t('reception.ports.airports.title') || 'Airport'
                            : t('reception.ports.landPorts.title') || 'Land Port'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(entry.status)}
                  </div>

                  {/* Entry Details - Only Group and Carrier */}
                  <div className="space-y-3 mb-4">
                    {entry.groupName && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 font-medium">{t('reception.ports.list.group') || 'Group'}:</span>
                          <span className="text-sm font-bold text-gray-900">{entry.groupName}</span>
                        </div>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 font-medium">{t('reception.ports.list.carrier') || 'Carrier'}:</span>
                        <span className="text-sm font-bold text-gray-900">{entry.carrierName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEntry(entry);
                      }}
                      className="flex-1 px-4 py-2 bg-mainColor/10 hover:bg-mainColor/20 text-mainColor rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                    >
                      <EditOutlined />
                      {t('form.edit') || 'Edit'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEntry(entry);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                    >
                      <EyeOutlined />
                      {t('reception.ports.list.viewDetails') || 'View Details'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-12 border border-gray-100">
              <div className="flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 shadow-inner">
                  <InboxOutlined className="text-5xl text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  {t('reception.ports.list.empty') || 'No port entries found'}
                </h3>
                <p className="text-sm text-gray-500 max-w-md text-center mb-6">
                  {t('reception.ports.list.emptyMessage') || 'Start by adding a new airport or land port entry'}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Entry Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddModalOpen(false);
              setEditingEntry(null);
            }
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-7xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingEntry
                  ? (modalPortType === 'airport'
                      ? t('reception.ports.airports.editEntry') || 'Edit Airport Entry'
                      : t('reception.ports.landPorts.editEntry') || 'Edit Land Port Entry')
                  : (modalPortType === 'airport'
                      ? t('reception.ports.airports.addEntry') || 'Add Airport Entry'
                      : t('reception.ports.landPorts.addEntry') || 'Add Land Port Entry')}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingEntry(null);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
                aria-label="Close modal"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
              <PortEntryForm
                portType={modalPortType}
                initialData={editingEntry || undefined}
                onCancel={() => {
                  setIsAddModalOpen(false);
                  setEditingEntry(null);
                }}
                onSubmit={handleAddEntry}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedEntry(null);
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-4xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                {t('reception.ports.list.entryDetails') || 'Entry Details'}
              </h2>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
                aria-label="Close modal"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
              <div className="space-y-6">
                {/* Entry Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedEntry.portType === 'airport' ? (
                      <AirplaneOutlined className="text-3xl text-blue-600" />
                    ) : (
                      <CarOutlined className="text-3xl text-mainColor" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedEntry.portName || (selectedEntry.portType === 'airport' ? selectedEntry.flightNumber : selectedEntry.busNumber)}
                      </h3>
                      {selectedEntry.groupName && (
                        <p className="text-gray-600">{selectedEntry.groupName}</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(selectedEntry.status)}
                </div>

                {/* Entry Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedEntry.portName && (
                    <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">
                        {selectedEntry.portType === 'airport' 
                          ? (t('reception.ports.airports.title') || 'Airport')
                          : (t('reception.ports.landPorts.title') || 'Land Port')}
                      </label>
                      <p className="text-gray-900 text-lg font-semibold">{selectedEntry.portName}</p>
                    </div>
                  )}
                  {selectedEntry.groupName && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">
                        {t('reception.ports.list.group') || 'Group'}
                      </label>
                      <p className="text-gray-900">{selectedEntry.groupName}</p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                      {t('reception.ports.list.carrier') || 'Carrier'}
                    </label>
                    <p className="text-gray-900">{selectedEntry.carrierName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                      {t('reception.ports.airports.busNumber') || 'Bus Number'}
                    </label>
                    <p className="text-gray-900">{selectedEntry.busNumber}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                      {t('reception.ports.airports.driverPhone') || 'Driver Phone'}
                    </label>
                    <p className="text-gray-900">{selectedEntry.driverPhone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                      {t('reception.ports.airports.passengersPerBus') || 'Passengers per Bus'}
                    </label>
                    <p className="text-gray-900">{selectedEntry.passengersPerBus}</p>
                  </div>
                  {selectedEntry.portType === 'land' && selectedEntry.guidePhone && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">
                        {t('reception.ports.landPorts.guidePhone') || 'Guide Phone'}
                      </label>
                      <p className="text-gray-900">{selectedEntry.guidePhone}</p>
                    </div>
                  )}
                  {selectedEntry.portType === 'airport' && selectedEntry.expectedCount && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">
                        {t('reception.ports.airports.expected') || 'Expected Count'}
                      </label>
                      <p className="text-gray-900">{selectedEntry.expectedCount}</p>
                    </div>
                  )}
                </div>

                {/* Timestamps */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold">{t('reception.ports.list.createdAt') || 'Created At'}:</span>{' '}
                      {new Date(selectedEntry.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-semibold">{t('reception.ports.list.updatedAt') || 'Last Updated'}:</span>{' '}
                      {new Date(selectedEntry.updatedAt).toLocaleString()}
                    </div>
                    {selectedEntry.confirmedBy && (
                      <div>
                        <span className="font-semibold">{t('reception.ports.list.confirmedBy') || 'Confirmed By'}:</span>{' '}
                        {selectedEntry.confirmedBy}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedEntry(null);
                      handleEditEntry(selectedEntry);
                    }}
                    className="flex-1 px-4 py-2 bg-mainColor text-white rounded-xl hover:bg-primary transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                  >
                    <EditOutlined />
                    {t('form.edit') || 'Edit'}
                  </button>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                  >
                    {t('form.close') || 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortsDashboardPage;

