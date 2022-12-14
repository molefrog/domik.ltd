import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

import sprite from "~/assets/sprites/wondering-eyes.png";

export const EyedLink = (props: React.ComponentProps<"a">) => {
  // opens in a new window by default
  return (
    <Link target="_blank" rel="noreferrer noopener" {...props}>
      {props.children}
      <InlineEyes />
    </Link>
  );
};

/**
 * Styles
 */

const Link = styled.a`
  color: inherit;
  cursor: pointer;
  text-decoration-thickness: 2px;
  text-decoration: underline;
  text-decoration-color: var(--color-text);

  :visited {
    color: inherit;
  }

  :hover {
    background-color: var(--color-selected);
    text-decoration: none;
  }

  :hover span:last-of-type {
    animation-duration: 0.5s;
  }
`;

/**
 * Eye icon and animations
 */
const spriteAnimation = keyframes`
 0%   {  background-position-x: calc(100% / (var(--total-frames) - 1) * 0); }
 100% {  background-position-x: calc(100% / (var(--total-frames) - 1) * var(--total-frames)); }
`;

export const WonderingEyes = styled.span<{ speed?: number }>`
  --total-frames: 4;
  background-image: url(${sprite});
  background-size: auto 100%;
  aspect-ratio: 1 / 1;

  animation: ${(p) => p.speed || 1}s normal infinite ${spriteAnimation};
  animation-timing-function: steps(var(--total-frames), jump-start);

  width: 1em;
  height: 1em;
  display: inline-block;
`;

const InlineEyes = styled(WonderingEyes)`
  // position and alignment within a link
  margin-left: 0.08em;
  vertical-align: sub;
`;
