import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import af from "./locales/af.json";
import xh from "./locales/xh.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      af: { translation: af },
      xh: { translation: xh },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
