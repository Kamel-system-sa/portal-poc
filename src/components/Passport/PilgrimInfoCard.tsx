import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Descriptions, Tag, Avatar } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';
import type { MockPassportScanResult } from '../../data/mockPassports';

interface PilgrimInfoCardProps {
  passport: MockPassportScanResult;
}

export const PilgrimInfoCard: React.FC<PilgrimInfoCardProps> = ({ passport }) => {
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
        {passport.photo && (
          <Avatar 
            src={passport.photo} 
            size={100} 
            icon={<UserOutlined />}
            className="mx-auto md:mx-0"
          />
        )}
        
        <div className="flex-1">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label={t('passport.name')}>
              <strong>{passport.name}</strong>
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.passportNumber')}>
              <span className="font-mono">{passport.passportNumber}</span>
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.visaNumber')}>
              <span className="font-mono">{passport.visaNumber}</span>
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.nationality')}>
              {passport.nationality}
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.gender')}>
              <Tag color={passport.gender === 'male' ? 'blue' : 'pink'}>
                {passport.gender === 'male' ? t('form.male') : t('form.female')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('labels.age')}>
              {passport.age}
            </Descriptions.Item>
            <Descriptions.Item label={t('passport.dateOfBirth')}>
              <CalendarOutlined className="mr-2" />
              {new Date(passport.dateOfBirth).toLocaleDateString()}
            </Descriptions.Item>
            {passport.phone && (
              <Descriptions.Item label={t('labels.phone')}>
                <PhoneOutlined className="mr-2" />
                {passport.phone}
              </Descriptions.Item>
            )}
            {passport.email && (
              <Descriptions.Item label={t('labels.email')}>
                <MailOutlined className="mr-2" />
                {passport.email}
              </Descriptions.Item>
            )}
            {passport.preArrivalData && (
              <>
                <Descriptions.Item label={t('passport.groupNumber')}>
                  {passport.preArrivalData.groupNumber}
                </Descriptions.Item>
                <Descriptions.Item label={t('passport.groupName')}>
                  {passport.preArrivalData.groupName}
                </Descriptions.Item>
                {passport.preArrivalData.flightNumber && (
                  <Descriptions.Item label={t('passport.flightNumber')}>
                    {passport.preArrivalData.flightNumber}
                  </Descriptions.Item>
                )}
              </>
            )}
          </Descriptions>
        </div>
      </div>
    </Card>
  );
};

