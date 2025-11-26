import React, { useState } from 'react';
import { Button, Spin, Input } from 'antd';
import { ScanOutlined, SearchOutlined, IdcardOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface ScannerPanelProps {
  onScan: () => void;
  onSearchByPassportId: (passportId: string) => void;
  isScanning: boolean;
  isSearching?: boolean;
}

export const ScannerPanel: React.FC<ScannerPanelProps> = ({
  onScan,
  onSearchByPassportId,
  isScanning,
  isSearching = false
}) => {
  const { t } = useTranslation('common');
  const [passportId, setPassportId] = useState('');

  const handleSearch = () => {
    if (passportId.trim()) {
      onSearchByPassportId(passportId.trim());
      setPassportId('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && passportId.trim()) {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-mainColor/5 via-white to-primaryColor/5 rounded-3xl shadow-2xl shadow-gray-200/50 border-2 border-gray-100 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-mainColor/10 to-transparent rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primaryColor/10 to-transparent rounded-full -ml-32 -mb-32 blur-3xl"></div>
      
      <div className="relative z-10 p-8 sm:p-10 md:p-12 lg:p-16">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-mainColor to-primaryColor flex items-center justify-center shadow-2xl shadow-mainColor/30">
              <IdcardOutlined className="text-white text-3xl md:text-4xl" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('passport.passportScanning')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('passport.scanningInstructions')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center justify-center mb-8 md:mb-12">
          <Button
            type="primary"
            size="large"
            icon={<ScanOutlined className="text-xl" />}
            onClick={onScan}
            disabled={isScanning || isSearching}
            className="w-full sm:w-auto min-w-[280px] md:min-w-[320px] h-16 md:h-20 text-lg md:text-xl font-bold bg-gradient-to-r from-mainColor to-primaryColor hover:from-mainColor/90 hover:to-primaryColor/90 border-0 shadow-2xl shadow-mainColor/40 hover:shadow-3xl hover:shadow-mainColor/50 hover:-translate-y-1 transition-all duration-300 rounded-xl"
          >
            {isScanning ? (
              <span className="flex items-center gap-3">
                <Spin size="large" />
                <span>{t('passport.scanning')}</span>
              </span>
            ) : (
              t('passport.scanPassport')
            )}
          </Button>
          
          <Input
            size="large"
            placeholder={t('passport.searchByPassportId')}
            prefix={<SearchOutlined className="text-gray-400 text-xl" />}
            value={passportId}
            onChange={(e) => setPassportId(e.target.value)}
            onPressEnter={handleKeyPress}
            disabled={isScanning || isSearching}
            className="passport-search-input w-full sm:w-auto min-w-[280px] md:min-w-[320px] font-semibold"
            suffix={
              isSearching ? (
                <Spin size="small" />
              ) : (
                <Button
                  type="text"
                  icon={<SearchOutlined className="text-xl" />}
                  onClick={handleSearch}
                  disabled={!passportId.trim() || isScanning || isSearching}
                  className="text-mainColor hover:text-primaryColor hover:bg-mainColor/10"
                />
              )
            }
          />
        </div>

        {/* Instructions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border-2 border-gray-200/50 shadow-lg max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mainColor to-primaryColor flex items-center justify-center shadow-md">
                <InfoCircleOutlined className="text-white text-xl" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{t('passport.howToScan')}</h3>
              <ul className="space-y-2 text-sm md:text-base text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-mainColor font-bold mt-1">1.</span>
                  <span>{t('passport.instruction1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mainColor font-bold mt-1">2.</span>
                  <span>{t('passport.instruction2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mainColor font-bold mt-1">3.</span>
                  <span>{t('passport.instruction3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

