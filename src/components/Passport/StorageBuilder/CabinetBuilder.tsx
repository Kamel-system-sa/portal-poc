import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Input, Button, List, Modal, Form } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { Cabinet } from '../../../types/passport';

interface CabinetBuilderProps {
  cabinets: Cabinet[];
  onAdd: (cabinet: Omit<Cabinet, 'id' | 'drawers'>) => void;
  onEdit: (id: string, cabinet: Partial<Cabinet>) => void;
  onDelete: (id: string) => void;
}

export const CabinetBuilder: React.FC<CabinetBuilderProps> = ({
  cabinets,
  onAdd,
  onEdit,
  onDelete
}) => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCabinet, setEditingCabinet] = useState<Cabinet | null>(null);

  const handleAdd = () => {
    setEditingCabinet(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (cabinet: Cabinet) => {
    setEditingCabinet(cabinet);
    form.setFieldsValue({
      number: cabinet.number,
      name: cabinet.name
    });
    setModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingCabinet) {
        onEdit(editingCabinet.id, values);
      } else {
        onAdd({
          number: values.number,
          name: values.name,
          drawers: []
        });
      }
      setModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <Card 
      title={t('passport.storageLayout.cabinet')}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('passport.storageLayout.addCabinet')}
        </Button>
      }
    >
      <List
        dataSource={cabinets}
        renderItem={(cabinet) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                icon={<EditOutlined />}
                onClick={() => handleEdit(cabinet)}
              />,
              <Button
                key="delete"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(cabinet.id)}
              />
            ]}
          >
            <List.Item.Meta
              title={`${t('passport.storageLayout.cabinet')} ${cabinet.number}${cabinet.name ? ` - ${cabinet.name}` : ''}`}
              description={`${cabinet.drawers.length} ${t('passport.storageLayout.drawers')}`}
            />
          </List.Item>
        )}
        locale={{ emptyText: t('passport.storageLayout.noCabinets') }}
      />

      <Modal
        title={editingCabinet ? t('passport.storageLayout.editCabinet') : t('passport.storageLayout.addCabinet')}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="number"
            label={t('passport.storageLayout.cabinetNumber')}
            rules={[{ required: true, message: t('passport.storageLayout.enterCabinetNumber') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label={t('passport.storageLayout.cabinetName')}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

