import React, { useMemo } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  BankOutlined,
  TeamOutlined,
  ApartmentOutlined,
  BuildOutlined,
  UserOutlined,
  FileTextOutlined,
  LoginOutlined,
  GlobalOutlined,
  CarOutlined,
  DashboardOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  IdcardOutlined,
  CheckCircleOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
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
  const { t: tPublicAffairs } = useTranslation("PublicAffairs");
  const { t: tTransport } = useTranslation("Transport");
  const { currentRole } = useUserRole();
  const location = useLocation();
  const isRtl = i18n.language === "ar" || i18n.language === "ur";

  // Determine selected keys based on pathname
  const getSelectedKeys = (): string[] => {
    if (location.pathname === "/") return ["home"];
    if (location.pathname.startsWith("/service-centers")) {
      if (location.pathname.includes("/reports")) return ["service-centers-reports"];
      return ["service-centers-main"];
    }
    if (location.pathname.startsWith("/organizers")) {
      if (location.pathname === "/organizers") {
        return ["organizers-list"];
      }
      if (location.pathname.includes("/campaigns")) {
        return ["organizers-campaigns"];
      }
      return ["organizers-list"];
    }
    if (location.pathname.startsWith("/hr")) {
      if (location.pathname === "/hr") return ["hr-dashboard"];
      if (location.pathname.includes("/shift-schedules")) return ["hr-shift-schedules"];
      if (location.pathname.includes("/attendance")) return ["hr-attendance"];
      if (location.pathname.includes("/leaves")) return ["hr-leaves"];
      if (location.pathname.includes("/employees")) return ["hr-employees"];
      if (location.pathname.includes("/reports")) return ["hr-reports"];
      return ["hr-dashboard"];
    }
    if (location.pathname.startsWith("/housing")) {
      if (location.pathname === "/housing") return ["housing-dashboard"];
      if (location.pathname.includes("/hotels")) return ["housing-hotels"];
      if (location.pathname.includes("/buildings")) return ["housing-buildings"];
      if (location.pathname.includes("/reports")) return ["housing-reports"];
      return ["housing-dashboard"];
    }
    if (location.pathname.startsWith("/mashair")) {
      if (location.pathname === "/mashair" || location.pathname === "/housing/mashair") return ["mashair-dashboard"];
      if (location.pathname.includes("/mina") || location.pathname.includes("/housing/mina")) return ["mashair-mina"];
      if (location.pathname.includes("/arafat") || location.pathname.includes("/housing/arafat")) return ["mashair-arafat"];
      return ["mashair-dashboard"];
    }
    if (location.pathname.startsWith("/reception")) {
      if (location.pathname === "/reception" || location.pathname === "/reception/dashboard") {
        return ["reception-dashboard"];
      }
      if (location.pathname.includes("/pre-arrival/departures")) {
        return ["reception-pre-arrival-departures"];
      }
      if (location.pathname.includes("/pre-arrival")) {
        return ["reception-pre-arrival-arrivals"];
      }
      if (location.pathname.includes("/ports")) return ["reception-ports"];
      if (location.pathname.includes("/campaigns")) {
        return ["organizers-campaigns"];
      }
      if (location.pathname.includes("/centers-dashboard")) {
        return ["reception-centers-dashboard"];
      }
      if (location.pathname.includes("/reports")) return ["reception-reports"];
      return ["reception-dashboard"];
    }
    if (location.pathname.startsWith("/public-affairs")) {
      if (location.pathname === "/public-affairs") return ["public-affairs-dashboard"];
      if (location.pathname.includes("/deaths")) return ["public-affairs-deaths"];
      if (location.pathname.includes("/hospitalized")) return ["public-affairs-hospitalized"];
      if (location.pathname.includes("/other-incidents")) return ["public-affairs-other"];
      if (location.pathname.includes("/reports")) return ["public-affairs-reports"];
      return ["public-affairs-dashboard"];
    }
    return [];
  };

  // Auto-expand menus if on sub-pages
  const openKeys: string[] = [];
  if (location.pathname.startsWith("/housing") && location.pathname !== "/housing") {
    openKeys.push("housing");
  }
  if (location.pathname.startsWith("/mashair") || location.pathname.includes("/mashair") || location.pathname.includes("/mina") || location.pathname.includes("/arafat")) {
    openKeys.push("mashair");
  }
  if (location.pathname.startsWith("/service-centers") && location.pathname !== "/service-centers") {
    openKeys.push("service-centers");
  }
  if (location.pathname.startsWith("/reception")) {
    openKeys.push("reception");
  }
  if (location.pathname.startsWith("/public-affairs")) {
    openKeys.push("public-affairs");
  }

  const borderClass = isRtl ? "border-l" : "border-r";

  // Filter menu items based on role permissions
  const menuItems: MenuProps["items"] = useMemo(() => {
    const allMenuItems: MenuProps["items"] = [
      {
        key: "home",
        icon: <HomeOutlined />,
        label: <Link to="/">{t("homeTitle")}</Link>,
      },
      {
        key: "hr",
        icon: <TeamOutlined />,
        label: t("hr.title"),
        children: [
          {
            key: "hr-dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/hr">{t("hr.dashboardTitle")}</Link>,
          },
          {
            key: "hr-employees",
            icon: <UserOutlined />,
            label: <Link to="/hr/employees">{t("hr.employees")}</Link>,
          },
          {
            key: "hr-shift-schedules",
            icon: <ClockCircleOutlined />,
            label: <Link to="/hr/shift-schedules">{t("hr.shifts.title")}</Link>,
          },
          {
            key: "hr-attendance",
            icon: <ClockCircleOutlined />,
            label: <Link to="/hr/attendance">{t("hr.attendance.title")}</Link>,
          },
          {
            key: "hr-leaves",
            icon: <CalendarOutlined />,
            label: <Link to="/hr/leaves">{t("hr.leaves.title")}</Link>,
          },
          {
            key: "hr-reports",
            icon: <FileTextOutlined />,
            label: <Link to="/hr/reports">{t("hr.reports")}</Link>,
          },
        ],
      },
      {
        key: "finance",
        icon: <DollarOutlined />,
        label: <Link to="/finance">{t("finance.title")}</Link>,
      },
      {
        key: "service-centers",
        icon: <BankOutlined />,
        label: t("serviceCentersTitle"),
        children: [
          {
            key: "service-centers-main",
            icon: <BankOutlined />,
            label: <Link to="/service-centers">{t("serviceCenters.dashboardTitle")}</Link>,
          },
          {
            key: "service-centers-reports",
            icon: <FileTextOutlined />,
            label: <Link to="/service-centers/reports">{t("serviceCentersReports.title")}</Link>,
          },
        ],
      },
      {
        key: "organizers",
        icon: <UserOutlined />,
        label: t("sidebar.organizersControlPanel"),
        children: [
          {
            key: "organizers-list",
            icon: <UserOutlined />,
            label: <Link to="/organizers">{t("sidebar.organizersControlPanel")}</Link>,
          },
          {
            key: "organizers-campaigns",
            icon: <GlobalOutlined />,
            label: <Link to="/organizers/campaigns">{t("reception.campaigns.title")}</Link>,
          },
        ],
      },
      {
        key: "reception",
        icon: <LoginOutlined />,
        label: t("reception.title"),
        children: [
          {
            key: "reception-dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/reception">{t("reception.dashboard.title")}</Link>,
          },
          {
            key: "reception-centers-dashboard",
            icon: <BankOutlined />,
            label: <Link to="/reception/centers-dashboard">{t("reception.centersDashboard.title")}</Link>,
          },
          {
            key: "reception-pre-arrival-arrivals",
            icon: <HomeOutlined />,
            label: <Link to="/reception/pre-arrival">{t("reception.preArrival.arrivals.title")}</Link>,
          },
          {
            key: "reception-pre-arrival-departures",
            icon: <HomeOutlined />,
            label: <Link to="/reception/pre-arrival/departures">{t("reception.preArrival.departures.title")}</Link>,
          },
          {
            key: "reception-ports",
            icon: <CarOutlined />,
            label: <Link to="/reception/ports">{t("reception.ports.title")}</Link>,
          },
          {
            key: "reception-reports",
            icon: <FileTextOutlined />,
            label: <Link to="/reception/reports">{t("reception.reports")}</Link>,
          },
        ],
      },
      {
        key: "passport",
        icon: <IdcardOutlined />,
        label: t("passport.title"),
        children: [
          {
            key: "passport-box-arrangement",
            icon: <FileTextOutlined />,
            label: <Link to="/passport/box-arrangement">{t("passport.boxArrangement")}</Link>,
          },
          {
            key: "passport-service-proof",
            icon: <CheckCircleOutlined />,
            label: <Link to="/passport/service-proof">{t("passport.serviceProof")}</Link>,
          },
          {
            key: "passport-verified-pilgrims",
            icon: <UserOutlined />,
            label: <Link to="/passport/verified-pilgrims">{t("passport.verifiedPilgrims")}</Link>,
          },
          {
            key: "passport-reports",
            icon: <FileSearchOutlined />,
            label: <Link to="/passport/reports">{t("passport.reports.title")}</Link>,
          },
        ],
      },
      {
        key: "housing",
        icon: <ApartmentOutlined />,
        label: t("housingTitle"),
        children: [
          {
            key: "housing-dashboard",
            icon: <HomeOutlined />,
            label: <Link to="/housing">{t("housing.dashboardTitle")}</Link>,
          },
          {
            key: "housing-hotels",
            icon: <ApartmentOutlined />,
            label: <Link to="/housing/hotels">{t("housing.hotels")}</Link>,
          },
          {
            key: "housing-buildings",
            icon: <BuildOutlined />,
            label: <Link to="/housing/buildings">{t("housing.buildings")}</Link>,
          },
          {
            key: "housing-reports",
            icon: <FileTextOutlined />,
            label: <Link to="/housing/reports">{t("housing.reports")}</Link>,
          },
        ],
      },
      {
        key: "mashair",
        icon: <EnvironmentOutlined />,
        label: t("mashair.holySitesTitle"),
        children: [
          {
            key: "mashair-dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/housing/mashair">{t("mashair.dashboardTitle")}</Link>,
          },
          {
            key: "mashair-mina",
            icon: <ApartmentOutlined />,
            label: <Link to="/housing/mina">{t("housing.mina")}</Link>,
          },
          {
            key: "mashair-arafat",
            icon: <ApartmentOutlined />,
            label: <Link to="/housing/arafat">{t("housing.arafat")}</Link>,
          },
        ],
      },
      {
        key: "transport",
        icon: <CarOutlined />,
        label: tTransport("title"),
        children: [
          {
            key: "transport-dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/transport">{tTransport("dashboardTitle")}</Link>,
          },
          {
            key: "transport-transfer-info",
            icon: <FileTextOutlined />,
            label: <Link to="/transport/transfer-info">{tTransport("transferInfo")}</Link>,
          },
          {
            key: "transport-inter-city",
            icon: <EnvironmentOutlined />,
            label: <Link to="/transport/inter-city">{tTransport("interCityTransfers")}</Link>,
          },
          {
            key: "transport-holy-sites",
            icon: <EnvironmentOutlined />,
            label: <Link to="/transport/holy-sites">{tTransport("holySitesTransfers")}</Link>,
          },
        ],
      },
      {
        key: "public-affairs",
        icon: <SafetyOutlined />,
        label: tPublicAffairs("title"),
        children: [
          {
            key: "public-affairs-dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/public-affairs">{tPublicAffairs("dashboardTitle")}</Link>,
          },
          {
            key: "public-affairs-deaths",
            icon: <FileTextOutlined />,
            label: <Link to="/public-affairs/deaths">{tPublicAffairs("deaths")}</Link>,
          },
          {
            key: "public-affairs-hospitalized",
            icon: <FileTextOutlined />,
            label: <Link to="/public-affairs/hospitalized">{tPublicAffairs("hospitalized")}</Link>,
          },
          {
            key: "public-affairs-other",
            icon: <FileTextOutlined />,
            label: <Link to="/public-affairs/other-incidents">{tPublicAffairs("otherIncidents")}</Link>,
          },
          {
            key: "public-affairs-reports",
            icon: <FileTextOutlined />,
            label: <Link to="/public-affairs/reports">{t("publicAffairsReports.title")}</Link>,
          },
        ],
      },
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

        // For menus with children (housing, reception, public-affairs, etc.), filter children (including nested menus)
        if ("children" in item && item.children) {
          const filteredChildren = item.children
            .map((child: any) => {
              if (!child) return null;

              // Process grandchildren if present
              if ("children" in child && Array.isArray(child.children)) {
                const filteredGrandChildren = child.children.filter((grandChild: any) => {
                  if (!grandChild) return false;
                  return hasPermission(currentRole, grandChild.key as any);
                });
                if (filteredGrandChildren.length === 0) {
                  return null;
                }
                return {
                  ...child,
                  children: filteredGrandChildren,
                };
              }

              // Regular child item
              if (!hasPermission(currentRole, child.key as any)) {
                return null;
              }

              return child;
            })
            .filter((child): child is NonNullable<typeof child> => child !== null);

          // Only show menu if it has visible children
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
  }, [currentRole, t, tPublicAffairs, tTransport]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={260}
      collapsedWidth={80}
      breakpoint="lg"
      className={`bg-gradient-to-b from-white to-gray-50 ${borderClass} border-bordergray fixed top-0 h-screen z-50 overflow-y-auto shadow-lg transition-transform duration-300 ${
        collapsed ? "translate-x-[-100%] lg:translate-x-0" : "translate-x-0"
      } ${isRtl ? "lg:translate-x-0" : ""}`}
      style={{
        height: "100vh",
        [isRtl ? "right" : "left"]: 0,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
      }}
    >
      <div
        className={`flex items-center justify-center border-b border-bordergray transition-all duration-300 py-4 px-3`}
      >
        <img
          src={
            collapsed
              ? "/images/kamelPortalSmallLogo.png"
              : "/images/kamelPortalLogo.png"
          }
          alt={t("logo.alt")}
          className="object-contain transition-all duration-300"
          style={{
            height: collapsed ? "56px" : "72px",
            maxHeight: collapsed ? "56px" : "72px",
            objectFit: "contain",
            width: "auto",
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
          backgroundColor: "transparent",
          border: "none",
        }}
      />
    </Sider>
  );
};

export default AppSidebar;
