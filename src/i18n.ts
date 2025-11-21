import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import arCommon from "./locales/ar/common.json";
import urCommon from "./locales/ur/common.json";
import enOrganizers from "./locales/en/organizers.json";
import arOrganizers from "./locales/ar/organizers.json";
import urOrganizers from "./locales/ur/organizers.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        common: enCommon,
        organizers: enOrganizers
      },
      ar: { 
        common: arCommon,
        organizers: arOrganizers
      },
      ur: { 
        common: urCommon,
        organizers: urOrganizers
      },
    },
    fallbackLng: "ar",
    supportedLngs: ["en", "ar", "ur"],
    defaultNS: "common",
    ns: ["common", "organizers"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
