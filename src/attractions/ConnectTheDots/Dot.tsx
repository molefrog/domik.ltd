import styled from "@emotion/styled";
import { type Coords } from "./types";

interface DotProps extends React.ComponentProps<"circle"> {
  position: Coords;
  selected?: boolean;
  isDrawing?: boolean;
}

export const Dot = ({ position: [x, y], selected, isDrawing, ...rest }: DotProps) => {
  return (
    <G>
      <HoverZone cx={x} cy={y} r={26} isDrawing={Boolean(isDrawing)} {...rest} />

      {/* Outer circle */}
      <InnerDotCircle r={10} cx={x} cy={y} border={Boolean(selected)} />
      {/* Inner circle */}
      <DotCircle r={6} cx={x} cy={y} />
    </G>
  );
};

const G = styled.g`
  --stroke-color: black;
  --fill-color: white;
  --stroke-width: 2.5;
`;

const HoverZone = styled.circle<{ isDrawing: boolean }>`
  fill: transparent;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.8s ease;

  &:hover {
    fill: var(--color-selected);
  }

  &:active {
    opacity: 0.3;
    cursor: grabbing;
    transition-duration: 0.1s;
  }

  ${(props) => props.isDrawing && "cursor: cell;"}
`;

const DotCircle = styled.circle`
  fill: var(--fill-color);
  stroke-width: var(--stroke-width);
  stroke: var(--stroke-color);
  pointer-events: none;
`;

const InnerDotCircle = styled(DotCircle)<{ border: boolean }>`
  stroke-width: 2;

  ${(props) => (props.border ? `stroke: var(--stroke-color);` : `stroke: transparent;`)}
`;
