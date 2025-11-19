import { Button, Card, Alert, Typography, Space } from "antd";

const { Title, Paragraph, Text } = Typography;

const TestPage = () => {
  return (
    <div className="p-8 space-y-8">

      <Title level={2} className="text-mainColor">
        Test Page – Tailwind + Ant Design
      </Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Main Color Card" bordered={false} className="shadow">
          <p className="text-mainColor font-bold">Main color text</p>
        </Card>

        <Card title="Danger Card" bordered={false} className="shadow">
          <p className="text-danger font-bold">Danger red color</p>
        </Card>

        <Card title="Warning Card" bordered={false} className="shadow">
          <p className="text-warning font-semibold">Warning yellow color</p>
        </Card>

        <Card title="Info Card" bordered={false} className="shadow">
          <p className="text-info font-bold">Info blue color</p>
        </Card>
      </div>

      <div className="space-y-4">
        <Title level={4}>Buttons</Title>

        <Space wrap>
          <Button
            type="primary"
            className="bg-mainColor border-mainColor hover:bg-primary hover:border-primary"
          >
            Primary (mainColor)
          </Button>

          <Button className="bg-primary text-white hover:bg-primary/90">
            Secondary (primary)
          </Button>

          <Button className="bg-danger text-white hover:bg-danger/90">
            Danger
          </Button>

          <Button className="bg-warning text-black hover:bg-warning/90">
            Warning
          </Button>

          <Button className="bg-info text-white hover:bg-info/90">
            Info
          </Button>

          <Button className="bg-success text-white hover:bg-success/90">
            Success
          </Button>
        </Space>
      </div>

      <div className="space-y-4">
        <Title level={4}>Alerts</Title>

        <Alert
          message="Main Color Alert"
          description="Using the mainColor styling."
          type="success"
          className="text-mainColor border-mainColor"
          showIcon
        />

        <Alert
          message="Danger Alert"
          description="Danger-level notification."
          type="error"
          className="text-danger border-danger"
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
        <Title level={4}>Tailwind Boxes</Title>

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
