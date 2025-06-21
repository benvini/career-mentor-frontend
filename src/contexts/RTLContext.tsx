import React, { useEffect } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from "styled-components";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { rtlTheme, ltrTheme, RTLContext } from "./rtlUtils";

interface RTLProviderProps {
  children: ReactNode;
}

// MUI themes
const createMuiTheme = (direction: "rtl" | "ltr") =>
  createTheme({
    direction,
    palette: {
      mode: "light",
    },
    typography: {
      fontFamily:
        direction === "rtl"
          ? '-apple-system, BlinkMacSystemFont, "Segoe UI", "Heebo", "Noto Sans Hebrew", "Arial", sans-serif'
          : '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    },
  });

// Emotion cache for RTL
const createEmotionCache = (direction: "rtl" | "ltr") => {
  return createCache({
    key: direction === "rtl" ? "muirtl" : "muiltr",
    stylisPlugins: direction === "rtl" ? [rtlPlugin] : [],
  });
};

export const RTLProvider: React.FC<RTLProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "he";
  const direction = isRTL ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
    document.body.style.direction = direction;
  }, [direction, i18n.language]);

  const styledTheme = isRTL ? rtlTheme : ltrTheme;
  const muiTheme = createMuiTheme(direction);
  const emotionCache = createEmotionCache(direction);

  return (
    <RTLContext.Provider value={{ isRTL, direction }}>
      <CacheProvider value={emotionCache}>
        <MuiThemeProvider theme={muiTheme}>
          <ThemeProvider theme={styledTheme}>{children}</ThemeProvider>
        </MuiThemeProvider>
      </CacheProvider>
    </RTLContext.Provider>
  );
};
