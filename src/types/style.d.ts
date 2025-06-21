import type {} from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    direction: "rtl" | "ltr";
    marginStart: string;
    marginEnd: string;
    paddingStart: string;
    paddingEnd: string;
    borderStart: string;
    borderEnd: string;
    start: string;
    end: string;
    textAlign: string;
    flexDirection: string;
  }
}
