import styled from "@emotion/styled";
import { SVGTextWithOuterStroke } from "./SVGTextWithOuterStroke";
import billboardImg from "~/assets/main/billboard.png";
import { ComponentProps } from "react";

export const Billboard = (props: ComponentProps<"svg">) => {
  return (
    <svg viewBox="0 0 540 380" {...props}>
      <image xlinkHref={billboardImg} x="0" y="0" width="519" height="372" />

      <g transform="rotate(-6) translate(212 190) skewX(-6) scale(0.85)">
        <Subtitle transform="translate(70, 42)" stroke="white" strokeWidth="8">
          лимитед
        </Subtitle>

        <Title stroke="white" strokeWidth="16">
          домик
        </Title>
      </g>
    </svg>
  );
};

const Title = styled(SVGTextWithOuterStroke)`
  font-size: 78px;
  letter-spacing: -2px;
  font-weight: 900;
  text-transform: uppercase;
`;

const Subtitle = styled(SVGTextWithOuterStroke)`
  font-size: 34px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
`;
