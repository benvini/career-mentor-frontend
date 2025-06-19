import Router from "./routes/Router";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";

import en from "./locales/en.json";
import he from "./locales/he.json";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  resources: {
    en,
    he,
  },
  lng: localStorage.getItem('preferredLanguage') || "en",
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
  },
});

// Ensure language is loaded from localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('preferredLanguage', lng);
});

// Check if we need to change language on mount
const savedLang = localStorage.getItem('preferredLanguage');
if (savedLang && savedLang !== i18n.language) {
  i18n.changeLanguage(savedLang);
}

const App = () => {
  return <Router />;
};

export default App;
