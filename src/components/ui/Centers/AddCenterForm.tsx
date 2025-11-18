import React, { useState, useMemo } from 'react';
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
  PlusOutlined,
  DeleteOutlined,
  CloseOutlined,
  SaveOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import type { Center, Member } from '../../../data/mockCenters';
import { generateId, buildDefaultMembers, getResponsibleLabels } from '../../../utils';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

// Helper to normalize section values (convert old Arabic to keys)
const normalizeSection = (section: string): string => {
  const sectionMap: Record<string, string> = {
    'قسم الاستقبال': 'reception',
    'قسم الإسكان': 'housing',
    'الخدمات الميدانية': 'fieldServices'
  };
  return sectionMap[section] || section;
};

// Helper to normalize serviceDetail values (convert old Arabic to keys)
const normalizeServiceDetail = (detail: string | undefined): '' | 'tourism' | 'mission' => {
  if (!detail) return '';
  const detailMap: Record<string, '' | 'tourism' | 'mission'> = {
    'سياحة': 'tourism',
    'بعثة': 'mission'
  };
  return detailMap[detail] || (detail as '' | 'tourism' | 'mission');
};

interface AddCenterFormProps {
  initialData?: Center;
  onCancel: () => void;
  onSubmit: (center: Center) => void;
}

type FormState = {
  number: string;
  serviceType: 'B2B' | 'B2C' | 'B2G';
  serviceDetail: '' | 'tourism' | 'mission';
  missionNationality: string;
  capacity: number;
  status: 'active' | 'inactive';
  responsible: {
    name: string;
    email: string;
    mobile: string;
    age: string;
    bravoCode: string;
    hawiya: string;
    deputy: string;
  };
  locations: {
    mecca: string;
    mina: string[];
    arafat: string[];
    muzdalifah: string[];
  };
};

export const AddCenterForm: React.FC<AddCenterFormProps> = ({
  initialData,
  onCancel,
  onSubmit
}) => {
  const { t } = useTranslation('common');
  const [form, setForm] = useState<FormState>({
    number: initialData?.number ?? '',
    serviceType: initialData?.serviceType ?? 'B2B',
    serviceDetail: normalizeServiceDetail(initialData?.serviceDetail),
    missionNationality: initialData?.missionNationality ?? '',
    capacity: initialData?.capacity ?? 0,
    status: initialData?.status ?? 'active',
    responsible: initialData?.responsible ?? {
      name: '',
      email: '',
      mobile: '',
      age: '',
      bravoCode: '',
      hawiya: '',
      deputy: ''
    },
    locations: initialData?.locations ? {
      mecca: initialData.locations.meccaUrl || '',
      mina: initialData.locations.minaUrls || initialData.locations.customMinaSites || [],
      arafat: initialData.locations.arafatUrls || [],
      muzdalifah: initialData.locations.muzdalifahUrls || []
    } : {
      mecca: '',
      mina: [],
      arafat: [],
      muzdalifah: []
    }
  });

  // Normalize members sections when loading initial data
  const normalizedMembers = useMemo(() => {
    if (!initialData?.members.length) return buildDefaultMembers();
    return initialData.members.map(m => ({
      ...m,
      section: normalizeSection(m.section)
    }));
  }, [initialData]);

  const [members, setMembers] = useState<Member[]>(normalizedMembers);

  const [minaInput, setMinaInput] = useState('');
  const [arafatInput, setArafatInput] = useState('');
  const [muzdalifahInput, setMuzdalifahInput] = useState('');

  // Delete confirmation states
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'site' | 'member';
    data: { site?: string; key?: 'mina' | 'arafat' | 'muzdalifah'; memberId?: string };
  } | null>(null);

  // تحديث الحقول العامة
  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateResponsible = (key: keyof typeof form.responsible, value: string) => {
    setForm(prev => ({
      ...prev,
      responsible: { ...prev.responsible, [key]: value }
    }));
  };

  // إضافة مواقع متعددة
  const addSite = (site: string, key: 'mina' | 'arafat' | 'muzdalifah') => {
    if (!site.trim()) return;
    setForm(prev => ({
      ...prev,
      locations: {
        ...prev.locations,
        [key]: [...prev.locations[key], site.trim()]
      }
    }));
  };

  const removeSite = (site: string, key: 'mina' | 'arafat' | 'muzdalifah') => {
    setDeleteConfirm({ type: 'site', data: { site, key } });
  };

  const handleConfirmDeleteSite = () => {
    if (deleteConfirm?.type === 'site' && deleteConfirm.data.site && deleteConfirm.data.key) {
      setForm(prev => ({
        ...prev,
        locations: {
          ...prev.locations,
          [deleteConfirm.data.key!]: prev.locations[deleteConfirm.data.key!].filter(s => s !== deleteConfirm.data.site)
        }
      }));
    }
    setDeleteConfirm(null);
  };

  // إدارة الأعضاء
  const addMember = () => {
    setMembers([...members, { id: generateId(), section: 'reception', name: '', phone: '', email: '', bravoCode: '', hawiya: '' }]);
  };

  const updateMember = (id: string, field: keyof Member, value: string) => {
    setMembers(members.map(m => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const removeMember = (id: string) => {
    setDeleteConfirm({ type: 'member', data: { memberId: id } });
  };

  const handleConfirmDeleteMember = () => {
    if (deleteConfirm?.type === 'member' && deleteConfirm.data.memberId) {
      setMembers(members.filter(m => m.id !== deleteConfirm.data.memberId));
    }
    setDeleteConfirm(null);
  };

  // Convert serviceDetail keys back to Arabic values for Center interface compatibility
  const convertServiceDetailToArabic = (detail: '' | 'tourism' | 'mission'): '' | 'سياحة' | 'بعثة' => {
    if (detail === 'tourism') return 'سياحة';
    if (detail === 'mission') return 'بعثة';
    return '';
  };

  // إرسال الفورم
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newCenter: Center = {
      id: initialData?.id ?? `C-${Date.now()}`,
      number: form.number,
      serviceType: form.serviceType,
      serviceDetail: convertServiceDetailToArabic(form.serviceDetail),
      missionNationality: form.missionNationality,
      capacity: form.capacity,
      locations: {
        mecca: form.locations.mecca.length > 0,
        mina: form.locations.mina.length > 0,
        arafat: form.locations.arafat.length > 0,
        muzdalifah: form.locations.muzdalifah.length > 0,
        customMinaSites: form.locations.mina,
        meccaUrl: form.locations.mecca || undefined,
        minaUrls: form.locations.mina.length > 0 ? form.locations.mina : undefined,
        arafatUrls: form.locations.arafat.length > 0 ? form.locations.arafat : undefined,
        muzdalifahUrls: form.locations.muzdalifah.length > 0 ? form.locations.muzdalifah : undefined
      },
      responsible: form.responsible,
      members,
      createdAt: initialData?.createdAt ?? '',
      status: form.status
    };
    onSubmit(newCenter);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Row 1: Center Data and Responsible */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* بيانات المركز */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('form.centerData')}</h4>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <NumberOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('form.centerNumber')}</span>
            </div>
            <input
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              value={form.number}
              onChange={e => updateField('number', e.target.value)}
              required
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <ApartmentOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('form.serviceType')}</span>
            </div>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
              value={form.serviceType}
              onChange={e => updateField('serviceType', e.target.value as Center['serviceType'])}
            >
              <option value="B2B">{t('serviceTypes.b2b')}</option>
              <option value="B2C">{t('serviceTypes.b2c')}</option>
              <option value="B2G">{t('serviceTypes.b2g')}</option>
            </select>
          </label>

          {/* تظهر فقط للـ B2B */}
          {form.serviceType === 'B2B' && (
            <>
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <ApartmentOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('form.centerType')}</span>
                </div>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
                  value={form.serviceDetail}
                  onChange={e => updateField('serviceDetail', e.target.value as '' | 'tourism' | 'mission')}
                >
                  <option value="">{t('form.selectType')}</option>
                  <option value="tourism">{t('centerTypes.tourism')}</option>
                  <option value="mission">{t('centerTypes.mission')}</option>
                </select>
              </label>

              {/* تظهر فقط إذا اختار بعثة */}
              {form.serviceDetail === 'mission' && (
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <IdcardOutlined className="text-mainColor text-base" />
                    <span className="block text-sm font-semibold text-gray-700">{t('form.nationality')}</span>
                  </div>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
                    value={form.missionNationality || ''}
                    onChange={e => setForm(prev => ({ ...prev, missionNationality: e.target.value }))}
                  >
                    <option value="">{t('form.selectNationality')}</option>
                    <option value="السعودية">{t('nationalities.saudi')}</option>
                    <option value="مصرية">{t('nationalities.egyptian')}</option>
                    <option value="أردنية">{t('nationalities.jordanian')}</option>
                    <option value="لبنانية">{t('nationalities.lebanese')}</option>
                    <option value="سورية">{t('nationalities.syrian')}</option>
                    <option value="عراقية">{t('nationalities.iraqi')}</option>
                    <option value="يمنية">{t('nationalities.yemeni')}</option>
                    <option value="تونسية">{t('nationalities.tunisian')}</option>
                    <option value="مغربية">{t('nationalities.moroccan')}</option>
                    <option value="جزائرية">{t('nationalities.algerian')}</option>
                    <option value="باكستانية">{t('nationalities.pakistani')}</option>
                    <option value="هندية">{t('nationalities.indian')}</option>
                    <option value="بنغلاديشية">{t('nationalities.bangladeshi')}</option>
                    <option value="تركية">{t('nationalities.turkish')}</option>
                    <option value="إندونيسية">{t('nationalities.indonesian')}</option>
                    <option value="ماليزية">{t('nationalities.malaysian')}</option>
                    <option value="فلسطينية">{t('nationalities.palestinian')}</option>
                    <option value="أخرى">{t('nationalities.other')}</option>
                  </select>
                </label>
              )}
            </>
          )}

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <TeamOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('form.capacity')}</span>
            </div>
            <input
              type="number"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              value={form.capacity}
              onChange={e => updateField('capacity', Number(e.target.value))}
            />
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleOutlined className="text-mainColor text-base" />
              <span className="block text-sm font-semibold text-gray-700">{t('form.status')}</span>
            </div>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
              value={form.status}
              onChange={e => updateField('status', e.target.value as 'active' | 'inactive')}
            >
              <option value="active">{t('centers.active')}</option>
              <option value="inactive">{t('centers.inactive')}</option>
            </select>
          </label>
        </div>
      </section>

      {/* المسؤول */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('form.responsible')}</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(['name', 'email', 'mobile', 'age', 'bravoCode', 'hawiya', 'deputy'] as const).map(field => {
            const iconMap: Record<string, React.ReactNode> = {
              name: <UserOutlined className="text-mainColor text-base" />,
              email: <MailOutlined className="text-mainColor text-base" />,
              mobile: <PhoneOutlined className="text-mainColor text-base" />,
              age: <UserOutlined className="text-mainColor text-base" />,
              bravoCode: <IdcardOutlined className="text-mainColor text-base" />,
              hawiya: <IdcardOutlined className="text-mainColor text-base" />,
              deputy: <UserOutlined className="text-mainColor text-base" />
            };
            return (
              <label key={field} className="block">
                <div className="flex items-center gap-2 mb-2">
                  {iconMap[field]}
                  <span className="block text-sm font-semibold text-gray-700">{getResponsibleLabels()[field]}</span>
                </div>
                <input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  placeholder={t(`placeholders.${field}`)}
                  value={form.responsible[field]}
                  onChange={e => updateResponsible(field, e.target.value)}
                />
              </label>
            );
          })}
        </div>
      </section>
      </div>

      {/* Row 2: Locations and Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* المواقع */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h4 className="text-xl font-bold text-gray-900">{t('form.locations')}</h4>
        </div>
        <div className="grid grid-cols-1 gap-6">

        {/* مكة */}
        <div className="space-y-4">
        <label className="block">
          <div className="flex items-center gap-2 mb-2">
            <EnvironmentOutlined className="text-mainColor text-base" />
            <span className="block text-sm font-semibold text-gray-700">{t('form.meccaSingleLink')}</span>
          </div>
          <input
            type="url"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
            value={form.locations.mecca}
            onChange={e => setForm(prev => ({ ...prev, locations: { ...prev.locations, mecca: e.target.value } }))}
          />
        </label>
        </div>

        {/* منى */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <EnvironmentOutlined className="text-mainColor text-base" />
            <span className="block text-sm font-semibold text-gray-700">{t('form.minaSites')}</span>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="url"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              value={minaInput}
              onChange={e => setMinaInput(e.target.value)}
              placeholder={t('form.googleMapsLink')}
            />
            <button 
              type="button" 
              className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-md shadow-mainColor/20 hover:shadow-lg font-semibold flex items-center gap-2"
              onClick={() => { addSite(minaInput, 'mina'); setMinaInput(''); }}
            >
              <PlusOutlined />
              {t('form.add')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.locations.mina.map(site => (
              <span 
                key={site} 
                className="px-4 py-2 bg-gradient-to-r from-mainColor/10 to-primary/10 text-mainColor rounded-xl text-sm cursor-pointer hover:from-mainColor/20 hover:to-primary/20 transition-all duration-200 border-2 border-mainColor/20 hover:border-mainColor/40 font-medium flex items-center gap-2"
                onClick={() => removeSite(site, 'mina')}
              >
                {site}
                <DeleteOutlined className="text-xs" />
              </span>
            ))}
          </div>
        </div>

        {/* عرفات */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <EnvironmentOutlined className="text-mainColor text-base" />
            <span className="block text-sm font-semibold text-gray-700">{t('form.arafatSites')}</span>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="url"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              value={arafatInput}
              onChange={e => setArafatInput(e.target.value)}
              placeholder={t('form.googleMapsLink')}
            />
            <button 
              type="button" 
              className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-md shadow-mainColor/20 hover:shadow-lg font-semibold flex items-center gap-2"
              onClick={() => { addSite(arafatInput, 'arafat'); setArafatInput(''); }}
            >
              <PlusOutlined />
              {t('form.add')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.locations.arafat.map(site => (
              <span 
                key={site} 
                className="px-4 py-2 bg-gradient-to-r from-mainColor/10 to-primary/10 text-mainColor rounded-xl text-sm cursor-pointer hover:from-mainColor/20 hover:to-primary/20 transition-all duration-200 border-2 border-mainColor/20 hover:border-mainColor/40 font-medium flex items-center gap-2"
                onClick={() => removeSite(site, 'arafat')}
              >
                {site}
                <DeleteOutlined className="text-xs" />
              </span>
            ))}
          </div>
        </div>

        {/* مزدلفة */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <EnvironmentOutlined className="text-mainColor text-base" />
            <span className="block text-sm font-semibold text-gray-700">{t('form.muzdalifahSites')}</span>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="url"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
              value={muzdalifahInput}
              onChange={e => setMuzdalifahInput(e.target.value)}
              placeholder={t('form.googleMapsLink')}
            />
            <button 
              type="button" 
              className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-md shadow-mainColor/20 hover:shadow-lg font-semibold flex items-center gap-2"
              onClick={() => { addSite(muzdalifahInput, 'muzdalifah'); setMuzdalifahInput(''); }}
            >
              <PlusOutlined />
              {t('form.add')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.locations.muzdalifah.map(site => (
              <span 
                key={site} 
                className="px-4 py-2 bg-gradient-to-r from-mainColor/10 to-primary/10 text-mainColor rounded-xl text-sm cursor-pointer hover:from-mainColor/20 hover:to-primary/20 transition-all duration-200 border-2 border-mainColor/20 hover:border-mainColor/40 font-medium flex items-center gap-2"
                onClick={() => removeSite(site, 'muzdalifah')}
              >
                {site}
                <DeleteOutlined className="text-xs" />
              </span>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* الأعضاء */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h4 className="text-xl font-bold text-gray-900">{t('form.members')}</h4>
          </div>
          <button 
            type="button" 
            className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-md shadow-mainColor/20 hover:shadow-lg font-semibold flex items-center gap-2"
            onClick={addMember}
          >
            <PlusOutlined />
            {t('form.addMember')}
          </button>
        </header>
        <div className="space-y-4">
          {members.map(member => (
            <div key={member.id} className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-mainColor/30 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <label className="block flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ApartmentOutlined className="text-mainColor text-sm" />
                    <span className="block text-sm font-semibold text-gray-700">{t('form.section')}</span>
                  </div>
                  <select
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium text-sm"
                    value={member.section}
                    onChange={e => updateMember(member.id, 'section', e.target.value)}
                  >
                    <option value="reception">{t('sections.reception')}</option>
                    <option value="housing">{t('sections.housing')}</option>
                    <option value="fieldServices">{t('sections.fieldServices')}</option>
                  </select>
                </label>
                <button 
                  type="button" 
                  className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold flex items-center gap-2 ml-4 self-end"
                  onClick={() => removeMember(member.id)}
                >
                  <DeleteOutlined />
                  {t('form.remove')}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <UserOutlined className="text-mainColor text-sm" />
                    <span className="block text-sm font-semibold text-gray-700">{t('form.name')}</span>
                  </div>
                  <input 
                    value={member.name} 
                    onChange={e => updateMember(member.id, 'name', e.target.value)} 
                    placeholder={t('placeholders.name')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700" 
                  />
                </label>
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <MailOutlined className="text-mainColor text-sm" />
                    <span className="block text-sm font-semibold text-gray-700">{t('form.email')}</span>
                  </div>
                  <input 
                    value={member.email || ''} 
                    onChange={e => updateMember(member.id, 'email', e.target.value)} 
                    placeholder={t('placeholders.email')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700" 
                  />
                </label>
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <PhoneOutlined className="text-mainColor text-sm" />
                    <span className="block text-sm font-semibold text-gray-700">{t('form.phone')}</span>
                  </div>
                  <input 
                    value={member.phone || ''} 
                    onChange={e => updateMember(member.id, 'phone', e.target.value)} 
                    placeholder={t('placeholders.phone')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700" 
                  />
                </label>
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <IdcardOutlined className="text-mainColor text-sm" />
                    <span className="block text-sm font-semibold text-gray-700">{t('form.bravoCode')}</span>
                  </div>
                  <input 
                    value={member.bravoCode || ''} 
                    onChange={e => updateMember(member.id, 'bravoCode', e.target.value)} 
                    placeholder={t('placeholders.bravoCode')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700" 
                  />
                </label>
                <label className="block md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <IdcardOutlined className="text-mainColor text-sm" />
                    <span className="block text-sm font-semibold text-gray-700">{t('form.hawiya')}</span>
                  </div>
                  <input 
                    value={member.hawiya || ''} 
                    onChange={e => updateMember(member.id, 'hawiya', e.target.value)} 
                    placeholder={t('placeholders.hawiya')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700" 
                  />
                </label>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <TeamOutlined className="text-3xl text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500">{t('form.noMembers')}</p>
            </div>
          )}
        </div>
      </section>
      </div>

      {/* أزرار الإغلاق والإرسال */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button 
          type="button" 
          onClick={onCancel} 
          className="flex-1 px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
        >
          <CloseOutlined />
          {t('form.close')}
        </button>
        <button 
          type="submit" 
          className="flex-1 px-6 py-3.5 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center justify-center gap-2"
        >
          <SaveOutlined />
          {initialData ? t('form.saveChanges') : t('form.addCenter')}
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={deleteConfirm?.type === 'site' ? handleConfirmDeleteSite : handleConfirmDeleteMember}
        message={
          deleteConfirm?.type === 'site' 
            ? t('form.confirmDeleteSite')
            : deleteConfirm?.type === 'member'
            ? t('form.confirmDeleteMember')
            : undefined
        }
      />
    </form>
  );
};
