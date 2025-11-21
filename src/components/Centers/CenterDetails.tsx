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
import type { Center, Member } from '../../data/mockCenters';
import { renderLocations, translateSection, getResponsibleLabels } from '../../utils';
import { MemberDetails } from './MemberDetails';

interface CenterDetailsProps {
  center: Center;
  onEdit: () => void;
}

export const CenterDetails: React.FC<CenterDetailsProps> = ({ center, onEdit }) => {
  const { t } = useTranslation('common');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <div className="w-full space-y-5">
      {/* Row 1: Center Data and Responsible */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* معلومات المركز */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('form.centerData')}</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <NumberOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('form.centerNumber')}</span>
            </div>
            <div className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-gray-700">
              {center.number}
            </div>
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <ApartmentOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('form.serviceType')}</span>
            </div>
            <div className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-gray-700 font-medium">
              {center.serviceType}
            </div>
          </label>

          {center.serviceDetail && (
            <>
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <ApartmentOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('form.centerType')}</span>
                </div>
                <div className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-gray-700 font-medium">
                  {center.serviceDetail === 'سياحة' ? t('centerTypes.tourism') : center.serviceDetail === 'بعثة' ? t('centerTypes.mission') : center.serviceDetail}
                </div>
              </label>

              {center.serviceDetail === 'بعثة' && center.missionNationality && (
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <IdcardOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('form.nationality')}</span>
                  </div>
                  <div className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-gray-700 font-medium">
                    {center.missionNationality}
                  </div>
                </label>
              )}
            </>
          )}

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <TeamOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('form.capacity')}</span>
            </div>
            <div className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-gray-700">
              {center.capacity.toLocaleString()}
            </div>
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('form.status')}</span>
            </div>
            <div className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-gray-700 font-medium">
              {center.status === 'active' ? t('centers.active') : t('centers.inactive')}
            </div>
          </label>
        </div>
      </section>

      {/* المسؤول */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 border border-gray-100 w-full">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('form.responsible')}</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(['name', 'email', 'mobile', 'age', 'bravoCode', 'hawiya'] as const).map(field => {
            const iconMap: Record<string, React.ReactNode> = {
              name: <UserOutlined className="text-mainColor text-base" />,
              email: <MailOutlined className="text-mainColor text-base" />,
              mobile: <PhoneOutlined className="text-mainColor text-base" />,
              age: <UserOutlined className="text-mainColor text-base" />,
              bravoCode: <IdcardOutlined className="text-mainColor text-base" />,
              hawiya: <IdcardOutlined className="text-mainColor text-base" />
            };
            return (
              <label key={field} className="block">
                <div className="flex items-center gap-2 mb-2">
                  {iconMap[field]}
                  <span className="block text-sm font-semibold text-gray-700">{getResponsibleLabels()[field]}</span>
                </div>
                <div className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-gray-700">
                  {center.responsible[field] || t('details.notSpecified')}
                </div>
              </label>
            );
          })}
        </div>
      </section>
      </div>

      {/* Row 2: First Deputy and Second Deputy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* النائب الأول */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 border border-gray-100 w-full">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('form.firstDeputy')}</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(['name', 'email', 'mobile', 'age', 'bravoCode', 'hawiya'] as const).map(field => {
            const iconMap: Record<string, React.ReactNode> = {
              name: <UserOutlined className="text-mainColor text-base" />,
              email: <MailOutlined className="text-mainColor text-base" />,
              mobile: <PhoneOutlined className="text-mainColor text-base" />,
              age: <UserOutlined className="text-mainColor text-base" />,
              bravoCode: <IdcardOutlined className="text-mainColor text-base" />,
              hawiya: <IdcardOutlined className="text-mainColor text-base" />
            };
            return (
              <label key={field} className="block">
                <div className="flex items-center gap-2 mb-2">
                  {iconMap[field]}
                  <span className="block text-sm font-semibold text-gray-700">{getResponsibleLabels()[field]}</span>
                </div>
                <div className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-gray-700">
                  {center.firstDeputy?.[field] || t('details.notSpecified')}
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* النائب الثاني */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 border border-gray-100 w-full">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('form.secondDeputy')}</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(['name', 'email', 'mobile', 'age', 'bravoCode', 'hawiya'] as const).map(field => {
            const iconMap: Record<string, React.ReactNode> = {
              name: <UserOutlined className="text-mainColor text-base" />,
              email: <MailOutlined className="text-mainColor text-base" />,
              mobile: <PhoneOutlined className="text-mainColor text-base" />,
              age: <UserOutlined className="text-mainColor text-base" />,
              bravoCode: <IdcardOutlined className="text-mainColor text-base" />,
              hawiya: <IdcardOutlined className="text-mainColor text-base" />
            };
            return (
              <label key={field} className="block">
                <div className="flex items-center gap-2 mb-2">
                  {iconMap[field]}
                  <span className="block text-sm font-semibold text-gray-700">{getResponsibleLabels()[field]}</span>
                </div>
                <div className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-gray-700">
                  {center.secondDeputy?.[field] || t('details.notSpecified')}
                </div>
              </label>
            );
          })}
        </div>
      </section>
      </div>

      {/* Row 3: Locations and Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* المواقع */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 border border-gray-100 w-full">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('form.locations')}</h4>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {/* مكة */}
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <EnvironmentOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('form.meccaSingleLink')}</span>
            </div>
            {center.locations.meccaUrl ? (
              <a href={center.locations.meccaUrl} target="_blank" rel="noopener noreferrer" className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-blue-600 hover:text-blue-800 underline break-all block">
                {center.locations.meccaUrl}
              </a>
            ) : (
              <div className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-gray-500">
                {t('details.notSpecified')}
              </div>
            )}
          </label>

          {/* منى */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <EnvironmentOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('form.minaSites')}</span>
            </div>
            {center.locations.minaUrls && center.locations.minaUrls.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {center.locations.minaUrls.map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gradient-to-r from-mainColor/10 to-primary/10 text-mainColor rounded-xl text-sm hover:from-mainColor/20 hover:to-primary/20 transition-all duration-200 border-2 border-mainColor/20 hover:border-mainColor/40 font-medium break-all">
                    {url}
                  </a>
                ))}
              </div>
            ) : (
              <div className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-gray-500">
                {t('details.notSpecified')}
              </div>
            )}
          </div>

          {/* عرفات */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <EnvironmentOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('form.arafatSites')}</span>
            </div>
            {center.locations.arafatUrls && center.locations.arafatUrls.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {center.locations.arafatUrls.map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gradient-to-r from-mainColor/10 to-primary/10 text-mainColor rounded-xl text-sm hover:from-mainColor/20 hover:to-primary/20 transition-all duration-200 border-2 border-mainColor/20 hover:border-mainColor/40 font-medium break-all">
                    {url}
                  </a>
                ))}
              </div>
            ) : (
              <div className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-gray-500">
                {t('details.notSpecified')}
              </div>
            )}
          </div>

          {/* مزدلفة */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <EnvironmentOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('form.muzdalifahSites')}</span>
            </div>
            {center.locations.muzdalifahUrls && center.locations.muzdalifahUrls.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {center.locations.muzdalifahUrls.map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gradient-to-r from-mainColor/10 to-primary/10 text-mainColor rounded-xl text-sm hover:from-mainColor/20 hover:to-primary/20 transition-all duration-200 border-2 border-mainColor/20 hover:border-mainColor/40 font-medium break-all">
                    {url}
                  </a>
                ))}
              </div>
            ) : (
              <div className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white shadow-sm text-gray-500">
                {t('details.notSpecified')}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* الأعضاء */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 border border-gray-100 w-full">
        <header className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h4 className="text-xl font-bold text-gray-900">{t('form.members')}</h4>
          </div>
        </header>
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
      </div>

      {/* زر تعديل */}
      <footer className="pt-2">
        <button 
          className="w-full px-6 py-3 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold"
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
