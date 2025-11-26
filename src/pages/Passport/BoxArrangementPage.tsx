import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Select, Button, message, Card, Space } from 'antd';
import { SaveOutlined, InboxOutlined } from '@ant-design/icons';

const { Option } = Select;

interface BoxArrangementForm {
  passportSortMethod: string;
  boxSortMethod: string;
  shelf: string;
}

const BoxArrangementPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm<BoxArrangementForm>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: BoxArrangementForm) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store box sort method in localStorage for use in AssignToBoxPanel
      if (values.boxSortMethod) {
        localStorage.setItem('passport_boxSortMethod', values.boxSortMethod);
      }
      
      message.success(t('passport.arrangementSaved') || 'Box arrangement saved successfully');
      form.resetFields();
    } catch (error) {
      message.error(t('passport.saveError') || 'Failed to save arrangement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t('passport.boxArrangement')}
        </h1>
        <p className="text-gray-600">{t('passport.boxArrangementSubtitle')}</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
      >
        {/* Passport Sort Method */}
        <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mainColor to-primaryColor flex items-center justify-center shadow-md shadow-mainColor/20">
              <InboxOutlined className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('passport.passportSortMethod')}</h2>
          </div>

          <Form.Item
            name="passportSortMethod"
            label={t('passport.howToSortPassports')}
            rules={[{ required: true, message: t('passport.selectSortMethod') || 'Please select a sort method' }]}
          >
            <Select
              size="large"
              placeholder={t('passport.selectSortMethod') || 'Select sort method'}
              className="w-full"
            >
              <Option value="organizer">{t('passport.sortByOrganizer')}</Option>
              <Option value="nationality">{t('passport.sortByNationality')}</Option>
              <Option value="alphabetical">{t('passport.sortByAlphabet')}</Option>
              <Option value="passportNumber">{t('passport.sortByPassportNumber')}</Option>
              <Option value="custom">{t('passport.sortCustom')}</Option>
              <Option value="asReceived">{t('passport.sortAsReceived')}</Option>
            </Select>
          </Form.Item>
        </Card>

        {/* Box Sort Method */}
        <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primaryColor to-secondaryColor flex items-center justify-center shadow-md shadow-primaryColor/20">
              <InboxOutlined className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('passport.boxSortMethod')}</h2>
          </div>

          <Form.Item
            name="boxSortMethod"
            label={t('passport.howToSortBoxes')}
            rules={[{ required: true, message: t('passport.selectSortMethod') || 'Please select a sort method' }]}
          >
            <Select
              size="large"
              placeholder={t('passport.selectSortMethod') || 'Select sort method'}
              className="w-full"
            >
              <Option value="boxNumber">{t('passport.sortByBoxNumber')}</Option>
              <Option value="nationality">{t('passport.sortByNationality')}</Option>
              <Option value="organizer">{t('passport.sortByOrganizer')}</Option>
              <Option value="custom">{t('passport.sortCustom')}</Option>
            </Select>
          </Form.Item>
        </Card>

        {/* Shelf Selection */}
        <Card className="bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondaryColor to-primaryColor flex items-center justify-center shadow-md shadow-secondaryColor/20">
              <InboxOutlined className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('passport.shelf')}</h2>
          </div>

          <Form.Item
            name="shelf"
            label={t('passport.selectShelf')}
            rules={[{ required: true, message: t('passport.selectShelf') || 'Please select a shelf' }]}
          >
            <Select
              size="large"
              placeholder={t('passport.selectShelf') || 'Select shelf'}
              className="w-full"
            >
              <Option value="A">{t('passport.shelfA')}</Option>
              <Option value="B">{t('passport.shelfB')}</Option>
              <Option value="C">{t('passport.shelfC')}</Option>
              <Option value="D">{t('passport.shelfD')}</Option>
              <Option value="1">{t('passport.shelf1')}</Option>
              <Option value="2">{t('passport.shelf2')}</Option>
              <Option value="3">{t('passport.shelf3')}</Option>
              <Option value="4">{t('passport.shelf4')}</Option>
            </Select>
          </Form.Item>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            htmlType="submit"
            loading={loading}
            className="min-w-[200px] h-12 text-base font-semibold bg-gradient-to-r from-mainColor to-primaryColor hover:from-mainColor/90 hover:to-primaryColor/90 border-0 shadow-lg shadow-mainColor/30 hover:shadow-xl hover:shadow-mainColor/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            {t('passport.saveArrangement')}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default BoxArrangementPage;

