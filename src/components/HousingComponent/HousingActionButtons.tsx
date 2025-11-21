import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Form, Input, Select, InputNumber } from 'antd';
import { UploadOutlined, PlusOutlined, HomeOutlined } from '@ant-design/icons';
import { GlassCard } from './GlassCard';

const { Option } = Select;

interface HousingActionButtonsProps {
  type: 'hotel' | 'building' | 'mina' | 'arafat';
}

export const HousingActionButtons: React.FC<HousingActionButtonsProps> = ({ type }) => {
  const { t } = useTranslation('common');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addRoomsModalOpen, setAddRoomsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [roomsForm] = Form.useForm();

  const isRoomType = type === 'hotel' || type === 'building';
  const isTentType = type === 'mina' || type === 'arafat';

  const handleImportExcel = () => {
    setImportModalOpen(true);
  };

  const handleAdd = () => {
    setAddModalOpen(true);
  };

  const handleAddRooms = () => {
    setAddRoomsModalOpen(true);
  };

  const handleImportSubmit = () => {
    // UI only - no backend
    form.resetFields();
    setImportModalOpen(false);
  };

  const handleAddSubmit = () => {
    // UI only - no backend
    form.resetFields();
    setAddModalOpen(false);
  };

  const handleAddRoomsSubmit = () => {
    // UI only - no backend
    roomsForm.resetFields();
    setAddRoomsModalOpen(false);
  };

  const getActionLabels = () => {
    switch (type) {
      case 'hotel':
        return {
          import: t('housing.importExcel'),
          add: t('housing.addHotel'),
          addRooms: t('housing.addRoomsToHotel')
        };
      case 'building':
        return {
          import: t('housing.importExcel'),
          add: t('housing.addBuilding'),
          addRooms: t('housing.addRoomsToBuilding')
        };
      case 'mina':
        return {
          import: t('housing.importExcel'),
          add: t('housing.addCamp'),
          addRooms: t('housing.addBedsToCamp')
        };
      case 'arafat':
        return {
          import: t('housing.importExcel'),
          add: t('housing.addCamp'),
          addRooms: t('housing.addBedsToCamp')
        };
    }
  };

  const labels = getActionLabels();

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          type="default"
          icon={<UploadOutlined />}
          onClick={handleImportExcel}
          size="large"
          className="bg-white border-2 border-bordergray hover:border-primaryColor hover:text-primaryColor hover:bg-primaryColor/5 shadow-sm rounded-lg font-medium transition-all duration-200"
        >
          {labels.import}
        </Button>
        <Button
          type="default"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          size="large"
          className="bg-white border-2 border-bordergray hover:border-primaryColor hover:text-primaryColor hover:bg-primaryColor/5 shadow-sm rounded-lg font-medium transition-all duration-200"
        >
          {labels.add}
        </Button>
        <Button
          type="default"
          icon={<HomeOutlined />}
          onClick={handleAddRooms}
          size="large"
          className="bg-white border-2 border-bordergray hover:border-primaryColor hover:text-primaryColor hover:bg-primaryColor/5 shadow-sm rounded-lg font-medium transition-all duration-200"
        >
          {labels.addRooms}
        </Button>
      </div>

      {/* Import Excel Modal */}
      <Modal
        title={labels.import}
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
            label={t('housing.selectExcelFile') || 'Select Excel File'}
            name="file"
            rules={[{ required: true, message: t('housing.pleaseSelectFile') || 'Please select a file' }]}
          >
            <Input
              type="file"
              accept=".xlsx,.xls"
              className="py-2"
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <Button onClick={() => {
                setImportModalOpen(false);
                form.resetFields();
              }}>
                {t('cancel')}
              </Button>
              <Button type="primary" htmlType="submit" className="bg-primaryColor hover:bg-primaryColor/90">
                {t('housing.upload') || 'Upload'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Hotel/Building/Camp Modal */}
      <Modal
        title={labels.add}
        open={addModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddSubmit}
          className="mt-4"
        >
          <Form.Item
            label={isRoomType ? t('housing.hotelName') || 'Hotel/Building Name' : t('housing.campName') || 'Camp Name'}
            name="name"
            rules={[{ required: true, message: t('housing.pleaseEnterName') || 'Please enter name' }]}
          >
            <Input size="large" placeholder={isRoomType ? t('housing.enterHotelName') : t('housing.enterCampName')} />
          </Form.Item>
          
          <Form.Item
            label={t('housing.location')}
            name="location"
            rules={[{ required: true, message: t('housing.pleaseEnterLocation') || 'Please enter location' }]}
          >
            <Input size="large" placeholder={t('housing.enterLocation')} />
          </Form.Item>

          {isRoomType && (
            <>
              <Form.Item
                label={t('housing.totalRooms')}
                name="totalRooms"
                rules={[{ required: true, message: t('housing.pleaseEnterTotalRooms') || 'Please enter total rooms' }]}
              >
                <InputNumber min={1} className="w-full" size="large" placeholder={t('housing.enterTotalRooms')} />
              </Form.Item>
              <Form.Item
                label={t('housing.numberOfFloors') || 'Number of Floors'}
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
                rules={[{ required: true, message: t('housing.pleaseEnterTotalTents') || 'Please enter total tents' }]}
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
            label={t('housing.totalCapacity') || 'Total Capacity'}
            name="capacity"
            rules={[{ required: true, message: t('housing.pleaseEnterCapacity') || 'Please enter capacity' }]}
          >
            <InputNumber min={1} className="w-full" size="large" placeholder={t('housing.enterCapacity')} />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <Button onClick={() => {
                setAddModalOpen(false);
                form.resetFields();
              }}>
                {t('cancel')}
              </Button>
              <Button type="primary" htmlType="submit" className="bg-primaryColor hover:bg-primaryColor/90">
                {t('save')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Rooms/Beds Modal */}
      <Modal
        title={labels.addRooms}
        open={addRoomsModalOpen}
        onCancel={() => {
          setAddRoomsModalOpen(false);
          roomsForm.resetFields();
        }}
        footer={null}
        width={600}
        centered
      >
        <Form
          form={roomsForm}
          layout="vertical"
          onFinish={handleAddRoomsSubmit}
          className="mt-4"
        >
          <Form.Item
            label={isRoomType ? t('housing.selectHotel') || 'Select Hotel/Building' : t('housing.selectCamp') || 'Select Camp'}
            name="selectedItem"
            rules={[{ required: true, message: t('housing.pleaseSelectItem') || 'Please select an item' }]}
          >
            <Select size="large" placeholder={isRoomType ? t('housing.selectHotel') : t('housing.selectCamp')}>
              <Option value="1">{isRoomType ? 'Hotel 1' : 'Camp 1'}</Option>
              <Option value="2">{isRoomType ? 'Hotel 2' : 'Camp 2'}</Option>
            </Select>
          </Form.Item>

          {isRoomType ? (
            <>
              <Form.Item
                label={t('housing.numberOfRooms') || 'Number of Rooms'}
                name="numberOfRooms"
                rules={[{ required: true, message: t('housing.pleaseEnterNumberOfRooms') || 'Please enter number of rooms' }]}
              >
                <InputNumber min={1} className="w-full" size="large" placeholder={t('housing.enterNumberOfRooms')} />
              </Form.Item>
              <Form.Item
                label={t('housing.bedsPerRoom') || 'Beds per Room'}
                name="bedsPerRoom"
                rules={[{ required: true, message: t('housing.pleaseEnterBedsPerRoom') || 'Please enter beds per room' }]}
              >
                <InputNumber min={1} max={4} className="w-full" size="large" placeholder={t('housing.enterBedsPerRoom')} />
              </Form.Item>
            </>
          ) : (
            <Form.Item
              label={t('housing.numberOfBeds') || 'Number of Beds'}
              name="numberOfBeds"
              rules={[{ required: true, message: t('housing.pleaseEnterNumberOfBeds') || 'Please enter number of beds' }]}
            >
              <InputNumber min={1} className="w-full" size="large" placeholder={t('housing.enterNumberOfBeds')} />
            </Form.Item>
          )}

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <Button onClick={() => {
                setAddRoomsModalOpen(false);
                roomsForm.resetFields();
              }}>
                {t('cancel')}
              </Button>
              <Button type="primary" htmlType="submit" className="bg-primaryColor hover:bg-primaryColor/90">
                {t('save')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

