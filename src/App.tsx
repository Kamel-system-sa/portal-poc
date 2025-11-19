import { Card, Button } from "antd";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation("common");
  
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <Card className="max-w-lg mx-auto shadow">
        <h1 className="text-3xl font-bold text-blue-600">{t("portalTitle")}</h1>
        <p className="text-gray-600 mt-2 mb-4">
          TailwindCSS + Ant Design {t("portalTitle")}
        </p>

        <Button type="primary">Test Button</Button>
      </Card>
    </div>
  );
}

export default App;
