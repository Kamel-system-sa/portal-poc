import React from 'react';
import { useTranslation } from 'react-i18next';
import { CloseOutlined, UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined, TeamOutlined, HomeOutlined, FileOutlined } from '@ant-design/icons';
import type { DepartureGroup } from '../../types/reception';

interface DepartureDetailsModalProps {
  group: DepartureGroup;
  onClose: () => void;
}

export const DepartureDetailsModal: React.FC<DepartureDetailsModalProps> = ({ group, onClose }) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mainColor to-primary flex items-center justify-center">
              <FileOutlined className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">تفاصيل المغادرة</h2>
              <p className="text-sm text-gray-500">{group.organizerNumber} - {group.campaignNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <CloseOutlined className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Organizer Information */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <UserOutlined className="text-mainColor text-lg" />
              <h3 className="text-lg font-bold text-gray-900">معلومات المنظم</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">رقم المنظم</p>
                <p className="font-semibold text-gray-900">{group.organizerNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">اسم المنظم</p>
                <p className="font-semibold text-gray-900">{group.organizerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">اسم الشركة</p>
                <p className="font-semibold text-gray-900">{group.organizerCompany}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">الجنسية</p>
                <p className="font-semibold text-gray-900">{t(`nationalities.${group.organizerNationality}`) || group.organizerNationality}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <PhoneOutlined />
                  رقم الجوال
                </p>
                <p className="font-semibold text-gray-900">{group.organizerPhone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <MailOutlined />
                  الإيميل
                </p>
                <p className="font-semibold text-gray-900">{group.organizerEmail}</p>
              </div>
            </div>
          </div>

          {/* Campaign Information */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <FileOutlined className="text-mainColor text-lg" />
              <h3 className="text-lg font-bold text-gray-900">معلومات الحملة</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">رقم الحملة</p>
                <p className="font-semibold text-gray-900">{group.campaignNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <PhoneOutlined />
                  رقم الجوال مسؤول الحملة
                </p>
                <p className="font-semibold text-gray-900">{group.campaignManagerPhone}</p>
              </div>
            </div>
          </div>

          {/* Departure Information */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CalendarOutlined className="text-mainColor text-lg" />
              <h3 className="text-lg font-bold text-gray-900">معلومات المغادرة</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">مسار الرحلة</p>
                <p className="font-semibold text-gray-900">
                  {getDeparturePointLabel(group.departurePoint)} → {getArrivalDestinationLabel(group.arrivalDestination)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">تاريخ ووقت المغادرة</p>
                <p className="font-semibold text-gray-900">
                  {new Date(group.departureDate).toLocaleDateString('ar-SA', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} {group.departureTime}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">نقطة الانطلاق</p>
                <p className="font-semibold text-gray-900">{getDeparturePointLabel(group.departurePoint)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">جهة الوصول</p>
                <p className="font-semibold text-gray-900">{getArrivalDestinationLabel(group.arrivalDestination)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <TeamOutlined />
                  عدد الحجاج
                </p>
                <p className="font-semibold text-gray-900">{group.pilgrimsCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">الحالة</p>
                {getStatusBadge(group.status)}
              </div>
            </div>
          </div>

          {/* Departure Accommodations */}
          {group.accommodations.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <HomeOutlined className="text-mainColor text-lg" />
                <h3 className="text-lg font-bold text-gray-900">بيانات السكن - نقطة الانطلاق</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">اسم السكن</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">رقم عقد السكن</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">عدد الحجاج المغادرين</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {group.accommodations.map((acc, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{acc.accommodationName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{acc.contractNumber}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{acc.pilgrimsDeparting}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Arrival Accommodations */}
          {group.arrivalAccommodations.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <HomeOutlined className="text-mainColor text-lg" />
                <h3 className="text-lg font-bold text-gray-900">بيانات السكن - جهة الوصول</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">اسم السكن</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">رقم عقد السكن</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">تاريخ بداية العقد</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">عدد الواصلين</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {group.arrivalAccommodations.map((acc, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{acc.accommodationName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{acc.contractNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(acc.contractStartDate).toLocaleDateString('ar-SA', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{acc.pilgrimsArriving}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all font-semibold text-gray-700"
          >
            {t('form.close') || 'إغلاق'}
          </button>
        </div>
      </div>
    </div>
  );
};

