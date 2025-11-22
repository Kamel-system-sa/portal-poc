import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadOutlined, FileExcelOutlined, CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import type { DepartureExcelRow } from '../../types/reception';

interface DepartureExcelUploadProps {
  onComplete: (data: DepartureExcelRow[]) => void;
  onClose: () => void;
}

export const DepartureExcelUpload: React.FC<DepartureExcelUploadProps> = ({ onComplete, onClose }) => {
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar' || i18n.language === 'ur';
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedData, setUploadedData] = useState<DepartureExcelRow[]>([]);
  const [summary, setSummary] = useState<{ departed: number; expected: number; difference: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProcessing(true);

    // Simulate file processing (in real app, this would use a library like xlsx to parse Excel file)
    setTimeout(() => {
      // Mock parsed data from Excel
      const mockExcelData: DepartureExcelRow[] = [
        {
          organizerNumber: 'ORG-001',
          organizerName: 'Al-Sheikh Travel & Tourism',
          organizerCompany: 'Al-Sheikh Group',
          organizerNationality: 'saudi',
          organizerPhone: '+966501234567',
          campaignNumber: 'CAMP-2024-001',
          campaignManagerPhone: '+966501111111',
          route: 'مكة → جدة',
          departureDate: '2024-01-25',
          departureTime: '14:30',
          pilgrimsCount: 190
        },
        {
          organizerNumber: 'ORG-002',
          organizerName: 'Makkah Tours International',
          organizerCompany: 'Makkah Tours Co.',
          organizerNationality: 'saudi',
          organizerPhone: '+966502345678',
          campaignNumber: 'CAMP-2024-002',
          campaignManagerPhone: '+966502222222',
          route: 'المدينة → مطار المدينة',
          departureDate: '2024-01-26',
          departureTime: '10:00',
          pilgrimsCount: 200
        }
      ];

      // Calculate summary
      const departed = mockExcelData.reduce((sum, row) => sum + row.pilgrimsCount, 0);
      const expected = 200; // This would come from actual expected data
      const difference = departed - expected;

      setUploadedData(mockExcelData);
      setSummary({ departed, expected, difference });
      setUploading(false);
      setProcessing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mainColor to-primary flex items-center justify-center">
              <FileExcelOutlined className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {t('reception.preArrival.departures.excelUpload.title') || 'رفع تقرير المغادرة'}
              </h2>
              <p className="text-sm text-gray-500">
                {t('reception.preArrival.departures.excelUpload.description') || 'رفع بيانات المغادرة من قسم الجوازات بصيغة Excel'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <CloseOutlined className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!file && !processing && !uploadedData.length && (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-mainColor transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileExcelOutlined className="text-6xl text-gray-400 mb-4" />
              <p className="text-lg font-semibold text-gray-700 mb-2">
                {t('reception.preArrival.departures.excelUpload.dragDrop') || 'اسحب وأفلت ملف Excel هنا، أو انقر للاختيار'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {t('reception.preArrival.departures.excelUpload.supportedFormats') || 'الصيغ المدعومة: .xlsx, .xls'}
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all font-semibold flex items-center gap-2 mx-auto">
                <UploadOutlined />
                {t('reception.preArrival.departures.excelUpload.selectFile') || 'اختر ملف Excel'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {file && !processing && !uploadedData.length && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircleOutlined className="text-green-600 text-xl" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900">{file.name}</p>
                  <p className="text-sm text-green-700">
                    {(file.size / 1024).toFixed(2)} KB • {t('reception.preArrival.departures.excelUpload.fileSelected') || 'تم اختيار الملف'}
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <CloseOutlined />
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      {t('reception.preArrival.departures.excelUpload.uploading') || 'جاري الرفع...'}
                    </>
                  ) : (
                    <>
                      <UploadOutlined />
                      {t('reception.preArrival.excelUpload.validate') || 'التحقق من البيانات'}
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all font-semibold text-gray-700"
                >
                  {t('form.cancel') || 'إلغاء'}
                </button>
              </div>
            </div>
          )}

          {processing && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-6xl text-mainColor mb-4">⏳</div>
              <p className="text-lg font-semibold text-gray-700">
                {t('reception.preArrival.departures.excelUpload.processing') || 'جاري معالجة الملف...'}
              </p>
            </div>
          )}

          {uploadedData.length > 0 && (
            <div className="space-y-6">
              {/* Summary */}
              {summary && (
                <div className="bg-gradient-to-r from-mainColor/10 to-primary/10 border border-mainColor/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {t('reception.preArrival.departures.excelUpload.summary') || 'ملخص المغادرة'}
                  </h3>
                  <p className="text-base text-gray-700">
                    {t('reception.preArrival.departures.excelUpload.summaryMessage', {
                      departed: summary.departed,
                      expected: summary.expected,
                      difference: summary.difference
                    }) || `تمت مغادرة لعدد ${summary.departed} حاج / عدد الحجاج المتوقع مغادرتهم ${summary.expected} الفرق ${summary.difference}`}
                  </p>
                </div>
              )}

              {/* Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">
                    {t('reception.preArrival.departures.excelUpload.tableTitle') || 'بيانات المغادرة'}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">
                          {t('reception.preArrival.departures.form.step3.organizerNumber') || 'رقم المنظم'}
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">
                          {t('reception.preArrival.departures.form.step3.organizerName') || 'اسم المنظم'}
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">
                          {t('reception.preArrival.departures.form.step1.organizerCompany') || 'اسم الشركة'}
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">
                          {t('reception.preArrival.departures.form.step3.campaignManagerPhone') || 'رقم الجوال مسؤول الحملة'}
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">
                          {t('reception.preArrival.departures.form.step3.route') || 'مسار الرحلة'}
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">
                          {t('reception.preArrival.departures.form.step3.departureDateTime') || 'تاريخ ووقت المغادرة'}
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b border-gray-200">
                          {t('reception.preArrival.departures.form.step3.pilgrimsCount') || 'عدد الحجاج'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">{row.organizerNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">{row.organizerName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">{row.organizerCompany}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">{row.campaignManagerPhone}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">{row.route}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">{row.departureDate} {row.departureTime}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">{row.pilgrimsCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all font-semibold text-gray-700"
                >
                  {t('form.cancel') || 'إلغاء'}
                </button>
                <button
                  onClick={() => {
                    onComplete(uploadedData);
                    onClose();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-mainColor to-primary text-white rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all font-semibold"
                >
                  {t('form.save') || 'حفظ'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

