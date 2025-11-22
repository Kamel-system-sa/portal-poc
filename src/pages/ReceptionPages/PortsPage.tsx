import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CameraOutlined,
  PhoneOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CarOutlined,
  GlobalOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { mockArrivalGroups, mockBuses } from '../../data/mockReception';
import type { ArrivalGroup, Bus } from '../../types/reception';

const PortsPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [portType, setPortType] = useState<'airport' | 'land'>('airport');
  const [selectedFlight, setSelectedFlight] = useState<string>('');
  const [groupCount, setGroupCount] = useState<number>(0);
  const [selectedBus, setSelectedBus] = useState<string>('');
  const [busPhoto, setBusPhoto] = useState<string | null>(null);
  const [guidePhone, setGuidePhone] = useState<string>('');
  const [busCarrier, setBusCarrier] = useState<string>('');
  const [busNumber, setBusNumber] = useState<string>('');
  const [driverPhone, setDriverPhone] = useState<string>('');
  const [passengersPerBus, setPassengersPerBus] = useState<number>(0);
  const [showAlerts, setShowAlerts] = useState<{ type: 'overcapacity' | 'mismatch'; message: string } | null>(null);

  // Get groups with flights (for airports)
  const groupsWithFlights = mockArrivalGroups.filter(g => g.flightNumber && g.status === 'scheduled');
  // Get buses
  const availableBuses = mockBuses.filter(b => b.status === 'available' || b.status === 'assigned' || b.status === 'in-transit');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBusPhoto(URL.createObjectURL(file));
    }
  };

  const selectedGroup = groupsWithFlights.find(g => g.flightNumber === selectedFlight);
  const selectedBusData = availableBuses.find(b => b.id === selectedBus);

  // Validate and show alerts
  const validateAndShowAlerts = () => {
    if (!selectedGroup || !selectedBus) return;

    const expectedCount = selectedGroup.pilgrimsCount;
    const busCapacity = selectedBusData?.capacity || 0;
    const enteredCount = groupCount || passengersPerBus;

    // Overcapacity check
    if (enteredCount > busCapacity) {
      setShowAlerts({
        type: 'overcapacity',
        message: t('reception.ports.alerts.overcapacity') || `Warning: ${enteredCount} passengers exceeds bus capacity of ${busCapacity}`
      });
    } else if (enteredCount !== expectedCount) {
      setShowAlerts({
        type: 'mismatch',
        message: t('reception.ports.alerts.mismatch') || `Mismatch: Expected ${expectedCount} passengers, but entered ${enteredCount}`
      });
    } else {
      setShowAlerts(null);
    }
  };

  // Update alerts when relevant fields change
  React.useEffect(() => {
    validateAndShowAlerts();
  }, [selectedFlight, selectedBus, groupCount, passengersPerBus, selectedGroup, selectedBusData]);

  const handleConfirmArrival = () => {
    if (portType === 'airport') {
      if (selectedFlight && groupCount && selectedBus && busPhoto) {
        console.log('Confirm flight arrival:', { selectedFlight, groupCount, selectedBus, busPhoto });
        // In real app, this would call an API and notify teams
        alert(t('reception.ports.notifications.confirmed') || 'Flight arrival confirmed! Notifications sent to Accommodation team, Reception team, and Card team.');
      }
    } else {
      if (selectedBus && busPhoto && guidePhone) {
        console.log('Confirm bus passage:', { selectedBus, busPhoto, guidePhone });
        // In real app, this would call an API and notify teams
        alert(t('reception.ports.notifications.confirmed') || 'Bus passage confirmed! Notifications sent to Accommodation team, Reception team, and Card team.');
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('reception.ports.title') || 'Air & Land Ports'}
          </h1>
          <p className="text-gray-600">{t('reception.ports.subtitle') || 'Confirm arrivals and bus passages'}</p>
        </div>

        {/* Port Type Selector */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => {
              setPortType('airport');
              setSelectedFlight('');
              setGroupCount(0);
              setSelectedBus('');
              setBusPhoto(null);
              setShowAlerts(null);
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              portType === 'airport'
                ? 'bg-gradient-to-r from-mainColor to-primary text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-mainColor'
            }`}
          >
            <GlobalOutlined />
            {t('reception.ports.airports.title') || 'Airports'}
          </button>
          <button
            onClick={() => {
              setPortType('land');
              setSelectedBus('');
              setBusPhoto(null);
              setGuidePhone('');
              setShowAlerts(null);
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              portType === 'land'
                ? 'bg-gradient-to-r from-mainColor to-primary text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-mainColor'
            }`}
          >
            <CarOutlined />
            {t('reception.ports.landPorts.title') || 'Land Ports'}
          </button>
        </div>

        {/* Alerts */}
        {showAlerts && (
          <div className={`mb-6 p-4 rounded-xl border-2 ${
            showAlerts.type === 'overcapacity' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-start gap-3">
              <ExclamationCircleOutlined className={`text-xl mt-0.5 ${
                showAlerts.type === 'overcapacity' ? 'text-red-600' : 'text-orange-600'
              }`} />
              <div className="flex-1">
                <h4 className={`font-semibold mb-1 ${
                  showAlerts.type === 'overcapacity' ? 'text-red-900' : 'text-orange-900'
                }`}>
                  {showAlerts.type === 'overcapacity' 
                    ? t('reception.ports.alerts.overcapacityTitle') || 'Overcapacity Warning'
                    : t('reception.ports.alerts.mismatchTitle') || 'Count Mismatch Warning'}
                </h4>
                <p className={`text-sm ${
                  showAlerts.type === 'overcapacity' ? 'text-red-700' : 'text-orange-700'
                }`}>
                  {showAlerts.message}
                </p>
              </div>
              <button
                onClick={() => setShowAlerts(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseOutlined />
              </button>
            </div>
          </div>
        )}

        {/* Airport: Flight Arrival Confirmation */}
        {portType === 'airport' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left: Flight Arrival Confirmation */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <CheckCircleOutlined className="text-mainColor" />
                {t('reception.ports.airports.confirmArrival') || 'Confirm Flight Arrival'}
              </h2>

              <div className="space-y-6">
                {/* Flight Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('reception.ports.airports.flightNumber') || 'Flight Number'}
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
                    <option value="">{t('reception.ports.airports.flightNumber') || 'Select Flight...'}</option>
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
                    {t('reception.ports.airports.groupCount') || 'Number of Pilgrims in Group'}
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
                      {t('reception.ports.airports.expected') || 'Expected'}: {selectedGroup.pilgrimsCount} {t('reception.ports.airports.pilgrims') || 'pilgrims'}
                    </p>
                  )}
                </div>

                {/* Group Info Display */}
                {selectedGroup && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{selectedGroup.groupName}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>{t('reception.preArrival.table.groupNumber')}:</strong> {selectedGroup.groupNumber}</p>
                      <p><strong>{t('reception.preArrival.table.destination')}:</strong> {selectedGroup.destination}</p>
                      <p><strong>{t('reception.preArrival.form.organizerName')}:</strong> {selectedGroup.organizer.name}</p>
                      <p><strong>{t('reception.preArrival.table.arrivalDate')}:</strong> {new Date(selectedGroup.arrivalDate).toLocaleDateString()} {selectedGroup.arrivalTime}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Bus Entry Form */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <CarOutlined className="text-mainColor" />
                {t('reception.ports.busEntryForm') || 'Bus Entry Form'}
              </h2>

              <div className="space-y-6">
                {/* Bus Photo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('reception.ports.airports.busPhoto') || 'Bus Photo'} *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-mainColor transition-colors">
                    {busPhoto ? (
                      <div className="space-y-3">
                        <img src={busPhoto} alt="Bus" className="w-full h-48 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setBusPhoto(null)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          {t('reception.ports.removePhoto') || 'Remove Photo'}
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
                          <p className="text-sm text-gray-600">{t('reception.ports.clickToUpload') || 'Click to upload bus photo'}</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Carrier Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('reception.ports.airports.carrier') || 'Carrier Name'} *
                  </label>
                  <input
                    type="text"
                    value={busCarrier}
                    onChange={(e) => setBusCarrier(e.target.value)}
                    placeholder={t('reception.ports.carrierPlaceholder') || 'Enter carrier name'}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                    dir={isRtl ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Bus Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('reception.ports.airports.busNumber') || 'Bus Number'} *
                  </label>
                  <input
                    type="text"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    placeholder="BUS-001"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                    dir={isRtl ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Driver Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <PhoneOutlined className="text-mainColor" />
                    {t('reception.ports.airports.driverPhone') || 'Driver Phone'} *
                  </label>
                  <input
                    type="tel"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="+9665XXXXXXXX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                    dir={isRtl ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Passengers per Bus */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <TeamOutlined className="text-mainColor" />
                    {t('reception.ports.airports.passengersPerBus') || 'Passengers per Bus'} *
                  </label>
                  <input
                    type="number"
                    value={passengersPerBus}
                    onChange={(e) => setPassengersPerBus(Number(e.target.value))}
                    placeholder={t('reception.ports.passengersPlaceholder') || 'Enter number of passengers'}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                    dir={isRtl ? 'rtl' : 'ltr'}
                    min={1}
                  />
                  {selectedBusData && (
                    <p className="text-sm text-gray-500 mt-2">
                      {t('reception.ports.busCapacity') || 'Bus capacity'}: {selectedBusData.capacity} {t('reception.ports.passengers') || 'passengers'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Land Port: Bus Passage Confirmation */}
        {portType === 'land' && (
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CarOutlined className="text-mainColor" />
              {t('reception.ports.landPorts.confirmPassage') || 'Confirm Bus Passage'}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Bus Entry Form */}
              <div className="space-y-6">
                {/* Bus Photo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('reception.ports.landPorts.busPhoto') || 'Bus Photo'} *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-mainColor transition-colors">
                    {busPhoto ? (
                      <div className="space-y-3">
                        <img src={busPhoto} alt="Bus" className="w-full h-64 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setBusPhoto(null)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          {t('reception.ports.removePhoto') || 'Remove Photo'}
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
                          <p className="text-sm text-gray-600">{t('reception.ports.clickToUpload') || 'Click to upload bus photo'}</p>
                          <p className="text-xs text-gray-500">{t('reception.ports.photoRequired') || 'Required for confirmation'}</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Carrier Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('reception.ports.airports.carrier') || 'Carrier Name'} *
                  </label>
                  <input
                    type="text"
                    value={busCarrier}
                    onChange={(e) => setBusCarrier(e.target.value)}
                    placeholder={t('reception.ports.carrierPlaceholder') || 'Enter carrier name'}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                    dir={isRtl ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Bus Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('reception.ports.airports.busNumber') || 'Bus Number'} *
                  </label>
                  <input
                    type="text"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    placeholder="BUS-001"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                    dir={isRtl ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Driver Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <PhoneOutlined className="text-mainColor" />
                    {t('reception.ports.airports.driverPhone') || 'Driver Phone'} *
                  </label>
                  <input
                    type="tel"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="+9665XXXXXXXX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                    dir={isRtl ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Passengers per Bus */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <TeamOutlined className="text-mainColor" />
                    {t('reception.ports.airports.passengersPerBus') || 'Passengers per Bus'} *
                  </label>
                  <input
                    type="number"
                    value={passengersPerBus}
                    onChange={(e) => setPassengersPerBus(Number(e.target.value))}
                    placeholder={t('reception.ports.passengersPlaceholder') || 'Enter number of passengers'}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                    dir={isRtl ? 'rtl' : 'ltr'}
                    min={1}
                  />
                </div>
              </div>

              {/* Right: Guide Phone and Info */}
              <div className="space-y-6">
                {/* Guide Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <PhoneOutlined className="text-mainColor" />
                    {t('reception.ports.landPorts.guidePhone') || 'Guide Phone'} *
                  </label>
                  <input
                    type="tel"
                    value={guidePhone}
                    onChange={(e) => setGuidePhone(e.target.value)}
                    placeholder="+9665XXXXXXXX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                    dir={isRtl ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Notifications Info */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <InfoCircleOutlined className="text-blue-600 text-xl mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">{t('reception.ports.notifications.title') || 'Automatic Notifications'}</h4>
                      <p className="text-sm text-blue-700 mb-2">
                        {t('reception.ports.notifications.description') || 'Upon confirmation, notifications will be sent to:'}
                      </p>
                      <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                        <li>{t('reception.ports.notifications.accommodationTeam') || 'Accommodation Team'}</li>
                        <li>{t('reception.ports.notifications.receptionTeam') || 'Reception Team'}</li>
                        <li>{t('reception.ports.notifications.cardTeam') || 'Card Team'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleConfirmArrival}
            disabled={
              portType === 'airport'
                ? !selectedFlight || !groupCount || !busPhoto || !busCarrier || !busNumber || !driverPhone || !passengersPerBus
                : !busPhoto || !guidePhone || !busCarrier || !busNumber || !driverPhone || !passengersPerBus
            }
            className="px-8 py-4 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircleOutlined />
            {portType === 'airport'
              ? t('reception.ports.airports.confirm') || 'Confirm Arrival'
              : t('reception.ports.landPorts.confirm') || 'Confirm Passage'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortsPage;

