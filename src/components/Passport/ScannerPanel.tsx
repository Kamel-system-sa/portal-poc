import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Modal, message, Radio, Card } from 'antd';
import { ScanOutlined, SearchOutlined, IdcardOutlined } from '@ant-design/icons';

interface ScannerPanelProps {
  onScan: () => Promise<void>;
  onSearch: (passportNumber: string, visaNumber: string) => Promise<void>;
  isScanning: boolean;
  error: string | null;
}

type ScanMode = 'scan' | 'search';

export const ScannerPanel: React.FC<ScannerPanelProps> = ({
  onScan,
  onSearch,
  isScanning,
  error
}) => {
  const { t } = useTranslation('common');
  const [mode, setMode] = useState<ScanMode>('scan');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [passportNumber, setPassportNumber] = useState('');
  const [visaNumber, setVisaNumber] = useState('');
  const [searching, setSearching] = useState(false);

  const handleScan = async () => {
    await onScan();
  };

  const handleSearchClick = () => {
    setSearchModalVisible(true);
  };

  const handleSearch = async () => {
    if (!passportNumber && !visaNumber) {
      message.warning(t('passport.scan.enterPassportOrVisa'));
      return;
    }

    setSearching(true);
    try {
      await onSearch(passportNumber, visaNumber);
      setSearchModalVisible(false);
      setPassportNumber('');
      setVisaNumber('');
    } catch (err) {
      // Error handling is done in parent
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <Card className="mb-6 shadow-lg">
        {/* Mode Selection */}
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-3">
            {t('passport.scan.selectMode')}
          </div>
          <Radio.Group
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full"
            size="large"
          >
            <Radio.Button value="scan" className="flex-1 text-center">
              <ScanOutlined className="mr-2" />
              {t('passport.scan.scanMode')}
            </Radio.Button>
            <Radio.Button value="search" className="flex-1 text-center">
              <SearchOutlined className="mr-2" />
              {t('passport.scan.searchMode')}
            </Radio.Button>
          </Radio.Group>
        </div>

        {/* Action Buttons */}
        {mode === 'scan' ? (
          <div className="flex justify-center">
            <Button
              type="primary"
              size="large"
              icon={<ScanOutlined />}
              loading={isScanning}
              onClick={handleScan}
              className="w-full sm:w-auto min-w-[250px] h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 shadow-lg"
            >
              {isScanning ? t('passport.scan.scanning') : t('passport.scan.scanPassport')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
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
                  onPressEnter={handleSearchClick}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('passport.visaNumber')} ({t('passport.optional')})
                </label>
                <Input
                  placeholder={t('passport.scan.enterVisaNumber')}
                  value={visaNumber}
                  onChange={(e) => setVisaNumber(e.target.value)}
                  size="large"
                  prefix={<IdcardOutlined />}
                  onPressEnter={handleSearchClick}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                type="primary"
                size="large"
                icon={<SearchOutlined />}
                loading={isScanning || searching}
                onClick={handleSearchClick}
                className="w-full sm:w-auto min-w-[250px] h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-0 shadow-lg"
              >
                {searching ? t('passport.scan.searching') : t('passport.scan.search')}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}
      </Card>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <SearchOutlined className="text-primaryColor" />
            <span>{t('passport.search.title')}</span>
          </div>
        }
        open={searchModalVisible}
        onOk={handleSearch}
        onCancel={() => {
          setSearchModalVisible(false);
          setPassportNumber('');
          setVisaNumber('');
        }}
        okText={t('passport.search.search')}
        cancelText={t('form.cancel')}
        confirmLoading={searching}
      >
        <div className="space-y-4 py-4">
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
              onPressEnter={handleSearch}
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
              onPressEnter={handleSearch}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

