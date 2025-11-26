import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CameraOutlined,
  PhoneOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CarOutlined,
  GlobalOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { mockArrivalGroups } from '../../data/mockReception';
import type { PortEntry, AirportEntryFormData, LandPortEntryFormData, ArrivalGroup } from '../../types/reception';

interface PortEntryFormProps {
  portType: 'airport' | 'land';
  initialData?: PortEntry;
  onCancel: () => void;
  onSubmit: (data: PortEntry) => void;
}

export const PortEntryForm: React.FC<PortEntryFormProps> = ({
  portType,
  initialData,
  onCancel,
  onSubmit
}) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  
  // Airport form state
  const [flightNumber, setFlightNumber] = useState<string>(initialData?.flightNumber || '');
  const [groupCount, setGroupCount] = useState<number>(initialData?.groupCount || 0);
  
  // Land port form state
  const [guidePhone, setGuidePhone] = useState<string>(initialData?.guidePhone || '');
  
  // Common form state
  const [busPhoto, setBusPhoto] = useState<string | null>(initialData?.busPhoto || null);
  const [busCarrier, setBusCarrier] = useState<string>(initialData?.carrierName || '');
  const [busNumber, setBusNumber] = useState<string>(initialData?.busNumber || '');
  const [driverPhone, setDriverPhone] = useState<string>(initialData?.driverPhone || '');
  const [passengersPerBus, setPassengersPerBus] = useState<number>(initialData?.passengersPerBus || 0);
  const [showAlerts, setShowAlerts] = useState<{ type: 'overcapacity' | 'mismatch'; message: string } | null>(null);

  // Get groups with flights (for airports)
  // Include scheduled flights + the flight from initialData (if editing)
  const scheduledGroups = mockArrivalGroups.filter(g => g.flightNumber && g.status === 'scheduled');
  let groupsWithFlights = [...scheduledGroups];
  
  // If editing and initialData has a flightNumber, ensure it's in the list
  if (portType === 'airport' && initialData?.flightNumber) {
    const initialFlightExists = groupsWithFlights.find(g => g.flightNumber === initialData.flightNumber);
    
    // If the flight from initialData is not in scheduled groups, try to find it in all groups
    if (!initialFlightExists) {
      const initialFlightGroup = mockArrivalGroups.find(g => g.flightNumber === initialData.flightNumber);
      if (initialFlightGroup) {
        // Add the group even if it's not scheduled (it might be confirmed/arrived already)
        groupsWithFlights.push(initialFlightGroup);
      } else {
        // If not found in mock data, create a placeholder entry so the dropdown shows it
        // This happens when flightNumber in PortEntry doesn't match any ArrivalGroup
        const placeholderGroup = {
          id: initialData.groupId || 'temp-group',
          groupNumber: initialData.groupId || '',
          groupName: initialData.groupName || 'Selected Flight',
          flightNumber: initialData.flightNumber,
          pilgrimsCount: initialData.groupCount || initialData.passengersPerBus || 0,
          status: 'confirmed' as const,
          arrivalDate: new Date().toISOString().split('T')[0],
          arrivalTime: '00:00',
          destination: 'Makkah' as const,
          organizer: {
            id: '',
            number: '',
            name: initialData.groupName || 'N/A',
            company: '',
            phone: '',
            email: ''
          },
          accommodations: []
        };
        groupsWithFlights.push(placeholderGroup as any);
      }
    }
  }
  
  // Also check if current flightNumber (from state) is in the list
  if (portType === 'airport' && flightNumber && !groupsWithFlights.find(g => g.flightNumber === flightNumber)) {
    const currentFlightGroup = mockArrivalGroups.find(g => g.flightNumber === flightNumber);
    if (currentFlightGroup) {
      groupsWithFlights.push(currentFlightGroup);
    } else if (initialData?.flightNumber === flightNumber) {
      // Use initialData to create placeholder
      const placeholderGroup = {
        id: initialData.groupId || 'temp-group',
        groupNumber: initialData.groupId || '',
        groupName: initialData.groupName || 'Selected Flight',
        flightNumber: flightNumber,
        pilgrimsCount: initialData.groupCount || initialData.passengersPerBus || 0,
        status: 'confirmed' as const,
        arrivalDate: new Date().toISOString().split('T')[0],
        arrivalTime: '00:00',
        destination: 'Makkah' as const,
        organizer: {
          id: '',
          number: '',
          name: initialData.groupName || 'N/A',
          company: '',
          phone: '',
          email: ''
        },
        accommodations: []
      };
      groupsWithFlights.push(placeholderGroup as any);
    }
  }
  
  const selectedGroup = groupsWithFlights.find(g => g.flightNumber === flightNumber);

  // Update form state when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      // Only update if portType matches
      if (initialData.portType === portType) {
        if (portType === 'airport' && initialData.portType === 'airport') {
          setFlightNumber(initialData.flightNumber || '');
          setGroupCount(initialData.groupCount || initialData.passengersPerBus || 0);
        } else if (portType === 'land' && initialData.portType === 'land') {
          setGuidePhone(initialData.guidePhone || '');
        }
        setBusPhoto(initialData.busPhoto || null);
        setBusCarrier(initialData.carrierName || '');
        setBusNumber(initialData.busNumber || '');
        setDriverPhone(initialData.driverPhone || '');
        setPassengersPerBus(initialData.passengersPerBus || 0);
      }
    } else {
      // Clear form when no initialData (add mode)
      if (portType === 'airport') {
        setFlightNumber('');
        setGroupCount(0);
      } else {
        setGuidePhone('');
      }
      setBusPhoto(null);
      setBusCarrier('');
      setBusNumber('');
      setDriverPhone('');
      setPassengersPerBus(0);
    }
  }, [initialData, portType]);

  // Auto-fill groupCount from selected flight only if not already set (and not in edit mode)
  useEffect(() => {
    if (selectedGroup && !initialData && !groupCount) {
      setGroupCount(selectedGroup.pilgrimsCount);
    }
  }, [flightNumber, selectedGroup, groupCount, initialData]);

  useEffect(() => {
    // Validate and show alerts
    if (portType === 'airport' && selectedGroup && passengersPerBus > 0) {
      const expectedCount = selectedGroup.pilgrimsCount;
      if (passengersPerBus > 50) { // Assuming 50 is standard bus capacity
        setShowAlerts({
          type: 'overcapacity',
          message: t('reception.ports.alerts.overcapacity') || `Warning: ${passengersPerBus} passengers exceeds bus capacity of 50`
        });
      } else if (groupCount !== expectedCount) {
        setShowAlerts({
          type: 'mismatch',
          message: t('reception.ports.alerts.mismatch') || `Mismatch: Expected ${expectedCount} passengers, but entered ${groupCount}`
        });
      } else {
        setShowAlerts(null);
      }
    }
  }, [portType, selectedGroup, groupCount, passengersPerBus, t]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBusPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const portEntry: PortEntry = {
      id: initialData?.id || `port-${Date.now()}`,
      portType,
      carrierName: busCarrier,
      busNumber,
      driverPhone,
      passengersPerBus,
      busPhoto: busPhoto || undefined,
      status: 'confirmed',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      confirmedBy: 'Current User', // In real app, get from auth
      ...(portType === 'airport' ? {
        flightNumber,
        groupId: selectedGroup?.id,
        groupName: selectedGroup?.groupName,
        groupCount,
        expectedCount: selectedGroup?.pilgrimsCount
      } : {
        guidePhone
      })
    };

    onSubmit(portEntry);
  };

  const isFormValid = portType === 'airport'
    ? flightNumber && groupCount && busPhoto && busCarrier && busNumber && driverPhone && passengersPerBus
    : busPhoto && guidePhone && busCarrier && busNumber && driverPhone && passengersPerBus;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Alerts */}
      {showAlerts && (
        <div className={`p-4 rounded-xl border-2 ${
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
                  ? t('reception.ports.alerts.overcapacityTitle')
                  : t('reception.ports.alerts.mismatchTitle')}
              </h4>
              <p className={`text-sm ${
                showAlerts.type === 'overcapacity' ? 'text-red-700' : 'text-orange-700'
              }`}>
                {showAlerts.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAlerts(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Airport Specific Fields */}
      {portType === 'airport' && (
        <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">
              {t('reception.ports.airports.confirmArrival') || 'Confirm Flight Arrival'}
            </h3>
          </div>

          <div className="space-y-6">
            {/* Flight Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('reception.ports.airports.flightNumber') || 'Flight Number'} *
              </label>
              <select
                value={flightNumber}
                onChange={(e) => {
                  setFlightNumber(e.target.value);
                  const group = groupsWithFlights.find(g => g.flightNumber === e.target.value);
                  if (group) {
                    setGroupCount(group.pilgrimsCount);
                  }
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
                dir={isRtl ? 'rtl' : 'ltr'}
                required
              >
                <option value="">{t('reception.ports.airports.selectFlight') || 'Select Flight...'}</option>
                {groupsWithFlights.map((group) => (
                  <option key={group.id} value={group.flightNumber || ''}>
                    {group.flightNumber} - {group.groupName} ({group.pilgrimsCount} pilgrims)
                  </option>
                ))}
              </select>
              {/* Display current flight number if it's not in the list */}
              {flightNumber && !groupsWithFlights.find(g => g.flightNumber === flightNumber) && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                  <strong>{flightNumber}</strong> - {initialData?.groupName || 'Current Flight'} ({initialData?.groupCount || initialData?.passengersPerBus || 0} pilgrims)
                  <p className="text-xs text-blue-600 mt-1">
                    {t('reception.ports.airports.flightSelected') || 'Flight number is selected and will be saved'}
                  </p>
                </div>
              )}
            </div>

            {/* Group Count */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {initialData ? 'عدد الحجاج في الرحلة' : (t('reception.ports.airports.groupCount') || 'عدد الحجاج في المجموعة')} *
              </label>
              <input
                type="number"
                value={groupCount}
                onChange={(e) => setGroupCount(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                dir={isRtl ? 'rtl' : 'ltr'}
                required
                min={1}
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
                  {selectedGroup.destination && (
                    <p><strong>{t('reception.preArrival.table.destination')}:</strong> {selectedGroup.destination}</p>
                  )}
                  {selectedGroup.organizer && selectedGroup.organizer.name && (
                    <p><strong>{t('reception.preArrival.form.organizerName')}:</strong> {selectedGroup.organizer.name}</p>
                  )}
                  {selectedGroup.arrivalDate && (
                    <p><strong>{t('reception.preArrival.table.arrivalDate')}:</strong> {new Date(selectedGroup.arrivalDate).toLocaleDateString()} {selectedGroup.arrivalTime || ''}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Bus Entry Form (Common for both) */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">
            {t('reception.ports.busEntryForm') || 'Bus Entry Form'}
          </h3>
        </div>

        <div className="space-y-6">
          {/* Bus Photo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('reception.ports.airports.busPhoto') || 'Bus Photo'} *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-mainColor transition-colors">
              {busPhoto ? (
                <div className="space-y-3">
                  <img src={busPhoto} alt="Bus" className="w-full h-48 object-cover rounded-lg max-w-md mx-auto" />
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
                    required
                  />
                  <div className="space-y-3">
                    <CameraOutlined className="text-4xl text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">{t('reception.ports.clickToUpload') || 'Click to upload bus photo'}</p>
                    {portType === 'land' && (
                      <p className="text-xs text-gray-500">{t('reception.ports.photoRequired') || 'Required for confirmation'}</p>
                    )}
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
              required
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
              placeholder={t('reception.ports.busNumberPlaceholder')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              dir={isRtl ? 'rtl' : 'ltr'}
              required
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
              placeholder={t('reception.ports.phonePlaceholder')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              dir={isRtl ? 'rtl' : 'ltr'}
              required
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
              required
              min={1}
            />
          </div>
        </div>
      </section>

      {/* Land Port Specific: Guide Phone */}
      {portType === 'land' && (
        <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">
              {t('reception.ports.landPorts.confirmPassage') || 'Confirm Bus Passage'}
            </h3>
          </div>

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
                placeholder={t('reception.ports.phonePlaceholder')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                dir={isRtl ? 'rtl' : 'ltr'}
                required
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
        </section>
      )}

      {/* Form Actions */}
      <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
        >
          {t('form.cancel')}
        </button>
        <button
          type="submit"
          disabled={!isFormValid}
          className="px-6 py-3.5 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircleOutlined />
          {portType === 'airport'
            ? t('reception.ports.airports.confirm') || 'Confirm Arrival'
            : t('reception.ports.landPorts.confirm') || 'Confirm Passage'}
        </button>
      </div>
    </form>
  );
};

