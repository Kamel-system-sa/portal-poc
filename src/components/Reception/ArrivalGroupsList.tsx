import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  InboxOutlined
} from '@ant-design/icons';
import type { ArrivalGroup } from '../../types/reception';

interface ArrivalGroupsListProps {
  groups: ArrivalGroup[];
  onAddGroup: () => void;
  onEditGroup: (group: ArrivalGroup) => void;
  onDeleteGroup: (groupId: string) => void;
  onViewGroup: (group: ArrivalGroup) => void;
}

export const ArrivalGroupsList: React.FC<ArrivalGroupsListProps> = ({
  groups,
  onAddGroup,
  onEditGroup,
  onDeleteGroup,
  onViewGroup
}) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [destinationFilter, setDestinationFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter groups
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.groupNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      group.groupName.toLowerCase().includes(searchValue.toLowerCase()) ||
      (group.flightNumber?.toLowerCase().includes(searchValue.toLowerCase()) ?? false) ||
      (group.tripNumber?.toLowerCase().includes(searchValue.toLowerCase()) ?? false);

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(group.status);
    const matchesDestination = destinationFilter.length === 0 || destinationFilter.includes(group.destination);

    return matchesSearch && matchesStatus && matchesDestination;
  });

  // Pagination
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
      scheduled: {
        label: t('reception.preArrival.status.scheduled'),
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      arrived: {
        label: t('reception.preArrival.status.arrived'),
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      completed: {
        label: t('reception.preArrival.status.completed'),
        color: 'text-gray-600',
        bgColor: 'bg-gray-50'
      }
    };
    const statusInfo = statusMap[status] || statusMap.scheduled;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getDestinationLabel = (destination: string) => {
    const destMap: Record<string, string> = {
      makkah: 'Makkah',
      madinah: 'Madinah',
      mina: 'Mina',
      arafat: 'Arafat'
    };
    return destMap[destination] || destination;
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:w-auto flex gap-3">
          <div className="relative flex-1 max-w-md">
            <SearchOutlined className={`absolute top-1/2 transform -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} text-gray-400`} />
            <input
              type="text"
              placeholder={t('reception.preArrival.searchPlaceholder')}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700`}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-mainColor hover:text-mainColor transition-all duration-200 font-semibold flex items-center gap-2 ${
              showFilters ? 'bg-mainColor/10 border-mainColor text-mainColor' : 'bg-white text-gray-700'
            }`}
          >
            <FilterOutlined />
            {t('filters.apply')}
          </button>
        </div>
        <button
          onClick={onAddGroup}
          className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-md shadow-mainColor/20 hover:shadow-lg font-semibold flex items-center gap-2"
        >
          <PlusOutlined />
          {t('reception.preArrival.addGroup')}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('reception.preArrival.filters.status')}
              </label>
              <div className="flex flex-wrap gap-2">
                {['scheduled', 'arrived', 'completed'].map((status) => (
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
                    {t(`reception.preArrival.status.${status}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('reception.preArrival.filters.destination')}
              </label>
              <div className="flex flex-wrap gap-2">
                {['makkah', 'madinah', 'mina', 'arafat'].map((dest) => (
                  <button
                    key={dest}
                    onClick={() => {
                      setDestinationFilter(
                        destinationFilter.includes(dest)
                          ? destinationFilter.filter((d) => d !== dest)
                          : [...destinationFilter, dest]
                      );
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      destinationFilter.includes(dest)
                        ? 'bg-mainColor text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getDestinationLabel(dest)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setStatusFilter([]);
                setDestinationFilter([]);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('filters.reset')}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {paginatedGroups.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    {t('reception.preArrival.table.groupNumber')}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    {t('reception.preArrival.table.groupName')}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    {t('reception.preArrival.table.arrivalDate')}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    {t('reception.preArrival.table.flightNumber')}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    {t('reception.preArrival.table.pilgrimsCount')}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    {t('reception.preArrival.table.destination')}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    {t('reception.preArrival.table.status')}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    {t('reception.preArrival.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{group.groupNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{group.groupName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(group.arrivalDate).toLocaleDateString()} {group.arrivalTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {group.flightNumber || group.tripNumber || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {group.arrivedCount}/{group.pilgrimsCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{getDestinationLabel(group.destination)}</td>
                    <td className="px-6 py-4">{getStatusBadge(group.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewGroup(group)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={t('reception.preArrival.groupDetails')}
                        >
                          <EyeOutlined />
                        </button>
                        <button
                          onClick={() => onEditGroup(group)}
                          className="p-2 text-mainColor hover:bg-mainColor/10 rounded-lg transition-colors"
                          title={t('reception.preArrival.editGroup')}
                        >
                          <EditOutlined />
                        </button>
                        <button
                          onClick={() => onDeleteGroup(group.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={t('form.delete')}
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {t('pagination.showing')} {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, filteredGroups.length)} {t('pagination.of')}{' '}
                {filteredGroups.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('pagination.previous') || 'Previous'}
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('pagination.next') || 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-12 border border-gray-100">
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 shadow-inner">
              <InboxOutlined className="text-5xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {t('reception.preArrival.list.empty') || 'No groups found'}
            </h3>
            <p className="text-sm text-gray-500 max-w-md text-center mb-6">
              {t('reception.preArrival.list.emptyMessage') || 'Start by adding a new arrival group'}
            </p>
            <button
              onClick={onAddGroup}
              className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-md shadow-mainColor/20 hover:shadow-lg font-semibold flex items-center gap-2"
            >
              <PlusOutlined />
              {t('reception.preArrival.addGroup')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

