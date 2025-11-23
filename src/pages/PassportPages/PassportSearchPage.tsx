import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, List, Empty } from 'antd';
import { SearchPassportForm } from '../../components/Passport/SearchPassportForm';
import { HajjDetailsCard } from '../../components/Passport/HajjDetailsCard';
import Breadcrumb from '../../components/common/Breadcrumb';
import { searchPilgrims } from '../../utils/passportHelpers';
import type { Pilgrim } from '../../types/passport';

// Mock data
const mockPilgrims: Pilgrim[] = [];

const PassportSearchPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [searchResults, setSearchResults] = useState<Pilgrim[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPilgrim, setSelectedPilgrim] = useState<Pilgrim | null>(null);

  const handleSearch = (query: string, searchType: 'passport' | 'visa' | 'name') => {
    setLoading(true);
    // Simulate search
    setTimeout(() => {
      const results = searchPilgrims(mockPilgrims, query);
      setSearchResults(results);
      setLoading(false);
    }, 500);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 ${isRtl ? 'rtl' : 'ltr'}`}>
      <Breadcrumb />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/passport/dashboard')}
            >
              {t('passport.back')}
            </Button>
            <SearchOutlined className="text-3xl text-primaryColor" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {t('passport.search')}
            </h1>
          </div>
        </div>

        {/* Search Form */}
        <div className="mb-6">
          <SearchPassportForm
            onSearch={handleSearch}
            loading={loading}
          />
        </div>

        {/* Results */}
        {selectedPilgrim ? (
          <div>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setSelectedPilgrim(null)}
              className="mb-4"
            >
              {t('passport.back')}
            </Button>
            <HajjDetailsCard pilgrim={selectedPilgrim} />
          </div>
        ) : (
          <Card>
            {searchResults.length > 0 ? (
              <List
                dataSource={searchResults}
                renderItem={(pilgrim) => (
                  <List.Item
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedPilgrim(pilgrim)}
                  >
                    <List.Item.Meta
                      title={pilgrim.name}
                      description={
                        <div>
                          <div>{t('passport.passportNumber')}: {pilgrim.passportNumber}</div>
                          <div>{t('passport.visaNumber')}: {pilgrim.visaNumber}</div>
                          <div>{t('passport.nationality')}: {pilgrim.nationality}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description={t('passport.search.noResults')}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default PassportSearchPage;

