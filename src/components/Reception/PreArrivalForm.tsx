import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  UploadOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import type { ArrivalGroup, Accommodation } from '../../data/mockReception';
import { mockAccommodations, mockOrganizers } from '../../data/mockReception';

interface PreArrivalFormProps {
  initialData?: ArrivalGroup;
  isViewMode?: boolean;
  onCancel: () => void;
  onSubmit: (group: ArrivalGroup) => void;
}

type ImportMethod = 'excel' | 'manual';

const PreArrivalForm: React.FC<PreArrivalFormProps> = ({
  initialData,
  isViewMode = false,
  onCancel,
  onSubmit
}) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  
  const [importMethod, setImportMethod] = useState<ImportMethod>(initialData ? 'manual' : 'excel');
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [showColumnMapping, setShowColumnMapping] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState<Partial<ArrivalGroup>>({
    groupNumber: initialData?.groupNumber || '',
    groupName: initialData?.groupName || '',
    arrivalDate: initialData?.arrivalDate || '',
    arrivalTime: initialData?.arrivalTime || '',
    flightNumber: initialData?.flightNumber || '',
    tripNumber: initialData?.tripNumber || '',
    pilgrimsCount: initialData?.pilgrimsCount || 0,
    destination: initialData?.destination || '',
    organizer: initialData?.organizer || mockOrganizers[0],
    accommodations: initialData?.accommodations || [],
    status: initialData?.status || 'scheduled',
  });

  const handleInputChange = (field: keyof ArrivalGroup, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOrganizerChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      organizer: prev.organizer ? { ...prev.organizer, [field]: value } : undefined
    }));
  };

  const handleAddAccommodation = () => {
    if (!formData.accommodations) {
      setFormData(prev => ({ ...prev, accommodations: [] }));
    }
    // In a real app, this would open a modal to select accommodation
    const newAccommodation = mockAccommodations[0];
    if (formData.accommodations && !formData.accommodations.find(a => a.id === newAccommodation.id)) {
      setFormData(prev => ({
        ...prev,
        accommodations: [...(prev.accommodations || []), newAccommodation]
      }));
    }
  };

  const handleRemoveAccommodation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations?.filter(a => a.id !== id) || []
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFile(file);
      setShowColumnMapping(true);
      // In a real app, this would parse the Excel file and show column mapping UI
      setValidationErrors(['Mock: Excel file uploaded. Column mapping UI would appear here.']);
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.groupNumber) errors.push(t('reception.preArrival.form.groupNumber') + ' ' + t('reception.preArrival.form.isRequired'));
    if (!formData.groupName) errors.push(t('reception.preArrival.form.groupName') + ' ' + t('reception.preArrival.form.isRequired'));
    if (!formData.arrivalDate) errors.push(t('reception.preArrival.form.arrivalDate') + ' ' + t('reception.preArrival.form.isRequired'));
    if (!formData.arrivalTime) errors.push(t('reception.preArrival.form.arrivalTime') + ' ' + t('reception.preArrival.form.isRequired'));
    if (!formData.flightNumber && !formData.tripNumber) {
      errors.push(t('reception.preArrival.form.flightOrTripRequired'));
    }
    if (!formData.pilgrimsCount || formData.pilgrimsCount <= 0) {
      errors.push(t('reception.preArrival.form.pilgrimsCount') + ' ' + t('reception.preArrival.form.mustBeGreaterThanZero'));
    }
    if (!formData.destination) errors.push(t('reception.preArrival.form.destination') + ' ' + t('reception.preArrival.form.isRequired'));
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newGroup: ArrivalGroup = {
      id: initialData?.id || `GRP-${Date.now()}`,
      groupNumber: formData.groupNumber || '',
      groupName: formData.groupName || '',
      arrivalDate: formData.arrivalDate || '',
      arrivalTime: formData.arrivalTime || '',
      flightNumber: formData.flightNumber,
      tripNumber: formData.tripNumber,
      pilgrimsCount: formData.pilgrimsCount || 0,
      arrivedCount: initialData?.arrivedCount || 0,
      destination: formData.destination || '',
      organizer: formData.organizer || mockOrganizers[0],
      accommodations: formData.accommodations || [],
      status: formData.status || 'scheduled',
      createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0],
    };

    onSubmit(newGroup);
  };

  if (isViewMode) {
    return (
      <div className="space-y-6">
        {/* Group Info */}
        <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h4 className="text-xl font-bold text-gray-900">{t('reception.preArrival.form.groupInfo')}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('reception.preArrival.form.groupNumber')}</label>
              <p className="text-gray-900">{formData.groupNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('reception.preArrival.form.groupName')}</label>
              <p className="text-gray-900">{formData.groupName}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('reception.preArrival.form.arrivalDate')}</label>
              <p className="text-gray-900">{formData.arrivalDate}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('reception.preArrival.form.arrivalTime')}</label>
              <p className="text-gray-900">{formData.arrivalTime}</p>
            </div>
          </div>
        </section>

        {/* Organizer Info */}
        <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h4 className="text-xl font-bold text-gray-900">{t('reception.preArrival.form.organizerInfo')}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('reception.preArrival.form.organizerName')}</label>
              <p className="text-gray-900">{formData.organizer?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('reception.preArrival.form.organizerCompany')}</label>
              <p className="text-gray-900">{formData.organizer?.company}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Import Method Selection */}
      {!initialData && (
        <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h4 className="text-xl font-bold text-gray-900">{t('reception.preArrival.form.importMethod')}</h4>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setImportMethod('excel')}
              className={`flex-1 px-6 py-4 rounded-xl border-2 transition-all duration-200 font-semibold flex items-center justify-center gap-2 ${
                importMethod === 'excel'
                  ? 'bg-gradient-to-r from-mainColor/10 to-primary/10 border-mainColor text-mainColor'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-mainColor/50'
              }`}
            >
              <FileExcelOutlined className="text-xl" />
              {t('reception.preArrival.form.uploadExcel')}
            </button>
            <button
              type="button"
              onClick={() => setImportMethod('manual')}
              className={`flex-1 px-6 py-4 rounded-xl border-2 transition-all duration-200 font-semibold flex items-center justify-center gap-2 ${
                importMethod === 'manual'
                  ? 'bg-gradient-to-r from-mainColor/10 to-primary/10 border-mainColor text-mainColor'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-mainColor/50'
              }`}
            >
              <CheckCircleOutlined className="text-xl" />
              {t('reception.preArrival.form.manualEntry')}
            </button>
          </div>

          {importMethod === 'excel' && (
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('reception.preArrival.form.uploadExcel')}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-mainColor transition-colors">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="excel-upload"
                />
                <label
                  htmlFor="excel-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <UploadOutlined className="text-4xl text-gray-400" />
                  <span className="text-gray-600">{t('reception.preArrival.form.uploadExcel')}</span>
                  {excelFile && (
                    <span className="text-sm text-mainColor mt-2">{excelFile.name}</span>
                  )}
                </label>
              </div>
              
              {showColumnMapping && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <WarningOutlined className="text-yellow-600" />
                    <span className="font-semibold text-yellow-900">{t('reception.preArrival.form.excelMapping')}</span>
                  </div>
                  <p className="text-sm text-yellow-800">{t('reception.preArrival.form.mapColumns')}</p>
                  <p className="text-xs text-yellow-700 mt-2">
                    Mock: Column mapping interface would appear here with dropdowns to map Excel columns to form fields.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <WarningOutlined className="text-red-600" />
            <span className="font-semibold text-red-900">{t('reception.preArrival.form.validationErrors')}</span>
          </div>
          <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Manual Entry Form */}
      {(importMethod === 'manual' || initialData) && (
        <>
          {/* Group Information */}
          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
              <h4 className="text-xl font-bold text-gray-900">{t('reception.preArrival.form.groupInfo')}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.groupNumber')} *
                </span>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={formData.groupNumber || ''}
                  onChange={(e) => handleInputChange('groupNumber', e.target.value)}
                  required
                  readOnly={isViewMode}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.groupName')} *
                </span>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={formData.groupName || ''}
                  onChange={(e) => handleInputChange('groupName', e.target.value)}
                  required
                  readOnly={isViewMode}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.arrivalDate')} *
                </span>
                <input
                  type="date"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={formData.arrivalDate || ''}
                  onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
                  required
                  readOnly={isViewMode}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.arrivalTime')} *
                </span>
                <input
                  type="time"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={formData.arrivalTime || ''}
                  onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                  required
                  readOnly={isViewMode}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.flightNumber')}
                </span>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={formData.flightNumber || ''}
                  onChange={(e) => handleInputChange('flightNumber', e.target.value)}
                  placeholder="SV-1234"
                  readOnly={isViewMode}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.tripNumber')}
                </span>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={formData.tripNumber || ''}
                  onChange={(e) => handleInputChange('tripNumber', e.target.value)}
                  placeholder="TR-001"
                  readOnly={isViewMode}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.pilgrimsCount')} *
                </span>
                <input
                  type="number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={formData.pilgrimsCount || 0}
                  onChange={(e) => handleInputChange('pilgrimsCount', parseInt(e.target.value))}
                  required
                  min={1}
                  readOnly={isViewMode}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.destination')} *
                </span>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
                  value={formData.destination || ''}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  required
                  disabled={isViewMode}
                >
                  <option value="">{t('form.selectType')}</option>
                  <option value="مطار الملك عبدالعزيز">مطار الملك عبدالعزيز</option>
                  <option value="منفذ البطحاء البري">منفذ البطحاء البري</option>
                </select>
              </label>
            </div>
          </section>

          {/* Organizer Information */}
          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
              <h4 className="text-xl font-bold text-gray-900">{t('reception.preArrival.form.organizerInfo')}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.organizerName')}
                </span>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={formData.organizer?.name || ''}
                  onChange={(e) => handleOrganizerChange('name', e.target.value)}
                  readOnly={isViewMode}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.organizerCompany')}
                </span>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={formData.organizer?.company || ''}
                  onChange={(e) => handleOrganizerChange('company', e.target.value)}
                  readOnly={isViewMode}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('reception.preArrival.form.organizerPhone')}
                </span>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  value={formData.organizer?.phone || ''}
                  onChange={(e) => handleOrganizerChange('phone', e.target.value)}
                  readOnly={isViewMode}
                />
              </label>
            </div>
          </section>

          {/* Accommodations Assignment */}
          <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
                <h4 className="text-xl font-bold text-gray-900">{t('reception.preArrival.form.accommodations')}</h4>
              </div>
              {!isViewMode && (
                <button
                  type="button"
                  onClick={handleAddAccommodation}
                  className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-md shadow-mainColor/20 hover:shadow-lg font-semibold flex items-center gap-2"
                >
                  <PlusOutlined />
                  {t('reception.preArrival.form.addAccommodation')}
                </button>
              )}
            </div>
            <div className="space-y-3">
              {formData.accommodations && formData.accommodations.length > 0 ? (
                formData.accommodations.map((acc) => (
                  <div key={acc.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-900">{acc.name}</span>
                      <span className="text-sm text-gray-600 ml-2">({acc.type})</span>
                      <span className="text-sm text-gray-600 ml-2">- {acc.location}</span>
                    </div>
                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAccommodation(acc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <DeleteOutlined />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">{t('form.notSpecified')}</p>
              )}
            </div>
          </section>
        </>
      )}

      {/* Form Actions */}
      {!isViewMode && (
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
          >
            <CloseOutlined />
            {t('reception.preArrival.form.cancel')}
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3.5 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center justify-center gap-2"
          >
            <SaveOutlined />
            {initialData ? t('form.saveChanges') : t('reception.preArrival.form.save')}
          </button>
        </div>
      )}
    </form>
  );
};

export default PreArrivalForm;

