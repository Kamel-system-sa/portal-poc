import { Button, Typography, Dropdown } from "antd";
import { PlusOutlined, TeamOutlined, MoreOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Title, Text } = Typography;

interface OrganizersHeaderProps {
  onAddClick: () => void;
  onExport: () => void;
  onImport: () => void;
  t: (key: string) => string;
}

export const OrganizersHeader = ({ onAddClick, onExport, onImport, t }: OrganizersHeaderProps) => {
  const items: MenuProps['items'] = [
    {
      key: 'export',
      label: t("exportData"),
      icon: <DownloadOutlined />,
      onClick: onExport,
    },
    {
      key: 'import',
      label: t("importData"),
      icon: <UploadOutlined />,
      onClick: onImport,
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-mainColor to-primary rounded-xl p-3 shadow-lg">
          <TeamOutlined className="text-white text-3xl" />
        </div>
        <div>
          <Title level={2} className="text-mainColor mb-0">
            {t("title")}
          </Title>
          <Text className="text-gray-500">{t("organizerData")} & {t("contactData")}</Text>
        </div>
      </div>
      <div className="flex justify-end gap-3 items-center">
        <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
          <Button
            size="middle"
            icon={<MoreOutlined />}
            className="border-gray-300 hover:border-mainColor hover:text-mainColor rounded-lg h-10 px-3 font-medium shadow-sm hover:shadow-md transition-all duration-300"
          >
            {t("actions")}
          </Button>
        </Dropdown>
        <Button
          size="large"
          onClick={onAddClick}
          className="add-organizer-btn bg-gradient-to-r from-mainColor to-primary border-0 hover:from-[#00443A] hover:to-[#00695C] text-white rounded-xl h-12 px-6 font-semibold shadow-lg shadow-mainColor/25 hover:shadow-xl hover:shadow-mainColor/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          style={{ color: '#ffffff' }}
        >
          <PlusOutlined className="text-lg" />
          <span>{t("addOrganizer")}</span>
        </Button>
      </div>
    </div>
  );
};

