import { Layout, Button, Dropdown, Avatar, Typography, Tooltip } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
  SwapOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";
import { useUserRole } from "../contexts/UserRoleContext";
import { getRoleDisplayName } from "../utils/rolePermissions";
import type { MenuProps } from "antd";

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
  const { currentRole, setCurrentRole, availableRoles } = useUserRole();
  const isRtl = i18n.language === "ar" || i18n.language === "ur";

  const handleRoleChange = (role: string) => {
    setCurrentRole(role as typeof currentRole);
  };

  const roleMenuItems: MenuProps["items"] = availableRoles.map((role) => ({
    key: `role-${role}`,
    label: (
      <div className="flex items-center justify-between w-full">
        <span>{getRoleDisplayName(role)}</span>
        {currentRole === role && (
          <span className="text-mainColor ml-2">✓</span>
        )}
      </div>
    ),
    onClick: () => handleRoleChange(role),
  }));

  const userMenuItems: MenuProps["items"] = [
    {
      key: "role-header",
      type: "group",
      label: (
        <div className="flex items-center gap-2">
          <SwapOutlined />
          <span className="font-semibold">{t("header.switchRole")}</span>
        </div>
      ),
    },
    ...roleMenuItems,
    { type: "divider" },
    { key: "profile", label: <span>{t("header.profile")}</span> },
    { key: "settings", label: <span>{t("header.settings")}</span> },
    { key: "logout", label: <span>{t("header.logout")}</span> }
  ];

  const sidebarWidth = collapsed ? 80 : 260;
  const headerLeft = isRtl ? 0 : sidebarWidth;
  const headerRight = isRtl ? sidebarWidth : 0;

  return (
    <Header
      className="flex items-center justify-between px-2 sm:px-3 md:px-4 bg-white shadow fixed top-0 z-40 transition-all duration-200 w-full"
      style={{ 
        height: '56px',
        left: headerLeft,
        right: headerRight,
        width: `calc(100% - ${headerLeft + headerRight}px)`
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
        <Tooltip title={collapsed ? t("sidebar.openSidebar") : t("sidebar.closeSidebar")}>
          <Button
            type="text"
            onClick={onToggleSidebar}
            aria-label={collapsed ? t("sidebar.openSidebar") : t("sidebar.closeSidebar")}
            className="flex-shrink-0"
            icon={
              isRtl ? (
                // RTL: Reverse the arrow direction
                collapsed ? (
                  <MenuFoldOutlined style={{ fontSize: 18 }} />
                ) : (
                  <MenuUnfoldOutlined style={{ fontSize: 18 }} />
                )
              ) : (
                // LTR: Keep current behavior
                collapsed ? (
                  <MenuUnfoldOutlined style={{ fontSize: 18 }} />
                ) : (
                  <MenuFoldOutlined style={{ fontSize: 18 }} />
                )
              )
            }
          />
        </Tooltip>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>
        <Tooltip title={t("header.notifications")}>
          <Button 
            type="text" 
            icon={<BellOutlined style={{ fontSize: 18 }} />}
            className="hidden sm:flex"
            aria-label={t("header.notifications")}
          />
        </Tooltip>
        <Dropdown
          menu={{ items: userMenuItems }}
          placement={isRtl ? "bottomLeft" : "bottomRight"}
          trigger={["click"]}
        >
          <Avatar
            className="bg-mainColor cursor-pointer flex-shrink-0"
            size={{ xs: 28, sm: 32, md: 36 }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
