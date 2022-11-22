import styled from "@emotion/styled";
import { css } from "@emotion/react";

import iconPlay from "./images/icon-play.svg";
import iconStop from "./images/icon-stop.svg";
import iconCamera from "./images/icon-camera.svg";
import iconShuffle from "./images/icon-shuffle.svg";
import iconPlus from "./images/icon-plus.svg";
import iconMinus from "./images/icon-minus.svg";

const ICONS = {
  play: iconPlay,
  stop: iconStop,
  camera: iconCamera,
  shuffle: iconShuffle,
  plus: iconPlus,
  minus: iconMinus,
};

interface ButtonProps {
  width?: string;
  height?: string;
  aspect?: string;
  icon?: keyof typeof ICONS;
  iconSize?: string;
}

/**
 * Styles
 */

export const Controls = styled.div<{ gap: number }>`
  position: absolute;
  top: 32px;
  right: 29px;

  display: grid;
  column-gap: ${(props) => (props.gap || 16) + "px"};
  grid-auto-flow: column;
`;

export const Button = styled.button<ButtonProps>`
  width: ${({ width = "64px " }) => width};
  height: ${({ height = "64px " }) => height};

  border-radius: 6px;
  border: none;
  padding: 0;
  cursor: pointer;

  background: var(--color-bg);
  box-shadow: 0px 1px 0px 1.5px #ddd, 0px 2px 0px 2px #bbb, 0px -1px 0px 1px #ddd;
  font-size: calc(${({ height = "64px" }) => height} / 2);

  display: flex;
  align-items: center;
  justify-content: center;

  &:focus-visible {
    outline: var(--color-selected-vivid) dashed 4px;
    outline-offset: 6px;
  }

  &:hover {
    transform: scale(1.02, 1.02) translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }

  ${({ icon, iconSize = "60%" }) =>
    icon &&
    css`
      &:before {
        content: "";
        display: inline-block;
        width: ${iconSize};
        height: ${iconSize};
        background: url("${ICONS[icon!]}") center / contain no-repeat;
      }
    `}
`;
