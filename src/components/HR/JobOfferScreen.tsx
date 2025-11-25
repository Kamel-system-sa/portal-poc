import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MailOutlined,
  SendOutlined,
  EditOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  UploadOutlined,
  DeleteOutlined,
  FileOutlined
} from '@ant-design/icons';
import type { Employee } from '../../data/mockEmployees';
import { translateEmployeeName, translateDepartment, translateJobRank, translateShiftPeriod } from '../../utils';

interface JobOfferScreenProps {
  employee: Employee;
  onClose: () => void;
  onSend: (email: string, subject: string, body: string) => void;
}

export const JobOfferScreen: React.FC<JobOfferScreenProps> = ({
  employee,
  onClose,
  onSend
}) => {
  const { t, i18n } = useTranslation('common');
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  
  // Generate templates based on current language
  const getTemplates = () => {
    const employeeName = translateEmployeeName(employee.name, employee.id);
    const jobRank = translateJobRank(employee.jobRank);
    const department = translateDepartment(employee.department);
    const shiftPeriod = translateShiftPeriod(employee.shiftPeriod);
    const shiftDuration = employee.shiftDuration === '8h' ? t('hr.form.8h') : t('hr.form.12h');
    const isArabic = i18n.language?.split('-')[0] === 'ar';
    
    if (isArabic) {
      return [
        {
          id: 'default',
          name: 'قالب احترافي',
          subject: `${t('hr.jobOffer.title')} - ${employeeName} - ${department}`,
          body: `السيد/السيدة ${employeeName}،\n\n` +
            `نتشرف نحن إدارة الموارد البشرية في بوابة كامل بتقديم عرض عمل لكم للانضمام إلى فريقنا المتميز في منصب ${jobRank} ب${department}.\n\n` +
            `ملاحظة: سيتم إرسال هذا العرض على بريدكم الإلكتروني: ${employee.email}\n\n` +
            `تفاصيل الوظيفة:\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${t('hr.form.jobRank')}: ${jobRank} - ${department}\n` +
            `${t('hr.form.department')}: ${department}\n` +
            `${t('hr.form.jobRank')}: ${jobRank}\n` +
            `${t('hr.form.shiftPeriod')}: ${shiftPeriod}\n` +
            `${t('hr.form.shiftDuration')}: ${shiftDuration}\n\n` +
            `المزايا المالية:\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${t('hr.form.dailySalary')}: ${employee.dailySalary} ريال سعودي\n` +
            `${t('hr.form.seasonalSalary')}: ${employee.seasonalSalary} ريال سعودي\n\n` +
            `مدة العقد:\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${t('hr.form.contractStartDate')}: ${employee.contractStartDate}\n` +
            `${t('hr.form.contractEndDate')}: ${employee.contractEndDate}\n` +
            `${t('hr.form.numberOfDays')}: ${employee.numberOfDays} يوم\n\n` +
            `نتمنى أن ينال هذا العرض رضاكم ونتطلع إلى انضمامكم لفريقنا. يرجى تأكيد قبولكم لهذا العرض خلال مدة أسبوع من تاريخه.\n\n` +
            `مع أطيب التحيات،\n\n` +
            `الموارد البشرية\n` +
            `بوابة كامل`
        }
      ];
    } else {
      return [
        {
          id: 'default',
          name: 'Professional Template',
          subject: `${t('hr.jobOffer.title')} - ${employeeName} - ${department}`,
          body: `Dear ${employeeName},\n\n` +
            `We are pleased to extend a formal job offer to you for the position of ${jobRank} in the ${department} department.\n\n` +
            `Note: This offer will be sent to your email: ${employee.email}\n\n` +
            `POSITION DETAILS:\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${t('hr.form.jobRank')}: ${jobRank} - ${department}\n` +
            `${t('hr.form.department')}: ${department}\n` +
            `${t('hr.form.jobRank')}: ${jobRank}\n` +
            `${t('hr.form.shiftPeriod')}: ${shiftPeriod}\n` +
            `${t('hr.form.shiftDuration')}: ${shiftDuration}\n\n` +
            `COMPENSATION:\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${t('hr.form.dailySalary')}: ${employee.dailySalary} SAR\n` +
            `${t('hr.form.seasonalSalary')}: ${employee.seasonalSalary} SAR\n\n` +
            `CONTRACT TERMS:\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${t('hr.form.contractStartDate')}: ${employee.contractStartDate}\n` +
            `${t('hr.form.contractEndDate')}: ${employee.contractEndDate}\n` +
            `${t('hr.form.numberOfDays')}: ${employee.numberOfDays} days\n\n` +
            `We believe your skills and experience will be a valuable addition to our team. Please confirm your acceptance of this offer by replying to this email.\n\n` +
            `We look forward to welcoming you to our organization.\n\n` +
            `Best regards,\n\n` +
            `Human Resources Department\n` +
            `Kamel Portal`
        }
      ];
    }
  };
  
  const templates = getTemplates();
  const [subject, setSubject] = useState(templates[0].subject);
  const [body, setBody] = useState(templates[0].body);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Update templates when language changes
  useEffect(() => {
    const newTemplates = getTemplates();
    setSubject(newTemplates[0].subject);
    setBody(newTemplates[0].body);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSubject(template.subject);
      setBody(template.body);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type (allow PDF, DOC, DOCX, TXT)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (allowedTypes.includes(file.type)) {
        setUploadedFile(file);
      } else {
        alert(t('hr.jobOffer.invalidFileType') || 'Invalid file type. Please upload PDF, DOC, DOCX, or TXT file.');
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleSend = () => {
    setShowConfirmation(true);
  };

  const confirmSend = () => {
    // If file is uploaded, include file info in the body
    const emailBody = uploadedFile 
      ? `${t('hr.jobOffer.fileAttachedMessage') || 'تم إرفاق ملف عرض العمل مع هذا الإيميل.'}\n\n${body}`
      : body;
    
    onSend(employee.email, subject, emailBody);
    setShowConfirmation(false);
    
    // Generate Arabic-only PDF version of job offer
    const pdfWindow = window.open('', '_blank');
    if (pdfWindow) {
      // Get Arabic translations
      const i18nResources = (window as any).i18n?.store?.data?.ar?.common?.hr || {};
      
      // Create Arabic-only content
      const arabicContent = `
        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #005B4F;">
          <h1 style="color: #005B4F; font-size: 28px; margin-bottom: 10px;">عرض عمل</h1>
          <p style="color: #666; font-size: 14px;">بوابة كامل - الموارد البشرية</p>
        </div>
        
        <div style="margin-bottom: 30px; text-align: right;">
          <p style="font-size: 16px; margin-bottom: 15px;">السيد/السيدة: <strong>${translateEmployeeName(employee.name, employee.id)}</strong></p>
          <p style="font-size: 14px; color: #666; margin-bottom: 30px;">التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
        </div>
        
        <div style="margin-bottom: 30px; text-align: right; line-height: 2;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            تحية طيبة وبعد،
          </p>
          <p style="font-size: 16px; margin-bottom: 20px; text-align: justify;">
            نتشرف نحن إدارة الموارد البشرية في بوابة كامل بتقديم عرض عمل لكم للانضمام إلى فريقنا المتميز في منصب <strong>${translateJobRank(employee.jobRank)}</strong> ب<strong>${translateDepartment(employee.department)}</strong>.
          </p>
        </div>
        
        <div style="margin-bottom: 30px; border: 2px solid #005B4F; border-radius: 8px; padding: 20px; background: #f9f9f9;">
          <h3 style="color: #005B4F; font-size: 20px; margin-bottom: 20px; text-align: right; border-bottom: 2px solid #005B4F; padding-bottom: 10px;">تفاصيل الوظيفة:</h3>
          <div style="text-align: right; font-size: 16px; line-height: 2.5;">
            <p><strong>المنصب:</strong> ${translateJobRank(employee.jobRank)}</p>
            <p><strong>:</strong> ${translateDepartment(employee.department)}</p>
            <p><strong>${t('hr.form.shiftPeriod')}:</strong> ${translateShiftPeriod(employee.shiftPeriod)}</p>
            <p><strong>${t('hr.form.shiftDuration')}:</strong> ${employee.shiftDuration === '8h' ? t('hr.form.8h') : t('hr.form.12h')}</p>
          </div>
        </div>
        
        <div style="margin-bottom: 30px; border: 2px solid #005B4F; border-radius: 8px; padding: 20px; background: #f9f9f9;">
          <h3 style="color: #005B4F; font-size: 20px; margin-bottom: 20px; text-align: right; border-bottom: 2px solid #005B4F; padding-bottom: 10px;">المزايا المالية:</h3>
          <div style="text-align: right; font-size: 16px; line-height: 2.5;">
            <p><strong>الراتب اليومي:</strong> ${employee.dailySalary} ريال سعودي</p>
            <p><strong>الراتب الموسمي:</strong> ${employee.seasonalSalary} ريال سعودي</p>
          </div>
        </div>
        
        <div style="margin-bottom: 30px; border: 2px solid #005B4F; border-radius: 8px; padding: 20px; background: #f9f9f9;">
          <h3 style="color: #005B4F; font-size: 20px; margin-bottom: 20px; text-align: right; border-bottom: 2px solid #005B4F; padding-bottom: 10px;">مدة العقد:</h3>
          <div style="text-align: right; font-size: 16px; line-height: 2.5;">
            <p><strong>تاريخ البدء:</strong> ${employee.contractStartDate}</p>
            <p><strong>تاريخ الانتهاء:</strong> ${employee.contractEndDate}</p>
            <p><strong>مدة العقد:</strong> ${employee.numberOfDays} يوم</p>
          </div>
        </div>
        
        <div style="margin-top: 40px; text-align: right; line-height: 2;">
          <p style="font-size: 16px; margin-bottom: 20px; text-align: justify;">
            نتمنى أن ينال هذا العرض رضاكم ونتطلع إلى انضمامكم لفريقنا. يرجى تأكيد قبولكم لهذا العرض خلال مدة أسبوع من تاريخه.
          </p>
          <p style="font-size: 16px; margin-bottom: 30px;">
            مع أطيب التحيات،
          </p>
        </div>
        
        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #ddd; text-align: right;">
          <p style="font-size: 18px; font-weight: bold; color: #005B4F; margin-bottom: 10px;">الموارد البشرية</p>
          <p style="font-size: 16px; color: #666; margin-bottom: 10px;">بوابة كامل</p>
          <p style="font-size: 14px; color: #999;">${employee.email}</p>
        </div>
        
        <div style="margin-top: 60px; text-align: right; padding-top: 30px; border-top: 2px solid #ddd;">
          <p style="font-size: 14px; color: #666; margin-bottom: 15px;"><strong>توقيع الموظف:</strong></p>
          <div style="border-bottom: 2px solid #333; width: 300px; margin-right: 0; margin-bottom: 30px;"></div>
          <p style="font-size: 14px; color: #666;"><strong>التاريخ:</strong> ________________</p>
        </div>
      `;
      
      const htmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <title>عرض عمل - ${translateEmployeeName(employee.name, employee.id)}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: 'Arial', 'Tahoma', sans-serif;
                direction: rtl;
                padding: 40px;
                background: white;
                color: #333;
                line-height: 1.8;
              }
              @media print {
                @page {
                  size: A4;
                  margin: 2cm;
                }
                body {
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            ${arabicContent}
          </body>
        </html>
      `;
      pdfWindow.document.write(htmlContent);
      pdfWindow.document.close();
      setTimeout(() => {
        pdfWindow.print();
        pdfWindow.close();
      }, 250);
    }
    
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">{t('hr.jobOffer.title')}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition"
        >
          <CloseOutlined className="text-lg" />
        </button>
      </div>

      {/* Template Selection */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <label className="block mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileTextOutlined className="text-mainColor text-base" />
            <span className="block text-sm font-semibold text-gray-700">{t('hr.jobOffer.template')}</span>
          </div>
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium"
            value={selectedTemplate}
            onChange={e => handleTemplateChange(e.target.value)}
          >
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      {/* Email Subject */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <label className="block mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MailOutlined className="text-mainColor text-base" />
            <span className="block text-sm font-semibold text-gray-700">{t('hr.jobOffer.subject')}</span>
          </div>
          <input
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </label>
      </section>

      {/* File Upload Option */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <UploadOutlined className="text-mainColor text-base" />
          <span className="block text-sm font-semibold text-gray-700">{t('hr.jobOffer.uploadFile') || 'رفع ملف العرض'}</span>
        </div>
        <div className="space-y-3">
          {!uploadedFile ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-mainColor transition-all duration-200">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadOutlined className="text-3xl text-gray-400 mb-2" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">{t('hr.jobOffer.clickToUpload') || 'انقر للرفع'}</span> {t('hr.jobOffer.orDragDrop') || 'أو اسحب الملف هنا'}
                </p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
              />
            </label>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex items-center gap-3">
                <FileOutlined className="text-2xl text-mainColor" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                title={t('hr.jobOffer.removeFile') || 'إزالة الملف'}
              >
                <DeleteOutlined className="text-lg" />
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          {t('hr.jobOffer.uploadNote') || 'يمكنك رفع ملف يحتوي على عرض العمل بدلاً من كتابته كنص'}
        </p>
      </section>

      {/* Email Body */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <label className="block mb-4">
          <div className="flex items-center gap-2 mb-2">
            <EditOutlined className="text-mainColor text-base" />
            <span className="block text-sm font-semibold text-gray-700">
              {t('hr.jobOffer.body')} {uploadedFile && <span className="text-gray-400 text-xs">({t('hr.jobOffer.optional') || 'اختياري'})</span>}
            </span>
          </div>
          <textarea
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 min-h-[300px] disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={body}
            onChange={e => setBody(e.target.value)}
            disabled={!!uploadedFile}
            placeholder={uploadedFile ? (t('hr.jobOffer.fileUploadedPlaceholder') || 'تم رفع ملف، سيتم استخدام الملف المرفوع بدلاً من النص') : ''}
          />
        </label>
        {!uploadedFile && (
          <div className="text-xs text-gray-500 mt-2">
            <p>Placeholders: {t('hr.jobOffer.placeholders.name')}, {t('hr.jobOffer.placeholders.position')}, {t('hr.jobOffer.placeholders.salary')}, {t('hr.jobOffer.placeholders.startDate')}, {t('hr.jobOffer.placeholders.endDate')}</p>
          </div>
        )}
      </section>

      {/* Preview */}
      <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <FileTextOutlined className="text-mainColor text-base" />
          <span className="block text-sm font-semibold text-gray-700">{t('hr.jobOffer.preview')}</span>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
          <div className="space-y-2 text-sm">
            <p><strong>To:</strong> {employee.email}</p>
            <p><strong>Subject:</strong> {subject}</p>
            {uploadedFile ? (
              <div className="mt-4 p-4 bg-white rounded-lg border-2 border-mainColor/20">
                <div className="flex items-center gap-3">
                  <FileOutlined className="text-2xl text-mainColor" />
                  <div>
                    <p className="font-semibold text-gray-900">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {t('hr.jobOffer.fileWillBeAttached') || 'سيتم إرفاق هذا الملف مع الإيميل'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 whitespace-pre-wrap text-gray-700">{body}</div>
            )}
          </div>
        </div>
      </section>

      {/* Send Button */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3.5 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
        >
          <CloseOutlined />
          {t('hr.form.close')}
        </button>
        <button
          onClick={handleSend}
          className="flex-1 px-6 py-3.5 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 shadow-lg shadow-mainColor/25 hover:shadow-xl font-semibold flex items-center justify-center gap-2"
        >
          <SendOutlined />
          {t('hr.jobOffer.send')}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircleOutlined className="text-mainColor text-2xl" />
              <h3 className="text-xl font-bold text-gray-900">{t('hr.jobOffer.sendConfirmation')}</h3>
            </div>
            <p className="text-gray-700 mb-6">
              {t('hr.jobOffer.sendConfirmationMessage')} <strong>{employee.email}</strong>?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
              >
                {t('hr.form.cancel')}
              </button>
              <button
                onClick={confirmSend}
                className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-mainColor to-primary rounded-xl hover:from-mainColor/90 hover:to-primary/90 transition-all duration-300 font-semibold"
              >
                {t('hr.jobOffer.send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

