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

import { lerp, Point, angleAndDistanceBetween } from "./math";
import { sortBy } from "lodash";
import { usePopSound, useSuccessSound } from "~/hooks/useSounds";
import { useHorizontalScrollProgress } from "./useHorizontalScrollProgress";
import { Slider } from "~/components/Slider";

interface CompassFinderProps {
  fieldImg: string;
  fieldImgDimensions: [number, number];
  children: ReactElement<ComponentProps<typeof HiddenSecret>>[];
  onSuccessChange?: (value: boolean) => void;
}

const cursorCoordinates = ({ elementHeight, elementWidth, x, y }: MousePosition): Point => {
  if (x === null || y === null || !elementHeight || !elementHeight) {
    return [0, 0];
  }

  const scale = 1 / elementWidth!;

  const _x = x * scale;
  const _y = y * scale;

  return [_x, _y];
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
  const anglesAndDistances = targets.map((point) => angleAndDistanceBetween(cursor, point));
  const ids = targets.map((_p, idx) => idx).filter((id) => !revealedIds.includes(id));

  const closestTargetId = sortBy(ids, (idx) => {
    const [, dist] = anglesAndDistances[idx];
    return dist;
  })[0];

  const [alpha, distance] = anglesAndDistances[closestTargetId] || [-0.5 * Math.PI, 0.0];

  // Reveal the secret when the cursor stays within a circle for N seconds
  const revealRadius = 0.02;
  const toBeRevealedId = !isSolved && distance < revealRadius ? closestTargetId : undefined;

  useEffect(() => {
    if (toBeRevealedId === undefined) return;

    const tm = setTimeout(() => {
      revealSecret(toBeRevealedId);
    }, 5000);

    return () => {
      clearTimeout(tm);
    };
  }, [toBeRevealedId, revealSecret]);

  // scrolling support on mobiles
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useHorizontalScrollProgress(scrollContainerRef);

  return (
    <InteractionBadge>
      <ContainerWithScroll ref={scrollContainerRef}>
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

          <CompassCursor
            accuracy={compassAccuracyFromDistance(distance)}
            pulseFrequency={pulseFrequencyFromDistance(distance)}
            size={64}
            mousePosition={mousePosition}
            angleRad={alpha}
          />
        </Finder>
      </ContainerWithScroll>

      <ScrollSlider>
        <Slider
          value={[scrollProgress * 100.0]}
          onValueChange={([val]) => setScrollProgress(val / 100.0)}
        />
      </ScrollSlider>
    </InteractionBadge>
  );
};

const compassAccuracyFromDistance = (distance: number) => {
  const A = 0.2;
  if (distance > A) {
    return 0.0;
  } else {
    return 1.0 - distance / A;
  }
};

const pulseFrequencyFromDistance = (distance: number) => {
  const maxPulseRadius = 0.1;

  if (distance > maxPulseRadius) {
    return 0.0;
  } else {
    const t = Math.min(1.0, distance / maxPulseRadius);
    const pulseFrequency = lerp(t, 1.0, 0.25);

    return pulseFrequency;
  }
};

const ScrollSlider = styled.div`
  position: absolute;
  right: 16px;
  bottom: -12px;
  visibility: hidden;

  width: 140px;

  @media (max-width: 1024px) {
    visibility: visible;
  }
`;

const ContainerWithScroll = styled.div`
  user-select: none;

  // don't scroll the parent element once reaches the end of scroll
  overscroll-behavior: contain;

  @media (max-width: 1024px) {
    overflow: hidden;
  }
`;

const Finder = styled.div<{ image: string; aspect: string }>`
  background: url("${(props) => props.image}") top / 100%, var(--color-embossed);
  aspect-ratio: ${(props) => props.aspect};
  position: relative;
  cursor: none;
  min-width: 1024px; // should overflow on smaller viewports
  touch-action: none;
`;
