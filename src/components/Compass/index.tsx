import styled from "@emotion/styled";
import { useSpring, animated } from "react-spring";

import body from "~/assets/compass/body.png";
import arrow from "~/assets/compass/arrow.png";

interface Props {
  size?: number;
  angle?: number;
}

export const Compass = (props: Props) => {
  const { alpha } = useSpring({
    from: { alpha: 34 },
    to: { alpha: props.angle || 0 },
    config: { mass: 1, tension: 200, friction: 8 },
  });

  return (
    <Body size={props.size}>
      <Arrow style={{ rotate: alpha.to((a) => `${90.0 - a}deg`) }} />
    </Body>
  );
};

const Body = styled.div<{ size?: number }>`
  width: ${(props) => props.size || "50"}px;
  height: ${(props) => props.size || "50"}px;
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
