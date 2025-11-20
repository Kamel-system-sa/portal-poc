import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/ui/HousingComponent/GlassCard';
import { TentBedVisualizer } from '../../components/ui/HousingComponent/TentBedVisualizer';
import { HousingStatsCard } from '../../components/ui/HousingComponent/HousingStatsCard';
import { Input, Select, Button } from 'antd';
import { SearchOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { mockMinaTents } from '../../data/mockHousing';
import { Tent3DViewer } from '../../components/ui/HousingComponent/Tent3DViewer';
import type { Tent } from '../../types/housing';

const { Option } = Select;

const MinaHousingPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTent, setSelectedTent] = useState<Tent | null>(null);
  const [selectedTent3D, setSelectedTent3D] = useState<Tent | null>(null);
  const [filters, setFilters] = useState({
    section: '' as string,
    minCapacity: '' as string,
    maxCapacity: '' as string
  });

  const filteredTents = useMemo(() => {
    return mockMinaTents.filter((tent: Tent) => {
      // Search filter
      if (searchTerm && !tent.tentNumber.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Section filter
      if (filters.section && tent.section !== filters.section) {
        return false;
      }

      // Capacity filters
      if (filters.minCapacity && tent.totalBeds < parseInt(filters.minCapacity)) {
        return false;
      }
      if (filters.maxCapacity && tent.totalBeds > parseInt(filters.maxCapacity)) {
        return false;
      }

      return true;
    });
  }, [searchTerm, filters]);

  const stats = useMemo(() => {
    const totalTents = mockMinaTents.length;
    const totalBeds = mockMinaTents.reduce((sum, t) => sum + t.totalBeds, 0);
    const occupiedBeds = mockMinaTents.reduce((sum, t) => sum + t.beds.filter(b => b.occupied).length, 0);
    const availableBeds = totalBeds - occupiedBeds;
    return { totalTents, totalBeds, occupiedBeds, availableBeds };
  }, []);

  const sections = useMemo(() => {
    const uniqueSections = new Set(mockMinaTents.map(t => t.section).filter(Boolean));
    return Array.from(uniqueSections);
  }, []);

  const handleTentClick = (tent: Tent) => {
    setSelectedTent(tent);
  };

  const getPilgrimsInTent = (tent: Tent) => {
    return tent.beds.filter(b => b.occupied && b.pilgrimName).map(b => ({
      id: b.pilgrimId || '',
      name: b.pilgrimName || t('housing.unknown'),
      bedId: b.id
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grayBG via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('housing.mina')}
          </h1>
          <p className="text-customgray">
            {t('housing.manageMinaTents')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <HousingStatsCard
            title={t('housing.totalTents')}
            value={stats.totalTents}
            color="mainColor"
          />
          <HousingStatsCard
            title={t('housing.totalBeds')}
            value={stats.totalBeds}
            color="primaryColor"
          />
          <HousingStatsCard
            title={t('housing.occupiedBeds')}
            value={stats.occupiedBeds}
            color="secondaryColor"
          />
          <HousingStatsCard
            title={t('housing.availableBeds')}
            value={stats.availableBeds}
            color="success"
          />
        </div>

        {/* Filters */}
        <GlassCard className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder={t('housing.searchTents')}
              prefix={<SearchOutlined className="text-customgray" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
              size="large"
            />
            <Select
              placeholder={t('housing.filterBySection')}
              value={filters.section}
              onChange={(value) => setFilters(prev => ({ ...prev, section: value }))}
              allowClear
              className="w-full md:w-48"
              size="large"
            >
              {sections.map(section => (
                <Option key={section} value={section}>{section}</Option>
              ))}
            </Select>
            <Select
              placeholder={t('housing.minCapacity')}
              value={filters.minCapacity}
              onChange={(value) => setFilters(prev => ({ ...prev, minCapacity: value }))}
              allowClear
              className="w-full md:w-32"
              size="large"
            >
              <Option value="10">10+</Option>
              <Option value="20">20+</Option>
              <Option value="30">30+</Option>
              <Option value="40">40+</Option>
            </Select>
            <Select
              placeholder={t('housing.maxCapacity')}
              value={filters.maxCapacity}
              onChange={(value) => setFilters(prev => ({ ...prev, maxCapacity: value }))}
              allowClear
              className="w-full md:w-32"
              size="large"
            >
              <Option value="20">20</Option>
              <Option value="30">30</Option>
              <Option value="40">40</Option>
              <Option value="50">50</Option>
            </Select>
          </div>
        </GlassCard>

        {/* Tents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTents.map((tent) => (
            <div key={tent.id} className="relative">
              <TentBedVisualizer
                beds={tent.beds}
                tentNumber={tent.tentNumber}
                totalBeds={tent.totalBeds}
                onClick={() => handleTentClick(tent)}
              />
              <Button
                type="primary"
                icon={<EyeOutlined />}
                className="absolute top-4 right-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTent3D(tent);
                }}
              >
                {t('housing.view3D')}
              </Button>
            </div>
          ))}
        </div>

        {filteredTents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-customgray text-lg">
              {t('housing.noTentsFound')}
            </p>
          </div>
        )}

        {/* Tent Details Side Panel */}
        {selectedTent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-end p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedTent(null);
            }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-md max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
              <div className="flex items-center justify-between p-6 border-b border-bordergray bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t('housing.tentDetails')} - {selectedTent.tentNumber}
                </h2>
                <button
                  onClick={() => setSelectedTent(null)}
                  className="p-2 text-customgray hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
                >
                  <CloseOutlined className="text-lg" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-customgray mb-2">
                      {t('housing.tentInfo')}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-customgray">{t('housing.tentNumber')}:</span>
                        <span className="font-semibold">{selectedTent.tentNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-customgray">{t('housing.section')}:</span>
                        <span className="font-semibold">{selectedTent.section || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-customgray">{t('housing.totalBeds')}:</span>
                        <span className="font-semibold">{selectedTent.totalBeds}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-customgray">{t('housing.occupiedBeds')}:</span>
                        <span className="font-semibold text-primaryColor">
                          {selectedTent.beds.filter(b => b.occupied).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-customgray">{t('housing.availableBeds')}:</span>
                        <span className="font-semibold text-success">
                          {selectedTent.beds.filter(b => !b.occupied).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-customgray mb-2">
                      {t('housing.assignedPilgrims')}
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {getPilgrimsInTent(selectedTent).length > 0 ? (
                        getPilgrimsInTent(selectedTent).map((pilgrim) => (
                          <GlassCard key={pilgrim.id} className="p-3" hover={false}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-800">{pilgrim.name}</span>
                              <span className="text-xs text-customgray">{pilgrim.bedId}</span>
                            </div>
                          </GlassCard>
                        ))
                      ) : (
                        <p className="text-sm text-customgray text-center py-4">
                          {t('housing.noPilgrimsAssigned')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3D Tent Viewer */}
        {selectedTent3D && (
          <Tent3DViewer
            tentNumber={selectedTent3D.tentNumber}
            beds={selectedTent3D.beds}
            totalBeds={selectedTent3D.totalBeds}
            location="mina"
            onClose={() => setSelectedTent3D(null)}
          />
        )}
      </div>
    </div>
  );
};

export default MinaHousingPage;

