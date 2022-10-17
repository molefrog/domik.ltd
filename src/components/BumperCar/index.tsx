import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";

import carImage from "~/assets/sprites/bumper-car.png";

interface Props {
  width?: number;
  animation?: boolean;
}

export const BumperCar = (props: Props) => {
  const props_ = Object.assign({ animation: true, width: 128 }, props);
  return <Car src={carImage} {...props_} />;
};

const drivingAnimation = keyframes`
  from, to {
    transform: translateY(0px);
  }

  20% {
    transform: translateY(-8px);
  }

  40% {
    transform: translateY(-5px);
  }
  
  60% {
    transform: translateY(-7px);
  }
`;

const Car = styled.img<Props>`
  width: ${(props) => `${props.width}px`};

  filter: drop-shadow(0px 1px 0px rgba(0, 0, 0, 0.2)) drop-shadow(0px -1px 0px rgba(0, 0, 0, 0.1));

  ${(props) =>
    props.animation &&
    css`
      animation: 0.8s ease-in infinite 0s both ${drivingAnimation};
    `}
`;
