import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import arCommon from "./locales/ar/common.json";
import urCommon from "./locales/ur/common.json";
import enOrganizers from "./locales/en/organizers.json";
import arOrganizers from "./locales/ar/organizers.json";
import urOrganizers from "./locales/ur/organizers.json";
import enPublicAffairs from "./locales/en/PublicAffairs.json";
import arPublicAffairs from "./locales/ar/PublicAffairs.json";
import urPublicAffairs from "./locales/ur/PublicAffairs.json";
import enTransport from "./locales/en/Transport.json";
import arTransport from "./locales/ar/Transport.json";
import urTransport from "./locales/ur/Transport.json";

// Utility function to apply font and direction based on language
const applyLanguageStyles = (language: string) => {
  const isRtl = language === "ar" || language === "ur";
  document.documentElement.dir = isRtl ? "rtl" : "ltr";
  
  // Remove existing font classes
  document.documentElement.classList.remove("font-arabic", "font-english");
  // Add appropriate font class
  if (isRtl) {
    document.documentElement.classList.add("font-arabic");
  } else {
    document.documentElement.classList.add("font-english");
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        common: enCommon,
        organizers: enOrganizers,
        PublicAffairs: enPublicAffairs,
        Transport: enTransport
      },
      ar: { 
        common: arCommon,
        organizers: arOrganizers,
        PublicAffairs: arPublicAffairs,
        Transport: arTransport
      },
      ur: { 
        common: urCommon,
        organizers: urOrganizers,
        PublicAffairs: urPublicAffairs,
        Transport: urTransport
      },
    },
    fallbackLng: "ar",
    supportedLngs: ["en", "ar", "ur"],
    defaultNS: "common",
    ns: ["common", "organizers", "PublicAffairs", "Transport"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
  })
  .then(() => {
    // Initialize font class based on detected language
    applyLanguageStyles(i18n.language);
  });

// Also listen for language changes
i18n.on('languageChanged', (lng) => {
  applyLanguageStyles(lng);
});

export default i18n;
