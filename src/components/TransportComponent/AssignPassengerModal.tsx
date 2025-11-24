import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Input, Button, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../HousingComponent/GlassCard';
import { SearchOutlined, UserOutlined, CloseOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import type { Passenger } from '../../types/transport';
import { mockTransportData } from '../../data/mockTransport';

interface AssignPassengerModalProps {
  open: boolean;
  onClose: () => void;
  seatNumber: number;
  busNumber: string;
  onAssign: (passenger: Passenger) => void;
}

export const AssignPassengerModal: React.FC<AssignPassengerModalProps> = ({
  open,
  onClose,
  seatNumber,
  busNumber,
  onAssign
}) => {
  const { t } = useTranslation('Transport');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPassengerId, setSelectedPassengerId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('select');

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSearchTerm('');
      setSelectedPassengerId('');
      setActiveTab('select');
    }
  }, [open]);

  // Get all passengers from all buses (for now, we'll use mock data)
  // TODO: Replace with backend API call to get unassigned passengers
  const allPassengers = useMemo(() => {
    const passengers: Passenger[] = [];
    mockTransportData.forEach(bus => {
      bus.passengers.forEach(passenger => {
        // Check if passenger is already assigned to a seat
        // For now, we'll show all passengers (in real app, filter unassigned)
        passengers.push(passenger);
      });
    });
    return passengers;
  }, []);

  // Filter passengers based on search term
  const filteredPassengers = useMemo(() => {
    if (!searchTerm) return allPassengers.slice(0, 20); // Limit to 20 for performance
    
    return allPassengers.filter(p => 
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.idNumber.includes(searchTerm) ||
      p.passportNumber.includes(searchTerm) ||
      p.phoneNumber.includes(searchTerm)
    ).slice(0, 20);
  }, [searchTerm, allPassengers]);

  const handleAssignPassenger = () => {
    if (selectedPassengerId) {
      const passenger = allPassengers.find(p => p.id === selectedPassengerId);
      if (passenger) {
        onAssign(passenger);
        setSelectedPassengerId('');
        setSearchTerm('');
        onClose();
      }
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      className="assign-passenger-modal"
      closeIcon={<CloseOutlined className="text-gray-500 hover:text-gray-700" />}
    >
      <GlassCard className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Seat Info */}
          <div className="lg:w-1/3 bg-gradient-to-br from-primaryColor/10 to-secondaryColor/10 p-6 lg:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-bordergray">
            <div className="w-24 h-24 rounded-full bg-white border-2 border-bordergray flex items-center justify-center shadow-xl mb-4">
              <UserOutlined className="text-primaryColor text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {t('assignPassenger') || 'Assign Passenger'}
            </h3>
            <p className="text-sm text-customgray mb-4 text-center">
              {t('assignPassengerToSeat') || `Assign passenger to seat ${seatNumber}`}
            </p>
            
            {/* Seat Information */}
            <div className="w-full mt-4 p-3 bg-white/80 rounded-lg border border-bordergray">
              <div className="text-xs font-semibold text-customgray uppercase mb-2">
                {t('seatInformation') || 'Seat Information'}
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {t('busNumber')}: {busNumber}
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {t('seatNumber')}: {seatNumber}
              </p>
            </div>
          </div>

          {/* Right Side - Assignment Options */}
          <div className="lg:w-2/3 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-primaryColor to-secondaryColor rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900">{t('assignPassenger') || 'Assign Passenger'}</h3>
            </div>

            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab} 
              className="assignment-tabs"
              items={[
                {
                  key: 'select',
                  label: t('selectExistingPassenger') || 'Select Existing Passenger',
                  children: (
                    <div className="space-y-4 mt-4">
                      <Input
                        placeholder={t('searchPassengers') || 'Search passengers...'}
                        prefix={<SearchOutlined className="text-customgray" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="large"
                        className="border-2 border-bordergray hover:border-primaryColor focus:border-primaryColor"
                      />
                      
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {filteredPassengers.length > 0 ? (
                          filteredPassengers.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => setSelectedPassengerId(p.id)}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedPassengerId === p.id
                                  ? 'border-primaryColor bg-primaryColor/5'
                                  : 'border-bordergray hover:border-primaryColor/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white border-2 border-bordergray flex items-center justify-center overflow-hidden">
                                  {p.gender === 'female' ? (
                                    <img 
                                      src="/images/female.png" 
                                      alt={p.fullName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : p.gender === 'male' ? (
                                    <img 
                                      src="/images/male.png" 
                                      alt={p.fullName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <UserOutlined className="text-primaryColor" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800">{p.fullName}</p>
                                  <p className="text-xs text-customgray">
                                    {p.gender === 'female' ? t('female') : p.gender === 'male' ? t('male') : ''} • {t('seatNumber')}: {p.seatNumber || 'N/A'}
                                  </p>
                                  {p.phoneNumber && (
                                    <p className="text-xs text-customgray">{p.phoneNumber}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-customgray">
                            {searchTerm ? (t('noPassengersFound') || 'No passengers found') : (t('noPassengers') || 'No passengers')}
                          </div>
                        )}
                      </div>

                      {selectedPassengerId && (
                        <Button
                          type="primary"
                          size="large"
                          onClick={handleAssignPassenger}
                          className="w-full bg-gradient-to-r from-primaryColor to-secondaryColor border-0 hover:from-primaryColor/90 hover:to-secondaryColor/90"
                          icon={<UserOutlined />}
                        >
                          {t('assignSelectedPassenger') || 'Assign Selected Passenger'}
                        </Button>
                      )}
                    </div>
                  )
                },
                {
                  key: 'add',
                  label: t('addNewPassenger') || 'Add New Passenger',
                  children: (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-bordergray">
                      <p className="text-sm text-customgray text-center">
                        {t('newPassengerFormComingSoon') || 'New passenger form coming soon'}
                      </p>
                      <p className="text-xs text-customgray text-center mt-2">
                        {t('useSelectExistingForNow') || 'Please use "Select Existing Passenger" for now'}
                      </p>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>
      </GlassCard>
    </Modal>
  );
};

