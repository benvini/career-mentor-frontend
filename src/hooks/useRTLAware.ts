import { useRTL } from "../contexts/rtlUtils";

export const useRTLAware = () => {
  const { isRTL, direction } = useRTL();

  const getMargin = (left: string | number, right: string | number) => ({
    marginLeft: isRTL ? right : left,
    marginRight: isRTL ? left : right,
  });

  const getPadding = (left: string | number, right: string | number) => ({
    paddingLeft: isRTL ? right : left,
    paddingRight: isRTL ? left : right,
  });

  const getBorder = (left: string, right: string) => ({
    borderLeft: isRTL ? right : left,
    borderRight: isRTL ? left : right,
  });

  const getPosition = (left: string | number, right: string | number) => ({
    left: isRTL ? "auto" : left,
    right: isRTL ? right : "auto",
  });

  const getTextAlign = (align: "left" | "right" | "center" | "justify") => {
    if (align === "center" || align === "justify") return align;
    return isRTL ? (align === "left" ? "right" : "left") : align;
  };

  const getFlexDirection = (
    dir: "row" | "column" | "row-reverse" | "column-reverse"
  ) => {
    if (dir === "column" || dir === "column-reverse") return dir;
    if (dir === "row") return isRTL ? "row-reverse" : "row";
    if (dir === "row-reverse") return isRTL ? "row" : "row-reverse";
    return dir;
  };

  const getTransform = (translateX: number) => {
    const directionMultiplier = isRTL ? -translateX : translateX;
    return `translateX(${directionMultiplier}px)`;
  };

  const getAnimationDirection = (animationName: string) => {
    const rtlAnimations: Record<string, string> = {
      slideInLeft: "slideInRight",
      slideInRight: "slideInLeft",
      slideOutLeft: "slideOutRight",
      slideOutRight: "slideOutLeft",
    };

    return isRTL && rtlAnimations[animationName]
      ? rtlAnimations[animationName]
      : animationName;
  };

  const getJustifyContent = (justify: string) => {
    if (
      justify === "center" ||
      justify === "space-between" ||
      justify === "space-around" ||
      justify === "space-evenly"
    ) {
      return justify;
    }
    if (justify === "flex-start") return isRTL ? "flex-end" : "flex-start";
    if (justify === "flex-end") return isRTL ? "flex-start" : "flex-end";
    return justify;
  };

  const getAlignSelf = (align: string) => {
    if (align === "center" || align === "stretch" || align === "baseline")
      return align;
    if (align === "flex-start") return isRTL ? "flex-end" : "flex-start";
    if (align === "flex-end") return isRTL ? "flex-start" : "flex-end";
    return align;
  };

  // פונקציות נוספות שימושיות
  const getMarginStart = (value: string | number) => ({
    [isRTL ? "marginRight" : "marginLeft"]: value,
  });

  const getMarginEnd = (value: string | number) => ({
    [isRTL ? "marginLeft" : "marginRight"]: value,
  });

  const getPaddingStart = (value: string | number) => ({
    [isRTL ? "paddingRight" : "paddingLeft"]: value,
  });

  const getPaddingEnd = (value: string | number) => ({
    [isRTL ? "paddingLeft" : "paddingRight"]: value,
  });

  const getBorderStart = (value: string) => ({
    [isRTL ? "borderRight" : "borderLeft"]: value,
  });

  const getBorderEnd = (value: string) => ({
    [isRTL ? "borderLeft" : "borderRight"]: value,
  });

  return {
    isRTL,
    direction,
    getMargin,
    getPadding,
    getBorder,
    getPosition,
    getTextAlign,
    getFlexDirection,
    getTransform,
    getAnimationDirection,
    getJustifyContent,
    getAlignSelf,
    // פונקציות חדשות לנוחות
    getMarginStart,
    getMarginEnd,
    getPaddingStart,
    getPaddingEnd,
    getBorderStart,
    getBorderEnd,
  };
};
