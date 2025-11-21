import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CloseOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  IdcardOutlined
} from '@ant-design/icons';
import type { Member } from '../../data/mockCenters';
import { translateSection } from '../../utils';

interface MemberDetailsProps {
  member: Member;
  onClose: () => void;
}

export const MemberDetails: React.FC<MemberDetailsProps> = ({ member, onClose }) => {
  const { t } = useTranslation('common');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="bg-gradient-to-r from-mainColor to-primary p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <UserOutlined className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{t('details.members')}</h2>
                <p className="text-sm text-white/80">{translateSection(member.section)}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <CloseOutlined className="text-lg" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/50 to-transparent border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <UserOutlined className="text-blue-600 text-lg" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">{t('details.name')}</p>
                <p className="text-sm font-bold text-gray-900">{member.name || t('details.notSpecified')}</p>
              </div>
            </div>
          </div>

          {member.email && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50/50 to-transparent border border-orange-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <MailOutlined className="text-orange-600 text-lg" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">{t('details.email')}</p>
                  <p className="text-sm font-bold text-gray-900">{member.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50/50 to-transparent border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <PhoneOutlined className="text-purple-600 text-lg" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">{t('details.mobile')}</p>
                <p className="text-sm font-bold text-gray-900">{member.phone || t('details.notSpecified')}</p>
              </div>
            </div>
          </div>

          {member.bravoCode && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-transparent border border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <IdcardOutlined className="text-indigo-600 text-lg" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">{t('details.bravoCode')}</p>
                  <p className="text-sm font-bold text-gray-900">{member.bravoCode}</p>
                </div>
              </div>
            </div>
          )}

          {member.hawiya && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50/50 to-transparent border border-pink-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                  <IdcardOutlined className="text-pink-600 text-lg" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">{t('form.hawiya')}</p>
                  <p className="text-sm font-bold text-gray-900">{member.hawiya}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
