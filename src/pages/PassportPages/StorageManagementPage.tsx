import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { InboxOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { StorageDashboard } from '../../components/Passport/StorageDashboard';
import Breadcrumb from '../../components/common/Breadcrumb';
import type { StorageLayout, StoredPassport } from '../../types/passport';

// Mock data
const mockLayout: StorageLayout = {
  id: '1',
  name: 'Main Storage',
  cabinets: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const mockStoredPassports: StoredPassport[] = [];

const StorageManagementPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';

  const handleBoxSelect = (boxId: string) => {
    // Navigate to box details or open modal
    console.log('Box selected:', boxId);
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
            <InboxOutlined className="text-3xl text-primaryColor" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {t('passport.storage')}
            </h1>
          </div>
        </div>

        {/* Storage Dashboard */}
        <StorageDashboard
          layout={mockLayout}
          storedPassports={mockStoredPassports}
          onBoxSelect={handleBoxSelect}
        />
      </div>
    </div>
  );
};

export default StorageManagementPage;

