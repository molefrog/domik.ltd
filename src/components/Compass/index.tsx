import styled from "@emotion/styled";
import { useSpring, animated } from "@react-spring/web";

import { radToDeg, lerp } from "~/attractions/CompassFinder/math";

import body from "~/assets/compass/body.png";
import arrow from "~/assets/compass/arrow.png";
import arrowDirected from "~/assets/compass/arrow-directed.png";

type CompassProps = {
  size?: number;
  accuracy?: number; // 0 to 1, how accurate the compass is
  directed?: boolean;
} & (
  | { angle: number; angleRad?: never } // either `angle` or `angleRad` must be present
  | { angle?: never; angleRad: number }
);

export const Compass = ({
  size = 50,
  angle,
  accuracy = 1.0,
  angleRad = 0,
  directed = false,
}: CompassProps) => {
  if (angle === undefined) {
    angle = radToDeg(angleRad);
  }

  const threshold = 0.75;
  if (accuracy < threshold) {
    const error = accuracy / threshold;
    angle -= angle % Math.floor(lerp(error, 90, 10));
  }

  const { alpha } = useSpring({
    from: { alpha: 0 },
    to: { alpha: angle },
    config: { mass: 1, tension: lerp(accuracy, 40, 100), friction: lerp(accuracy, 0.1, 20) },
  });

  return (
    <Body size={size}>
      {/* zero angle starts at the east, unit circle goes counter-clockwise */}
      <Arrow isDirected={directed} style={{ rotate: alpha.to((a) => `${-a}deg`) }} />
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

const Arrow = styled(animated.div, { shouldForwardProp: (prop) => prop != "isDirected" })<{
  isDirected: boolean;
}>`
  will-change: transform;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background: url(${({ isDirected }) => (isDirected ? arrowDirected : arrow)}) no-repeat center;
  background-size: cover;
`;
