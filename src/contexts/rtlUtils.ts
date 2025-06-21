import { createContext, useContext } from "react";
import type { DefaultTheme } from "styled-components";

export interface RTLContextType {
  isRTL: boolean;
  direction: "rtl" | "ltr";
}

export const RTLContext = createContext<RTLContextType>({
  isRTL: false,
  direction: "ltr",
});

export const useRTL = () => useContext(RTLContext);

export const rtlTheme: DefaultTheme = {
  direction: "rtl",
  marginStart: "margin-right",
  marginEnd: "margin-left",
  paddingStart: "padding-right",
  paddingEnd: "padding-left",
  borderStart: "border-right",
  borderEnd: "border-left",
  start: "right",
  end: "left",
  textAlign: "right",
  flexDirection: "row-reverse",
};

export const ltrTheme: DefaultTheme = {
  direction: "ltr",
  marginStart: "margin-left",
  marginEnd: "margin-right",
  paddingStart: "padding-left",
  paddingEnd: "padding-right",
  borderStart: "border-left",
  borderEnd: "border-right",
  start: "left",
  end: "right",
  textAlign: "left",
  flexDirection: "row",
};
