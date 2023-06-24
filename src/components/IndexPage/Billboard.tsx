import styled from "@emotion/styled";
import { SVGTextWithOuterStroke } from "./SVGTextWithOuterStroke";
import billboardImg from "~/assets/main/main-menu.webp";
import { ComponentProps, useId } from "react";

import { useI18n } from "~/i18n/hooks";

export const Billboard = (props: ComponentProps<"svg">) => {
  const i18n = useI18n();

  const filterId = useId();

  return (
    <svg viewBox="0 0 800 714" {...props}>
      <defs>
        <filter id={filterId}>
          <feDropShadow dx="0" dy="0.4" stdDeviation="1" floodColor="black" floodOpacity="0.4" />
          <feDropShadow dx="-3" dy="0.4" stdDeviation="3" floodColor="black" floodOpacity="0.5" />
        </filter>
      </defs>

      <image xlinkHref={billboardImg} x="0" y="0" width="100%" />

      <g transform="rotate(-6) translate(360 220) skewX(-6) scale(1.05)">
        <Subtitle
          style={{ filter: `url(#${filterId})` }}
          transform="translate(75, 48)"
          stroke="white"
          strokeWidth="8"
        >
          {i18n.t("banner.ltd")}
        </Subtitle>

        <Title style={{ filter: `url(#${filterId})` }} stroke="white" strokeWidth="18">
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
`;

const Subtitle = styled(SVGTextWithOuterStroke)`
  font-size: 38px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
`;
