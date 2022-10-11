import { ReactNode, useRef, useEffect } from "react";
import { useTransition, animated } from "react-spring";
import { colord } from "colord";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

import { usePrevious } from "~/hooks/usePrevious";

import oct0 from "~/assets/symbols/0.svg";
import oct1 from "~/assets/symbols/1.svg";
import oct2 from "~/assets/symbols/2.svg";
import oct3 from "~/assets/symbols/3.svg";
import oct4 from "~/assets/symbols/4.svg";
import oct5 from "~/assets/symbols/5.svg";
import oct6 from "~/assets/symbols/6.svg";
import oct7 from "~/assets/symbols/7.svg";

const symbols = [oct0, oct1, oct2, oct3, oct4, oct5, oct6, oct7];

export enum Direction {
  Backward = -1,
  Forward = 1,
}

interface SelectProps {
  value: number;
  onClick: () => void;
  direction?: Direction;
}

interface TransitionItem {
  offset: number;
}

const Symbol = (props: { value: number }) => {
  return (
    <SymbolContainer>
      <img src={symbols[props.value % 8]} />
    </SymbolContainer>
  );
};

export const CipherCharSelect = ({
  value,
  onClick,
  direction,
}: SelectProps) => {
  const prevValue = usePrevious(value);

  let dir = value > (prevValue || 0) ? 1 : -1;
  if (direction !== undefined) dir = direction;

  const transitions = useTransition<number, TransitionItem>(value, {
    from: (item) => ({ offset: -200 * dir }),
    enter: () => ({ offset: 0 }),
    leave: (item) => ({ offset: 100 * dir }),
  });

  return (
    <Box onClick={onClick}>
      <ShadowLayer />
      {transitions(({ offset }, item, t) => {
        return (
          <AnimatedLayer
            key={t.key}
            style={{
              translateY: offset.to((x) => `${x}%`),
            }}
          >
            <Symbol value={item} />
          </AnimatedLayer>
        );
      })}
    </Box>
  );
};

const AnimatedLayer = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ShadowLayer = styled(AnimatedLayer)`
  box-shadow: 0px 1px 1px 0px rgb(0 0 0 / 5%) inset,
    0px 0px 1px 0px rgb(0 0 0 / 5%) inset,
    0px 4px 6px -4px rgb(0 0 0 / 10%) inset;

  transition: box-shadow 0.25s ease, border-color 0s;
  z-index: 10;

  :hover {
    box-shadow: none;
  }
`;

const SymbolContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 10px;
  z-index: 1;

  img {
    width: 60%;
    transition: transform 0.2s ease;
    opacity: 0.7;
  }
`;

const Box = styled.div`
  z-index: 2;
  width: 100px;
  height: 140px;
  border-radius: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  user-select: none;

  background-color: var(--color-embossed);
  border: 8px solid var(--color-embossed);

  :hover {
    border-color: var(--color-selected);

    img {
      transform: translateY(-2px);
    }
  }
`;
