import { Layout, Button, Dropdown, Avatar, Typography, Tooltip } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";

const { Header } = Layout;
const { Title } = Typography;

interface AppHeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  collapsed,
  onToggleSidebar
}) => {
  const { t, i18n } = useTranslation("common");
  const isRtl = i18n.language === "ar" || i18n.language === "ur";

  const userMenuItems = [
    { key: "profile", label: <span>Profile</span> },
    { key: "settings", label: <span>Settings</span> },
    { key: "logout", label: <span>Logout</span> }
  ];

  const sidebarWidth = collapsed ? 80 : 220;
  const headerLeft = isRtl ? 0 : sidebarWidth;
  const headerRight = isRtl ? sidebarWidth : 0;

  return (
    <Header
      className="flex items-center justify-between px-4 bg-white shadow fixed top-0 z-40 transition-all duration-200"
      style={{ 
        height: 60, 
        left: headerLeft,
        right: headerRight
      }}
    >
      <div className="flex items-center gap-4">
        <Tooltip title={collapsed ? t("sidebar.openSidebar") : t("sidebar.closeSidebar")}>
          <Button
            type="text"
            onClick={onToggleSidebar}
            aria-label={collapsed ? t("sidebar.openSidebar") : t("sidebar.closeSidebar")}
            icon={
              collapsed ? (
                <MenuUnfoldOutlined style={{ fontSize: 20 }} />
              ) : (
                <MenuFoldOutlined style={{ fontSize: 20 }} />
              )
            }
          />
        </Tooltip>
        <Title
          level={4}
          className="m-0 text-mainColor font-bold"
        >
          {t("portalTitle")}
        </Title>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <Button type="text" icon={<BellOutlined style={{ fontSize: 20 }} />} />
        <Dropdown
          menu={{ items: userMenuItems }}
          placement={isRtl ? "bottomLeft" : "bottomRight"}
          trigger={["click"]}
        >
          <Avatar
            className="bg-mainColor cursor-pointer"
            icon={<UserOutlined />}
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
