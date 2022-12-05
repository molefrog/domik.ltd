import styled from "@emotion/styled";
import { useSpring, animated } from "@react-spring/web";

import body from "~/assets/compass/body.png";
import arrow from "~/assets/compass/arrow.png";

type CompassProps = { size?: number } & (
  | { angle: number; angleRad?: never } // either `angle` or `angleRad` must be present
  | { angle?: never; angleRad: number }
);

// [0, 2π] => [0, 360]
const radToDeg = (rad: number) => (360.0 * rad) / (2 * Math.PI);

export const Compass = ({ size = 50, angle, angleRad = 0 }: CompassProps) => {
  if (angle === undefined) {
    angle = radToDeg(angleRad);
  }

  const { alpha } = useSpring({
    from: { alpha: 0 },
    to: { alpha: angle },
    config: { mass: 1, tension: 200, friction: 8 },
  });

  return (
    <Body size={size}>
      <Arrow style={{ rotate: alpha.to((a) => `${-a}deg`) }} />
    </Body>
  );
};

const Body = styled.div<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: url(${body}) no-repeat center;
  background-size: cover;
  position: relative;
  z-index: 100;
`;

const Arrow = styled(animated.div)`
  will-change: transform;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background: url(${arrow}) no-repeat center;
  background-size: cover;
`;
