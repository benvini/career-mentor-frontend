import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  direction: ${(props) => props.theme.direction};
  text-align: ${(props) =>
    props.theme.direction === "rtl" ? "right" : "left"};
`;

interface RTLWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const RTLWrapper: React.FC<RTLWrapperProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <Wrapper className={className} style={style}>
      {children}
    </Wrapper>
  );
};
