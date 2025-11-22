import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraOutlined, PhoneOutlined, UserOutlined, CheckCircleOutlined, CarOutlined } from '@ant-design/icons';
import { mockArrivalGroups, mockBuses } from '../../data/mockReception';

const AirportPortPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [selectedFlight, setSelectedFlight] = useState<string>('');
  const [groupCount, setGroupCount] = useState<number>(0);
  const [selectedBus, setSelectedBus] = useState<string>('');
  const [busPhoto, setBusPhoto] = useState<string | null>(null);

  // Get groups with flights
  const groupsWithFlights = mockArrivalGroups.filter(g => g.flightNumber && g.status === 'scheduled');
  const availableBuses = mockBuses.filter(b => b.status === 'available' || b.status === 'assigned');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In real app, this would upload and get URL
      setBusPhoto(URL.createObjectURL(file));
    }
  };

  const handleConfirm = () => {
    if (selectedFlight && groupCount && selectedBus) {
      console.log('Confirm arrival:', { selectedFlight, groupCount, selectedBus, busPhoto });
      // In real app, this would call an API and notify teams
      alert('Flight arrival confirmed! Notifications sent to Accommodation team, Reception team, and Card team.');
    }
  };

  const selectedGroup = groupsWithFlights.find(g => g.flightNumber === selectedFlight);
  const selectedBusData = availableBuses.find(b => b.id === selectedBus);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('reception.ports.airports.title')}
          </h1>
          <p className="text-gray-600">{t('reception.ports.airports.confirmArrival')}</p>
        </div>

        {/* Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Flight Arrival Confirmation */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CheckCircleOutlined className="text-mainColor" />
              {t('reception.ports.airports.confirmArrival')}
            </h2>

            <div className="space-y-6">
              {/* Flight Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.ports.airports.flightNumber')}
                </label>
                <select
                  value={selectedFlight}
                  onChange={(e) => {
                    setSelectedFlight(e.target.value);
                    const group = groupsWithFlights.find(g => g.flightNumber === e.target.value);
                    if (group) {
                      setGroupCount(group.pilgrimsCount);
                    }
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <option value="">{t('reception.ports.airports.flightNumber')}...</option>
                  {groupsWithFlights.map((group) => (
                    <option key={group.id} value={group.flightNumber}>
                      {group.flightNumber} - {group.groupName} ({group.pilgrimsCount} pilgrims)
                    </option>
                  ))}
                </select>
              </div>

              {/* Group Count */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.ports.airports.groupCount')}
                </label>
                <input
                  type="number"
                  value={groupCount}
                  onChange={(e) => setGroupCount(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
                {selectedGroup && (
                  <p className="text-sm text-gray-500 mt-2">
                    Expected: {selectedGroup.pilgrimsCount} pilgrims
                  </p>
                )}
              </div>

              {/* Group Info Display */}
              {selectedGroup && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">{selectedGroup.groupName}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Group:</strong> {selectedGroup.groupNumber}</p>
                    <p><strong>Destination:</strong> {selectedGroup.destination}</p>
                    <p><strong>Organizer:</strong> {selectedGroup.organizer.name}</p>
                    <p><strong>Arrival Date:</strong> {new Date(selectedGroup.arrivalDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Bus Information */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CarOutlined className="text-mainColor" />
              {t('reception.ports.airports.busInfo')}
            </h2>

            <div className="space-y-6">
              {/* Bus Photo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.ports.airports.busPhoto')}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-mainColor transition-colors">
                  {busPhoto ? (
                    <div className="space-y-3">
                      <img src={busPhoto} alt="Bus" className="w-full h-48 object-cover rounded-lg" />
                      <button
                        onClick={() => setBusPhoto(null)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="space-y-3">
                        <CameraOutlined className="text-4xl text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600">Click to upload bus photo</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Bus Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.ports.airports.busNumber')}
                </label>
                <select
                  value={selectedBus}
                  onChange={(e) => setSelectedBus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <option value="">Select Bus...</option>
                  {availableBuses.map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.number} - {bus.carrier} ({bus.capacity} capacity)
                    </option>
                  ))}
                </select>
              </div>

              {/* Bus Details */}
              {selectedBusData && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('reception.ports.airports.carrier')}
                    </label>
                    <p className="text-gray-900">{selectedBusData.carrier}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <UserOutlined />
                      {t('reception.ports.airports.driverName')}
                    </label>
                    <p className="text-gray-900">{selectedBusData.driverName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <PhoneOutlined />
                      {t('reception.ports.airports.driverPhone')}
                    </label>
                    <p className="text-gray-900">{selectedBusData.driverPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('reception.ports.airports.passengersPerBus')}
                    </label>
                    <input
                      type="number"
                      max={selectedBusData.capacity}
                      placeholder={`Max: ${selectedBusData.capacity}`}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleConfirm}
            disabled={!selectedFlight || !groupCount || !selectedBus}
            className="px-8 py-4 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircleOutlined />
            {t('reception.ports.airports.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AirportPortPage;

