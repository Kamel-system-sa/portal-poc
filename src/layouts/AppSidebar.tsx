import React from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, AppstoreOutlined, BankOutlined, TeamOutlined, ApartmentOutlined, BuildOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { MenuProps } from "antd";

const { Sider } = Layout;

interface AppSidebarProps {
  collapsed: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed }) => {
  const { t, i18n } = useTranslation("common");
  const location = useLocation();
  const isRtl = i18n.language === "ar" || i18n.language === "ur";
  // Determine selected keys based on pathname
  const getSelectedKeys = (): string[] => {
    if (location.pathname === "/") return ["home"];
    if (location.pathname.startsWith("/test")) return ["test"];
    if (location.pathname.startsWith("/service-centers")) return ["service-centers"];
    if (location.pathname.startsWith("/organizers")) return ["organizers"];
    if (location.pathname.startsWith("/hr")) return ["hr"];
    if (location.pathname.startsWith("/housing")) {
      if (location.pathname === "/housing") return ["housing-dashboard"];
      if (location.pathname.includes("/hotels")) return ["housing-hotels"];
      if (location.pathname.includes("/buildings")) return ["housing-buildings"];
      if (location.pathname.includes("/mina")) return ["housing-mina"];
      if (location.pathname.includes("/arafat")) return ["housing-arafat"];
      if (location.pathname.includes("/pilgrims")) return ["housing-pilgrims"];
      return ["housing-dashboard"];
    }
    return [];
  };

  // Auto-expand housing menu if on a housing sub-page
  const openKeys = location.pathname.startsWith("/housing") && location.pathname !== "/housing" 
    ? ["housing"] 
    : [];

  const borderClass = isRtl ? "border-l" : "border-r";

  const menuItems: MenuProps["items"] = [
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
      key: "organizers",
      icon: <UserOutlined />,
      label: <Link to="/organizers">{t("organizersTitle") || "Organizers"}</Link>
    },
    {
      key: "hr",
      icon: <TeamOutlined />,
      label: <Link to="/hr">{t("hr.title")}</Link>
    },
    {
      key: "housing",
      icon: <ApartmentOutlined />,
      label: t("housingTitle"),
      children: [
        {
          key: "housing-dashboard",
          icon: <HomeOutlined />,
          label: <Link to="/housing">{t("housing.dashboardTitle")}</Link>
        },
        {
          key: "housing-hotels",
          icon: <ApartmentOutlined />,
          label: <Link to="/housing/hotels">{t("housing.hotels")}</Link>
        },
        {
          key: "housing-buildings",
          icon: <BuildOutlined />,
          label: <Link to="/housing/buildings">{t("housing.buildings")}</Link>
        },
        {
          key: "housing-mina",
          icon: <ApartmentOutlined />,
          label: <Link to="/housing/mina">{t("housing.mina")}</Link>
        },
        {
          key: "housing-arafat",
          icon: <ApartmentOutlined />,
          label: <Link to="/housing/arafat">{t("housing.arafat")}</Link>
        },
        {
          key: "housing-pilgrims",
          icon: <TeamOutlined />,
          label: <Link to="/housing/pilgrims">{t("housing.pilgrimsList")}</Link>
        }
      ]
    },
    {
      key: "test",
      icon: <AppstoreOutlined />,
      label: <Link to="/test">{t("testPageTitle")}</Link>
    }
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={260}
      className={`bg-gradient-to-b from-white to-gray-50 ${borderClass} border-bordergray fixed top-0 h-screen z-50 overflow-y-auto shadow-lg`}
      style={{ 
        height: '100vh',
        [isRtl ? 'right' : 'left']: 0,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      <div className={`text-mainColor text-center font-bold py-6 px-4 border-b border-bordergray transition-all duration-300 ${collapsed ? 'px-2' : ''}`}>
        <div className="text-xl font-extrabold tracking-tight">
          {collapsed ? "KP" : t("portalTitle")}
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={openKeys}
        className="bg-transparent custom-sidebar-menu border-0 pt-4"
        items={menuItems}
        style={{
          backgroundColor: 'transparent',
          border: 'none'
        }}
      />
    </Sider>
  );
};

export default AppSidebar;
