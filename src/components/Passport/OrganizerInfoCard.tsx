import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Descriptions, Tag } from 'antd';
import { TeamOutlined, PhoneOutlined, MailOutlined, BankOutlined } from '@ant-design/icons';
import type { MockPassportScanResult } from '../../data/mockPassports';

interface OrganizerInfoCardProps {
  passport: MockPassportScanResult;
}

export const OrganizerInfoCard: React.FC<OrganizerInfoCardProps> = ({ passport }) => {
  const { t } = useTranslation('common');

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <TeamOutlined className="text-primaryColor" />
          <span>{t('passport.organizerInfo')}</span>
        </div>
      }
      className="shadow-lg"
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label={t('passport.organizerNumber')}>
          <strong>{passport.organizer.number}</strong>
        </Descriptions.Item>
        <Descriptions.Item label={t('passport.organizerName')}>
          {passport.organizer.name}
        </Descriptions.Item>
        <Descriptions.Item label={t('passport.organizerCompany')}>
          <BankOutlined className="mr-2" />
          {passport.organizer.company}
        </Descriptions.Item>
        <Descriptions.Item label={t('labels.phone')}>
          <PhoneOutlined className="mr-2" />
          {passport.organizer.phone}
        </Descriptions.Item>
        {passport.organizer.email && (
          <Descriptions.Item label={t('labels.email')}>
            <MailOutlined className="mr-2" />
            {passport.organizer.email}
          </Descriptions.Item>
        )}
      </Descriptions>

      {passport.campaign && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-semibold mb-2">{t('passport.campaignInfo')}</h4>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label={t('passport.campaignNumber')}>
              <Tag color="blue">{passport.campaign.campaignNumber}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.campaignName')}>
              {passport.campaign.campaignName}
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.totalPilgrims')}>
              {passport.campaign.totalPilgrims}
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.registeredPilgrims')}>
              {passport.campaign.registeredPilgrims}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Card>
  );
};

