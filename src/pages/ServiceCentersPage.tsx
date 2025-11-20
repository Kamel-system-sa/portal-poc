import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AddCenterForm } from '../components/ui/Centers/AddCenterForm';
import { CenterDetails } from '../components/ui/Centers/CenterDetails';
import { CentersToolbar } from '../components/ui/Centers/CentersToolbar';
import { SummaryCards } from '../components/ui/Centers/SummaryCards';
import { CentersGrid } from '../components/ui/Centers/CentersGrid';
import { mockCenters } from '../data/mockCenters';
import type { Center } from '../data/mockCenters';
import type { FilterState } from '../types';
import { CloseOutlined } from '@ant-design/icons';

const ServiceCentersPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [centers, setCenters] = useState<Center[]>(mockCenters);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [editCenterData, setEditCenterData] = useState<Center | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    serviceType: [],
    status: []
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  const handleSearch = (val: string): void => setSearchValue(val);

  const handleOpenAdd = (): void => {
    setEditCenterData(null);
    setIsAddFormOpen(true);
  };

  const handleCloseAdd = (): void => {
    setEditCenterData(null);
    setIsAddFormOpen(false);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isAddFormOpen) {
        handleCloseAdd();
      }
    };

    if (isAddFormOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isAddFormOpen]);

  const handleAddCenter = (newCenter: Center): void => {
    // لو موجود تعديل، نحدث المركز بدل الإضافة
    if (editCenterData) {
      setCenters(centers.map(c => (c.id === newCenter.id ? newCenter : c)));
    } else {
      setCenters([...centers, newCenter]);
    }
    handleCloseAdd();
  };

  const handleSelectCenter = (center: Center): void => setSelectedCenter(center);

  const handleEditCenter = (): void => {
    if (selectedCenter) {
      setEditCenterData(selectedCenter); // خزن بيانات المركز اللي حنعدل عليه
      setIsAddFormOpen(true); // افتح الفورم
      setSelectedCenter(null); // غلق تفاصيل المركز
    }
  };

  // Filter centers based on search and filters
  const filteredCenters = centers.filter((center) => {
    // Search filter
    const matchesSearch = 
      center.number.toLowerCase().includes(searchValue.toLowerCase()) ||
      center.serviceType.toLowerCase().includes(searchValue.toLowerCase()) ||
      center.responsible.name.toLowerCase().includes(searchValue.toLowerCase());
    
    // Service type filter
    const matchesServiceType = 
      filters.serviceType.length === 0 || 
      filters.serviceType.includes(center.serviceType);
    
    // Status filter
    const matchesStatus = 
      filters.status.length === 0 || 
      filters.status.includes(center.status);
    
    return matchesSearch && matchesServiceType && matchesStatus;
  });

  const handleResetFilters = (): void => {
    setFilters({ serviceType: [], status: [] });
  };

  return (
    <>
      <section className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CentersToolbar
            searchValue={searchValue}
            onSearch={handleSearch}
            onOpenAdd={handleOpenAdd}
            filters={filters}
            onFiltersChange={setFilters}
            isFiltersOpen={isFiltersOpen}
            onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
            onResetFilters={handleResetFilters}
          />

          <SummaryCards centers={filteredCenters} />

          <CentersGrid
            centers={filteredCenters}
            onSelectCenter={handleSelectCenter}
          />
        </div>
      </section>

      {isAddFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) handleCloseAdd();
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                {editCenterData ? t('centers.editCenter') : t('centers.addNewCenter')}
              </h2>
              <button
                onClick={handleCloseAdd}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
                aria-label="Close modal"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
              <AddCenterForm
                initialData={editCenterData ?? undefined}
                onCancel={handleCloseAdd}
                onSubmit={handleAddCenter}
              />
            </div>
          </div>
        </div>
      )}

      {selectedCenter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) setSelectedCenter(null);
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-5xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">{t('centers.centerDetails')}</h2>
              <button
                onClick={() => setSelectedCenter(null)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
                aria-label="Close modal"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
              <CenterDetails
                center={selectedCenter}
                onEdit={handleEditCenter}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceCentersPage;
