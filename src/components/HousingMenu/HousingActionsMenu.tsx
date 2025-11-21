import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, Modal, Form, Input, Select, InputNumber } from 'antd';
import { MoreOutlined, UploadOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Option } = Select;

interface HousingActionsMenuProps {
  type: 'hotel' | 'building' | 'mina' | 'arafat';
}

export const HousingActionsMenu: React.FC<HousingActionsMenuProps> = ({ type }) => {
  const { t } = useTranslation('common');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [manualEntryModalOpen, setManualEntryModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [exportForm] = Form.useForm();
  const [manualEntryForm] = Form.useForm();

  const isRoomType = type === 'hotel' || type === 'building';
  const isTentType = type === 'mina' || type === 'arafat';

  const handleImport = () => {
    setImportModalOpen(true);
  };

  const handleExport = () => {
    setExportModalOpen(true);
  };

  const handleManualEntry = () => {
    setManualEntryModalOpen(true);
  };

  const handleImportSubmit = () => {
    // UI only - no backend
    form.resetFields();
    setImportModalOpen(false);
  };

  const handleExportSubmit = () => {
    // UI only - no backend
    exportForm.resetFields();
    setExportModalOpen(false);
  };

  const handleManualEntrySubmit = () => {
    // UI only - no backend
    manualEntryForm.resetFields();
    setManualEntryModalOpen(false);
  };

  const getManualEntryLabel = () => {
    switch (type) {
      case 'hotel':
        return t('housing.addHotel');
      case 'building':
        return t('housing.addBuilding');
      case 'mina':
      case 'arafat':
        return t('housing.addCamp');
      default:
        return t('housing.addRecord');
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'import',
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <UploadOutlined className="text-primaryColor" />
          <span>{t('housing.import') || 'Import'}</span>
        </div>
      ),
      onClick: handleImport,
    },
    {
      key: 'export',
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <DownloadOutlined className="text-primaryColor" />
          <span>{t('housing.export') || 'Export'}</span>
        </div>
      ),
      onClick: handleExport,
    },
    {
      type: 'divider',
    },
    {
      key: 'manualEntry',
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <PlusOutlined className="text-primaryColor" />
          <span>{getManualEntryLabel()}</span>
        </div>
      ),
      onClick: handleManualEntry,
    },
  ];

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement="bottomRight"
        overlayClassName="housing-actions-menu"
        getPopupContainer={(trigger) => trigger.parentElement || document.body}
      >
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm border-2 border-bordergray hover:border-primaryColor hover:bg-primaryColor/5 text-gray-700 hover:text-primaryColor font-medium transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <MoreOutlined className="text-lg" />
          <span className="hidden sm:inline">{t('housing.actions') || 'Actions'}</span>
        </button>
      </Dropdown>

      {/* Import Modal */}
      <Modal
        title={t('housing.import') || 'Import'}
        open={importModalOpen}
        onCancel={() => {
          setImportModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleImportSubmit}
          className="mt-4"
        >
          <Form.Item
            label={t('housing.selectExcelFile')}
            name="file"
            rules={[{ required: true, message: t('housing.pleaseSelectFile') }]}
          >
            <Input
              type="file"
              accept=".xlsx,.xls"
              className="py-2"
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setImportModalOpen(false);
                  form.resetFields();
                }}
                className="px-4 py-2 rounded-lg border-2 border-bordergray text-gray-700 hover:border-primaryColor hover:text-primaryColor transition-all duration-200"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primaryColor text-white hover:bg-primaryColor/90 border-2 border-primaryColor transition-all duration-200"
              >
                {t('housing.upload')}
              </button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Export Modal */}
      <Modal
        title={t('housing.export') || 'Export'}
        open={exportModalOpen}
        onCancel={() => {
          setExportModalOpen(false);
          exportForm.resetFields();
        }}
        footer={null}
        width={600}
        centered
      >
        <Form
          form={exportForm}
          layout="vertical"
          onFinish={handleExportSubmit}
          className="mt-4"
        >
          <Form.Item
            label={t('housing.exportFormat') || 'Export Format'}
            name="format"
            rules={[{ required: true, message: t('housing.pleaseSelectFormat') || 'Please select format' }]}
          >
            <Select size="large" placeholder={t('housing.selectFormat') || 'Select format'}>
              <Option value="excel">Excel (.xlsx)</Option>
              <Option value="csv">CSV (.csv)</Option>
              <Option value="pdf">PDF (.pdf)</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={t('housing.includeFields') || 'Include Fields'}
            name="fields"
          >
            <Select
              mode="multiple"
              size="large"
              placeholder={t('housing.selectFields') || 'Select fields to include'}
            >
              <Option value="all">{t('housing.allFields') || 'All Fields'}</Option>
              <Option value="basic">{t('housing.basicInfo') || 'Basic Information'}</Option>
              <Option value="capacity">{t('housing.capacity') || 'Capacity'}</Option>
              <Option value="occupancy">{t('housing.occupancy') || 'Occupancy'}</Option>
            </Select>
          </Form.Item>
          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setExportModalOpen(false);
                  exportForm.resetFields();
                }}
                className="px-4 py-2 rounded-lg border-2 border-bordergray text-gray-700 hover:border-primaryColor hover:text-primaryColor transition-all duration-200"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primaryColor text-white hover:bg-primaryColor/90 border-2 border-primaryColor transition-all duration-200"
              >
                {t('housing.download') || 'Download'}
              </button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Manual Entry Modal */}
      <Modal
        title={getManualEntryLabel()}
        open={manualEntryModalOpen}
        onCancel={() => {
          setManualEntryModalOpen(false);
          manualEntryForm.resetFields();
        }}
        footer={null}
        width={700}
        centered
      >
        <Form
          form={manualEntryForm}
          layout="vertical"
          onFinish={handleManualEntrySubmit}
          className="mt-4"
        >
          <Form.Item
            label={isRoomType ? t('housing.hotelName') : t('housing.campName')}
            name="name"
            rules={[{ required: true, message: t('housing.pleaseEnterName') }]}
          >
            <Input size="large" placeholder={isRoomType ? t('housing.enterHotelName') : t('housing.enterCampName')} />
          </Form.Item>
          
          <Form.Item
            label={t('housing.location')}
            name="location"
            rules={[{ required: true, message: t('housing.pleaseEnterLocation') }]}
          >
            <Input size="large" placeholder={t('housing.enterLocation')} />
          </Form.Item>

          {isRoomType && (
            <>
              <Form.Item
                label={t('housing.totalRooms')}
                name="totalRooms"
                rules={[{ required: true, message: t('housing.pleaseEnterTotalRooms') }]}
              >
                <InputNumber min={1} className="w-full" size="large" placeholder={t('housing.enterTotalRooms')} />
              </Form.Item>
              <Form.Item
                label={t('housing.numberOfFloors')}
                name="floors"
              >
                <InputNumber min={1} className="w-full" size="large" placeholder={t('housing.enterNumberOfFloors')} />
              </Form.Item>
            </>
          )}

          {isTentType && (
            <>
              <Form.Item
                label={t('housing.totalTents')}
                name="totalTents"
                rules={[{ required: true, message: t('housing.pleaseEnterTotalTents') }]}
              >
                <InputNumber min={1} className="w-full" size="large" placeholder={t('housing.enterTotalTents')} />
              </Form.Item>
              <Form.Item
                label={t('housing.section')}
                name="section"
              >
                <Input size="large" placeholder={t('housing.enterSection')} />
              </Form.Item>
            </>
          )}

          <Form.Item
            label={t('housing.totalCapacity')}
            name="capacity"
            rules={[{ required: true, message: t('housing.pleaseEnterCapacity') }]}
          >
            <InputNumber min={1} className="w-full" size="large" placeholder={t('housing.enterCapacity')} />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setManualEntryModalOpen(false);
                  manualEntryForm.resetFields();
                }}
                className="px-4 py-2 rounded-lg border-2 border-bordergray text-gray-700 hover:border-primaryColor hover:text-primaryColor transition-all duration-200"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primaryColor text-white hover:bg-primaryColor/90 border-2 border-primaryColor transition-all duration-200"
              >
                {t('save')}
              </button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

