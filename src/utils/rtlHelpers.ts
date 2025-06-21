export const getRTLProperty = (
  ltrValue: string,
  rtlValue: string,
  isRTL: boolean
) => (isRTL ? rtlValue : ltrValue);

export const getFlexDirection = (
  direction: "row" | "column",
  isRTL: boolean
) => {
  if (direction === "column") return "column";
  return isRTL ? "row-reverse" : "row";
};

export const getTextAlign = (
  align: "left" | "right" | "center",
  isRTL: boolean
) => {
  if (align === "center") return "center";
  if (align === "left") return isRTL ? "right" : "left";
  if (align === "right") return isRTL ? "left" : "right";
  return align;
};

export const getTransform = (translateX: number, isRTL: boolean) => {
  const direction = isRTL ? -translateX : translateX;
  return `translateX(${direction}px)`;
};

export const getMarginPadding = (
  property: "margin" | "padding",
  side: "left" | "right",
  value: string | number,
  isRTL: boolean
) => {
  const actualSide = isRTL ? (side === "left" ? "right" : "left") : side;
  return {
    [`${property}${actualSide.charAt(0).toUpperCase()}${actualSide.slice(1)}`]:
      value,
  };
};
