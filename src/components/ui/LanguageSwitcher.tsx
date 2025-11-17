import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const normalizedLang = i18n.language?.startsWith("ar")
    ? "ar"
    : i18n.language?.startsWith("ur")
    ? "ur"
    : "en";

  const currentLabel =
    normalizedLang === "ar" ? "AR" : normalizedLang === "ur" ? "UR" : "EN";

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  useEffect(() => {
    const lng = i18n.language;
    const isRtl = lng === "ar" || lng === "ur";
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [i18n.language]);

  const items = [
    { key: "ar", label: "العربية" },
    { key: "en", label: "English" },
    { key: "ur", label: "اردو" }
  ];

  return (
    <Dropdown
      trigger={["click"]}
      menu={{
        items,
        onClick: ({ key }) => handleChange(key as string)
      }}
    >
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 shadow-sm hover:shadow-md hover:border-mainColor transition"
      >
        <GlobalOutlined style={{ fontSize: 16, color: "#005B4F" }} />
        <span className="text-xs font-semibold text-gray-700">{currentLabel}</span>
      </button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
