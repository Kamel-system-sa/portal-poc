import { Button, Card, Alert, Typography, Space } from "antd";
import { useTranslation } from "react-i18next";
import { 
  LayoutDashboard,
  Activity,
  BarChart3,
  TrendingUp,
  PieChart,
  LineChart,
  Target,
  Zap
} from "lucide-react";

const { Title } = Typography;

const TestPage = () => {
  const { t } = useTranslation("common");
  
  return (
    <div className="p-8 space-y-8">

      <Title level={2} className="text-mainColor">
        {t("testPageTitle")} – Tailwind + Ant Design
      </Title>

      {/* Modern Dashboard Cards Section */}
      <div className="space-y-6">
        <Title level={3} className="text-gray-700">بطاقات الحالة الحديثة</Title>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Dashboard Overview */}
          <div className="group relative bg-gradient-to-br from-primary to-primaryColor rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-[220px] flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <LayoutDashboard className="text-white w-12 h-12" strokeWidth={2} />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <h3 className="text-white text-lg font-bold mb-2">نظرة عامة</h3>
              <div className="space-y-1 min-w-0">
                <p className="text-white text-3xl sm:text-2xl font-extrabold leading-tight break-all overflow-hidden">1,234,567</p>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">نشط</span>
              </div>
            </div>
          </div>

          {/* Card 2: Activity Metrics */}
          <div className="group relative bg-gradient-to-br from-success to-green-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-[220px] flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <Activity className="text-white w-12 h-12" strokeWidth={2} />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <h3 className="text-white text-lg font-bold mb-2">النشاط</h3>
              <div className="space-y-1 min-w-0">
                <p className="text-white text-3xl sm:text-2xl font-extrabold leading-tight break-all overflow-hidden">89,456</p>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">نشط</span>
              </div>
            </div>
          </div>

          {/* Card 3: Analytics */}
          <div className="group relative bg-gradient-to-br from-info to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-[220px] flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <BarChart3 className="text-white w-12 h-12" strokeWidth={2} />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <h3 className="text-white text-lg font-bold mb-2">التحليلات</h3>
              <div className="space-y-1 min-w-0">
                <p className="text-white text-3xl sm:text-2xl font-extrabold leading-tight break-all overflow-hidden">2,345,678</p>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">غير نشط</span>
              </div>
            </div>
          </div>

          {/* Card 4: Trends */}
          <div className="group relative bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-[220px] flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <TrendingUp className="text-white w-12 h-12" strokeWidth={2} />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <h3 className="text-white text-lg font-bold mb-2">الاتجاهات</h3>
              <div className="space-y-1 min-w-0">
                <p className="text-white text-3xl sm:text-2xl font-extrabold leading-tight break-all overflow-hidden">456,789</p>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">متأخر</span>
              </div>
            </div>
          </div>

          {/* Card 5: Statistics */}
          <div className="group relative bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-[220px] flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <PieChart className="text-white w-12 h-12" strokeWidth={2} />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <h3 className="text-white text-lg font-bold mb-2">الإحصائيات</h3>
              <div className="space-y-1 min-w-0">
                <p className="text-white text-3xl sm:text-2xl font-extrabold leading-tight break-all overflow-hidden">12,345,678</p>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">نشط</span>
              </div>
            </div>
          </div>

          {/* Card 6: Performance */}
          <div className="group relative bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-[220px] flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <LineChart className="text-white w-12 h-12" strokeWidth={2} />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <h3 className="text-white text-lg font-bold mb-2">الأداء</h3>
              <div className="space-y-1 min-w-0">
                <p className="text-white text-3xl sm:text-2xl font-extrabold leading-tight break-all overflow-hidden">987,654</p>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">قيد الإجراء</span>
              </div>
            </div>
          </div>

          {/* Card 7: Targets */}
          <div className="group relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-[220px] flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <Target className="text-white w-12 h-12" strokeWidth={2} />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <h3 className="text-white text-lg font-bold mb-2">الأهداف</h3>
              <div className="space-y-1 min-w-0">
                <p className="text-white text-3xl sm:text-2xl font-extrabold leading-tight break-all overflow-hidden">5,678,901</p>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">مكتمل</span>
              </div>
            </div>
          </div>

          {/* Card 8: Energy */}
          <div className="group relative bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-[220px] flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <Zap className="text-white w-12 h-12" strokeWidth={2} />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <h3 className="text-white text-lg font-bold mb-2">الطاقة</h3>
              <div className="space-y-1 min-w-0">
                <p className="text-white text-3xl sm:text-2xl font-extrabold leading-tight break-all overflow-hidden">234,567</p>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold">جاري</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
