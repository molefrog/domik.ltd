import styled from "@emotion/styled";
import { SVGTextWithOuterStroke } from "./SVGTextWithOuterStroke";
import billboardImg from "~/assets/main/main-menu.webp";
import { ComponentProps } from "react";

import { useI18n } from "~/i18n/hooks";

export const Billboard = (props: ComponentProps<"svg">) => {
  const i18n = useI18n();

  return (
    <svg viewBox="0 0 800 714" {...props}>
      <image xlinkHref={billboardImg} x="0" y="0" width="100%" />

      <g transform="rotate(-6) translate(380 220) skewX(-6) scale(1.05)">
        <Subtitle transform="translate(70, 50)" stroke="white" strokeWidth="8">
          {i18n.t("banner.ltd")}
        </Subtitle>

        <Title stroke="white" strokeWidth="18">
          {i18n.t("banner.domik")}
        </Title>
      </g>
    </svg>
  );
};

const Title = styled(SVGTextWithOuterStroke)`
  font-size: 82px;
  letter-spacing: -2px;
  font-weight: 900;
  text-transform: uppercase;
  filter: drop-shadow(4px 3px 0px black);
`;

const Subtitle = styled(SVGTextWithOuterStroke)`
  font-size: 38px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  filter: drop-shadow(2px 1px 0px black);
`;
