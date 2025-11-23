import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BuildOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import { CabinetBuilder } from '../../components/Passport/StorageBuilder/CabinetBuilder';
import { DrawerBuilder } from '../../components/Passport/StorageBuilder/DrawerBuilder';
import { BoxBuilder } from '../../components/Passport/StorageBuilder/BoxBuilder';
import Breadcrumb from '../../components/common/Breadcrumb';
import type { StorageLayout, Cabinet, Drawer, Box } from '../../types/passport';

// Mock data
const initialLayout: StorageLayout = {
  id: '1',
  name: 'Main Storage',
  cabinets: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const StorageBuilderPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [layout, setLayout] = useState<StorageLayout>(initialLayout);

  const handleAddCabinet = (cabinet: Omit<Cabinet, 'id' | 'drawers'>) => {
    const newCabinet: Cabinet = {
      ...cabinet,
      id: `cabinet-${Date.now()}`,
      drawers: []
    };
    setLayout({
      ...layout,
      cabinets: [...layout.cabinets, newCabinet],
      updatedAt: new Date().toISOString()
    });
  };

  const handleEditCabinet = (id: string, updates: Partial<Cabinet>) => {
    setLayout({
      ...layout,
      cabinets: layout.cabinets.map(c =>
        c.id === id ? { ...c, ...updates } : c
      ),
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteCabinet = (id: string) => {
    setLayout({
      ...layout,
      cabinets: layout.cabinets.filter(c => c.id !== id),
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddDrawer = (cabinetId: string, drawer: Omit<Drawer, 'id' | 'boxes'>) => {
    const newDrawer: Drawer = {
      ...drawer,
      id: `drawer-${Date.now()}`,
      boxes: []
    };
    setLayout({
      ...layout,
      cabinets: layout.cabinets.map(c =>
        c.id === cabinetId
          ? { ...c, drawers: [...c.drawers, newDrawer] }
          : c
      ),
      updatedAt: new Date().toISOString()
    });
  };

  const handleEditDrawer = (cabinetId: string, drawerId: string, updates: Partial<Drawer>) => {
    setLayout({
      ...layout,
      cabinets: layout.cabinets.map(c =>
        c.id === cabinetId
          ? {
              ...c,
              drawers: c.drawers.map(d =>
                d.id === drawerId ? { ...d, ...updates } : d
              )
            }
          : c
      ),
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteDrawer = (cabinetId: string, drawerId: string) => {
    setLayout({
      ...layout,
      cabinets: layout.cabinets.map(c =>
        c.id === cabinetId
          ? { ...c, drawers: c.drawers.filter(d => d.id !== drawerId) }
          : c
      ),
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddBox = (cabinetId: string, drawerId: string, box: Omit<Box, 'id' | 'passports'>) => {
    const newBox: Box = {
      ...box,
      id: `box-${Date.now()}`,
      passports: []
    };
    setLayout({
      ...layout,
      cabinets: layout.cabinets.map(c =>
        c.id === cabinetId
          ? {
              ...c,
              drawers: c.drawers.map(d =>
                d.id === drawerId
                  ? { ...d, boxes: [...d.boxes, newBox] }
                  : d
              )
            }
          : c
      ),
      updatedAt: new Date().toISOString()
    });
  };

  const handleEditBox = (cabinetId: string, drawerId: string, boxId: string, updates: Partial<Box>) => {
    setLayout({
      ...layout,
      cabinets: layout.cabinets.map(c =>
        c.id === cabinetId
          ? {
              ...c,
              drawers: c.drawers.map(d =>
                d.id === drawerId
                  ? {
                      ...d,
                      boxes: d.boxes.map(b =>
                        b.id === boxId ? { ...b, ...updates } : b
                      )
                    }
                  : d
              )
            }
          : c
      ),
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteBox = (cabinetId: string, drawerId: string, boxId: string) => {
    setLayout({
      ...layout,
      cabinets: layout.cabinets.map(c =>
        c.id === cabinetId
          ? {
              ...c,
              drawers: c.drawers.map(d =>
                d.id === drawerId
                  ? { ...d, boxes: d.boxes.filter(b => b.id !== boxId) }
                  : d
              )
            }
          : c
      ),
      updatedAt: new Date().toISOString()
    });
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
            <BuildOutlined className="text-3xl text-primaryColor" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {t('passport.storageBuilder')}
            </h1>
          </div>
        </div>

        {/* Builder Tabs */}
        <Tabs
          defaultActiveKey="cabinets"
          items={[
            {
              key: 'cabinets',
              label: t('passport.storageLayout.cabinet'),
              children: (
                <CabinetBuilder
                  cabinets={layout.cabinets}
                  onAdd={handleAddCabinet}
                  onEdit={handleEditCabinet}
                  onDelete={handleDeleteCabinet}
                />
              )
            },
            {
              key: 'drawers',
              label: t('passport.storageLayout.drawer'),
              children: (
                <DrawerBuilder
                  cabinets={layout.cabinets}
                  onAdd={handleAddDrawer}
                  onEdit={handleEditDrawer}
                  onDelete={handleDeleteDrawer}
                />
              )
            },
            {
              key: 'boxes',
              label: t('passport.storageLayout.box'),
              children: (
                <BoxBuilder
                  cabinets={layout.cabinets}
                  onAdd={handleAddBox}
                  onEdit={handleEditBox}
                  onDelete={handleDeleteBox}
                />
              )
            }
          ]}
        />
      </div>
    </div>
  );
};

export default StorageBuilderPage;

