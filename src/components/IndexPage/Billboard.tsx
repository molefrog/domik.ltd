import styled from "@emotion/styled";
import { SVGTextWithOuterStroke } from "./SVGTextWithOuterStroke";
import billboardImg from "~/assets/main/billboard-hills.webp";
import { ComponentProps } from "react";

import { useI18n } from "~/i18n/hooks";

export const Billboard = (props: ComponentProps<"svg">) => {
  const i18n = useI18n();

  return (
    <svg viewBox="0 0 885 340" {...props}>
      <image xlinkHref={billboardImg} x="0" y="0" width="885" height="340" />

      <g transform="rotate(-6) translate(416 172) skewX(-6) scale(0.68)">
        <Subtitle transform="translate(70, 42)" stroke="white" strokeWidth="8">
          {i18n.t("banner.ltd")}
        </Subtitle>

        <Title stroke="white" strokeWidth="16">
          {i18n.t("banner.domik")}
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
  filter: drop-shadow(4px 3px 0px black);
`;

const Subtitle = styled(SVGTextWithOuterStroke)`
  font-size: 34px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  filter: drop-shadow(2px 1px 0px black);
`;
