import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Input, Button, Select } from 'antd';
import { SearchOutlined, IdcardOutlined } from '@ant-design/icons';

interface SearchPassportFormProps {
  onSearch: (query: string, searchType: 'passport' | 'visa' | 'name') => void;
  loading?: boolean;
}

export const SearchPassportForm: React.FC<SearchPassportFormProps> = ({
  onSearch,
  loading = false
}) => {
  const { t } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'passport' | 'visa' | 'name'>('passport');

  const handleSearch = () => {
    if (!query.trim()) {
      return;
    }
    onSearch(query.trim(), searchType);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <SearchOutlined className="text-2xl text-primaryColor" />
          <h3 className="text-lg font-semibold">{t('passport.search.title')}</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <Select
            value={searchType}
            onChange={setSearchType}
            className="w-full md:w-48"
            size="large"
          >
            <Select.Option value="passport">{t('passport.search.byPassport')}</Select.Option>
            <Select.Option value="visa">{t('passport.search.byVisa')}</Select.Option>
            <Select.Option value="name">{t('passport.search.byName')}</Select.Option>
          </Select>

          <Input
            placeholder={
              searchType === 'passport' 
                ? t('passport.search.enterPassportNumber')
                : searchType === 'visa'
                ? t('passport.search.enterVisaNumber')
                : t('passport.search.enterName')
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            size="large"
            prefix={<IdcardOutlined />}
            className="flex-1"
          />

          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="large"
            loading={loading}
            onClick={handleSearch}
          >
            {t('passport.search.search')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

