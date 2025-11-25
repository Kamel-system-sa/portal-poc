import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Tag, Button, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ClearOutlined, SearchOutlined, LeftOutlined, RightOutlined, DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import type { Center } from '../../data/mockCenters';

interface CentersTableProps {
  centers: Center[];
  onSelectCenter: (center: Center) => void;
}

export const CentersTable: React.FC<CentersTableProps> = ({ centers, onSelectCenter }) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  
  // Search states for filter dropdowns
  const [searchTexts, setSearchTexts] = useState<Record<string, string>>({});
  
  // Debug: Log centers data
  useEffect(() => {
    console.log('CentersTable - Centers count:', centers.length);
  }, [centers]);

  // Get unique values for filter dropdowns
  const numberOptions = useMemo(() => {
    const numbers = new Set(centers.map(c => c.number));
    return Array.from(numbers).sort().map(number => ({
      text: number,
      value: number
    }));
  }, [centers]);

  const serviceTypeOptions = useMemo(() => {
    const types = new Set(centers.map(c => c.serviceType));
    return Array.from(types).map(type => ({
      text: type,
      value: type
    }));
  }, [centers]);

  const statusOptions = useMemo(() => {
    const statuses = new Set(centers.map(c => c.status));
    return Array.from(statuses).map(status => ({
      text: status === 'active' ? t('centers.active') : t('centers.inactive'),
      value: status
    }));
  }, [centers, t]);

  const capacityOptions = useMemo(() => {
    const capacities = new Set(centers.map(c => c.capacity.toString()));
    return Array.from(capacities).sort((a, b) => parseInt(a) - parseInt(b)).map(capacity => ({
      text: capacity,
      value: capacity
    }));
  }, [centers]);

  const responsibleOptions = useMemo(() => {
    const responsibles = new Set(centers.map(c => c.responsible.name));
    return Array.from(responsibles).sort().map(name => ({
      text: name,
      value: name
    }));
  }, [centers]);

  const emailOptions = useMemo(() => {
    const emails = new Set(centers.map(c => c.responsible.email));
    return Array.from(emails).sort().map(email => ({
      text: email,
      value: email
    }));
  }, [centers]);

  const mobileOptions = useMemo(() => {
    const mobiles = new Set(centers.map(c => c.responsible.mobile));
    return Array.from(mobiles).sort().map(mobile => ({
      text: mobile,
      value: mobile
    }));
  }, [centers]);

  const nationalityOptions = useMemo(() => {
    const nationalities = new Set(
      centers
        .map(c => c.missionNationality)
        .filter((nat): nat is string => !!nat)
    );
    return Array.from(nationalities).sort().map(nationality => ({
      text: nationality,
      value: nationality
    }));
  }, [centers]);

  // Helper function to create filter dropdown with search
  const createFilterDropdown = (
    searchKey: string,
    options: Array<{ text: string; value: any }>,
    setSelectedKeys: (keys: any[]) => void,
    selectedKeys: any[],
    confirm: () => void,
    clearFilters?: () => void
  ) => {
    const searchText = searchTexts[searchKey] || '';
    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={t('centers.searchPlaceholder') || 'البحث...'}
          value={searchText}
          onChange={(e) => {
            setSearchTexts({ ...searchTexts, [searchKey]: e.target.value });
          }}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
          prefix={<SearchOutlined />}
        />
        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
          {options
            .filter(option => 
              !searchText || 
              option.text.toLowerCase().includes(searchText.toLowerCase())
            )
            .map(option => (
              <div
                key={option.value}
                onClick={() => {
                  const newKeys = selectedKeys.includes(option.value)
                    ? selectedKeys.filter((key: any) => key !== option.value)
                    : [...selectedKeys, option.value];
                  setSelectedKeys(newKeys);
                }}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  backgroundColor: selectedKeys.includes(option.value) ? '#E6F7FF' : 'transparent',
                  borderRadius: 4,
                  marginBottom: 4
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedKeys.includes(option.value)}
                  onChange={() => {}}
                  style={{ marginRight: 8 }}
                />
                {option.text}
              </div>
            ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90 }}
          >
            {t('filters.apply') || 'تطبيق'}
          </Button>
          <Button
            onClick={() => {
              setSelectedKeys([]);
              setSearchTexts({ ...searchTexts, [searchKey]: '' });
              clearFilters?.();
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            {t('filters.reset') || 'إعادة'}
          </Button>
        </div>
      </div>
    );
  };

  const columns: ColumnsType<Center> = [
    {
      title: t('centers.centerNumber'),
      dataIndex: 'number',
      key: 'number',
      sorter: (a, b) => a.number.localeCompare(b.number),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        createFilterDropdown('number', numberOptions, setSelectedKeys, selectedKeys, confirm, clearFilters),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#00796B' : undefined }} />
      ),
      onFilter: (value, record) => {
        if (!filteredInfo.number || filteredInfo.number.length === 0) return true;
        return filteredInfo.number.includes(record.number);
      },
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: t('centers.serviceType'),
      dataIndex: 'serviceType',
      key: 'serviceType',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        createFilterDropdown('serviceType', serviceTypeOptions, setSelectedKeys, selectedKeys, confirm, clearFilters),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#00796B' : undefined }} />
      ),
      onFilter: (value, record) => {
        if (!filteredInfo.serviceType || filteredInfo.serviceType.length === 0) return true;
        return filteredInfo.serviceType.includes(record.serviceType);
      },
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          B2B: 'blue',
          B2C: 'green',
          B2G: 'purple'
        };
        return (
          <Tag color={colorMap[type] || 'default'}>
            {type}
          </Tag>
        );
      },
    },
    {
      title: t('centers.status'),
      dataIndex: 'status',
      key: 'status',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        createFilterDropdown('status', statusOptions, setSelectedKeys, selectedKeys, confirm, clearFilters),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#00796B' : undefined }} />
      ),
      onFilter: (value, record) => {
        if (!filteredInfo.status || filteredInfo.status.length === 0) return true;
        return filteredInfo.status.includes(record.status);
      },
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? t('centers.active') : t('centers.inactive')}
        </Tag>
      ),
    },
    {
      title: t('centers.capacity'),
      dataIndex: 'capacity',
      key: 'capacity',
      sorter: (a, b) => a.capacity - b.capacity,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        createFilterDropdown('capacity', capacityOptions, setSelectedKeys, selectedKeys, confirm, clearFilters),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#00796B' : undefined }} />
      ),
      onFilter: (value, record) => {
        if (!filteredInfo.capacity || filteredInfo.capacity.length === 0) return true;
        return filteredInfo.capacity.includes(record.capacity.toString());
      },
    },
    {
      title: t('centers.responsible'),
      dataIndex: ['responsible', 'name'],
      key: 'responsible',
      sorter: (a, b) => a.responsible.name.localeCompare(b.responsible.name),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        createFilterDropdown('responsible', responsibleOptions, setSelectedKeys, selectedKeys, confirm, clearFilters),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#00796B' : undefined }} />
      ),
      onFilter: (value, record) => {
        if (!filteredInfo.responsible || filteredInfo.responsible.length === 0) return true;
        return filteredInfo.responsible.includes(record.responsible.name);
      },
    },
    {
      title: t('form.email') || 'البريد الإلكتروني',
      dataIndex: ['responsible', 'email'],
      key: 'email',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        createFilterDropdown('email', emailOptions, setSelectedKeys, selectedKeys, confirm, clearFilters),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#00796B' : undefined }} />
      ),
      onFilter: (value, record) => {
        if (!filteredInfo.email || filteredInfo.email.length === 0) return true;
        return filteredInfo.email.includes(record.responsible.email);
      },
    },
    {
      title: t('form.phone') || 'الهاتف',
      dataIndex: ['responsible', 'mobile'],
      key: 'mobile',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        createFilterDropdown('mobile', mobileOptions, setSelectedKeys, selectedKeys, confirm, clearFilters),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#00796B' : undefined }} />
      ),
      onFilter: (value, record) => {
        if (!filteredInfo.mobile || filteredInfo.mobile.length === 0) return true;
        return filteredInfo.mobile.includes(record.responsible.mobile);
      },
    },
    {
      title: t('form.nationality') || 'الجنسية',
      dataIndex: 'missionNationality',
      key: 'nationality',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
        createFilterDropdown('nationality', nationalityOptions, setSelectedKeys, selectedKeys, confirm, clearFilters),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#00796B' : undefined }} />
      ),
      onFilter: (value, record) => {
        if (!filteredInfo.nationality || filteredInfo.nationality.length === 0) return true;
        return record.missionNationality ? filteredInfo.nationality.includes(record.missionNationality) : false;
      },
      render: (nationality: string | undefined) => nationality || '-',
    },
    {
      title: 'الإجراءات',
      key: 'actions',
      render: (_, record: Center) => (
        <Button
          type="link"
          onClick={() => onSelectCenter(record)}
        >
          {t('centers.viewDetails')}
        </Button>
      ),
    },
  ];

  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});

  const handleResetAllFilters = () => {
    setFilteredInfo({});
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setFilteredInfo(filters);
  };

  const hasActiveFilters = Object.keys(filteredInfo).some(key => 
    filteredInfo[key] && filteredInfo[key].length > 0
  );

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
        {t('centers.totalCenters') || 'قائمة المراكز'}
      </h3>
      
      {hasActiveFilters && (
        <div className="mb-4 sm:mb-5 md:mb-6 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <span className="text-sm text-blue-700">
            {t('housing.showingResults')} {centers.length} {t('housing.of')} {centers.length} {t('centers.totalCenters')?.toLowerCase() || 'مراكز'}
          </span>
          <Button
            icon={<ClearOutlined />}
            onClick={handleResetAllFilters}
            size="small"
          >
            {t('filters.reset') || 'إعادة الضبط'}
          </Button>
        </div>
      )}
      
      {centers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('centers.noCenters')}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg">
          <Table
            columns={columns}
            dataSource={centers}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${t('housing.total')}: ${total}`,
              className: 'px-4 py-2',
              itemRender: (page, type, originalElement) => {
                if (type === 'prev') {
                  return isRtl ? <RightOutlined /> : <LeftOutlined />;
                }
                if (type === 'next') {
                  return isRtl ? <LeftOutlined /> : <RightOutlined />;
                }
                if (type === 'jump-prev') {
                  return isRtl ? <DoubleRightOutlined /> : <DoubleLeftOutlined />;
                }
                if (type === 'jump-next') {
                  return isRtl ? <DoubleLeftOutlined /> : <DoubleRightOutlined />;
                }
                return originalElement;
              },
            }}
            scroll={{ x: 'max-content' }}
            onChange={handleTableChange}
            filteredInfo={filteredInfo}
            onRow={(record) => ({
              onClick: () => onSelectCenter(record),
              style: { cursor: 'pointer' },
              className: 'hover:bg-gray-50 transition-colors'
            })}
            className="centers-table"
            size="middle"
          />
        </div>
      )}
    </div>
  );
};
