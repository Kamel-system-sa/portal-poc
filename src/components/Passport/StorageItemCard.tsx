import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Tag, Progress } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { Box, StoredPassport } from '../../types/passport';

interface StorageItemCardProps {
  box: Box;
  cabinetNumber: string;
  drawerNumber: string;
  onSelect?: (boxId: string) => void;
}

export const StorageItemCard: React.FC<StorageItemCardProps> = ({
  box,
  cabinetNumber,
  drawerNumber,
  onSelect
}) => {
  const { t } = useTranslation('common');
  const usage = (box.passports.length / box.capacity) * 100;

  return (
    <Card
      hoverable
      onClick={() => onSelect?.(box.id)}
      className="cursor-pointer transition-all hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <InboxOutlined className="text-xl text-primaryColor" />
          <div>
            <h4 className="font-semibold text-lg">
              {t('passport.storageLayout.box')} {box.number}
            </h4>
            {box.name && (
              <p className="text-sm text-gray-600">{box.name}</p>
            )}
          </div>
        </div>
        <Tag color={usage >= 100 ? 'red' : usage >= 80 ? 'orange' : 'green'}>
          {box.passports.length}/{box.capacity}
        </Tag>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{t('passport.storageLayout.location')}:</span>{' '}
          {t('passport.storageLayout.cabinet')} {cabinetNumber}, {t('passport.storageLayout.drawer')} {drawerNumber}
        </div>
        <Progress 
          percent={Math.round(usage)} 
          status={usage >= 100 ? 'exception' : 'active'}
          size="small"
        />
      </div>
    </Card>
  );
};

