import { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppSidebar from "../layouts/AppSidebar";
import AppHeader from "../layouts/AppHeader";
import ScrollToTopButton from "../components/common/ScrollToTopButton";
import Breadcrumb from "../components/common/Breadcrumb";

const { Content } = Layout;

const PortalLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { i18n } = useTranslation("common");
  const isRtl = i18n.language === "ar" || i18n.language === "ur";

  return (
    <Layout className="min-h-screen">
      <AppSidebar collapsed={collapsed} />

      <Layout>
        <AppHeader
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
        />
        <Content 
          className="p-6 bg-gray-100 min-h-screen transition-all duration-200"
          style={{ 
            [isRtl ? 'marginRight' : 'marginLeft']: collapsed ? 80 : 260,
            paddingTop: 84
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
