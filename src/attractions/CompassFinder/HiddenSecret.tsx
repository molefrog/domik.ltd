import styled from "@emotion/styled";
import React from "react";

interface Coordinates {
  x: number;
  y: number;
}

export type HiddenSecretProps = {
  // coordinates in %
  xPct?: number;
  yPct?: number;
  isRevealed?: boolean;
} & Coordinates;

const debug = true;

export const HiddenSecret = ({ xPct, yPct, isRevealed = false }: HiddenSecretProps) => {
  const PointComponent = debug ? DebugPoint : MagnifyingGlass;
  return <PointComponent style={{ left: `${xPct}%`, top: `${yPct}%` }} isRevealed={isRevealed} />;
};

const DebugPoint = styled.div<{ isRevealed: boolean }>`
  --size: 16px;

  position: absolute;
  top: 0%;
  left: 0%;

  width: var(--size);
  height: var(--size);
  margin-left: calc(-0.5 * var(--size));
  margin-top: calc(-0.5 * var(--size));
  border-radius: 100% 100%;

  box-shadow: 0px 0px 0px 6px white, 0 0px 12px 0px rgba(0, 0, 0, 0.4);
  background: rebeccapurple;
  ${(props) => props.isRevealed && "background: red;"};
`;

const MagnifyingGlass = styled.div`
  --size: 220px;

  position: absolute;
  top: 0%;
  left: 0%;

  width: var(--size);
  height: var(--size);
  margin-left: calc(-0.5 * var(--size));
  margin-top: calc(-0.5 * var(--size));
  border-radius: 100% 100%;

  box-shadow: 0px 0px 0px 6px white, 0 0px 12px 0px rgba(0, 0, 0, 0.4);
  background: rgb(255 255 255 / 0.6);

  transition: 0.4s transform cubic-bezier(0.82, 0.09, 0.54, 1.76), 0.3s opacity ease-in;
  backdrop-filter: blur(4px);

  &:hover {
    transform: translateY(20%) scale(0.2, 0.2);
    opacity: 0;
  }
`;
