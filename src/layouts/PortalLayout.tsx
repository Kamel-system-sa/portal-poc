import { useState, useEffect } from "react";
import { Layout, Drawer } from "antd";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppSidebar from "../layouts/AppSidebar";
import AppHeader from "../layouts/AppHeader";
import ScrollToTopButton from "../components/common/ScrollToTopButton";
import Breadcrumb from "../components/common/Breadcrumb";

const { Content } = Layout;

const PortalLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { i18n } = useTranslation("common");
  const isRtl = i18n.language === "ar" || i18n.language === "ur";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setCollapsed(false);
      } else {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sidebarWidth = collapsed ? 80 : 260;
  const contentMargin = isMobile ? 0 : sidebarWidth;

  return (
    <Layout className="min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar collapsed={collapsed} />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={null}
        placement={isRtl ? "right" : "left"}
        closable={false}
        onClose={() => setCollapsed(true)}
        open={!collapsed && isMobile}
        styles={{ 
          body: { padding: 0 },
          mask: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
        }}
        width={260}
        className="lg:hidden"
        style={{ zIndex: 1000 }}
      >
        <AppSidebar collapsed={false} />
      </Drawer>

      {/* Mobile Overlay */}
      {!collapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <Layout className="w-full">
        <AppHeader
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
        />
        <Content 
          className="p-3 sm:p-4 md:p-5 lg:p-6 bg-gray-100 min-h-screen transition-all duration-200"
          style={{ 
            [isRtl ? 'marginRight' : 'marginLeft']: contentMargin,
            paddingTop: isMobile ? '72px' : '84px'
          }}
        >
          <Breadcrumb />
          <Outlet />
        </Content>
      </Layout>
      <ScrollToTopButton />
    </Layout>
  );
};

export default PortalLayout;
