import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import LanguagesEnums from "../enums/languagesEnums";

// Import translation files from locales
import trTranslation from "../locales/TR/translation.json";
import enTranslation from "../locales/EN/translation.json";

const KEY = import.meta.env.VITE_LOCAL_KEY;
const userString = localStorage.getItem(KEY);
const { user } = JSON.parse(userString) || {};
const defaultLang = LanguagesEnums.filter(
  (l) => l.value == user?.defaultLang
)[0]?.id;

const resources = {
  tr: { translation: trTranslation },
  en: { translation: enTranslation },
};

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLang?.toLowerCase() || "tr",
  fallbackLng: "tr",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
