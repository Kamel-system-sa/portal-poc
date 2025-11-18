import { Button, Card, Alert, Typography, Space } from "antd";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const TestPage = () => {
  const { t } = useTranslation("common");
  
  return (
    <div className="p-8 space-y-8">

      <Title level={2} className="text-mainColor">
        {t("testPageTitle")} – Tailwind + Ant Design
      </Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title={t("mainColorCard")} bordered={false} className="shadow">
          <p className="text-mainColor font-bold">Main color text</p>
        </Card>

        <Card title={t("dangerCard")} bordered={false} className="shadow">
          <p className="text-danger font-bold">Danger red color</p>
        </Card>

        <Card title={t("warningCard")} bordered={false} className="shadow">
          <p className="text-warning font-semibold">Warning yellow color</p>
        </Card>

        <Card title={t("infoCard")} bordered={false} className="shadow">
          <p className="text-info font-bold">Info blue color</p>
        </Card>
      </div>

      <div className="space-y-4">
        <Title level={4}>{t("buttonsSection")}</Title>

        <Space wrap>
          <Button
            type="primary"
            style={{ background: "#005B4F", borderColor: "#005B4F" }}
          >
            Primary (mainColor)
          </Button>

          <Button style={{ background: "#00796B", color: "white" }}>
            Secondary (primary)
          </Button>

          <Button style={{ background: "#D64545", color: "white" }}>
            Danger
          </Button>

          <Button style={{ background: "#F2C94C", color: "black" }}>
            Warning
          </Button>

          <Button style={{ background: "#2F80ED", color: "white" }}>
            Info
          </Button>

          <Button style={{ background: "#27AE60", color: "white" }}>
            Success
          </Button>
        </Space>
      </div>

      <div className="space-y-4">
        <Title level={4}>{t("alertsSection")}</Title>

        <Alert
          message="Main Color Alert"
          description="Using the mainColor styling."
          type="success"
          style={{ borderColor: "#005B4F" }}
          className="text-mainColor"
          showIcon
        />

        <Alert
          message="Danger Alert"
          description="Danger-level notification."
          type="error"
          style={{ borderColor: "#D64545" }}
          className="text-danger"
          showIcon
        />

        <Alert
          message="Warning Alert"
          description="Warning-level notification."
          type="warning"
          className="text-warning"
          showIcon
        />

        <Alert
          message="Info Alert"
          description="Information-level notification."
          type="info"
          className="text-info"
          showIcon
        />
      </div>

      <div className="space-y-4">
        <Title level={4}>{t("tailwindBoxesSection")}</Title>

        <div className="p-4 rounded-lg bg-mainColor text-white font-bold">
          Tailwind Box – mainColor
        </div>

        <div className="p-4 rounded-lg bg-danger text-white font-bold">
          Tailwind Box – danger
        </div>

        <div className="p-4 rounded-lg bg-warning text-black font-semibold">
          Tailwind Box – warning
        </div>

        <div className="p-4 rounded-lg bg-info text-white font-bold">
          Tailwind Box – info
        </div>

        <div className="p-4 rounded-lg bg-success text-white font-bold">
          Tailwind Box – success
        </div>
      </div>
    </div>
  );
};

export default TestPage;
