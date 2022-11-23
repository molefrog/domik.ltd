import styled from "@emotion/styled";
import { useRef, useState, useMemo, useCallback, useEffect, PropsWithChildren } from "react";

import { usePopSound, useResetSound, useSuccessSound } from "~/hooks/useSounds";
import { Dot } from "./Dot";
import { type Coords } from "./types";
import { InteractionBadge } from "~/components/InteractionBadge";

interface ConnectTheDotsProps {
  dots: Coords[];
  initialPath: number[];
  baseWidth?: number;
  image?: string;
  background?: "light" | "dark";
  overlayImage?: string;
  successPredicate?: (p: number[]) => boolean;
  onSuccessChange?: (state: boolean) => void;
}

const matchNone = () => false;

export const ConnectTheDots = ({
  dots: providedDots,
  initialPath,
  image,
  overlayImage,
  background = "light",
  baseWidth = 670,
  successPredicate = matchNone,
  onSuccessChange,
  children,
}: PropsWithChildren<ConnectTheDotsProps>) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // currently it's not possible to change the dot layout dynamically via props,
  // so we simply memoize the first provided value
  const [dots] = useState(() => providedDots);

  const [pointer, setPointer] = useState<Coords>();
  const [isDrawing, setIsDrawing] = useState(false);
  const [path, setPath] = useState<number[]>(() => initialPath);
  const [isSuccess, setIsSuccess] = useState<boolean>(() => !!initialPath.length);

  const [playPop] = usePopSound({
    // increase sound pitch with every dot selected
    playbackRate: 0.5 + 0.1 * Math.min(path.length, 8),
  });
  const [playReset] = useResetSound();
  const [playSuccess] = useSuccessSound();

  // the path that is currently being built
  const svgPath = buildPath([...path.map((i) => dots[i]), ...(isDrawing ? [pointer] : [])]);

  // erase everything
  const reset = useCallback(
    ({ silent } = { silent: false }) => {
      setPath([]);
      setIsDrawing(false);
      setIsSuccess(false);
      if (!silent) playReset();
    },
    [playReset]
  );

  const accept = useCallback(() => {
    setIsDrawing(false);
    setIsSuccess(true);
    playSuccess();
  }, [playSuccess]);

  const checkSequence = useCallback(
    (seq: number[]) => {
      // all dots must be present at least once
      const progression = [...Array(dots.length)].map((_, i) => i);
      const allDotsConnected = progression.every((i) => seq.includes(i));

      if (allDotsConnected) {
        if (successPredicate(seq)) {
          accept();
        } else {
          reset();
        }
      }
    },
    [dots, reset, accept, successPredicate]
  );

  const handleDotClick = useCallback(
    (idx: number, e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isDrawing) {
        // start over
        reset({ silent: true });
        setIsDrawing(true);
      }

      // don't allow two sequential points
      if (path[path.length - 1] === idx) return reset();

      setPath((indices) => {
        const updated = [...indices, idx];
        checkSequence(updated);

        return updated;
      });

      // play sound
      playPop();
    },
    [reset, isDrawing, path, dots, playPop]
  );

  // Update pointer position
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!svgRef.current) return;
    setPointer(getSVGCoords(e, svgRef.current));
  }, []);

  // Stop drawing when gets out of bounds
  const handleClick = useCallback(() => reset(), [reset]);
  const handleMouseLeave = useCallback(() => {
    if (isDrawing) reset();
  }, [isDrawing, reset]);

  // fire the callback when solved/unsolved
  useEffect(() => {
    onSuccessChange?.(isSuccess);
  }, [isSuccess, onSuccessChange]);

  return (
    <InteractionBadge>
      <Figure drawing={isDrawing}>
        {image && <img src={image} />}
        {children}

        <SVG
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${baseWidth} ${baseWidth}`}
          ref={svgRef}
          onMouseDown={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {svgPath && <Path d={svgPath} success={isSuccess} background={background} />}

          {dots.map((pos, index) => (
            <Dot
              key={pos.toString()}
              position={pos}
              onMouseDown={handleDotClick.bind(this, index)}
              selected={path.includes(index)}
              isDrawing={isDrawing}
            />
          ))}
        </SVG>

        {overlayImage && <OverlayImage src={overlayImage} />}
      </Figure>
    </InteractionBadge>
  );
};

const norm = (a: Coords, b: Coords) => {
  const [[ax, ay], [bx, by]] = [a, b];
  const { sqrt, pow } = Math;

  const len = sqrt(pow(bx - ax, 2) + pow(by - ay, 2));
  return len > 0 ? [(bx - ax) / len, (by - ay) / len] : [0, 0];
};

/*
 * Constructs an SVG path from the list of coordinates
 */
const buildPath = (dots: Array<Coords | undefined>): string => {
  const filtered = dots.filter(Boolean) as Coords[];

  return filtered
    .map(([x, y], index) => {
      if (index === 0) {
        return `M ${x} ${y}`;
      } else if (index >= 1) {
        const [px, py] = filtered[index - 1];
        const [nx, ny] = norm([px, py], [x, y]);

        const t: number = index % 2 === 0 ? 0.2 : -0.3;

        return `Q ${px + (0.5 - t) * (x - px)} ${py + (0.5 + t) * (y - py)} ${x} ${y}`;
      }
    })
    .join(",");
};

/**
 * Translates page event coordinates to SVG coordinates
 */
const getSVGCoords = (event: React.MouseEvent, svg: SVGSVGElement): Coords => {
  const pt = svg.createSVGPoint();

  // pass event coordinates
  pt.x = event.clientX;
  pt.y = event.clientY;

  // transform to SVG coordinates
  const { x, y } = pt.matrixTransform(svg.getScreenCTM()?.inverse());
  return [x, y];
};

/**
 * Styles
 */
const Figure = styled.figure<{ drawing: boolean }>`
  display: block;
  margin: 0;
  position: relative;
  user-select: none;

  ${(props) => props.drawing && "cursor: cell;"}

  > img {
    width: 100%;
  }
`;

const SVG = styled.svg`
  position: absolute;
  inset: 0 0 0 0;
`;

const OverlayImage = styled.img`
  position: absolute;
  inset: 0 0 0 0;
  pointer-events: none;
`;

const Path = styled.path<{ success: boolean; background: "light" | "dark" }>`
  fill: none;
  stroke-width: 6;

  stroke-linecap: round;
  stroke-linejoin: round;

  stroke-dasharray: 2 10;

  ${(props) => (props.background === "light" ? `stroke: #777;` : "stroke: #eee;")}
  ${(props) => props.success && `stroke: var(--color-selected-vivid);`}
`;
