import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import React, { useState, PropsWithChildren } from "react";

import "~/utils/squircle";
import { Anxiety, Fear, Happiness, Sadness } from "./glows";

const glows = {
  happiness: Happiness,
  anxiety: Anxiety,
  sadness: Sadness,
  fear: Fear,
};

type Feeling = keyof typeof glows;

export const Emotion = (props: PropsWithChildren<{ feeling: Feeling }>) => {
  const [pulseDelay] = useState(() => Math.random() * 2);

  const GlowComp = glows[props.feeling];

  return (
    <Tag style={{ "--pulse-delay": `${pulseDelay}s` } as React.CSSProperties}>
      <GlowComp />
      {props.children}
    </Tag>
  );
};

const pulseAnimation = keyframes`
  0% {
    background: var(--pulse-color);
  }

  60%, 100% {
    background: transparent;
  }
`;

const Tag = styled.span`
  padding: 0px 4px 3px 4px;
  margin: 0 -4px;
  cursor: crosshair;

  // rounded squircle borders
  --squircle-radius: 16px;
  --squircle-smooth: 0.6;
  mask-image: paint(squircle);

  --pulse-color: rgba(var(--color-selected-rgb) / 0.8);
  --pulse-delay: 0s;

  animation: 3s ${pulseAnimation} infinite ease-out var(--pulse-delay);

  @media (prefers-reduced-motion) {
    animation: none;
    background: var(--pulse-color);
  }

  &:hover {
    animation: none;
    background: none;
    color: white;

    > span {
      opacity: 1;
    }
  }

  position: relative;
  white-space: nowrap;
`;
