import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Input, Upload, message } from 'antd';
import { ScanOutlined, UploadOutlined, SearchOutlined, IdcardOutlined } from '@ant-design/icons';
import type { ScanResult } from '../../types/passport';

interface ScanPassportFormProps {
  onScanComplete?: (result: ScanResult) => void;
  onManualSearch?: (passportNumber: string, visaNumber: string) => void;
}

export const ScanPassportForm: React.FC<ScanPassportFormProps> = ({
  onScanComplete,
  onManualSearch
}) => {
  const { t } = useTranslation('common');
  const [passportNumber, setPassportNumber] = useState('');
  const [visaNumber, setVisaNumber] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      const result: ScanResult = {
        passportNumber: passportNumber || 'A12345678',
        visaNumber: visaNumber || 'V98765432',
        name: 'Sample Name',
        nationality: 'Pakistani',
        dateOfBirth: '1990-01-01',
        expiryDate: '2030-01-01'
      };
      setScanning(false);
      onScanComplete?.(result);
      message.success(t('passport.scan.success'));
    }, 1500);
  };

  const handleManualSearch = () => {
    if (!passportNumber && !visaNumber) {
      message.warning(t('passport.scan.enterPassportOrVisa'));
      return;
    }
    onManualSearch?.(passportNumber, visaNumber);
  };

  const handleFileUpload = (file: File) => {
    // Handle file upload for passport scanning
    message.info(t('passport.scan.uploading'));
    // Simulate processing
    setTimeout(() => {
      message.success(t('passport.scan.uploadSuccess'));
    }, 1000);
    return false; // Prevent default upload
  };

  return (
    <Card className="shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <ScanOutlined className="text-2xl text-primaryColor" />
          <h3 className="text-lg font-semibold">{t('passport.scan.title')}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('passport.passportNumber')}
            </label>
            <Input
              placeholder={t('passport.scan.enterPassportNumber')}
              value={passportNumber}
              onChange={(e) => setPassportNumber(e.target.value)}
              size="large"
              prefix={<IdcardOutlined />}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('passport.visaNumber')}
            </label>
            <Input
              placeholder={t('passport.scan.enterVisaNumber')}
              value={visaNumber}
              onChange={(e) => setVisaNumber(e.target.value)}
              size="large"
              prefix={<IdcardOutlined />}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="primary"
            icon={<ScanOutlined />}
            size="large"
            loading={scanning}
            onClick={handleScan}
          >
            {t('passport.scan.scan')}
          </Button>

          <Button
            icon={<SearchOutlined />}
            size="large"
            onClick={handleManualSearch}
          >
            {t('passport.scan.search')}
          </Button>

          <Upload
            accept="image/*,.pdf"
            beforeUpload={handleFileUpload}
            showUploadList={false}
          >
            <Button
              icon={<UploadOutlined />}
              size="large"
            >
              {t('passport.scan.upload')}
            </Button>
          </Upload>
        </div>
      </div>
    </Card>
  );
};

