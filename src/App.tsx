import Router from "./routes/Router";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import { RTLProvider } from "./contexts/RTLContext";
import { createGlobalStyle } from "styled-components";

import en from "./locales/en.json";
import he from "./locales/he.json";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  html {
    direction: ${(props) => props.theme.direction};
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: ${(props) =>
      props.theme.direction === "rtl"
        ? '-apple-system, BlinkMacSystemFont, "Segoe UI", "Heebo", "Noto Sans Hebrew", "Arial", sans-serif'
        : '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif'};
    direction: ${(props) => props.theme.direction};
    text-align: ${(props) =>
      props.theme.direction === "rtl" ? "right" : "left"};
  }

  /* RTL-specific adjustments */
  [dir="rtl"] {
    text-align: right;
  }

  [dir="rtl"] input,
  [dir="rtl"] textarea,
  [dir="rtl"] select {
    text-align: right;
  }

  [dir="rtl"] input::placeholder,
  [dir="rtl"] textarea::placeholder {
    text-align: right;
  }

  /* Animation adjustments for RTL */
  [dir="rtl"] .slide-in-left {
    animation: slideInRight 0.3s ease-out;
  }

  [dir="rtl"] .slide-in-right {
    animation: slideInLeft 0.3s ease-out;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slideInLeft {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  resources: {
    en,
    he,
  },
  lng: localStorage.getItem("preferredLanguage") || "en",
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
});

// Ensure language is loaded from localStorage
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("preferredLanguage", lng);
});

// Check if we need to change language on mount
const savedLang = localStorage.getItem("preferredLanguage");
if (savedLang && savedLang !== i18n.language) {
  i18n.changeLanguage(savedLang);
}

const App = () => {
  return (
    <RTLProvider>
      <GlobalStyle />
      <Router />
    </RTLProvider>
  );
};

export default App;
