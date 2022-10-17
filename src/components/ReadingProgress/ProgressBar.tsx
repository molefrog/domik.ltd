import styled from "@emotion/styled";

import { useState, useEffect, useCallback } from "react";

import { BumperCar } from "~/components/BumperCar";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = (props: ProgressBarProps) => {
  const constrained = Math.min(1.0, Math.max(0, props.progress));

  const hidden = constrained === 0 || constrained === 1.0;
  const width = 380;

  return (
    <Container hidden={hidden}>
      <Bar style={{ width: width }}>
        <Filled style={{ width: `${100.0 * constrained}%` }} />
        <Car
          style={{
            transform: `
          translate(calc(-50% + ${constrained * width}px), 0) 
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
  bottom: 28px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;

  ${(props) => props.hidden && `opacity: 0; transform: translateY(120px);`}
  transition: all 0.4s ease;
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
  background: var(--color-subtle-gray);
  border: 2px solid white;

  box-shadow: 0 0 12px 0 rgba(179, 179, 179, 0.6), 0 1px 2px 0 rgba(0, 0, 0, 0.15);
`;
