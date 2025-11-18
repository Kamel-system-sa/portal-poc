import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  NumberOutlined, 
  ApartmentOutlined, 
  TeamOutlined, 
  EnvironmentOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import type { Center, Member } from '../../../data/mockCenters';
import { renderLocations, translateSection } from '../../../utils';
import { MemberDetails } from './MemberDetails';

interface CenterDetailsProps {
  center: Center;
  onEdit: () => void;
}

export const CenterDetails: React.FC<CenterDetailsProps> = ({ center, onEdit }) => {
  const { t } = useTranslation('common');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <div className="space-y-6">
      {/* معلومات المركز */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <header className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mainColor to-primary flex items-center justify-center shadow-lg shadow-mainColor/20">
                <NumberOutlined className="text-3xl text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
                  {t('details.centerNumber')} {center.number}
                </h3>
                <div className="flex items-center gap-2">
                  {center.status === 'active' ? (
                    <CheckCircleOutlined className="text-green-500 text-sm" />
                  ) : (
                    <CloseCircleOutlined className="text-red-500 text-sm" />
                  )}
                  <span className={`text-sm font-semibold ${
                    center.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {center.status === 'active' ? t('centers.active') : t('centers.inactive')}
                  </span>
                </div>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
              center.serviceType === 'B2B' ? 'bg-blue-50 text-blue-700' :
              center.serviceType === 'B2C' ? 'bg-green-50 text-green-700' :
              'bg-purple-50 text-purple-700'
            }`}>
              {center.serviceType}
            </div>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/50 to-transparent border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <ApartmentOutlined className="text-blue-600 text-lg" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('details.serviceType')}</p>
                <p className="text-base font-bold text-gray-900">{center.serviceType}</p>
              </div>
            </div>
          </div>

          {center.serviceDetail && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-transparent border border-indigo-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <ApartmentOutlined className="text-indigo-600 text-lg" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('form.centerType')}</p>
                  <p className="text-base font-bold text-gray-900">
                    {center.serviceDetail === 'سياحة' ? t('centerTypes.tourism') : center.serviceDetail === 'بعثة' ? t('centerTypes.mission') : center.serviceDetail}
                  </p>
                </div>
              </div>
            </div>
          )}

          {center.missionNationality && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50/50 to-transparent border border-teal-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                  <IdcardOutlined className="text-teal-600 text-lg" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('form.nationality')}</p>
                  <p className="text-base font-bold text-gray-900">{center.missionNationality}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50/50 to-transparent border border-green-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TeamOutlined className="text-green-600 text-lg" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('details.capacity')}</p>
                <p className="text-base font-bold text-gray-900">{center.capacity.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/50 to-transparent border border-amber-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <CheckCircleOutlined className="text-amber-600 text-lg" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('centers.status')}</p>
                <p className="text-base font-bold text-gray-900">
                  {center.status === 'active' ? t('centers.active') : t('centers.inactive')}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 p-4 rounded-xl bg-gradient-to-br from-purple-50/50 to-transparent border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <EnvironmentOutlined className="text-purple-600 text-lg" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('details.locations')}</p>
                <div className="space-y-2">
                  {center.locations.mecca && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">{t('form.mecca')}:</p>
                      {center.locations.meccaUrl ? (
                        <a href={center.locations.meccaUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 underline break-all">
                          {center.locations.meccaUrl}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-500">{t('details.notSpecified')}</p>
                      )}
                    </div>
                  )}
                  {center.locations.mina && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">{t('form.mina')}:</p>
                      {center.locations.minaUrls && center.locations.minaUrls.length > 0 ? (
                        <div className="space-y-1">
                          {center.locations.minaUrls.map((url, idx) => (
                            <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-800 underline break-all">
                              {url}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">{t('details.notSpecified')}</p>
                      )}
                    </div>
                  )}
                  {center.locations.arafat && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">{t('form.arafat')}:</p>
                      {center.locations.arafatUrls && center.locations.arafatUrls.length > 0 ? (
                        <div className="space-y-1">
                          {center.locations.arafatUrls.map((url, idx) => (
                            <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-800 underline break-all">
                              {url}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">{t('details.notSpecified')}</p>
                      )}
                    </div>
                  )}
                  {center.locations.muzdalifah && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">{t('form.muzdalifah')}:</p>
                      {center.locations.muzdalifahUrls && center.locations.muzdalifahUrls.length > 0 ? (
                        <div className="space-y-1">
                          {center.locations.muzdalifahUrls.map((url, idx) => (
                            <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:text-blue-800 underline break-all">
                              {url}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">{t('details.notSpecified')}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* المسؤول */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('details.responsible')}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-mainColor/10 flex items-center justify-center">
              <UserOutlined className="text-mainColor text-lg" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">{t('details.name')}</p>
              <p className="text-sm font-bold text-gray-900">{center.responsible.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-mainColor/10 flex items-center justify-center">
              <MailOutlined className="text-mainColor text-lg" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">{t('details.email')}</p>
              <p className="text-sm font-bold text-gray-900">{center.responsible.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-mainColor/10 flex items-center justify-center">
              <PhoneOutlined className="text-mainColor text-lg" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">{t('details.mobile')}</p>
              <p className="text-sm font-bold text-gray-900">{center.responsible.mobile}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-mainColor/10 flex items-center justify-center">
              <IdcardOutlined className="text-mainColor text-lg" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">{t('details.bravoCode')}</p>
              <p className="text-sm font-bold text-gray-900">{center.responsible.bravoCode}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-mainColor/10 flex items-center justify-center">
              <UserOutlined className="text-mainColor text-lg" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">{t('labels.age')}</p>
              <p className="text-sm font-bold text-gray-900">{center.responsible.age || t('details.notSpecified')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-mainColor/10 flex items-center justify-center">
              <IdcardOutlined className="text-mainColor text-lg" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">{t('labels.hawiya')}</p>
              <p className="text-sm font-bold text-gray-900">{center.responsible.hawiya || t('details.notSpecified')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-mainColor/10 flex items-center justify-center">
              <UserOutlined className="text-mainColor text-lg" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">{t('labels.deputy')}</p>
              <p className="text-sm font-bold text-gray-900">{center.responsible.deputy || t('details.notSpecified')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* الأعضاء */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('details.members')}</h4>
        </div>
        {center.members.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <TeamOutlined className="text-3xl text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">{t('details.noMembers')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {center.members.map((member: Member) => (
              <div
                key={member.id}
                className="px-3 py-2 rounded-lg bg-gradient-to-br from-mainColor/5 to-primary/5 border border-mainColor/20 cursor-pointer hover:border-mainColor/40 hover:shadow-sm transition-all duration-200 group"
                onClick={() => setSelectedMember(member)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-mainColor bg-mainColor/10 px-2 py-0.5 rounded">
                    {translateSection(member.section)}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 flex-1 truncate">{member.name || t('details.notSpecified')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* زر تعديل */}
      <footer className="pt-4">
        <button 
          className="w-full px-6 py-3.5 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold"
          onClick={onEdit}
        >
          <EditOutlined className="text-lg" />
          <span>{t('details.edit')}</span>
        </button>
      </footer>

      {/* مودال تفاصيل العضو */}
      {selectedMember && (
        <MemberDetails
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
};
