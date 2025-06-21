import { keyframes } from "styled-components";

export const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const slideOutLeft = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-100%);
  }
`;

export const slideOutRight = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
`;

export const getSlideAnimation = (
  direction: "left" | "right",
  type: "in" | "out",
  isRTL: boolean
) => {
  if (type === "in") {
    if (direction === "left") return isRTL ? slideInRight : slideInLeft;
    if (direction === "right") return isRTL ? slideInLeft : slideInRight;
  } else {
    if (direction === "left") return isRTL ? slideOutRight : slideOutLeft;
    if (direction === "right") return isRTL ? slideOutLeft : slideOutRight;
  }
  return slideInLeft;
};
