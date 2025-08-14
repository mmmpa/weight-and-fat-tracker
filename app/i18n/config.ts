import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import jaTranslation from "./locales/ja/translation.json";

export const defaultLanguage = "en";
export const supportedLanguages = ["en", "ja"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const resources = {
  en: {
    translation: enTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
};

// Get saved language from localStorage or use default
const savedLanguage =
  typeof window !== "undefined"
    ? localStorage.getItem("language") || defaultLanguage
    : defaultLanguage;

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Save language changes to localStorage
i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("language", lng);
  }
});

export default i18n;
