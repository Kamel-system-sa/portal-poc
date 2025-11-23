import { Modal, Button, Card, Image, Typography, Tag } from "antd";
import {
  IdcardOutlined,
  BankOutlined,
  TeamOutlined,
  ManOutlined,
  WomanOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { Organizer } from "./types";

const { Text } = Typography;

interface OrganizerDetailsModalProps {
  visible: boolean;
  organizer: Organizer | null;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
  translateNationality: (nationality: string) => string;
  translateGender?: (gender: string) => string;
  t: (key: string) => string;
}

export const OrganizerDetailsModal = ({
  visible,
  organizer,
  onCancel,
  onEdit,
  onDelete,
  translateNationality,
  translateGender,
  t,
}: OrganizerDetailsModalProps) => {
  if (!organizer) return null;

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="bg-mainColor/10 p-2 rounded-lg">
            <IdcardOutlined className="text-mainColor text-xl" />
          </div>
          <span className="text-xl font-semibold">{t("organizerDetails")}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button
          key="delete"
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          danger
          className="h-10 px-6 rounded-lg font-medium bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 text-white"
          size="large"
          style={{ color: '#ffffff', backgroundColor: '#EF4444', borderColor: '#EF4444' }}
        >
          {t("deleteOrganizer") || "Delete Organizer"}
        </Button>,
        <Button
          key="edit"
          icon={<EditOutlined />}
          onClick={onEdit}
          className="bg-gradient-to-r from-mainColor to-primary border-0 hover:from-[#00443A] hover:to-[#00695C] text-white h-10 px-6 rounded-lg font-medium shadow-md shadow-mainColor/20 hover:shadow-lg hover:shadow-mainColor/25 transform hover:-translate-y-0.5 transition-all duration-300"
          size="large"
          style={{ color: '#ffffff' }}
        >
          {t("editOrganizer")}
        </Button>,
      ]}
      width={800}
      className="organizer-details-modal"
    >
      <div className="mt-4">
        {/* Profile Image Section */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-mainColor/20 to-primary/20 rounded-xl blur-lg"></div>
            {organizer.imageURL ? (
              <Image
                src={organizer.imageURL}
                alt={organizer.company}
                className="rounded-xl border-2 border-white shadow-lg relative z-10"
                width={120}
                height={120}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <img
                src={organizer.gender === "Male" ? "/images/male.png" : "/images/female.png"}
                alt={organizer.gender === "Male" ? "Male" : "Female"}
                className="rounded-xl border-2 border-white shadow-lg relative z-10"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                  backgroundColor: "#f5f5f5",
                }}
              />
            )}
          </div>
        </div>

        {/* Company Name - Prominent */}
        <div className="text-center mb-4">
          <Text className="text-xl font-bold text-gray-800 block mb-2">{organizer.company}</Text>
          <Tag className="bg-primary/10 text-primary border-primary/20 px-3 py-0.5 text-xs font-medium rounded-full">
            {translateNationality(organizer.nationality)}
          </Tag>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Column */}
          <div className="space-y-3">
            {/* Organizer Number */}
            <Card className="detail-info-card border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-2">
                <div className="bg-mainColor/10 p-2 rounded-lg flex-shrink-0">
                  <IdcardOutlined className="text-mainColor" />
                </div>
                <div className="flex-1 min-w-0">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-0.5">
                    {t("organizerNumber")}
                  </Text>
                  <Text className="text-sm font-semibold text-gray-800 block truncate">{organizer.organizerNumber}</Text>
                </div>
              </div>
            </Card>

            {/* License Number */}
            <Card className="detail-info-card border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                  <BankOutlined className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-0.5">
                    {t("licenseNumber")}
                  </Text>
                  <Text className="text-sm font-semibold text-gray-800 block truncate">{organizer.licenseNumber}</Text>
                </div>
              </div>
            </Card>

            {/* Hajj Count - Special Card */}
            <Card className="detail-info-card border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-mainColor/5 to-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <div className="bg-mainColor/20 p-2 rounded-lg flex-shrink-0">
                    <TeamOutlined className="text-mainColor" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-0.5">
                      {t("hajjCount")}
                    </Text>
                    <Text className="text-xl font-bold text-mainColor">{organizer.hajjCount}</Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Gender */}
            <Card className="detail-info-card border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-2">
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${organizer.gender === "Male" ? "bg-blue-50" : "bg-pink-50"}`}
                >
                  {organizer.gender === "Male" ? (
                    <ManOutlined className={`text-blue-500`} />
                  ) : (
                    <WomanOutlined className={`text-pink-500`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-0.5">
                    {t("gender")}
                  </Text>
                  <Text className="text-sm font-semibold text-gray-800">{translateGender ? translateGender(organizer.gender) : organizer.gender}</Text>
                </div>
              </div>
            </Card>

            {/* Organizer Nationality */}
            {organizer.organizerNationality && (
              <Card className="detail-info-card border-0 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                    <GlobalOutlined className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-0.5">
                      {t("organizerNationality") || "Organizer Nationality"}
                    </Text>
                    <Text className="text-sm font-semibold text-gray-800">{translateNationality(organizer.organizerNationality || "")}</Text>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {/* Phone */}
            <Card className="detail-info-card border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-2">
                <div className="bg-green-50 p-2 rounded-lg flex-shrink-0">
                  <PhoneOutlined className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-0.5">
                    {t("phone")}
                  </Text>
                  <div className="phone-display-wrapper">
                    <Text className="text-sm font-semibold text-gray-800 phone-display">
                      {organizer.phoneCountryCode && organizer.phoneNumber
                        ? `${organizer.phoneCountryCode} ${organizer.phoneNumber}`
                        : organizer.phone || "N/A"}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Country Phone */}
            <Card className="detail-info-card border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-2">
                <div className="bg-green-50 p-2 rounded-lg flex-shrink-0">
                  <PhoneOutlined className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-0.5">
                    {t("countryPhone")}
                  </Text>
                  <div className="phone-display-wrapper">
                    <Text className="text-sm font-semibold text-gray-800 phone-display">
                      {organizer.countryPhoneCountryCode && organizer.countryPhoneNumber
                        ? `${organizer.countryPhoneCountryCode} ${organizer.countryPhoneNumber}`
                        : organizer.countryPhone || "N/A"}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Email */}
            <Card className="detail-info-card border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-2">
                <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                  <MailOutlined className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-0.5">
                    {t("email")}
                  </Text>
                  <Text className="text-sm font-semibold text-gray-800 break-all">{organizer.email}</Text>
                </div>
              </div>
            </Card>

            {/* Passport */}
            <Card className="detail-info-card border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-2">
                <div className="bg-purple-50 p-2 rounded-lg flex-shrink-0">
                  <IdcardOutlined className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-0.5">
                    {t("passport")}
                  </Text>
                  <Text className="text-sm font-semibold text-gray-800 block truncate">{organizer.passport}</Text>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Modal>
  );
};

