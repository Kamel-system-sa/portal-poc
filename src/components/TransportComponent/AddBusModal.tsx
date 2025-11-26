import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Form, Input, InputNumber, Button, message, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../HousingComponent/GlassCard';
import type { Bus, Passenger } from '../../types/transport';
import { PlusOutlined, CloseOutlined, UserOutlined, PhoneOutlined, CarOutlined, ClockCircleOutlined, EnvironmentOutlined, IdcardOutlined } from '@ant-design/icons';
import { mockTransportData } from '../../data/mockTransport';

interface AddBusModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bus: Omit<Bus, 'id' | 'createdAt'>) => void;
  bus?: Bus; // For editing
}

export const AddBusModal: React.FC<AddBusModalProps> = ({ open, onClose, onSubmit, bus }) => {
  const { t } = useTranslation('Transport');
  const [form] = Form.useForm();
  const [passengers, setPassengers] = useState<Omit<Passenger, 'id'>[]>([]);

  // Get unique routes from mock data
  const availableRoutes = useMemo(() => {
    const routes = new Set<string>();
    mockTransportData.forEach(bus => {
      routes.add(bus.route);
    });
    // Add common routes if not in mock data
    const commonRoutes = [
      'Jeddah → Makkah',
      'Jeddah → Madinah',
      'Makkah → Jeddah',
      'Makkah → Madinah',
      'Madinah → Jeddah',
      'Madinah → Makkah'
    ];
    commonRoutes.forEach(route => routes.add(route));
    return Array.from(routes).sort();
  }, []);

  useEffect(() => {
    if (bus) {
      form.setFieldsValue({
        route: bus.route,
        departureTime: bus.departureTime,
        expectedArrival: bus.expectedArrival,
        transportCompany: bus.transportCompany,
        licensePlate: bus.licensePlate,
        busNumber: bus.busNumber,
        busId: bus.busId,
        driver1Name: bus.driver1Name,
        driver1Phone: bus.driver1Phone,
        driver2Name: bus.driver2Name,
        driver2Phone: bus.driver2Phone,
        capacity: bus.capacity,
      });
      setPassengers(bus.passengers.map(p => ({ ...p, id: undefined })));
    } else {
      form.resetFields();
      setPassengers([]);
    }
  }, [bus, open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newBus: Omit<Bus, 'id' | 'createdAt'> = {
        route: values.route,
        departureTime: values.departureTime,
        expectedArrival: values.expectedArrival,
        transportCompany: values.transportCompany,
        licensePlate: values.licensePlate,
        busNumber: values.busNumber,
        busId: values.busId,
        driver1Name: values.driver1Name,
        driver1Phone: values.driver1Phone,
        driver2Name: values.driver2Name,
        driver2Phone: values.driver2Phone,
        capacity: values.capacity,
        passengers: passengers.map((p, index) => ({
          ...p,
          id: `pass-${Date.now()}-${index}`,
          seatNumber: p.seatNumber || index + 1
        })) as Passenger[],
        status: 'scheduled'
      };
      onSubmit(newBus);
      message.success(bus ? t('busUpdated') || 'Bus updated' : t('busAdded') || 'Bus added');
      form.resetFields();
      setPassengers([]);
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setPassengers([]);
    onClose();
  };

  return (
    <Modal
      title={bus ? t('editBusTitle') : t('addBusTitle')}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={1200}
      destroyOnClose
      aria-label={bus ? t('editBusTitle') : t('addBusTitle')}
      closeIcon={<CloseOutlined className="text-gray-500 hover:text-gray-700" />}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        {/* Bus Information Section */}
        <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <CarOutlined className="text-primaryColor text-xl" />
            <h3 className="text-xl font-bold text-gray-800">{t('busDetails')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Form.Item
              name="route"
              label={t('route')}
              rules={[{ required: true, message: t('requiredField') }]}
            >
              <Select
                placeholder={t('selectRoute')}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={availableRoutes.map(route => ({
                  value: route,
                  label: route
                }))}
              />
            </Form.Item>

            <Form.Item
              name="transportCompany"
              label={t('transportCompany')}
              rules={[{ required: true, message: t('requiredField') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="licensePlate"
              label={t('licensePlate')}
              rules={[{ required: true, message: t('requiredField') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="busNumber"
              label={t('busNumber')}
              rules={[{ required: true, message: t('requiredField') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="busId"
              label={t('busId') || 'Bus ID'}
              rules={[{ required: true, message: t('requiredField') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="capacity"
              label={t('capacity')}
              rules={[{ required: true, message: t('requiredField') }]}
            >
              <InputNumber min={1} max={100} className="w-full" />
            </Form.Item>

            <Form.Item
              name="departureTime"
              label={t('departure')}
              rules={[{ required: true, message: t('requiredField') }]}
            >
              <Input type="time" />
            </Form.Item>

            <Form.Item
              name="expectedArrival"
              label={t('expectedArrival')}
              rules={[{ required: true, message: t('requiredField') }]}
            >
              <Input type="time" />
            </Form.Item>
          </div>
        </GlassCard>

        {/* Driver 1 Section */}
        <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <UserOutlined className="text-primaryColor text-xl" />
            <h3 className="text-xl font-bold text-gray-800">{t('driver1')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="driver1Name"
              label={t('driverName') || 'Driver Name'}
              rules={[{ required: true, message: t('requiredField') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="driver1Phone"
              label={t('phoneNumber')}
              rules={[{ required: true, message: t('requiredField') }]}
            >
              <Input type="tel" />
            </Form.Item>
          </div>
        </GlassCard>

        {/* Driver 2 Section */}
        <GlassCard className="p-6 border-2 border-bordergray/50 bg-white/90 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <UserOutlined className="text-primaryColor text-xl" />
            <h3 className="text-xl font-bold text-gray-800">{t('driver2')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="driver2Name"
              label={t('driverName') || 'Driver Name'}
              rules={[{ required: true, message: t('requiredField') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="driver2Phone"
              label={t('phoneNumber')}
              rules={[{ required: true, message: t('requiredField') }]}
            >
              <Input type="tel" />
            </Form.Item>
          </div>
        </GlassCard>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={handleCancel} size="large">{t('cancel')}</Button>
          <Button type="primary" htmlType="submit" size="large">
            {t('save')}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
