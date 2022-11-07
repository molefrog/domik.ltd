import { PropsWithChildren, useRef, HTMLAttributes, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

import worklet from "./worklet?url";
import { useRaf } from "./use-raf";

if ("paintWorklet" in CSS) {
  (CSS as any).paintWorklet.addModule(worklet);
}

type Props = {
  reveal?: boolean;
} & HTMLAttributes<HTMLSpanElement>;

export const Spoiler = ({ children, reveal = false, ...restProps }: PropsWithChildren<Props>) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const int = setInterval(() => {
      ref.current?.style?.setProperty("--time", String(Math.random()));
    }, 100);

    return () => clearInterval(int);
  });

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
      color: rgba(0, 0, 0, 0.2);
    `}
`;

export const Secret = styled.span<{ reveal: boolean }>`
  will-change: transform;
  --time: 0;
  transition: background 0.4s ease;

  ${(props) =>
    !props.reveal &&
    css`
      user-select: none;
      background: paint(spoiler);
      background-size: 4em 100%;
      border-radius: 0.3em;
      color: transparent;
    `}
`;
