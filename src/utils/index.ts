import i18n from '../i18n';
import type { Center, Member } from '../data/mockCenters';

export const generateId = (): string => {
  return `M-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const buildDefaultMembers = (): Member[] => {
  return [
    {
      id: generateId(),
      section: 'reception', // Store as key, not translated string
      name: '',
      role: '',
      phone: '',
      email: '',
      bravoCode: '',
      hawiya: ''
    }
  ];
};

// Helper function to translate section names
// Handles both old Arabic values and new key-based values
export const translateSection = (section: string): string => {
  // Map old Arabic values to keys
  const sectionMap: Record<string, string> = {
    'قسم الاستقبال': 'reception',
    'قسم الإسكان': 'housing',
    'الخدمات الميدانية': 'fieldServices'
  };
  
  // If it's an old Arabic value, convert to key first
  const key = sectionMap[section] || section;
  
  // Translate the key
  const translations: Record<string, string> = {
    'reception': i18n.t('sections.reception'),
    'housing': i18n.t('sections.housing'),
    'fieldServices': i18n.t('sections.fieldServices')
  };
  
  return translations[key] || section; // Fallback to original if not found
};

export const getResponsibleLabels = (): Record<string, string> => {
  return {
    name: i18n.t('labels.name'),
    email: i18n.t('labels.email'),
    mobile: i18n.t('labels.mobile'),
    age: i18n.t('labels.age'),
    bravoCode: i18n.t('labels.bravoCode'),
    hawiya: i18n.t('labels.hawiya'),
    deputy: i18n.t('labels.deputy')
  };
};

// Keep for backward compatibility
export const responsibleLabels: Record<string, string> = {
  name: 'الاسم',
  email: 'البريد الإلكتروني',
  mobile: 'الجوال',
  age: 'العمر',
  bravoCode: 'رمز البرافو',
  hawiya: 'الهوية',
  deputy: 'النائب'
};

export const locationLabels: Record<string, string> = {
  mecca: 'مكة',
  mina: 'منى',
  arafat: 'عرفات',
  muzdalifah: 'مزدلفة'
};

export const renderLocations = (locations: Center['locations']): string => {
  const activeLocations: string[] = [];
  
  if (locations.mecca) activeLocations.push(i18n.t('locations.mecca'));
  if (locations.mina) activeLocations.push(i18n.t('locations.mina'));
  if (locations.arafat) activeLocations.push(i18n.t('locations.arafat'));
  if (locations.muzdalifah) activeLocations.push(i18n.t('locations.muzdalifah'));
  
  if (locations.customMinaSites && locations.customMinaSites.length > 0) {
    activeLocations.push(`${i18n.t('locations.mina')} (${locations.customMinaSites.join(', ')})`);
  }
  
  return activeLocations.length > 0 ? activeLocations.join(', ') : i18n.t('locations.noLocations');
};

