import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined, EditOutlined, HomeOutlined, CloseOutlined } from '@ant-design/icons';
import type { ArrivalGroup } from '../../types/reception';
import { mockAccommodations } from '../../data/mockReception';
import { mockHotels, mockBuildings, mockMinaTents, mockArafatTents } from '../../data/mockHousing';

interface DataConfirmationScreenProps {
  groupData: Partial<ArrivalGroup>;
  onConfirm: () => void;
  onEdit: () => void;
  onClose: () => void;
}

export const DataConfirmationScreen: React.FC<DataConfirmationScreenProps> = ({
  groupData,
  onConfirm,
  onEdit,
  onClose
}) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';

  // Get linked accommodations (in real app, this would come from the data)
  const linkedAccommodations = groupData.accommodations || [];
  
  // Combine all available accommodations from different sources for lookup
  const allAccommodations = [
    ...mockAccommodations,
    ...mockHotels.map(h => ({ id: h.id, name: h.name, type: 'hotel', location: h.location, capacity: h.totalCapacity, occupied: h.occupiedCapacity, available: h.totalCapacity - h.occupiedCapacity })),
    ...mockBuildings.map(b => ({ id: b.id, name: b.name, type: 'building', location: b.location, capacity: b.totalCapacity, occupied: b.occupiedCapacity, available: b.totalCapacity - b.occupiedCapacity })),
    ...mockMinaTents.map(t => ({ id: t.id, name: `Mina Tent ${t.tentNumber}`, type: 'tent', location: 'Mina', capacity: t.totalBeds, occupied: t.beds.filter(b => b.occupied).length, available: t.beds.filter(b => !b.occupied).length })),
    ...mockArafatTents.map(t => ({ id: t.id, name: `Arafat Tent ${t.tentNumber}`, type: 'tent', location: 'Arafat', capacity: t.totalBeds, occupied: t.beds.filter(b => b.occupied).length, available: t.beds.filter(b => !b.occupied).length }))
  ];
  
  const accommodationsData = linkedAccommodations.map(acc => {
    // Try to find accommodation by ID first
    let fullAcc = allAccommodations.find(a => a.id === acc.accommodationId);
    
    // If not found by ID, try to find by name
    if (!fullAcc && acc.accommodationName) {
      fullAcc = allAccommodations.find(a => 
        a.name.toLowerCase().trim() === acc.accommodationName.toLowerCase().trim() ||
        acc.accommodationName.toLowerCase().includes(a.name.toLowerCase()) ||
        a.name.toLowerCase().includes(acc.accommodationName.toLowerCase())
      );
      
      // If found by name, update the accommodationId
      if (fullAcc) {
        acc.accommodationId = fullAcc.id;
      }
    }
    
    return {
      ...acc,
      fullAcc: fullAcc || null
    };
  }).filter(acc => acc); // Filter out invalid accommodations

  const totalPilgrims = groupData.pilgrimsCount || 0;
  const totalAccommodations = linkedAccommodations.length;

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
              <CheckCircleOutlined className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('reception.preArrival.confirmation.title')}</h2>
              <p className="text-sm text-gray-500">{t('reception.preArrival.confirmation.subtitle')}</p>
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
          {/* Group Data Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {t('reception.preArrival.confirmation.groupData')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('reception.preArrival.form.groupNumber')}</p>
                <p className="font-semibold text-gray-900">{groupData.groupNumber || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('reception.preArrival.form.groupName')}</p>
                <p className="font-semibold text-gray-900">{groupData.groupName || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('reception.preArrival.form.arrivalDate')}</p>
                <p className="font-semibold text-gray-900">
                  {groupData.arrivalDate ? new Date(groupData.arrivalDate).toLocaleDateString() : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('reception.preArrival.form.arrivalTime')}</p>
                <p className="font-semibold text-gray-900">{groupData.arrivalTime || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('reception.preArrival.form.flightNumber')}</p>
                <p className="font-semibold text-gray-900">{groupData.flightNumber || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('reception.preArrival.form.pilgrimsCount')}</p>
                <p className="font-semibold text-gray-900">{groupData.pilgrimsCount || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('reception.preArrival.form.destination')}</p>
                <p className="font-semibold text-gray-900">
                  {groupData.destination ? groupData.destination.charAt(0).toUpperCase() + groupData.destination.slice(1) : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Accommodations Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <HomeOutlined className="text-mainColor" />
                {t('reception.preArrival.confirmation.accommodations')}
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  {t('reception.preArrival.confirmation.totalPilgrims')}: <strong>{totalPilgrims}</strong>
                </span>
                <span className="text-gray-600">
                  {t('reception.preArrival.confirmation.totalAccommodations')}: <strong>{totalAccommodations}</strong>
                </span>
              </div>
            </div>

            {accommodationsData.length > 0 ? (
              <div className="space-y-3">
                {accommodationsData.map((acc, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{acc.accommodationName}</p>
                      {acc.fullAcc && (
                        <p className="text-sm text-gray-500">
                          {acc.fullAcc.location} • {acc.fullAcc.capacity} {t('form.capacity')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-mainColor text-lg">{acc.pilgrimsAssigned}</p>
                      <p className="text-xs text-gray-500">{t('reception.preArrival.form.pilgrimsCount')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <HomeOutlined className="text-4xl text-gray-300 mb-2" />
                <p>{t('reception.preArrival.confirmation.noAccommodations')}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircleOutlined />
              {t('reception.preArrival.confirmation.confirmButton')}
            </button>
            <button
              onClick={onEdit}
              className="flex-1 px-6 py-3 border-2 border-mainColor text-mainColor rounded-xl hover:bg-mainColor/10 transition-all font-semibold flex items-center justify-center gap-2"
            >
              <EditOutlined />
              {t('reception.preArrival.confirmation.editButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

