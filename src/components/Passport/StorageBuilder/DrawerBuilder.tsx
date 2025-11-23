import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Input, Button, List, Modal, Form, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { Drawer, Cabinet } from '../../../types/passport';

interface DrawerBuilderProps {
  cabinets: Cabinet[];
  onAdd: (cabinetId: string, drawer: Omit<Drawer, 'id' | 'boxes'>) => void;
  onEdit: (cabinetId: string, drawerId: string, drawer: Partial<Drawer>) => void;
  onDelete: (cabinetId: string, drawerId: string) => void;
}

export const DrawerBuilder: React.FC<DrawerBuilderProps> = ({
  cabinets,
  onAdd,
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDrawer, setEditingDrawer] = useState<{ drawer: Drawer; cabinetId: string } | null>(null);

  const handleAdd = () => {
    setEditingDrawer(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (cabinetId: string, drawer: Drawer) => {
    setEditingDrawer({ drawer, cabinetId });
    form.setFieldsValue({
      cabinetId,
      number: drawer.number,
      name: drawer.name
    });
    setModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingDrawer) {
        onEdit(editingDrawer.cabinetId, editingDrawer.drawer.id, {
          number: values.number,
          name: values.name
        });
      } else {
        onAdd(values.cabinetId, {
          number: values.number,
          name: values.name,
          boxes: []
        });
      }
      setModalVisible(false);
      form.resetFields();
    });
  };

  const allDrawers = cabinets.flatMap(cabinet =>
    cabinet.drawers.map(drawer => ({ drawer, cabinetId: cabinet.id, cabinetNumber: cabinet.number }))
  );

  return (
    <Card 
      title={t('passport.storageLayout.drawer')}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('passport.storageLayout.addDrawer')}
        </Button>
      }
    >
      <List
        dataSource={allDrawers}
        renderItem={({ drawer, cabinetId, cabinetNumber }) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                icon={<EditOutlined />}
                onClick={() => handleEdit(cabinetId, drawer)}
              />,
              <Button
                key="delete"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(cabinetId, drawer.id)}
              />
            ]}
          >
            <List.Item.Meta
              title={`${t('passport.storageLayout.drawer')} ${drawer.number}${drawer.name ? ` - ${drawer.name}` : ''}`}
              description={`${t('passport.storageLayout.cabinet')} ${cabinetNumber} - ${drawer.boxes.length} ${t('passport.storageLayout.boxes')}`}
            />
          </List.Item>
        )}
        locale={{ emptyText: t('passport.storageLayout.noDrawers') }}
      />

      <Modal
        title={editingDrawer ? t('passport.storageLayout.editDrawer') : t('passport.storageLayout.addDrawer')}
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
            <Select disabled={!!editingDrawer}>
              {cabinets.map(cabinet => (
                <Select.Option key={cabinet.id} value={cabinet.id}>
                  {t('passport.storageLayout.cabinet')} {cabinet.number}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="number"
            label={t('passport.storageLayout.drawerNumber')}
            rules={[{ required: true, message: t('passport.storageLayout.enterDrawerNumber') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label={t('passport.storageLayout.drawerName')}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

