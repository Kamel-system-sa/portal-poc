import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Checkbox, Button, Select, Input, Upload } from 'antd';
import { DownloadOutlined, FileTextOutlined, FileExcelOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { GlassCard } from './GlassCard';

const { Option } = Select;

interface ReportBuilderProps {
  onGenerate?: (format: 'pdf' | 'excel', options: any) => void;
}

export const ReportBuilder: React.FC<ReportBuilderProps> = ({ onGenerate }) => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [templateName, setTemplateName] = useState<string>('');

  const availableFields = [
    { key: 'hotels', label: t('housing.hotels') },
    { key: 'buildings', label: t('housing.buildings') },
    { key: 'minaCamps', label: t('housing.mina') },
    { key: 'arafatCamps', label: t('housing.arafat') },
    { key: 'totalCapacity', label: t('housing.totalCapacity') },
    { key: 'occupiedBeds', label: t('housing.occupiedBeds') },
    { key: 'availableBeds', label: t('housing.availableBeds') },
    { key: 'occupancyRate', label: t('housing.occupancyRate') },
    { key: 'pilgrims', label: t('housing.totalPilgrims') },
    { key: 'location', label: t('housing.location') },
    { key: 'genderDistribution', label: t('housing.genderDistribution') },
    { key: 'nationalityDistribution', label: t('housing.nationalityDistribution') },
  ];

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldKey) 
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleSelectAll = () => {
    setSelectedFields(availableFields.map(f => f.key));
  };

  const handleDeselectAll = () => {
    setSelectedFields([]);
  };

  const handleGenerate = (format: 'pdf' | 'excel') => {
    const values = form.getFieldsValue();
    const reportOptions = {
      fields: selectedFields,
      includeLogo: values.includeLogo || false,
      template: values.template || 'default',
      ...values
    };

    if (onGenerate) {
      onGenerate(format, reportOptions);
    } else {
      // Mock file generation
      const fileName = `housing-report-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      const blob = new Blob(['Mock report content'], { type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleSaveTemplate = () => {
    if (!templateName) return;
    // Mock save template
    console.log('Saving template:', templateName, selectedFields);
  };

  return (
    <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <FileTextOutlined className="text-primaryColor" />
          {t('housing.reportBuilder')}
        </h3>
        <p className="text-sm text-customgray">
          {t('housing.reportBuilderDescription')}
        </p>
      </div>

      <Form form={form} layout="vertical">
        {/* Template Selection */}
        <div className="mb-6">
          <Form.Item
            label={t('housing.selectTemplate')}
            name="template"
          >
            <Select size="large" placeholder={t('housing.chooseTemplate')}>
              <Option value="default">{t('housing.defaultTemplate')}</Option>
              <Option value="detailed">{t('housing.detailedTemplate')}</Option>
              <Option value="summary">{t('housing.summaryTemplate')}</Option>
            </Select>
          </Form.Item>

          <div className="flex gap-3 mb-4">
            <Input
              placeholder={t('housing.templateName')}
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="flex-1"
              size="large"
            />
            <Button
              type="default"
              icon={<SaveOutlined />}
              onClick={handleSaveTemplate}
              disabled={!templateName}
              size="large"
              className="border-2 border-bordergray hover:border-primaryColor"
            >
              {t('housing.saveTemplate')}
            </Button>
          </div>

          <Form.Item name="uploadTemplate">
            <Upload
              accept=".json"
              showUploadList={false}
              beforeUpload={() => false}
            >
              <Button
                icon={<UploadOutlined />}
                size="large"
                className="w-full border-2 border-bordergray hover:border-primaryColor"
              >
                {t('housing.uploadTemplate')}
              </Button>
            </Upload>
          </Form.Item>
        </div>

        {/* Field Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-gray-700">
              {t('housing.selectFields')}
            </label>
            <div className="flex gap-2">
              <Button
                type="text"
                size="small"
                onClick={handleSelectAll}
                className="text-primaryColor hover:text-primaryColor/80"
              >
                {t('housing.selectAll')}
              </Button>
              <Button
                type="text"
                size="small"
                onClick={handleDeselectAll}
                className="text-customgray hover:text-primaryColor"
              >
                {t('housing.deselectAll')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg border border-bordergray max-h-64 overflow-y-auto">
            {availableFields.map(field => (
              <div key={field.key} className="flex items-center">
                <Checkbox
                  checked={selectedFields.includes(field.key)}
                  onChange={() => handleFieldToggle(field.key)}
                  className="text-sm"
                >
                  {field.label}
                </Checkbox>
              </div>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="mb-6">
          <Form.Item name="includeLogo" valuePropName="checked">
            <Checkbox>
              {t('housing.includeCompanyLogo')}
            </Checkbox>
          </Form.Item>
        </div>

        {/* Generate Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => handleGenerate('pdf')}
            disabled={selectedFields.length === 0}
            size="large"
            className="bg-primaryColor hover:bg-primaryColor/90 border-2 border-primaryColor flex-1 min-w-[150px]"
          >
            {t('housing.generatePDF')}
          </Button>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={() => handleGenerate('excel')}
            disabled={selectedFields.length === 0}
            size="large"
            className="bg-secondaryColor hover:bg-secondaryColor/90 border-2 border-secondaryColor flex-1 min-w-[150px]"
          >
            {t('housing.generateExcel')}
          </Button>
        </div>
      </Form>
    </GlassCard>
  );
};

