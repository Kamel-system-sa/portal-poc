import { Form, Input, Select, Upload, Button } from "antd";
import {
  PlusOutlined,
  MailOutlined,
  GlobalOutlined,
  IdcardOutlined,
  BankOutlined,
  TeamOutlined,
  PhoneOutlined,
  UserOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { countryCodes } from "./constants";

const { Option } = Select;

interface OrganizerFormProps {
  form: any;
  onFinish: (values: any) => void;
  uploading: boolean;
  imageFile: File | null;
  onImageChange: (file: File | null) => void;
  t: (key: string) => string;
  submitText?: string;
  loadingText?: string;
}

export const OrganizerForm = ({
  form,
  onFinish,
  uploading,
  imageFile,
  onImageChange,
  t,
  submitText,
  loadingText,
}: OrganizerFormProps) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-6">
      {/* Row 1: Organizer Data and Contact Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* بيانات المنظم */}
        <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h4 className="text-xl font-bold text-gray-900">{t("organizerData")}</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="organizerNumber"
              rules={[{ required: true, message: t("requiredField") }]}
              className="mb-0"
            >
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <IdcardOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t("organizerNumber")}</span>
                </div>
                <Input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  placeholder={t("organizerNumber")}
                />
              </label>
            </Form.Item>

            <Form.Item
              name="licenseNumber"
              rules={[{ required: true, message: t("requiredField") }]}
              className="mb-0"
            >
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <BankOutlined className="text-primary text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t("licenseNumber")}</span>
                </div>
                <Input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  placeholder={t("licenseNumber")}
                />
              </label>
            </Form.Item>

            <Form.Item
              name="organizerName"
              rules={[{ required: true, message: t("requiredField") }]}
              className="mb-0"
            >
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t("organizerName")}</span>
                </div>
                <Input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  placeholder={t("organizerName")}
                />
              </label>
            </Form.Item>

            <Form.Item
              name="company"
              rules={[{ required: true, message: t("requiredField") }]}
              className="mb-0"
            >
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <TeamOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t("companyName")}</span>
                </div>
                <Input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  placeholder={t("companyNamePlaceholder")}
                />
              </label>
            </Form.Item>

            <Form.Item
              name="hajjCount"
              rules={[
                { required: true, message: t("requiredField") },
                {
                  validator: (_, value) => {
                    const numValue = Number(value);
                    if (isNaN(numValue) || numValue < 0) {
                      return Promise.reject(new Error(t("invalidNumber")));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              className="mb-0"
            >
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <TeamOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t("hajjCount")}</span>
                </div>
                <Input
                  type="number"
                  min={0}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  placeholder={t("hajjCount")}
                />
              </label>
            </Form.Item>

            <Form.Item
              name="nationality"
              rules={[{ required: true, message: t("requiredField") }]}
              className="mb-0"
            >
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <GlobalOutlined className="text-primary text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t("hajjNationality") || "Hajj Nationality"}</span>
                </div>
                <Input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  placeholder={t("hajjNationality") || "Hajj Nationality"}
                />
              </label>
            </Form.Item>

            <Form.Item
              name="gender"
              rules={[{ required: true, message: t("requiredField") }]}
              className="mb-0"
            >
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t("gender")}</span>
                </div>
                <Select
                  placeholder={t("selectGender")}
                  className="w-full"
                  style={{
                    height: "48px",
                  }}
                  dropdownStyle={{
                    borderRadius: "12px",
                  }}
                >
                  <Option value="Male">{t("male")}</Option>
                  <Option value="Female">{t("female")}</Option>
                </Select>
              </label>
            </Form.Item>

            <Form.Item
              name="passport"
              rules={[{ required: true, message: t("requiredField") }]}
              className="mb-0"
            >
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <IdcardOutlined className="text-purple-600 text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t("passport")}</span>
                </div>
                <Input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  placeholder={t("passport")}
                />
              </label>
            </Form.Item>
          </div>
        </section>

        {/* بيانات التواصل */}
        <section className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-mainColor to-primary rounded-full"></div>
            <h4 className="text-xl font-bold text-gray-900">{t("contactData")}</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Phone Number */}
            <Form.Item
              required
              className="mb-0 col-span-2"
            >
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <PhoneOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t("phone")}</span>
                </div>
                <div className="flex gap-2 phone-field-wrapper" style={{ direction: "ltr" }}>
                  <Form.Item
                    name="phoneCountryCode"
                    rules={[{ required: true, message: t("requiredField") }]}
                    style={{ marginBottom: 0, width: "140px", flexShrink: 0 }}
                  >
                    <Select
                      placeholder={t("countryCode")}
                      showSearch
                      className="country-code-select"
                      style={{ direction: "ltr", textAlign: "left", height: "48px" }}
                      dropdownStyle={{
                        borderRadius: "12px",
                      }}
                      filterOption={(input, option) => {
                        const text = String(option?.children || option?.value || "").toLowerCase();
                        return text.includes(input.toLowerCase());
                      }}
                    >
                      {countryCodes.map((country) => (
                        <Option key={country.code} value={country.code}>
                          <div style={{ textAlign: "left", direction: "ltr" }}>
                            <span style={{ fontWeight: "bold" }}>{country.code}</span>
                            <span className="ml-2 text-gray-500">{country.country}</span>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="phoneNumber"
                    rules={[{ required: true, message: t("requiredField") }]}
                    style={{ marginBottom: 0, flex: 1 }}
                  >
                    <Input
                      placeholder={t("phoneNumber")}
                      className="phone-number-input"
                      style={{ direction: "ltr", textAlign: "left", height: "48px" }}
                    />
                  </Form.Item>
                </div>
              </label>
            </Form.Item>

            {/* Country Phone Number */}
            <Form.Item
              required
              className="mb-0 col-span-2"
            >
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <PhoneOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t("countryPhone")}</span>
                </div>
                <div className="flex gap-2 phone-field-wrapper" style={{ direction: "ltr" }}>
                  <Form.Item
                    name="countryPhoneCountryCode"
                    rules={[{ required: true, message: t("requiredField") }]}
                    style={{ marginBottom: 0, width: "140px", flexShrink: 0 }}
                  >
                    <Select
                      placeholder={t("countryCode")}
                      showSearch
                      className="country-code-select"
                      style={{ direction: "ltr", textAlign: "left", height: "48px" }}
                      dropdownStyle={{
                        borderRadius: "12px",
                      }}
                      filterOption={(input, option) => {
                        const text = String(option?.children || option?.value || "").toLowerCase();
                        return text.includes(input.toLowerCase());
                      }}
                    >
                      {countryCodes.map((country) => (
                        <Option key={country.code} value={country.code}>
                          <div style={{ textAlign: "left", direction: "ltr" }}>
                            <span style={{ fontWeight: "bold" }}>{country.code}</span>
                            <span className="ml-2 text-gray-500">{country.country}</span>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="countryPhoneNumber"
                    rules={[{ required: true, message: t("requiredField") }]}
                    style={{ marginBottom: 0, flex: 1 }}
                  >
                    <Input
                      placeholder={t("phoneNumber")}
                      className="phone-number-input"
                      style={{ direction: "ltr", textAlign: "left", height: "48px" }}
                    />
                  </Form.Item>
                </div>
              </label>
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: t("requiredField") },
                { type: "email", message: t("invalidEmail") },
              ]}
              className="mb-0"
            >
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <MailOutlined className="text-blue-600 text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t("email")}</span>
                </div>
                <Input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700"
                  placeholder={t("email")}
                />
              </label>
            </Form.Item>

            {/* Image Upload */}
            <Form.Item
              className="mb-0"
            >
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <PictureOutlined className="text-mainColor text-base" />
                  <span className="block text-sm font-semibold text-gray-700">{t("imageUpload")}</span>
                </div>
                <Upload
                  beforeUpload={(file) => {
                    onImageChange(file);
                    return false;
                  }}
                  onRemove={() => onImageChange(null)}
                  maxCount={1}
                  accept="image/*"
                  className="upload-image-wrapper-small"
                >
                  <Button
                    icon={<PlusOutlined />}
                    size="large"
                    className="w-full rounded-xl border-dashed border-2 border-gray-300 hover:border-mainColor hover:text-mainColor transition-all duration-300 h-12"
                  >
                    {t("uploadImage")}
                  </Button>
                </Upload>
              </label>
            </Form.Item>
          </div>
        </section>
      </div>
    </Form>
  );
};
