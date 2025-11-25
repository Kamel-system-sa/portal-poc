import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  InboxOutlined
} from '@ant-design/icons';
import type { DepartureGroup } from '../../types/reception';

interface DepartureGroupsListProps {
  groups: DepartureGroup[];
  onViewGroup: (group: DepartureGroup) => void;
  onEditGroup: (group: DepartureGroup) => void;
  onDeleteGroup: (groupId: string) => void;
}

export const DepartureGroupsList: React.FC<DepartureGroupsListProps> = ({
  groups,
  onViewGroup,
  onEditGroup,
  onDeleteGroup
}) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter groups
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.organizerNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      group.organizerName.toLowerCase().includes(searchValue.toLowerCase()) ||
      group.campaignNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
      group.organizerCompany.toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(group.status);

    return matchesSearch && matchesStatus;
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
        label: 'مجدولة',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      departed: {
        label: 'مغادرة',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      },
      arrived: {
        label: 'وصلت',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      completed: {
        label: 'مكتملة',
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

  const getDeparturePointLabel = (point: string) => {
    const pointMap: Record<string, string> = {
      makkah: 'مكة',
      madinah: 'المدينة'
    };
    return pointMap[point] || point;
  };

  const getArrivalDestinationLabel = (destination: string) => {
    const destMap: Record<string, string> = {
      makkah: 'مكة',
      madinah: 'المدينة',
      jeddah: 'جدة',
      'madinah-airport': 'مطار المدينة'
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
              placeholder="البحث برقم المنظم، اسم المنظم، رقم الحملة..."
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
            {t('filters.apply') || 'تطبيق الفلاتر'}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الحالة
              </label>
              <div className="flex flex-wrap gap-2">
                {['scheduled', 'departed', 'arrived', 'completed'].map((status) => {
                  const statusLabels: Record<string, string> = {
                    scheduled: 'مجدولة',
                    departed: 'مغادرة',
                    arrived: 'وصلت',
                    completed: 'مكتملة'
                  };
                  return (
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
                      {statusLabels[status] || status}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setStatusFilter([]);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              {t('filters.reset') || 'إعادة الضبط'}
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
                    رقم المنظم
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    اسم المنظم
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    اسم الشركة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    رقم الحملة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    نقطة الانطلاق
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    جهة الوصول
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    تاريخ ووقت المغادرة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    عدد الحجاج
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{group.organizerNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{group.organizerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{group.organizerCompany}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{group.campaignNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{getDeparturePointLabel(group.departurePoint)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{getArrivalDestinationLabel(group.arrivalDestination)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(group.departureDate).toLocaleDateString('ar-SA')} {group.departureTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{group.pilgrimsCount}</td>
                    <td className="px-6 py-4">{getStatusBadge(group.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewGroup(group)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <EyeOutlined />
                        </button>
                        <button
                          onClick={() => onEditGroup(group)}
                          className="p-2 text-mainColor hover:bg-mainColor/10 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <EditOutlined />
                        </button>
                        <button
                          onClick={() => onDeleteGroup(group.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
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
                عرض {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, filteredGroups.length)} من{' '}
                {filteredGroups.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  السابق
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  التالي
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
              لا توجد بيانات مغادرة
            </h3>
            <p className="text-sm text-gray-500 max-w-md text-center">
              ابدأ بإضافة تسجيل مغادرة جديد أو رفع تقرير من الجوازات
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

