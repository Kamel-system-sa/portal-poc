import { Layout, Menu } from "antd";
import { HomeOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Sider } = Layout;

interface AppSidebarProps {
  collapsed: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed }) => {
  const { t } = useTranslation("common");
  const location = useLocation();

  const selectedKey =
    location.pathname === "/"
      ? "dashboard"
      : location.pathname.startsWith("/test")
      ? "test"
      : "";

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={220}
      className="bg-white border-r border-gray-200"
    >
      <div className="text-mainColor text-center font-bold py-4 text-lg">
        {collapsed ? "KP" : t("portalTitle")}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        className="bg-white custom-sidebar-menu"
        items={[
          {
            key: "dashboard",
            icon: <HomeOutlined />,
            label: <Link to="/">{t("dashboardTitle")}</Link>
          },
          {
            key: "test",
            icon: <AppstoreOutlined />,
            label: <Link to="/test">{t("testPageTitle")}</Link>
          }
        ]}
      />
    </Sider>
  );
};

export default AppSidebar;
