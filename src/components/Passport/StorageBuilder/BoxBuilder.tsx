import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Input, Button, List, Modal, Form, Select, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { Box, Cabinet, Drawer } from '../../../types/passport';

const { useWatch } = Form;

interface BoxBuilderProps {
  cabinets: Cabinet[];
  onAdd: (cabinetId: string, drawerId: string, box: Omit<Box, 'id' | 'passports'>) => void;
  onEdit: (cabinetId: string, drawerId: string, boxId: string, box: Partial<Box>) => void;
  onDelete: (cabinetId: string, drawerId: string, boxId: string) => void;
}

export const BoxBuilder: React.FC<BoxBuilderProps> = ({
  cabinets,
  onAdd,
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBox, setEditingBox] = useState<{ box: Box; cabinetId: string; drawerId: string } | null>(null);

  const handleAdd = () => {
    setEditingBox(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (cabinetId: string, drawerId: string, box: Box) => {
    setEditingBox({ box, cabinetId, drawerId });
    form.setFieldsValue({
      cabinetId,
      drawerId,
      number: box.number,
      name: box.name,
      capacity: box.capacity
    });
    setModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingBox) {
        onEdit(editingBox.cabinetId, editingBox.drawerId, editingBox.box.id, {
          number: values.number,
          name: values.name,
          capacity: values.capacity
        });
      } else {
        onAdd(values.cabinetId, values.drawerId, {
          number: values.number,
          name: values.name,
          capacity: values.capacity,
          passports: []
        });
      }
      setModalVisible(false);
      form.resetFields();
    });
  };

  const allBoxes = cabinets.flatMap(cabinet =>
    cabinet.drawers.flatMap(drawer =>
      drawer.boxes.map(box => ({
        box,
        cabinetId: cabinet.id,
        cabinetNumber: cabinet.number,
        drawerId: drawer.id,
        drawerNumber: drawer.number
      }))
    )
  );

  const selectedCabinetId = useWatch('cabinetId', form);
  const selectedDrawer = cabinets
    .find(c => c.id === selectedCabinetId)
    ?.drawers || [];

  return (
    <Card 
      title={t('passport.storageLayout.box')}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('passport.storageLayout.addBox')}
        </Button>
      }
    >
      <List
        dataSource={allBoxes}
        renderItem={({ box, cabinetId, cabinetNumber, drawerId, drawerNumber }) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                icon={<EditOutlined />}
                onClick={() => handleEdit(cabinetId, drawerId, box)}
              />,
              <Button
                key="delete"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(cabinetId, drawerId, box.id)}
              />
            ]}
          >
            <List.Item.Meta
              title={`${t('passport.storageLayout.box')} ${box.number}${box.name ? ` - ${box.name}` : ''}`}
              description={`${t('passport.storageLayout.cabinet')} ${cabinetNumber}, ${t('passport.storageLayout.drawer')} ${drawerNumber} - ${box.passports.length}/${box.capacity} ${t('passport.storageLayout.passports')}`}
            />
          </List.Item>
        )}
        locale={{ emptyText: t('passport.storageLayout.noBoxes') }}
      />

      <Modal
        title={editingBox ? t('passport.storageLayout.editBox') : t('passport.storageLayout.addBox')}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="cabinetId"
            label={t('passport.storageLayout.selectCabinet')}
            rules={[{ required: true, message: t('passport.storageLayout.selectCabinet') }]}
          >
            <Select 
              disabled={!!editingBox}
              onChange={() => form.setFieldValue('drawerId', undefined)}
            >
              {cabinets.map(cabinet => (
                <Select.Option key={cabinet.id} value={cabinet.id}>
                  {t('passport.storageLayout.cabinet')} {cabinet.number}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="drawerId"
            label={t('passport.storageLayout.selectDrawer')}
            rules={[{ required: true, message: t('passport.storageLayout.selectDrawer') }]}
          >
            <Select disabled={!!editingBox || !selectedCabinetId}>
              {selectedDrawer.map(drawer => (
                <Select.Option key={drawer.id} value={drawer.id}>
                  {t('passport.storageLayout.drawer')} {drawer.number}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="number"
            label={t('passport.storageLayout.boxNumber')}
            rules={[{ required: true, message: t('passport.storageLayout.enterBoxNumber') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label={t('passport.storageLayout.boxName')}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="capacity"
            label={t('passport.storageLayout.boxCapacity')}
            rules={[{ required: true, message: t('passport.storageLayout.enterBoxCapacity') }]}
          >
            <InputNumber min={1} max={1000} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

