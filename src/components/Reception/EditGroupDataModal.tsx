import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SaveOutlined, CloseOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ArrivalGroup } from '../../types/reception';
import { mockHotels, mockBuildings, mockMinaTents, mockArafatTents } from '../../data/mockHousing';
import { mockAccommodations, mockOrganizers } from '../../data/mockReception';
import { mockCampaigns } from '../../data/mockCampaigns';

interface EditGroupDataModalProps {
  groupData: Partial<ArrivalGroup>;
  onSave: (data: Partial<ArrivalGroup>) => void;
  onClose: () => void;
}

export const EditGroupDataModal: React.FC<EditGroupDataModalProps> = ({
  groupData,
  onSave,
  onClose
}) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';

  // Form state
  const [formData, setFormData] = useState<Partial<ArrivalGroup>>(groupData);
  const [organizerNumber, setOrganizerNumber] = useState<string>(
    groupData.organizer?.number || ''
  );
  const [accommodations, setAccommodations] = useState<Array<{
    accommodationId: string;
    accommodationName: string;
    pilgrimsAssigned: number;
    contractNumber?: string;
    campaignNumber?: string;
  }>>(groupData.accommodations || []);

  // Combine all available accommodations
  const allAccommodations = [
    ...mockAccommodations,
    ...mockHotels.map(h => ({ id: h.id, name: h.name, type: 'hotel' })),
    ...mockBuildings.map(b => ({ id: b.id, name: b.name, type: 'building' })),
    ...mockMinaTents.map(t => ({ id: t.id, name: `Mina Tent ${t.tentNumber}`, type: 'tent' })),
    ...mockArafatTents.map(t => ({ id: t.id, name: `Arafat Tent ${t.tentNumber}`, type: 'tent' }))
  ];

  useEffect(() => {
    setFormData(groupData);
    setOrganizerNumber(groupData.organizer?.number || '');
    setAccommodations(groupData.accommodations || []);
  }, [groupData]);

  const handleInputChange = (field: keyof ArrivalGroup, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAccommodation = () => {
    setAccommodations(prev => [
      ...prev,
      {
        accommodationId: '',
        accommodationName: '',
        pilgrimsAssigned: 0
      }
    ]);
  };

  const handleRemoveAccommodation = (index: number) => {
    setAccommodations(prev => prev.filter((_, i) => i !== index));
  };

  const handleOrganizerChange = (value: string) => {
    setOrganizerNumber(value);
    // Find organizer and update formData
    const selectedOrganizer = mockOrganizers.find(org => org.number === value);
    if (selectedOrganizer) {
      setFormData(prev => ({
        ...prev,
        organizer: selectedOrganizer
      }));
    }
  };

  const handleAccommodationChange = (index: number, field: string, value: any) => {
    setAccommodations(prev => {
      const updated = [...prev];
      if (field === 'accommodationId') {
        const selectedAcc = allAccommodations.find(a => a.id === value);
        updated[index] = {
          ...updated[index],
          accommodationId: value,
          accommodationName: selectedAcc?.name || ''
        };
      } else {
        updated[index] = {
          ...updated[index],
          [field]: value
        };
      }
      return updated;
    });
  };

  const handleSave = () => {
    // Validate organizer is selected
    if (!organizerNumber) {
      alert(t('reception.preArrival.form.organizerRequired') || 'Please select an organizer');
      return;
    }

    // Find organizer
    const selectedOrganizer = mockOrganizers.find(org => org.number === organizerNumber);
    if (!selectedOrganizer) {
      alert(t('reception.preArrival.form.organizerNotFound') || 'Organizer not found');
      return;
    }

    // Validate accommodations
    const validAccommodations = accommodations.filter(
      acc => acc.accommodationId && acc.pilgrimsAssigned > 0
    );

    const updatedData: Partial<ArrivalGroup> = {
      ...formData,
      organizer: selectedOrganizer,
      accommodations: validAccommodations,
      // Update total pilgrims count if accommodations changed
      pilgrimsCount: validAccommodations.reduce((sum, acc) => sum + acc.pilgrimsAssigned, 0) || formData.pilgrimsCount
    };

    onSave(updatedData);
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
          <h2 className="text-xl font-bold text-gray-900">{t('reception.preArrival.editModal.title') || 'Edit Group Data'}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <CloseOutlined className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Group Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {t('reception.preArrival.form.groupInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Group Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.groupNumber')} *
                </label>
                <input
                  type="text"
                  value={formData.groupNumber || ''}
                  onChange={(e) => handleInputChange('groupNumber', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Group Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.groupName')} *
                </label>
                <input
                  type="text"
                  value={formData.groupName || ''}
                  onChange={(e) => handleInputChange('groupName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Arrival Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.arrivalDate')} *
                </label>
                <input
                  type="date"
                  value={formData.arrivalDate || ''}
                  onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
                />
              </div>

              {/* Arrival Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.arrivalTime')} *
                </label>
                <input
                  type="time"
                  value={formData.arrivalTime || ''}
                  onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
                />
              </div>

              {/* Flight Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.flightNumber')}
                </label>
                <input
                  type="text"
                  value={formData.flightNumber || ''}
                  onChange={(e) => handleInputChange('flightNumber', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Trip Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.tripNumber')}
                </label>
                <input
                  type="text"
                  value={formData.tripNumber || ''}
                  onChange={(e) => handleInputChange('tripNumber', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Pilgrims Count */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.pilgrimsCount')} *
                </label>
                <input
                  type="number"
                  value={formData.pilgrimsCount || 0}
                  onChange={(e) => handleInputChange('pilgrimsCount', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.destination')} *
                </label>
                <select
                  value={formData.destination || 'makkah'}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <option value="makkah">Makkah</option>
                  <option value="madinah">Madinah</option>
                  <option value="mina">Mina</option>
                  <option value="arafat">Arafat</option>
                </select>
              </div>

              {/* Organizer Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.organizerNumber')} *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={organizerNumber}
                    onChange={(e) => handleOrganizerChange(e.target.value)}
                    placeholder={t('reception.preArrival.form.organizerNumberPlaceholder') || 'Enter or select organizer number'}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
                    dir={isRtl ? 'rtl' : 'ltr'}
                    list="organizer-numbers"
                  />
                  <datalist id="organizer-numbers">
                    {mockOrganizers.map(org => (
                      <option key={org.id} value={org.number}>
                        {org.name} - {org.company}
                      </option>
                    ))}
                  </datalist>
                  <select
                    value={organizerNumber}
                    onChange={(e) => handleOrganizerChange(e.target.value)}
                    className="w-48 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
                    dir={isRtl ? 'rtl' : 'ltr'}
                  >
                    <option value="">{t('reception.preArrival.form.selectOrganizer') || 'Select Organizer...'}</option>
                    {mockOrganizers.map(org => (
                      <option key={org.id} value={org.number}>
                        {org.number} - {org.name}
                      </option>
                    ))}
                  </select>
                </div>
                {organizerNumber && (
                  <p className="text-xs text-gray-500 mt-1">
                    {mockOrganizers.find(org => org.number === organizerNumber)?.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Accommodations */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {t('reception.preArrival.form.accommodations')}
              </h3>
              <button
                onClick={handleAddAccommodation}
                className="px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-all font-semibold flex items-center gap-2"
              >
                <PlusOutlined />
                {t('reception.preArrival.form.addAccommodation')}
              </button>
            </div>

            <div className="space-y-4">
              {accommodations.length > 0 ? (
                accommodations.map((acc, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">
                        {t('reception.preArrival.form.accommodations')} #{index + 1}
                      </h4>
                      <button
                        onClick={() => handleRemoveAccommodation(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Accommodation Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('reception.preArrival.editModal.accommodationName')} *
                        </label>
                        <select
                          value={acc.accommodationId}
                          onChange={(e) => handleAccommodationChange(index, 'accommodationId', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
                          dir={isRtl ? 'rtl' : 'ltr'}
                        >
                          <option value="">{t('reception.preArrival.editModal.selectAccommodation')}</option>
                          {allAccommodations.map(accommodation => (
                            <option key={accommodation.id} value={accommodation.id}>
                              {accommodation.name} ({accommodation.type})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Campaign Number */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('reception.preArrival.form.assignAccommodationToCampaign')}
                        </label>
                        <select
                          value={acc.campaignNumber || ''}
                          onChange={(e) => handleAccommodationChange(index, 'campaignNumber', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
                          dir={isRtl ? 'rtl' : 'ltr'}
                        >
                          <option value="">{t('reception.preArrival.form.selectCampaign') || 'Select Campaign...'}</option>
                          {mockCampaigns.map(campaign => (
                            <option key={campaign.id} value={campaign.campaignNumber}>
                              {campaign.campaignNumber} - {campaign.campaignName}
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
                          value={acc.contractNumber || ''}
                          onChange={(e) => handleAccommodationChange(index, 'contractNumber', e.target.value)}
                          placeholder={t('reception.preArrival.editModal.contractPlaceholder')}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
                          dir={isRtl ? 'rtl' : 'ltr'}
                        />
                      </div>

                      {/* Pilgrims Assigned */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('reception.preArrival.editModal.pilgrimsCount')} *
                        </label>
                        <input
                          type="number"
                          value={acc.pilgrimsAssigned || 0}
                          onChange={(e) => handleAccommodationChange(index, 'pilgrimsAssigned', parseInt(e.target.value) || 0)}
                          min="0"
                          placeholder={t('reception.preArrival.editModal.pilgrimsPlaceholder')}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white text-gray-700"
                          dir={isRtl ? 'rtl' : 'ltr'}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>{t('reception.preArrival.confirmation.noAccommodations')}</p>
                  <button
                    onClick={handleAddAccommodation}
                    className="mt-4 px-4 py-2 text-mainColor hover:bg-mainColor/10 rounded-lg transition-all font-semibold"
                  >
                    {t('reception.preArrival.form.addAccommodation')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all font-semibold flex items-center justify-center gap-2"
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
    </div>
  );
};

