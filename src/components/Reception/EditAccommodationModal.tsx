import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { mockAccommodations } from '../../data/mockReception';
import { mockHotels, mockBuildings, mockMinaTents, mockArafatTents } from '../../data/mockHousing';
import type { Accommodation } from '../../types/reception';

interface EditAccommodationModalProps {
  accommodation?: {
    accommodationId: string;
    accommodationName: string;
    pilgrimsAssigned: number;
    contractNumber?: string;
  };
  onSave: (data: { accommodationId: string; accommodationName: string; pilgrimsAssigned: number; contractNumber: string }) => void;
  onClose: () => void;
}

export const EditAccommodationModal: React.FC<EditAccommodationModalProps> = ({
  accommodation,
  onSave,
  onClose
}) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';

  // Combine all accommodations from Housing section
  const allAccommodations: Array<{ id: string; name: string; type: string }> = [
    ...mockHotels.map(h => ({ id: h.id, name: h.name, type: 'hotel' })),
    ...mockBuildings.map(b => ({ id: b.id, name: b.name, type: 'building' })),
    ...mockMinaTents.map(t => ({ id: t.id, name: `Mina Tent ${t.tentNumber}`, type: 'tent' })),
    ...mockArafatTents.map(t => ({ id: t.id, name: `Arafat Tent ${t.tentNumber}`, type: 'tent' }))
  ];

  const [selectedAccommodationId, setSelectedAccommodationId] = useState<string>(
    accommodation?.accommodationId || ''
  );
  const [contractNumber, setContractNumber] = useState<string>(
    accommodation?.contractNumber || ''
  );
  const [pilgrimsCount, setPilgrimsCount] = useState<number>(
    accommodation?.pilgrimsAssigned || 0
  );

  useEffect(() => {
    if (accommodation) {
      setSelectedAccommodationId(accommodation.accommodationId);
      setContractNumber(accommodation.contractNumber || '');
      setPilgrimsCount(accommodation.pilgrimsAssigned);
    }
  }, [accommodation]);

  const selectedAccommodation = allAccommodations.find(acc => acc.id === selectedAccommodationId);

  const handleSave = () => {
    if (!selectedAccommodationId || !selectedAccommodation) return;

    onSave({
      accommodationId: selectedAccommodationId,
      accommodationName: selectedAccommodation.name,
      pilgrimsAssigned: pilgrimsCount,
      contractNumber: contractNumber
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">{t('reception.preArrival.editModal.title')}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <CloseOutlined className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Accommodation Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('reception.preArrival.editModal.accommodationName')} *
            </label>
            <select
              value={selectedAccommodationId}
              onChange={(e) => setSelectedAccommodationId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              <option value="">{t('reception.preArrival.editModal.selectAccommodation')}</option>
              {allAccommodations.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.type})
                </option>
              ))}
            </select>
          </div>

          {/* Contract Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('reception.preArrival.editModal.contractNumber')}
            </label>
            <input
              type="text"
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
              placeholder={t('reception.preArrival.editModal.contractPlaceholder')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Number of Pilgrims */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('reception.preArrival.editModal.pilgrimsCount')} *
            </label>
            <input
              type="number"
              value={pilgrimsCount}
              onChange={(e) => setPilgrimsCount(parseInt(e.target.value) || 0)}
              placeholder={t('reception.preArrival.editModal.pilgrimsPlaceholder')}
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handleSave}
            disabled={!selectedAccommodationId || pilgrimsCount <= 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SaveOutlined />
            {t('reception.preArrival.editModal.saveButton')}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all font-semibold text-gray-700"
          >
            {t('reception.preArrival.editModal.cancelButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

