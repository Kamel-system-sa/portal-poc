import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Descriptions, Tag } from 'antd';
import { TeamOutlined, PhoneOutlined, MailOutlined, BankOutlined } from '@ant-design/icons';
import type { Organizer, Campaign } from '../../types/passport';

interface OrganizerDetailsCardProps {
  organizer: Organizer;
  campaign?: Campaign;
}

export const OrganizerDetailsCard: React.FC<OrganizerDetailsCardProps> = ({ 
  organizer, 
  campaign 
}) => {
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
          <strong>{organizer.number}</strong>
        </Descriptions.Item>
        <Descriptions.Item label={t('passport.organizerName')}>
          {organizer.name}
        </Descriptions.Item>
        <Descriptions.Item label={t('passport.organizerCompany')}>
          <BankOutlined className="mr-2" />
          {organizer.company}
        </Descriptions.Item>
        <Descriptions.Item label={t('labels.phone')}>
          <PhoneOutlined className="mr-2" />
          {organizer.phone}
        </Descriptions.Item>
        {organizer.email && (
          <Descriptions.Item label={t('labels.email')}>
            <MailOutlined className="mr-2" />
            {organizer.email}
          </Descriptions.Item>
        )}
      </Descriptions>

      {campaign && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-semibold mb-2">{t('passport.campaignInfo')}</h4>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label={t('passport.campaignNumber')}>
              <Tag color="blue">{campaign.campaignNumber}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.campaignName')}>
              {campaign.campaignName}
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.totalPilgrims')}>
              {campaign.totalPilgrims}
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.registeredPilgrims')}>
              {campaign.registeredPilgrims}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Card>
  );
};

