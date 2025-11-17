import { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppSidebar from "../layouts/AppSidebar";
import AppHeader from "../layouts/AppHeader";

const { Content } = Layout;

const PortalLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen">
      <AppSidebar collapsed={collapsed} />

      <Layout>
        <AppHeader
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
        />
        <Content className="p-6 bg-gray-100 min-h-screen">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PortalLayout;
