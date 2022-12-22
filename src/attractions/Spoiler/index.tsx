import { PropsWithChildren, useRef, HTMLAttributes, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

import worklet from "./worklet?url";

import { useRAF } from "./useRAF";
import { useIsInViewport } from "./useIsInViewport";

if ("paintWorklet" in CSS) {
  (CSS as any).paintWorklet.addModule(worklet);
}

type Props = {
  reveal?: boolean;
} & HTMLAttributes<HTMLSpanElement>;

export const Spoiler = ({ children, reveal = false, ...restProps }: PropsWithChildren<Props>) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInViewport = useIsInViewport(ref);

  const time = useRef<number>(0); // continously growing global time, starts with 0
  const dt = useRef<number>(0);

  // updates a CSS variable
  const setCSSVariable = (variable: string, value: string | number) =>
    ref.current?.style?.setProperty(variable, String(value));

  const shouldRunAnimation = isInViewport && !reveal;

  useRAF((_time, delta) => {
    const minFPS = 1.0;
    const maxFPS = 12.0;

    delta = Math.min(delta, 1000.0 / minFPS); // when it's been too long since the last call
    dt.current += delta;

    // skip frames until delta reach maxFPS delta
    if (dt.current < 1000.0 / maxFPS) return;
    time.current += dt.current;

    // reset the delta counter
    dt.current = 0;

    // redraw
    setCSSVariable("--time", time.current);
  }, shouldRunAnimation);

  return (
    <Secret ref={ref} reveal={reveal} {...restProps}>
      <RealContent reveal={reveal}>{children}</RealContent>
    </Secret>
  );
};

const RealContent = styled.span<{ reveal: boolean }>`
  transition: filter 0.3s ease, color 0.3s ease;
  ${(props) =>
    !props.reveal &&
    css`
      filter: blur(3px);
      color: rgba(0, 0, 0, 0.3);
    `}
`;

export const Secret = styled.span<{ reveal: boolean }>`
  will-change: transform;
  transition: background 0.4s ease;
  --time: 0;

  ${(props) =>
    !props.reveal &&
    css`
      user-select: none;
      background: paint(spoiler);
      background-size: 4em 100%;
      border-radius: 0.3em;
      color: transparent;
      pointer-events: none;
    `}
`;
