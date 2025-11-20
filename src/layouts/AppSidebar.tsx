import { Layout, Menu } from "antd";
import { HomeOutlined, AppstoreOutlined, BankOutlined, TeamOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Sider } = Layout;

interface AppSidebarProps {
  collapsed: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed }) => {
  const { t, i18n } = useTranslation("common");
  const location = useLocation();
  const isRtl = i18n.language === "ar" || i18n.language === "ur";

  const selectedKey =
    location.pathname === "/"
      ? "home"
      : location.pathname.startsWith("/test")
      ? "test"
      : location.pathname.startsWith("/service-centers")
      ? "service-centers"
      : location.pathname.startsWith("/hr")
      ? "hr"
      : "";

  const borderClass = isRtl ? "border-l" : "border-r";

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={220}
      className={`bg-white ${borderClass} border-gray-200 fixed top-0 h-screen z-50 overflow-y-auto`}
      style={{ 
        height: '100vh',
        [isRtl ? 'right' : 'left']: 0
      }}
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
            key: "home",
            icon: <HomeOutlined />,
            label: <Link to="/">{t("homeTitle")}</Link>
          },
          {
            key: "service-centers",
            icon: <BankOutlined />,
            label: <Link to="/service-centers">{t("serviceCentersTitle")}</Link>
          },
          {
            key: "hr",
            icon: <TeamOutlined />,
            label: <Link to="/hr">{t("hr.title")}</Link>
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
