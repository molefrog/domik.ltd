import styled from "@emotion/styled";
import React, {
  useState,
  useRef,
  ComponentProps,
  ReactElement,
  cloneElement,
  useEffect,
  useCallback,
} from "react";
import useMouse, { MousePosition } from "@react-hook/mouse-position";
import useChange from "@react-hook/change";

import { InteractionBadge } from "~/components/InteractionBadge";
import { CompassCursor } from "./CompassCursor";
import { HiddenSecret } from "./HiddenSecret";
export { HiddenSecret };

import { sortBy } from "lodash";
import { usePopSound, useSuccessSound } from "~/hooks/useSounds";

interface CompassFinderProps {
  fieldImg: string;
  fieldImgDimensions: [number, number];
  children: ReactElement<ComponentProps<typeof HiddenSecret>>[];
  onSuccessChange?: (value: boolean) => void;
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

const angleAndDistanceBetween = ([ax, ay]: Point, [bx, by]: Point): [number, number] => {
  const Δ = Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
  const α = -Math.atan2(by - ay, bx - ax);

  return [α, Δ];
};

export const CompassFinder = ({
  fieldImg,
  fieldImgDimensions: [w, h],
  children,
  onSuccessChange,
}: CompassFinderProps) => {
  // sounds
  const [playPop] = usePopSound();
  const [playSuccess] = useSuccessSound();

  // width and height transformed
  // from here on we work in normalized coordinates: width = 1, height = (depends on img dimensions)
  const [wNorm, hNorm] = [1, h / w];

  // extract secret point coordinates from the children
  let targets: Point[] = [];
  React.Children.forEach(children, (child) => {
    targets.push([child.props.x, child.props.y]);
  });

  // obtaining the cursor position within the working area
  const finderRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMouse(finderRef, { enterDelay: 100 });
  const cursor = cursorCoordinates(mousePosition);

  // revelaing points and solving the puzzle
  const [revealedIds, setReveleadIds] = useState<number[]>([]);
  const revealSecret = useCallback(
    (id: number) => {
      if (revealedIds.includes(id)) return;
      const updated = [...revealedIds, id];

      setReveleadIds(updated);
      playPop();

      if (updated.length === targets.length) {
        playSuccess();
      }
    },
    [revealedIds, targets.length, playSuccess, playPop]
  );

  // all secrets revealed
  const isSolved = revealedIds.length === targets.length;
  useChange(isSolved, (value) => onSuccessChange?.(value));

  // angles and distances from cursor to a target point
  const anglesAndDistances = targets.map((point, index) => angleAndDistanceBetween(cursor, point));

  const ids = targets.map((_p, idx) => idx);

  const closestTargetId = sortBy(ids, (idx) => {
    const [, dist] = anglesAndDistances[idx];
    return dist;
  })[0];

  const closestTarget = targets[closestTargetId];
  const [alpha, distance] = anglesAndDistances[closestTargetId];

  useChange(distance, (d) => {
    if (d < 0.02) revealSecret(closestTargetId);
  });

  const [acc, setAcc] = useState(0.5);

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
        {React.Children.map(children, (child, index) => {
          const { x, y } = child.props;
          const isRevealed = revealedIds.includes(index);

          return cloneElement(child, {
            xPct: (100.0 * x) / wNorm,
            yPct: (100.0 * y) / hNorm,
            isRevealed,
          });
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
  min-height: 360px; // should overflow on smaller viewports
  position: relative;
  cursor: none;
`;
