import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  IdcardOutlined,
  GlobalOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { Campaign } from '../../types/reception';

interface CampaignDetailsProps {
  campaign: Campaign;
}

export const CampaignDetails: React.FC<CampaignDetailsProps> = ({ campaign }) => {
  const { t } = useTranslation('common');

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
      draft: {
        label: t('reception.campaigns.status.draft') || 'Draft',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50'
      },
      registered: {
        label: t('reception.campaigns.status.registered') || 'Registered',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      completed: {
        label: t('reception.campaigns.status.completed') || 'Completed',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      }
    };
    const statusInfo = statusMap[status] || statusMap.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Campaign Header */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{campaign.campaignName}</h2>
            <p className="text-gray-600">{campaign.campaignNumber}</p>
          </div>
          {getStatusBadge(campaign.status)}
        </div>
        <div className="h-1 bg-gradient-to-r from-mainColor to-primary rounded-full"></div>
      </div>

      {/* Campaign Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <TeamOutlined className="text-2xl text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-gray-700">{t('reception.campaigns.details.totalPilgrims') || 'Total Pilgrims'}</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.totalPilgrims.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircleOutlined className="text-2xl text-green-600" />
            <div>
              <p className="text-sm font-semibold text-gray-700">{t('reception.campaigns.details.registeredPilgrims') || 'Registered'}</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.registeredPilgrims.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <ClockCircleOutlined className="text-2xl text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-gray-700">{t('reception.campaigns.details.remainingPilgrims') || 'Remaining'}</p>
              <p className="text-2xl font-bold text-gray-900">{(campaign.totalPilgrims - campaign.registeredPilgrims).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <GlobalOutlined className="text-2xl text-purple-600" />
            <div>
              <p className="text-sm font-semibold text-gray-700">{t('reception.campaigns.details.registrationPercentage') || 'Registration %'}</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.registrationPercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">{t('reception.campaigns.details.registrationProgress') || 'Registration Progress'}</span>
          <span className="text-sm font-semibold text-gray-900">{campaign.registrationPercentage}%</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-mainColor to-primary rounded-full transition-all duration-300"
            style={{ width: `${campaign.registrationPercentage}%` }}
          />
        </div>
      </div>

      {/* Campaign Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organizer Information */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">{t('reception.preArrival.form.organizerInfo') || 'Organizer Information'}</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <IdcardOutlined className="text-mainColor" />
                {t('reception.preArrival.form.organizerNumber') || 'Organizer Number'}
              </label>
              <p className="text-gray-900">{campaign.organizerNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <UserOutlined className="text-mainColor" />
                {t('reception.preArrival.form.organizerName') || 'Organizer Name'}
              </label>
              <p className="text-gray-900">{campaign.organizerName}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <UserOutlined className="text-mainColor" />
                {t('reception.preArrival.form.organizerCompany') || 'Company Name'}
              </label>
              <p className="text-gray-900">{campaign.organizerCompany}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <PhoneOutlined className="text-mainColor" />
                {t('reception.preArrival.form.organizerPhone') || 'Phone'}
              </label>
              <p className="text-gray-900">{campaign.organizerPhone}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <MailOutlined className="text-mainColor" />
                {t('reception.preArrival.form.organizerEmail') || 'Email'}
              </label>
              <p className="text-gray-900">{campaign.organizerEmail}</p>
            </div>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">{t('reception.campaigns.details.campaignInfo') || 'Campaign Details'}</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <UserOutlined className="text-mainColor" />
                {t('reception.campaigns.form.responsiblePerson') || 'Responsible Person'}
              </label>
              <p className="text-gray-900">{campaign.responsiblePerson}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <UserOutlined className="text-mainColor" />
                {t('reception.campaigns.form.gender') || 'Gender'}
              </label>
              <p className="text-gray-900">{campaign.gender === 'male' ? t('hr.form.male') || 'Male' : t('hr.form.female') || 'Female'}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <CalendarOutlined className="text-mainColor" />
                {t('reception.campaigns.details.createdAt') || 'Created At'}
              </label>
              <p className="text-gray-900">{new Date(campaign.createdAt).toLocaleDateString()} {new Date(campaign.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <CalendarOutlined className="text-mainColor" />
                {t('reception.campaigns.details.updatedAt') || 'Last Updated'}
              </label>
              <p className="text-gray-900">{new Date(campaign.updatedAt).toLocaleDateString()} {new Date(campaign.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            {campaign.photo && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('reception.campaigns.details.photo') || 'Photo'}</label>
                <img src={campaign.photo} alt="Campaign" className="w-full h-48 object-cover rounded-xl" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registered Pilgrims List */}
      {campaign.pilgrims.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">{t('reception.campaigns.details.registeredPilgrimsList') || 'Registered Pilgrims'}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t('labels.name') || 'Name'}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t('reception.campaigns.form.passportNumber') || 'Passport'}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t('reception.campaigns.form.primaryPhone') || 'Primary Phone'}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t('reception.campaigns.form.email') || 'Email'}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t('form.nationality') || 'Nationality'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {campaign.pilgrims.slice(0, 10).map((pilgrim) => (
                  <tr key={pilgrim.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{pilgrim.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{pilgrim.passportNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{pilgrim.primaryPhone}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{pilgrim.email || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{pilgrim.nationality}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {campaign.pilgrims.length > 10 && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                {t('reception.campaigns.details.showingFirst10') || 'Showing first 10 of'} {campaign.pilgrims.length} {t('reception.campaigns.details.pilgrims') || 'pilgrims'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

