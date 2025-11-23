import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Select, Row, Col } from 'antd';
import { StorageDistributionView } from './StorageDistributionView';
import { StorageItemCard } from './StorageItemCard';
import type { StorageLayout, StoredPassport } from '../../types/passport';

interface StorageDashboardProps {
  layout: StorageLayout;
  storedPassports: StoredPassport[];
  onBoxSelect?: (boxId: string) => void;
}

export const StorageDashboard: React.FC<StorageDashboardProps> = ({
  layout,
  storedPassports,
  onBoxSelect
}) => {
  const { t } = useTranslation('common');
  const [groupBy, setGroupBy] = useState<'nationality' | 'organizer' | 'campaign' | 'ageGroup'>('nationality');

  // Get all boxes with their locations
  const allBoxes = layout.cabinets.flatMap(cabinet =>
    cabinet.drawers.flatMap(drawer =>
      drawer.boxes.map(box => ({
        box,
        cabinetNumber: cabinet.number,
        drawerNumber: drawer.number
      }))
    )
  );

  // Map stored passports to boxes
  const boxesWithPassports = allBoxes.map(({ box, cabinetNumber, drawerNumber }) => {
    const passportsInBox = storedPassports.filter(
      p => p.boxId === box.id
    );
    return {
      ...box,
      passports: passportsInBox,
      cabinetNumber,
      drawerNumber
    };
  });

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t('passport.storage.title')}</h3>
          <Select
            value={groupBy}
            onChange={setGroupBy}
            className="w-48"
          >
            <Select.Option value="nationality">{t('passport.distribution.byNationality')}</Select.Option>
            <Select.Option value="organizer">{t('passport.distribution.byOrganizer')}</Select.Option>
            <Select.Option value="campaign">{t('passport.distribution.byCampaign')}</Select.Option>
            <Select.Option value="ageGroup">{t('passport.distribution.byAgeGroup')}</Select.Option>
          </Select>
        </div>

        <StorageDistributionView 
          storedPassports={storedPassports}
          groupBy={groupBy}
        />
      </Card>

      <Card title={t('passport.storage.boxes')}>
        <Row gutter={[16, 16]}>
          {boxesWithPassports.map(({ box, cabinetNumber, drawerNumber }) => (
            <Col xs={24} sm={12} md={8} lg={6} key={box.id}>
              <StorageItemCard
                box={box}
                cabinetNumber={cabinetNumber}
                drawerNumber={drawerNumber}
                onSelect={onBoxSelect}
              />
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

