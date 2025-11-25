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
    'الاستقبال': 'reception',
    'الإسكان': 'housing',
    'الخدمات الميدانية': 'fieldServices',
    'الجوازات': 'passports',
    'النقل': 'transport',
    'المشاعر': 'holySites',
    'الشؤون العامة': 'publicAffairs',
    'التفويج': 'guidance'
  };
  
  // If it's an old Arabic value, convert to key first
  const key = sectionMap[section] || section;
  
  // Translate the key
  const translations: Record<string, string> = {
    'reception': i18n.t('sections.reception'),
    'housing': i18n.t('sections.housing'),
    'fieldServices': i18n.t('sections.fieldServices'),
    'passports': i18n.t('sections.passports'),
    'transport': i18n.t('sections.transport'),
    'holySites': i18n.t('sections.holySites'),
    'publicAffairs': i18n.t('sections.publicAffairs'),
    'guidance': i18n.t('sections.guidance')
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

// Helper functions for translating employee data
export const translateNationality = (nationality: string): string => {
  // Map Arabic values to keys
  const nationalityMap: Record<string, string> = {
    'السعودية': 'saudi',
    'مصرية': 'egyptian',
    'أردنية': 'jordanian',
    'لبنانية': 'lebanese',
    'سورية': 'syrian',
    'عراقية': 'iraqi',
    'يمنية': 'yemeni',
    'تونسية': 'tunisian',
    'مغربية': 'moroccan',
    'جزائرية': 'algerian',
    'باكستانية': 'pakistani',
    'هندية': 'indian',
    'بنغلاديشية': 'bangladeshi',
    'تركية': 'turkish',
    'إندونيسية': 'indonesian',
    'ماليزية': 'malaysian',
    'فلسطينية': 'palestinian',
    'أخرى': 'other'
  };
  
  const key = nationalityMap[nationality] || nationality.toLowerCase().replace(/\s+/g, '');
  return i18n.t(`nationalities.${key}`, { defaultValue: nationality });
};

export const translateDepartment = (department: string): string => {
  const departmentMap: Record<string, string> = {
    'Transport': 'transport',
    'Reception': 'reception',
    'Accommodation': 'accommodation',
    'Field Services': 'fieldServices',
    'Other': 'other'
  };
  
  const key = departmentMap[department] || department;
  return i18n.t(`hr.departments.${key}`, { defaultValue: department });
};

export const translateJobRank = (jobRank: string): string => {
  const jobRankMap: Record<string, string> = {
    'Field': 'field',
    'Supervisor': 'supervisor',
    'Department Head': 'departmentHead'
  };
  
  const key = jobRankMap[jobRank] || jobRank;
  return i18n.t(`hr.form.${key}`, { defaultValue: jobRank });
};

export const translateShiftPeriod = (shiftPeriod: string): string => {
  const shiftMap: Record<string, string> = {
    'First': 'firstShift',
    'Second': 'secondShift',
    'Third': 'thirdShift'
  };
  
  const key = shiftMap[shiftPeriod] || shiftPeriod;
  return i18n.t(`hr.form.${key}`, { defaultValue: shiftPeriod });
};

// Helper function to translate employee names
export const translateEmployeeName = (name: string, employeeId?: string): string => {
  // Map Arabic names to translation keys based on employee ID
  const nameMap: Record<string, string> = {
    'موظف 1': 'E-1',
    'موظف 2': 'E-2',
    'موظف 3': 'E-3',
    'موظف 4': 'E-4',
    'موظف 5': 'E-5',
    'موظف 6': 'E-6'
  };
  
  const id = employeeId || nameMap[name];
  if (id) {
    try {
      // Normalize language code (e.g., 'en-US' -> 'en')
      const currentLang = (i18n.language || 'ar').split('-')[0];
      
      // Try to get translation using getResourceBundle
      const resources = i18n.getResourceBundle(currentLang, 'common');
      if (resources?.hr?.employeeData?.[id]?.name) {
        const translated = resources.hr.employeeData[id].name;
        if (typeof translated === 'string' && translated.trim() !== '') {
          return translated;
        }
      }
      
      // Fallback: try with i18n.t() but check if result is string
      const translatedByT = i18n.t(`hr.employeeData.${id}.name`, { 
        defaultValue: name,
        returnObjects: false 
      });
      if (typeof translatedByT === 'string' && translatedByT !== `hr.employeeData.${id}.name` && translatedByT.trim() !== '') {
        return translatedByT;
      }
      
      // Final fallback to default language (ar)
      if (currentLang !== 'ar') {
        const fallbackResources = i18n.getResourceBundle('ar', 'common');
        if (fallbackResources?.hr?.employeeData?.[id]?.name) {
          const fallbackTranslated = fallbackResources.hr.employeeData[id].name;
          if (typeof fallbackTranslated === 'string' && fallbackTranslated.trim() !== '') {
            return fallbackTranslated;
          }
        }
      }
    } catch (error) {
      // If translation fails, return original name
      console.warn(`Translation failed for employee ${id}:`, error);
    }
  }
  return name;
};

// Helper function to translate tasks
export const translateTask = (task: string, employeeId?: string, taskType?: 'main' | 'additional', taskIndex?: number): string => {
  // Map Arabic tasks to translation keys
  const taskMap: Record<string, { id: string; type: 'main' | 'additional'; index: number }> = {
    'استقبال الحجاج': { id: 'E-1', type: 'main', index: 0 },
    'تنظيم الجدول الزمني': { id: 'E-1', type: 'main', index: 1 },
    'التنسيق مع الفرق': { id: 'E-1', type: 'main', index: 2 },
    'مساعدة في حالات الطوارئ': { id: 'E-1', type: 'additional', index: 0 },
    'تدريب الموظفين الجدد': { id: 'E-1', type: 'additional', index: 1 },
    'إدارة الإسكان': { id: 'E-2', type: 'main', index: 0 },
    'تنسيق المواعيد': { id: 'E-2', type: 'main', index: 1 },
    'الرد على الاستفسارات': { id: 'E-2', type: 'additional', index: 0 },
    'الخدمات الميدانية': { id: 'E-3', type: 'main', index: 0 },
    'التنسيق مع المراكز': { id: 'E-3', type: 'main', index: 1 },
    'تسجيل البيانات': { id: 'E-3', type: 'additional', index: 0 },
    'متابعة الحجاج': { id: 'E-3', type: 'additional', index: 1 },
    'استقبال العملاء': { id: 'E-4', type: 'main', index: 0 },
    'تسجيل الدخول': { id: 'E-4', type: 'main', index: 1 },
    'إدارة الفريق': { id: 'E-5', type: 'main', index: 0 },
    'التنسيق العام': { id: 'E-5', type: 'main', index: 1 },
    'حل المشاكل': { id: 'E-5', type: 'main', index: 2 },
    'التدريب': { id: 'E-5', type: 'additional', index: 0 },
    'التقييم': { id: 'E-5', type: 'additional', index: 1 },
    'قيادة المركبات': { id: 'E-6', type: 'main', index: 0 },
    'توصيل الحجاج': { id: 'E-6', type: 'main', index: 1 },
    'صيانة المركبات': { id: 'E-6', type: 'additional', index: 0 }
  };
  
  const taskInfo = employeeId && taskType !== undefined && taskIndex !== undefined
    ? { id: employeeId, type: taskType, index: taskIndex }
    : taskMap[task];
  
  if (taskInfo) {
    const taskKey = taskInfo.type === 'main' ? 'mainTasks' : 'additionalTasks';
    try {
      // Normalize language code (e.g., 'en-US' -> 'en')
      const currentLang = (i18n.language || 'ar').split('-')[0];
      
      // Try to get translation using getResourceBundle
      const resources = i18n.getResourceBundle(currentLang, 'common');
      if (resources?.hr?.employeeData?.[taskInfo.id]?.[taskKey]?.[String(taskInfo.index)]) {
        const translated = resources.hr.employeeData[taskInfo.id][taskKey][String(taskInfo.index)];
        if (typeof translated === 'string' && translated.trim() !== '') {
          return translated;
        }
      }
      
      // Fallback: try with i18n.t() but check if result is string
      const translatedByT = i18n.t(`hr.employeeData.${taskInfo.id}.${taskKey}.${taskInfo.index}`, { 
        defaultValue: task,
        returnObjects: false 
      });
      if (typeof translatedByT === 'string' && translatedByT !== `hr.employeeData.${taskInfo.id}.${taskKey}.${taskInfo.index}` && translatedByT.trim() !== '') {
        return translatedByT;
      }
      
      // Final fallback to default language (ar)
      if (currentLang !== 'ar') {
        const fallbackResources = i18n.getResourceBundle('ar', 'common');
        if (fallbackResources?.hr?.employeeData?.[taskInfo.id]?.[taskKey]?.[String(taskInfo.index)]) {
          const fallbackTranslated = fallbackResources.hr.employeeData[taskInfo.id][taskKey][String(taskInfo.index)];
          if (typeof fallbackTranslated === 'string' && fallbackTranslated.trim() !== '') {
            return fallbackTranslated;
          }
        }
      }
    } catch (error) {
      // If translation fails, return original task
      console.warn(`Translation failed for task ${taskInfo.id}.${taskKey}.${taskInfo.index}:`, error);
    }
  }
  return task;
};

// Helper function to translate recommendations
export const translateRecommendations = (recommendations: string, employeeId?: string): string => {
  // Map English recommendations to translation keys based on employee ID
  const recommendationsMap: Record<string, string> = {
    'Recommended for Center 001 - Excellent customer service skills': 'E-1',
    'Suitable for VIP centers': 'E-2',
    'Recommended for B2B centers': 'E-3',
    'Ideal for high-capacity centers': 'E-5'
  };
  
  const id = employeeId || recommendationsMap[recommendations];
  if (id) {
    try {
      // Normalize language code (e.g., 'en-US' -> 'en')
      const currentLang = (i18n.language || 'ar').split('-')[0];
      
      // Try to get translation using getResourceBundle
      const resources = i18n.getResourceBundle(currentLang, 'common');
      if (resources?.hr?.employeeData?.[id]?.recommendations) {
        const translated = resources.hr.employeeData[id].recommendations;
        if (typeof translated === 'string' && translated.trim() !== '') {
          return translated;
        }
      }
      
      // Fallback: try with i18n.t() but check if result is string
      const translatedByT = i18n.t(`hr.employeeData.${id}.recommendations`, { 
        defaultValue: recommendations,
        returnObjects: false 
      });
      if (typeof translatedByT === 'string' && translatedByT !== `hr.employeeData.${id}.recommendations` && translatedByT.trim() !== '') {
        return translatedByT;
      }
      
      // Final fallback to default language (ar)
      if (currentLang !== 'ar') {
        const fallbackResources = i18n.getResourceBundle('ar', 'common');
        if (fallbackResources?.hr?.employeeData?.[id]?.recommendations) {
          const fallbackTranslated = fallbackResources.hr.employeeData[id].recommendations;
          if (typeof fallbackTranslated === 'string' && fallbackTranslated.trim() !== '') {
            return fallbackTranslated;
          }
        }
      }
    } catch (error) {
      // If translation fails, return original recommendations
      console.warn(`Translation failed for recommendations ${id}:`, error);
    }
  }
  return recommendations;
};

