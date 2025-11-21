import { Card, Button, Image, Typography, Tag } from "antd";
import { EyeOutlined, IdcardOutlined, BankOutlined, TeamOutlined, ManOutlined, WomanOutlined } from "@ant-design/icons";
import type { Organizer } from "./types";

const { Text } = Typography;

interface OrganizerCardProps {
  organizer: Organizer;
  onShowDetails: (organizer: Organizer) => void;
  translateNationality: (nationality: string) => string;
  translateGender?: (gender: string) => string;
  t: (key: string) => string;
}

export const OrganizerCard = ({ organizer, onShowDetails, translateNationality, t }: OrganizerCardProps) => {
  return (
    <Card
      key={organizer.id}
      className="shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group bg-gradient-to-br from-white to-gray-50"
      bodyStyle={{ padding: "0" }}
    >
      {/* Header with Image */}
      <div className="relative bg-gradient-to-br from-mainColor/10 to-primary/10 p-2">
        <div className="flex items-center justify-center mb-2">
          {organizer.imageURL ? (
            <div className="relative">
              <Image
                src={organizer.imageURL}
                alt={organizer.company}
                className="rounded-full border-2 border-white shadow-md"
                width={50}
                height={50}
                style={{ objectFit: "cover" }}
                preview={false}
              />
              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm">
                {organizer.gender === "Male" ? (
                  <ManOutlined className="text-blue-500 text-xs" />
                ) : (
                  <WomanOutlined className="text-pink-500 text-xs" />
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={organizer.gender === "Male" ? "/images/male.png" : "/images/female.png"}
                alt={organizer.gender === "Male" ? "Male" : "Female"}
                className="rounded-full border-2 border-white shadow-md"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "contain",
                }}
              />
              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm">
                {organizer.gender === "Male" ? (
                  <ManOutlined className="text-blue-500 text-xs" />
                ) : (
                  <WomanOutlined className="text-pink-500 text-xs" />
                )}
              </div>
            </div>
          )}
        </div>
        <div className="text-center">
          <Text className="text-sm font-bold text-gray-800 block truncate">{organizer.company}</Text>
          <Tag className="mt-1 rounded-full text-xs bg-primary/10 text-primary border-primary/20">
            {translateNationality(organizer.nationality)}
          </Tag>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-mainColor/5 rounded-lg p-1.5">
            <div className="flex items-center gap-1 mb-0.5">
              <IdcardOutlined className="text-mainColor text-xs" />
              <Text className="text-xs text-gray-500">{t("organizerNumber")}</Text>
            </div>
            <Text className="text-xs font-semibold text-gray-800 block truncate">{organizer.organizerNumber}</Text>
          </div>
          <div className="bg-primary/5 rounded-lg p-1.5">
            <div className="flex items-center gap-1 mb-0.5">
              <BankOutlined className="text-primary text-xs" />
              <Text className="text-xs text-gray-500">{t("licenseNumber")}</Text>
            </div>
            <Text className="text-xs font-semibold text-gray-800 block truncate">{organizer.licenseNumber}</Text>
          </div>
        </div>

        <div className="bg-gradient-to-r from-mainColor/10 to-primary/10 rounded-lg p-2 border-l-2 border-mainColor">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <TeamOutlined className="text-mainColor text-sm" />
              <Text className="text-xs text-gray-600">{t("hajjCount")}</Text>
            </div>
            <Text className="text-lg font-bold text-mainColor">{organizer.hajjCount}</Text>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-2 pt-0">
        <Button
          icon={<EyeOutlined />}
          onClick={() => onShowDetails(organizer)}
          block
          size="small"
          className="bg-gradient-to-r from-mainColor to-primary border-0 hover:from-[#00443A] hover:to-[#00695C] text-white rounded-lg font-medium shadow-md shadow-mainColor/20 hover:shadow-lg hover:shadow-mainColor/25 transform hover:-translate-y-0.5 transition-all duration-300"
          style={{ color: '#ffffff' }}
        >
          {t("showDetails")}
        </Button>
      </div>
    </Card>
  );
};

