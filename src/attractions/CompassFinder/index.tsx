import styled from "@emotion/styled";
import React, { useState, useRef, ComponentProps, ReactElement, cloneElement } from "react";
import useMouse, { MousePosition } from "@react-hook/mouse-position";

import { InteractionBadge } from "~/components/InteractionBadge";
import { CompassCursor } from "./CompassCursor";
import { HiddenSecret } from "./HiddenSecret";
export { HiddenSecret };

interface CompassFinderProps {
  fieldImg: string;
  fieldImgDimensions: [number, number];
  children: ReactElement<ComponentProps<typeof HiddenSecret>>[];
}

type Point = [number, number];

const cursorCoordinates = ({ elementHeight, elementWidth, x, y }: MousePosition): Point => {
  if (x === null || y === null || !elementHeight || !elementHeight) {
    return [0, 0];
  }

  const scale = 1 / elementWidth!;

  const _x = x * scale;
  const _y = y * scale;

  return [_x, _y];
};

const angleAndDistanceBetween = ([ax, ay]: Point, [bx, by]: Point) => {
  const Δ = Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
  const α = -Math.atan2(by - ay, bx - ax);

  return [α, Δ];
};

export const CompassFinder = ({
  fieldImg,
  fieldImgDimensions: [w, h],
  children,
}: CompassFinderProps) => {
  // width and height transformed
  const [wNorm, hNorm] = [1, h / w];

  // from here on we work in normalized coordinates: width = 1, height = (depends on img dimensions)
  const [acc, setAcc] = useState(0.5);

  // obtaining the cursor position within the working area
  const finderRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMouse(finderRef, { enterDelay: 100 });

  let targets: Point[] = [];
  React.Children.forEach(children, (child) => {
    targets.push([child.props.x, child.props.y]);
  });

  const cursor = cursorCoordinates(mousePosition);
  const [alpha, d] = angleAndDistanceBetween(cursor, targets[0]);

  return (
    <InteractionBadge>
      <center>
        <input
          type="range"
          value={acc * 10.0}
          min="0"
          max="10"
          onChange={(e) => setAcc(parseInt(e.target.value) / 10.0)}
        />{" "}
        accuracy = {acc.toFixed(1)}
      </center>

      <Finder ref={finderRef} image={fieldImg} aspect={String(wNorm / hNorm)}>
        {/* render the secret points by transforming their normal coordinates to offsets in percentage */}
        {React.Children.map(children, (child) => {
          const { x, y } = child.props;
          return cloneElement(child, { xPct: (100.0 * x) / wNorm, yPct: (100.0 * y) / hNorm });
        })}

        <CompassCursor size={64} accuracy={acc} mousePosition={mousePosition} angleRad={alpha} />
      </Finder>
    </InteractionBadge>
  );

  return <div>dsf</div>;
};

const Finder = styled.div<{ image: string; aspect: string }>`
  background: url("${(props) => props.image}") top / 100%, var(--color-embossed);
  aspect-ratio: ${(props) => props.aspect};
  min-height: 320px; // should overflow on smaller viewports
  position: relative;
  cursor: none;
`;
