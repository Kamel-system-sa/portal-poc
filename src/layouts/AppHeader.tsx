import { Layout, Button, Dropdown, Avatar, Typography } from "antd";
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
  const { t } = useTranslation("common");

  const userMenuItems = [
    { key: "profile", label: <span>Profile</span> },
    { key: "settings", label: <span>Settings</span> },
    { key: "logout", label: <span>Logout</span> }
  ];

  return (
    <Header
      className="flex items-center justify-between px-4 bg-white shadow"
      style={{ height: 60 }}
    >
      <div className="flex items-center gap-4">
        <Button
          type="text"
          onClick={onToggleSidebar}
          icon={
            collapsed ? (
              <MenuUnfoldOutlined style={{ fontSize: 20 }} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: 20 }} />
            )
          }
        />
        <Title
          level={4}
          className="m-0"
          style={{ color: "#005B4F", fontWeight: 700 }}
        >
          {t("portalTitle")}
        </Title>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <Button type="text" icon={<BellOutlined style={{ fontSize: 20 }} />} />
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Avatar
            style={{ backgroundColor: "#005B4F", cursor: "pointer" }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
