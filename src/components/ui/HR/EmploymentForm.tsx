import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  IdcardOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  PictureOutlined,
  PrinterOutlined,
  SendOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ApartmentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { Employee } from '../../../data/mockEmployees';
import { translateNationality, translateDepartment, translateJobRank, translateShiftPeriod } from '../../../utils';

interface EmploymentFormProps {
  initialData?: Employee;
  onCancel: () => void;
  onSubmit: (employee: Employee) => void;
}

type FormState = {
  name: string;
  nationality: string;
  idNumber: string;
  gender: 'male' | 'female';
  age: number;
  mobile: string;
  email: string;
  department: 'Transport' | 'Reception' | 'Accommodation' | 'Field Services' | 'Other';
  jobRank: 'Field' | 'Supervisor' | 'Department Head';
  shiftDuration: '8h' | '12h';
  shiftPeriod: 'First' | 'Second' | 'Third';
  contractStartDate: string;
  contractEndDate: string;
  numberOfDays: number;
  seasonalSalary: number;
  dailySalary: number;
  mainTasks: string[];
  additionalTasks: string[];
  recommendations?: string;
  profilePicture?: string;
  employeeCardPrinted: boolean;
  registeredInAjir: boolean;
  nuskCardIssued: boolean;
};

export const EmploymentForm: React.FC<EmploymentFormProps> = ({
  initialData,
  onCancel,
  onSubmit
}) => {
  const { t } = useTranslation('common');
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.profilePicture || null
  );

  const [form, setForm] = useState<FormState>({
    name: initialData?.name || '',
    nationality: initialData?.nationality || '',
    idNumber: initialData?.idNumber || '',
    gender: initialData?.gender || 'male',
    age: initialData?.age || 0,
    mobile: initialData?.mobile || '',
    email: initialData?.email || '',
    department: initialData?.department || 'Reception',
    jobRank: initialData?.jobRank || 'Field',
    shiftDuration: initialData?.shiftDuration || '8h',
    shiftPeriod: initialData?.shiftPeriod || 'First',
    contractStartDate: initialData?.contractStartDate || '',
    contractEndDate: initialData?.contractEndDate || '',
    numberOfDays: initialData?.numberOfDays || 0,
    seasonalSalary: initialData?.seasonalSalary || 0,
    dailySalary: initialData?.dailySalary || 0,
    mainTasks: initialData?.mainTasks || [],
    additionalTasks: initialData?.additionalTasks || [],
    recommendations: initialData?.recommendations || '',
    profilePicture: initialData?.profilePicture,
    employeeCardPrinted: initialData?.employeeCardPrinted || false,
    registeredInAjir: initialData?.registeredInAjir || false,
    nuskCardIssued: initialData?.nuskCardIssued || false
  });

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addTask = (type: 'mainTasks' | 'additionalTasks') => {
    setForm(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const updateTask = (type: 'mainTasks' | 'additionalTasks', index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      [type]: prev[type].map((task, i) => (i === index ? value : task))
    }));
  };

  const removeTask = (type: 'mainTasks' | 'additionalTasks', index: number) => {
    setForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        updateField('profilePicture', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateDays = () => {
    if (form.contractStartDate && form.contractEndDate) {
      const start = new Date(form.contractStartDate);
      const end = new Date(form.contractEndDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      updateField('numberOfDays', diffDays);
    }
  };

  React.useEffect(() => {
    calculateDays();
  }, [form.contractStartDate, form.contractEndDate]);

  const calculateSalaries = () => {
    if (form.numberOfDays > 0 && form.dailySalary > 0) {
      const calculatedSeasonal = form.dailySalary * form.numberOfDays * 0.8;
      updateField('seasonalSalary', Math.round(calculatedSeasonal));
    }
  };

  React.useEffect(() => {
    calculateSalaries();
  }, [form.dailySalary, form.numberOfDays]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmployee: Employee = {
      id: initialData?.id || `E-${Date.now()}`,
      name: form.name,
      nationality: form.nationality,
      idNumber: form.idNumber,
      gender: form.gender,
      age: form.age,
      mobile: form.mobile,
      email: form.email,
      department: form.department,
      jobRank: form.jobRank,
      shiftDuration: form.shiftDuration,
      shiftPeriod: form.shiftPeriod,
      contractStartDate: form.contractStartDate,
      contractEndDate: form.contractEndDate,
      numberOfDays: form.numberOfDays,
      seasonalSalary: form.seasonalSalary,
      dailySalary: form.dailySalary,
      mainTasks: form.mainTasks.filter(t => t.trim() !== ''),
      additionalTasks: form.additionalTasks.filter(t => t.trim() !== ''),
      recommendations: form.recommendations,
      profilePicture: form.profilePicture,
      employeeCardPrinted: form.employeeCardPrinted,
      registeredInAjir: form.registeredInAjir,
      nuskCardIssued: form.nuskCardIssued,
      createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0]
    };
    onSubmit(newEmployee);
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: t('hr.form.step1') },
    { number: 2, title: t('hr.form.step2') },
    { number: 3, title: t('hr.form.step3') },
    { number: 4, title: t('hr.form.step4') },
    { number: 5, title: t('hr.form.step5') }
  ];

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between w-full">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-mainColor to-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircleOutlined />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`ml-2 text-xs font-medium whitespace-nowrap ${
                    currentStep >= step.number ? 'text-mainColor' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 min-w-[30px] ${
                    currentStep > step.number
                      ? 'bg-gradient-to-r from-mainColor to-primary'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div className="space-y-6 mt-6">
          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
              <h4 className="text-xl font-bold text-gray-900">{t('hr.form.personalInfo')}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.name')}</span>
                </div>
                <input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <IdcardOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.nationality')}</span>
                </div>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
                  value={form.nationality}
                  onChange={e => updateField('nationality', e.target.value)}
                  required
                >
                  <option value="">{t('form.selectNationality')}</option>
                  {['السعودية', 'مصرية', 'أردنية', 'لبنانية', 'سورية', 'عراقية', 'يمنية', 'تونسية', 'مغربية', 'جزائرية', 'باكستانية', 'هندية', 'بنغلاديشية', 'تركية', 'إندونيسية', 'ماليزية', 'فلسطينية', 'أخرى'].map(nat => (
                    <option key={nat} value={nat}>{translateNationality(nat)}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <IdcardOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.id')}</span>
                </div>
                <input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={form.idNumber}
                  onChange={e => updateField('idNumber', e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.gender')}</span>
                </div>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
                  value={form.gender}
                  onChange={e => updateField('gender', e.target.value as 'male' | 'female')}
                  required
                >
                  <option value="male">{t('hr.form.male')}</option>
                  <option value="female">{t('hr.form.female')}</option>
                </select>
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.age')}</span>
                </div>
                <input
                  type="number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={form.age || ''}
                  onChange={e => updateField('age', Number(e.target.value))}
                  required
                />
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <PhoneOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.mobile')}</span>
                </div>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={form.mobile}
                  onChange={e => updateField('mobile', e.target.value)}
                  required
                />
              </label>

              <label className="block md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <MailOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.email')}</span>
                </div>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={form.email}
                  onChange={e => updateField('email', e.target.value)}
                  required
                />
              </label>

              {/* Profile Picture Upload */}
              <label className="block md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <PictureOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.profilePicture')}</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-24 h-24 rounded-xl object-cover border-2 border-mainColor/20"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -top-2 -right-2 bg-mainColor text-white rounded-full p-1 hover:bg-primary transition"
                      >
                        <PictureOutlined />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-gradient-to-r from-mainColor/10 to-primary/10 text-mainColor rounded-xl hover:from-mainColor/20 hover:to-primary/20 transition-all duration-200 border-2 border-mainColor/20 hover:border-mainColor/40 font-semibold flex items-center gap-2"
                    >
                      <PictureOutlined />
                      {t('hr.form.uploadImage')}
                    </button>
                  )}
                </div>
              </label>
            </div>
          </section>
        </div>
      )}

      {/* Step 2: Department & Role */}
      {currentStep === 2 && (
        <div className="space-y-6 mt-6">
          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
              <h4 className="text-xl font-bold text-gray-900">{t('hr.form.departmentRole')}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <ApartmentOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.department')}</span>
                </div>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
                  value={form.department}
                  onChange={e => updateField('department', e.target.value as FormState['department'])}
                  required
                >
                  <option value="Transport">{t('hr.departments.transport')}</option>
                  <option value="Reception">{t('hr.departments.reception')}</option>
                  <option value="Accommodation">{t('hr.departments.accommodation')}</option>
                  <option value="Field Services">{t('hr.departments.fieldServices')}</option>
                  <option value="Other">{t('hr.departments.other')}</option>
                </select>
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.jobRank')}</span>
                </div>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
                  value={form.jobRank}
                  onChange={e => updateField('jobRank', e.target.value as FormState['jobRank'])}
                  required
                >
                  <option value="Field">{t('hr.form.field')}</option>
                  <option value="Supervisor">{t('hr.form.supervisor')}</option>
                  <option value="Department Head">{t('hr.form.departmentHead')}</option>
                </select>
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <ClockCircleOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.shiftDuration')}</span>
                </div>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
                  value={form.shiftDuration}
                  onChange={e => updateField('shiftDuration', e.target.value as '8h' | '12h')}
                  required
                >
                  <option value="8h">{t('hr.form.8h')}</option>
                  <option value="12h">{t('hr.form.12h')}</option>
                </select>
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <ClockCircleOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.shiftPeriod')}</span>
                </div>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
                  value={form.shiftPeriod}
                  onChange={e => updateField('shiftPeriod', e.target.value as 'First' | 'Second' | 'Third')}
                  required
                >
                  <option value="First">{t('hr.form.firstShift')}</option>
                  <option value="Second">{t('hr.form.secondShift')}</option>
                  <option value="Third">{t('hr.form.thirdShift')}</option>
                </select>
              </label>
            </div>
          </section>
        </div>
      )}

      {/* Step 3: Contract Information */}
      {currentStep === 3 && (
        <div className="space-y-6 mt-6">
          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
              <h4 className="text-xl font-bold text-gray-900">{t('hr.form.contractInfo')}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.contractStartDate')}</span>
                </div>
                <input
                  type="date"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={form.contractStartDate}
                  onChange={e => updateField('contractStartDate', e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.contractEndDate')}</span>
                </div>
                <input
                  type="date"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={form.contractEndDate}
                  onChange={e => updateField('contractEndDate', e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.numberOfDays')}</span>
                </div>
                <input
                  type="number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={form.numberOfDays || ''}
                  readOnly
                />
              </label>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
              <h4 className="text-xl font-bold text-gray-900">{t('hr.form.salaryInfo')}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <DollarOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.dailySalary')}</span>
                </div>
                <input
                  type="number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={form.dailySalary || ''}
                  onChange={e => updateField('dailySalary', Number(e.target.value))}
                  required
                />
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <DollarOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t('hr.form.seasonalSalary')}</span>
                </div>
                <input
                  type="number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={form.seasonalSalary || ''}
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">{t('hr.form.seasonalSalary')} ({t('hr.form.calculatedAutomatically')})</p>
              </label>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <label className="block">
              <div className="flex items-center gap-2 mb-2">
                <FileTextOutlined className="text-mainColor text-base" />
                <span className="block text-sm font-semibold text-gray-700">{t('hr.form.recommendations')}</span>
              </div>
              <textarea
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 min-h-[100px]"
                value={form.recommendations || ''}
                onChange={e => updateField('recommendations', e.target.value)}
                placeholder={t('hr.form.recommendationsPlaceholder')}
              />
            </label>
          </section>

          {/* Administrative Checkboxes */}
          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
              <h4 className="text-xl font-bold text-gray-900">{t('hr.checkboxes.title')}</h4>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-mainColor/30 hover:bg-gray-50 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-mainColor border-gray-300 rounded focus:ring-mainColor focus:ring-2"
                  checked={form.employeeCardPrinted}
                  onChange={e => updateField('employeeCardPrinted', e.target.checked)}
                />
                <span className="text-sm font-semibold text-gray-700">{t('hr.checkboxes.employeeCardPrinted')}</span>
              </label>
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-mainColor/30 hover:bg-gray-50 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-mainColor border-gray-300 rounded focus:ring-mainColor focus:ring-2"
                  checked={form.registeredInAjir}
                  onChange={e => updateField('registeredInAjir', e.target.checked)}
                />
                <span className="text-sm font-semibold text-gray-700">{t('hr.checkboxes.registeredInAjir')}</span>
              </label>
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-mainColor/30 hover:bg-gray-50 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-mainColor border-gray-300 rounded focus:ring-mainColor focus:ring-2"
                  checked={form.nuskCardIssued}
                  onChange={e => updateField('nuskCardIssued', e.target.checked)}
                />
                <span className="text-sm font-semibold text-gray-700">{t('hr.checkboxes.nuskCardIssued')}</span>
              </label>
            </div>
          </section>
        </div>
      )}

      {/* Step 4: Tasks */}
      {currentStep === 4 && (
        <div className="space-y-6 mt-6">
          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                <h4 className="text-xl font-bold text-gray-900">{t('hr.form.mainTasks')}</h4>
              </div>
              <button
                type="button"
                onClick={() => addTask('mainTasks')}
                className="px-4 py-2 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-md shadow-mainColor/20 hover:shadow-lg font-semibold flex items-center gap-2"
              >
                <PlusOutlined />
                {t('hr.form.addTask')}
              </button>
            </div>
            <div className="space-y-3">
              {form.mainTasks.map((task, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                    value={task}
                    onChange={e => updateTask('mainTasks', index, e.target.value)}
                    placeholder={`${t('hr.form.mainTasks')} ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeTask('mainTasks', index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg font-semibold flex items-center gap-2"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              ))}
              {form.mainTasks.length === 0 && (
                <p className="text-center text-gray-500 py-4">{t('hr.form.mainTasks')}</p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                <h4 className="text-xl font-bold text-gray-900">{t('hr.form.additionalTasks')}</h4>
              </div>
              <button
                type="button"
                onClick={() => addTask('additionalTasks')}
                className="px-4 py-2 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-md shadow-mainColor/20 hover:shadow-lg font-semibold flex items-center gap-2"
              >
                <PlusOutlined />
                {t('hr.form.addTask')}
              </button>
            </div>
            <div className="space-y-3">
              {form.additionalTasks.map((task, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                    value={task}
                    onChange={e => updateTask('additionalTasks', index, e.target.value)}
                    placeholder={`${t('hr.form.additionalTasks')} ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeTask('additionalTasks', index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg font-semibold flex items-center gap-2"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              ))}
              {form.additionalTasks.length === 0 && (
                <p className="text-center text-gray-500 py-4">{t('hr.form.additionalTasks')}</p>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Step 5: Review */}
      {currentStep === 5 && (
        <div className="space-y-6 mt-6">
          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
              <h4 className="text-xl font-bold text-gray-900">{t('hr.form.step5')}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">{t('hr.form.personalInfo')}</h5>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>{t('hr.form.name')}:</strong> {form.name}</p>
                  <p><strong>{t('hr.form.nationality')}:</strong> {translateNationality(form.nationality)}</p>
                  <p><strong>{t('hr.form.id')}:</strong> {form.idNumber}</p>
                  <p><strong>{t('hr.form.gender')}:</strong> {form.gender === 'male' ? t('hr.form.male') : t('hr.form.female')}</p>
                  <p><strong>{t('hr.form.age')}:</strong> {form.age}</p>
                  <p><strong>{t('hr.form.mobile')}:</strong> {form.mobile}</p>
                  <p><strong>{t('hr.form.email')}:</strong> {form.email}</p>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">{t('hr.form.departmentRole')}</h5>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>{t('hr.form.department')}:</strong> {translateDepartment(form.department)}</p>
                  <p><strong>{t('hr.form.jobRank')}:</strong> {translateJobRank(form.jobRank)}</p>
                  <p><strong>{t('hr.form.shiftDuration')}:</strong> {form.shiftDuration === '8h' ? t('hr.form.8h') : t('hr.form.12h')}</p>
                  <p><strong>{t('hr.form.shiftPeriod')}:</strong> {translateShiftPeriod(form.shiftPeriod)}</p>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">{t('hr.form.contractInfo')}</h5>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>{t('hr.form.contractStartDate')}:</strong> {form.contractStartDate}</p>
                  <p><strong>{t('hr.form.contractEndDate')}:</strong> {form.contractEndDate}</p>
                  <p><strong>{t('hr.form.numberOfDays')}:</strong> {form.numberOfDays}</p>
                  <p><strong>{t('hr.form.dailySalary')}:</strong> {form.dailySalary} SAR</p>
                  <p><strong>{t('hr.form.seasonalSalary')}:</strong> {form.seasonalSalary} SAR</p>
                </div>
              </div>
              {form.recommendations && (
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">{t('hr.form.recommendations')}</h5>
                  <p className="text-sm text-gray-600">{form.recommendations}</p>
                </div>
              )}
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">{t('hr.checkboxes.title')}</h5>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    {form.employeeCardPrinted ? (
                      <CheckCircleOutlined className="text-success" />
                    ) : (
                      <CloseCircleOutlined className="text-gray-400" />
                    )}
                    <strong>{t('hr.checkboxes.employeeCardPrinted')}</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    {form.registeredInAjir ? (
                      <CheckCircleOutlined className="text-success" />
                    ) : (
                      <CloseCircleOutlined className="text-gray-400" />
                    )}
                    <strong>{t('hr.checkboxes.registeredInAjir')}</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    {form.nuskCardIssued ? (
                      <CheckCircleOutlined className="text-success" />
                    ) : (
                      <CloseCircleOutlined className="text-gray-400" />
                    )}
                    <strong>{t('hr.checkboxes.nuskCardIssued')}</strong>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
        >
          <CloseOutlined />
          {t('hr.form.close')}
        </button>
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
          >
            {t('hr.form.previous')}
          </button>
        )}
        {currentStep < 5 ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex-1 px-6 py-3.5 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center justify-center gap-2"
          >
            {t('hr.form.next')}
          </button>
        ) : (
          <button
            type="submit"
            className="flex-1 px-6 py-3.5 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center justify-center gap-2"
          >
            <SaveOutlined />
            {initialData ? t('form.saveChanges') : t('hr.form.save')}
          </button>
        )}
      </div>
    </form>
  );
};

