import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Descriptions, Tag, Avatar } from 'antd';
import { UserOutlined, IdcardOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import type { Pilgrim } from '../../types/passport';

interface HajjDetailsCardProps {
  pilgrim: Pilgrim;
}

export const HajjDetailsCard: React.FC<HajjDetailsCardProps> = ({ pilgrim }) => {
  const { t } = useTranslation('common');

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <UserOutlined className="text-primaryColor" />
          <span>{t('passport.pilgrimInfo')}</span>
        </div>
      }
      className="shadow-lg"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {pilgrim.photo && (
          <Avatar 
            src={pilgrim.photo} 
            size={120} 
            icon={<UserOutlined />}
            className="mx-auto md:mx-0"
          />
        )}
        
        <div className="flex-1">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label={t('passport.name')}>
              <strong>{pilgrim.name}</strong>
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.passportNumber')}>
              {pilgrim.passportNumber}
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.visaNumber')}>
              {pilgrim.visaNumber}
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.nationality')}>
              {pilgrim.nationality}
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.gender')}>
              <Tag color={pilgrim.gender === 'male' ? 'blue' : 'pink'}>
                {pilgrim.gender === 'male' ? t('form.male') : t('form.female')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('labels.age')}>
              {pilgrim.age}
            </Descriptions.Item>
            {pilgrim.phone && (
              <Descriptions.Item label={t('labels.phone')}>
                <PhoneOutlined className="mr-2" />
                {pilgrim.phone}
              </Descriptions.Item>
            )}
            {pilgrim.email && (
              <Descriptions.Item label={t('labels.email')}>
                <MailOutlined className="mr-2" />
                {pilgrim.email}
              </Descriptions.Item>
            )}
            <Descriptions.Item label={t('passport.serviceProvided')}>
              <Tag color={pilgrim.serviceProvided ? 'green' : 'orange'}>
                {pilgrim.serviceProvided ? t('passport.serviceProvided') : t('passport.pending')}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Card>
  );
};

