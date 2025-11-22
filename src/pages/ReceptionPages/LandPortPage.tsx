import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraOutlined, PhoneOutlined, CheckCircleOutlined, CarOutlined } from '@ant-design/icons';
import { mockBuses } from '../../data/mockReception';

const LandPortPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [selectedBus, setSelectedBus] = useState<string>('');
  const [busPhoto, setBusPhoto] = useState<string | null>(null);
  const [guidePhone, setGuidePhone] = useState<string>('');

  const busesInTransit = mockBuses.filter(b => b.status === 'in-transit' || b.status === 'assigned');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In real app, this would upload and get URL
      setBusPhoto(URL.createObjectURL(file));
    }
  };

  const handleConfirm = () => {
    if (selectedBus && busPhoto && guidePhone) {
      console.log('Confirm bus passage:', { selectedBus, busPhoto, guidePhone });
      // In real app, this would call an API and notify teams
      alert('Bus passage confirmed! Notifications sent to Accommodation team, Reception team, and Card team.');
    }
  };

  const selectedBusData = busesInTransit.find(b => b.id === selectedBus);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('reception.ports.landPorts.title')}
          </h1>
          <p className="text-gray-600">{t('reception.ports.landPorts.confirmPassage')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CarOutlined className="text-mainColor" />
            {t('reception.ports.landPorts.confirmPassage')}
          </h2>

          <div className="space-y-6">
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
                {busesInTransit.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.number} - {bus.carrier} ({bus.passengers} passengers)
                  </option>
                ))}
              </select>
            </div>

            {/* Bus Details */}
            {selectedBusData && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Bus Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Carrier:</strong> {selectedBusData.carrier}
                  </div>
                  <div>
                    <strong>Driver:</strong> {selectedBusData.driverName}
                  </div>
                  <div>
                    <strong>Driver Phone:</strong> {selectedBusData.driverPhone}
                  </div>
                  <div>
                    <strong>Capacity:</strong> {selectedBusData.capacity}
                  </div>
                  <div>
                    <strong>Passengers:</strong> {selectedBusData.passengers}
                  </div>
                </div>
              </div>
            )}

            {/* Bus Photo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('reception.ports.landPorts.busPhoto')}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-mainColor transition-colors">
                {busPhoto ? (
                  <div className="space-y-3">
                    <img src={busPhoto} alt="Bus" className="w-full h-64 object-cover rounded-lg" />
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
                      <p className="text-xs text-gray-500">Required for confirmation</p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Guide Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <PhoneOutlined />
                {t('reception.ports.landPorts.guidePhone')}
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
              <h4 className="font-semibold text-blue-900 mb-2">Automatic Notifications</h4>
              <p className="text-sm text-blue-700">
                Upon confirmation, notifications will be sent to:
              </p>
              <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
                <li>Accommodation Team</li>
                <li>Reception Team</li>
                <li>Card Team</li>
              </ul>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleConfirm}
              disabled={!selectedBus || !busPhoto || !guidePhone}
              className="px-8 py-4 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircleOutlined />
              {t('reception.ports.landPorts.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandPortPage;

