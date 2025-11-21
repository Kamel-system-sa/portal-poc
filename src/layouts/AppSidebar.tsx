import React, { useMemo } from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, AppstoreOutlined, BankOutlined, TeamOutlined, ApartmentOutlined, BuildOutlined, UserOutlined, FileTextOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { MenuProps } from "antd";
import { useUserRole } from "../contexts/UserRoleContext";
import { hasPermission } from "../utils/rolePermissions";

const { Sider } = Layout;

interface AppSidebarProps {
  collapsed: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed }) => {
  const { t, i18n } = useTranslation("common");
  const { currentRole } = useUserRole();
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
      if (location.pathname.includes("/reports")) return ["housing-reports"];
      return ["housing-dashboard"];
    }
    return [];
  };

  // Auto-expand housing menu if on a housing sub-page
  const openKeys = location.pathname.startsWith("/housing") && location.pathname !== "/housing" 
    ? ["housing"] 
    : [];

  const borderClass = isRtl ? "border-l" : "border-r";

  // Filter menu items based on role permissions
  const menuItems: MenuProps["items"] = useMemo(() => {
    const allMenuItems: MenuProps["items"] = [
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
        label: <Link to="/organizers">{t("organizersTitle")}</Link>
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
            key: "housing-reports",
            icon: <FileTextOutlined />,
            label: <Link to="/housing/reports">{t("housing.reports")}</Link>
          }
        ]
      },
      {
        key: "test",
        icon: <AppstoreOutlined />,
        label: <Link to="/test">{t("testPageTitle")}</Link>
      }
    ];

    // Filter menu items based on permissions
    return allMenuItems
      .map((item) => {
        if (!item) return null;
        
        // Home is always visible
        if (item.key === "home") return item;
        
        // Check permission for top-level items
        if (!hasPermission(currentRole, item.key as any)) {
          return null;
        }
        
        // For housing menu with children, filter children and only show parent if at least one child is visible
        if (item.key === "housing" && item.children) {
          const filteredChildren = item.children.filter((child) => {
            if (!child) return false;
            return hasPermission(currentRole, child.key as any);
          });
          
          // Only show housing menu if it has visible children
          if (filteredChildren.length === 0) {
            return null;
          }
          
          // Return new object with filtered children
          return {
            ...item,
            children: filteredChildren,
          };
        }
        
        return item;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [currentRole, t]);

  return (
    <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={260}
        collapsedWidth={80}
        breakpoint="lg"
        className={`bg-gradient-to-b from-white to-gray-50 ${borderClass} border-bordergray fixed top-0 h-screen z-50 overflow-y-auto shadow-lg transition-transform duration-300 ${
          collapsed ? 'translate-x-[-100%] lg:translate-x-0' : 'translate-x-0'
        } ${isRtl ? 'lg:translate-x-0' : ''}`}
        style={{ 
          height: '100vh',
          [isRtl ? 'right' : 'left']: 0,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        <div className={`flex items-center justify-center border-b border-bordergray transition-all duration-300 py-4 px-3`}>
          <img 
            src={collapsed ? "/images/kamelPortalSmallLogo.png" : "/images/kamelPortalLogo.png"}
            alt={t("logo.alt")} 
            className="object-contain transition-all duration-300"
            style={{
              height: collapsed ? '56px' : '72px',
              maxHeight: collapsed ? '56px' : '72px',
              objectFit: 'contain',
              width: 'auto'
            }}
          />
        </div>

        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={openKeys}
          className="bg-transparent custom-sidebar-menu border-0 pt-2 sm:pt-3 md:pt-4"
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
