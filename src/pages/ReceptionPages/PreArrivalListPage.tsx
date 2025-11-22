import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseOutlined } from '@ant-design/icons';
import { ArrivalGroupsList } from '../../components/Reception/ArrivalGroupsList';
import { mockArrivalGroups } from '../../data/mockReception';
import type { ArrivalGroup } from '../../types/reception';

const PreArrivalListPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [groups] = useState<ArrivalGroup[]>(mockArrivalGroups);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ArrivalGroup | null>(null);
  const [editGroup, setEditGroup] = useState<ArrivalGroup | null>(null);

  const handleAddGroup = () => {
    setEditGroup(null);
    setIsFormOpen(true);
  };

  const handleEditGroup = (group: ArrivalGroup) => {
    setEditGroup(group);
    setIsFormOpen(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    const confirmMessage = t('form.confirmDeleteMessage') || 'Are you sure you want to delete this group?';
    
    if (window.confirm(confirmMessage)) {
      console.log('Delete group', groupId);
      // In real app, this would call an API
    }
  };

  const handleViewGroup = (group: ArrivalGroup) => {
    setSelectedGroup(group);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditGroup(null);
  };

  const handleSaveGroup = (group: ArrivalGroup) => {
    console.log('Save group', group);
    handleCloseForm();
    // In real app, this would call an API
  };

  return (
    <>
      <section className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('reception.preArrival.list.title') || t('reception.preArrival.list') || 'Arrival Groups List'}
            </h1>
            <p className="text-gray-600">{t('reception.preArrival.title')}</p>
          </div>

          <ArrivalGroupsList
            groups={groups}
            onAddGroup={handleAddGroup}
            onEditGroup={handleEditGroup}
            onDeleteGroup={handleDeleteGroup}
            onViewGroup={handleViewGroup}
          />
        </div>
      </section>

      {/* Form Modal - Placeholder for now (would show actual form component) */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseForm();
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                {editGroup ? t('reception.preArrival.editGroup') : t('reception.preArrival.addGroup')}
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
                aria-label="Close modal"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Form component would go here</p>
                <p className="text-sm text-gray-500">
                  This is a UI mockup. The actual form would include Excel upload, manual entry, column mapping, and accommodation assignment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Group Details Modal */}
      {selectedGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedGroup(null);
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-5xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">{t('reception.preArrival.groupDetails')}</h2>
              <button
                onClick={() => setSelectedGroup(null)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
                aria-label="Close modal"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t('reception.preArrival.form.groupInfo')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {t('reception.preArrival.table.groupNumber')}
                      </label>
                      <p className="text-gray-900">{selectedGroup.groupNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {t('reception.preArrival.table.groupName')}
                      </label>
                      <p className="text-gray-900">{selectedGroup.groupName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {t('reception.preArrival.table.arrivalDate')}
                      </label>
                      <p className="text-gray-900">
                        {new Date(selectedGroup.arrivalDate).toLocaleDateString()} {selectedGroup.arrivalTime}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {t('reception.preArrival.table.pilgrimsCount')}
                      </label>
                      <p className="text-gray-900">
                        {selectedGroup.arrivedCount}/{selectedGroup.pilgrimsCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t('reception.preArrival.form.organizerInfo')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {t('reception.preArrival.form.organizerName')}
                      </label>
                      <p className="text-gray-900">{selectedGroup.organizer.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {t('reception.preArrival.form.organizerCompany')}
                      </label>
                      <p className="text-gray-900">{selectedGroup.organizer.company}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {t('reception.preArrival.form.organizerPhone')}
                      </label>
                      <p className="text-gray-900">{selectedGroup.organizer.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {t('reception.preArrival.form.organizerEmail')}
                      </label>
                      <p className="text-gray-900">{selectedGroup.organizer.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t('reception.preArrival.table.accommodations')}</h3>
                  <div className="space-y-2">
                    {selectedGroup.accommodations.map((acc, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{acc.accommodationName}</span>
                          <span className="text-sm text-gray-600">{acc.pilgrimsAssigned} pilgrims</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreArrivalListPage;
