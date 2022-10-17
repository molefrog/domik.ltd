import styled from "@emotion/styled";

import { useState, useEffect, useCallback } from "react";

import { BumperCar } from "~/components/BumperCar";

interface ProgressBarProps {
  progress: number;
  max?: number;
}

export const ProgressBar = ({ progress, max = 1.0 }: ProgressBarProps) => {
  const scaled = max * Math.min(1.0, Math.max(0, progress));

  const hidden = progress <= 0 || progress >= 1.0;
  const width = 380;

  return (
    <Container hidden={hidden /*scaled >= max*/}>
      <Bar hidden={hidden} style={{ width: width }}>
        <Filled style={{ width: `${100.0 * scaled}%` }} />
        <Car
          style={{
            transform: `
          translate(calc(-50% + ${scaled * width}px), 0) 
          scale(-1, 1)`,
          }}
        >
          <BumperCar width={70} animation={false}></BumperCar>
        </Car>
      </Bar>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: -24px;
  left: 0;
  right: 0;
  height: 96px;
  background: linear-gradient(360deg, var(--color-bg), transparent);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 44px;
  pointer-events: none;

  ${(props) => props.hidden && `opacity: 0;`}
  will-change: opacity;
  transition: opacity 0.3s ease;
`;

const Car = styled.div`
  position: absolute;
  will-change: transform;
  left: 0;
  top: -21px;
`;

const Filled = styled.div`
  width: 0px;
  height: 8px;
  background: var(--color-selected);
  border-radius: 10px;
`;

const Bar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  border-radius: 12px;
  background: #c1c1c1;
  border: 2px solid white;

  box-shadow: 0 0 12px 0 rgba(179, 179, 179, 0.6), 0 1px 2px 0 rgba(0, 0, 0, 0.15);

  transition: all 0.25s ease;
  will-change: transform;
  ${(props) => props.hidden && `transform: translateY(100px);`}
`;
