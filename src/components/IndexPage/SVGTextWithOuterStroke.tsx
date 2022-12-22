import styled from "@emotion/styled";
import { ComponentProps } from "react";

interface SVGTextWithOuterStrokeProps extends ComponentProps<"g"> {
  strokeWidth: string;
  stroke: string;
}

export const SVGTextWithOuterStroke = ({
  children,
  stroke,
  strokeWidth,
  ...props
}: ComponentProps<"g">) => {
  return (
    <G {...props}>
      <text stroke={stroke} strokeWidth={strokeWidth}>
        {children}
      </text>
      <text>{children}</text>
    </G>
  );
};

const G = styled.g``;
