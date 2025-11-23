import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IdcardOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { usePassportScanner } from '../../components/Passport/usePassportScanner';
import { ScannerPanel } from '../../components/Passport/ScannerPanel';
import { PassportViewer } from '../../components/Passport/PassportViewer';
import { PilgrimInfoCard } from '../../components/Passport/PilgrimInfoCard';
import { OrganizerInfoCard } from '../../components/Passport/OrganizerInfoCard';
import { ServiceProofActions } from '../../components/Passport/ServiceProofActions';
import Breadcrumb from '../../components/common/Breadcrumb';
import type { MockPassportScanResult } from '../../data/mockPassports';

const currentCenterId = 'center-001';

const NewServiceProofPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [scannedPassport, setScannedPassport] = useState<MockPassportScanResult | null>(null);
  
  const { scan, search, isScanning, error, clearError } = usePassportScanner();

  const handleScan = async () => {
    clearError();
    const result = await scan();
    if (result) {
      setScannedPassport(result);
    }
  };

  const handleSearch = async (passportNumber: string, visaNumber: string) => {
    clearError();
    const result = await search(passportNumber, visaNumber);
    if (result) {
      setScannedPassport(result);
    }
  };

  const handleServiceProvided = (passport: MockPassportScanResult) => {
    // Mark service as provided
    console.log('Service provided for:', passport.passportNumber);
    // In real implementation, this would call an API
    // For now, just show success and clear
    setScannedPassport(null);
  };

  const handleTransferRequest = (passport: MockPassportScanResult) => {
    // Create transfer request
    console.log('Transfer request for:', passport.passportNumber);
    // In real implementation, this would call an API
  };

  const handleNext = () => {
    setScannedPassport(null);
    clearError();
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 ${isRtl ? 'rtl' : 'ltr'}`}>
      <Breadcrumb />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/passport/dashboard')}
            >
              {t('passport.back')}
            </Button>
            <IdcardOutlined className="text-3xl text-primaryColor" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {t('passport.new')}
            </h1>
          </div>
        </div>

        {/* A) SCAN AREA */}
        <ScannerPanel
          onScan={handleScan}
          onSearch={handleSearch}
          isScanning={isScanning}
          error={error}
        />

        {/* B) PASSPORT VIEWER + C) SERVICE PROOF ACTIONS */}
        {scannedPassport && (
          <div className="space-y-6">
            {/* Realistic Passport Card */}
            <PassportViewer
              passport={scannedPassport}
              currentCenterId={currentCenterId}
            />

            {/* Detailed Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PilgrimInfoCard passport={scannedPassport} />
              <OrganizerInfoCard passport={scannedPassport} />
            </div>

            {/* Service Proof Actions */}
            <ServiceProofActions
              passport={scannedPassport}
              currentCenterId={currentCenterId}
              onServiceProvided={handleServiceProvided}
              onTransferRequest={handleTransferRequest}
              onNext={handleNext}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NewServiceProofPage;

