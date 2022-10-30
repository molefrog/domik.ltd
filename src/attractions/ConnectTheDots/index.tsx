import styled from "@emotion/styled";
import { useRef, useState, useCallback } from "react";

import { usePopSound } from "~/hooks/useSounds";

type Coords = [number, number];

interface Props {
  dots: Coords[];
  baseWidth?: number;
  image?: string;
}

export const ConnectTheDots = ({ dots, image, baseWidth = 670 }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const [pointer, setPointer] = useState<Coords>();
  const [isDrawing, setIsDrawing] = useState(false);
  const [connIndices, setConnIndices] = useState<number[]>([]);

  const [playPop] = usePopSound({
    // increase sound pitch with every dot selected
    playbackRate: 0.5 + 0.1 * Math.min(connIndices.length, 8),
  });

  // the path that is currently being built
  const wipPath = buildPath([...connIndices.map((i) => dots[i]), pointer]);

  const reset = useCallback(() => {
    setConnIndices([]);
    setIsDrawing(false);
    setPointer(undefined);
  }, []);

  const handleDotClick = useCallback(
    (idx: number, e: React.MouseEvent) => {
      e.stopPropagation();

      // don't allow two sequential points
      if (connIndices[connIndices.length - 1] === idx) return reset();

      setConnIndices((arr) => [...arr, idx]);
      setIsDrawing(true);

      playPop();
    },
    [connIndices]
  );

  // Update pointer position
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing || !svgRef.current) return;
      setPointer(getSVGCoords(e, svgRef.current));
    },
    [isDrawing]
  );

  // Stop drawing when gets out of bounds
  const handleClick = useCallback(() => reset(), []);
  const handleMouseLeave = useCallback(() => reset(), []);

  return (
    <Figure>
      {image && <img src={image} />}

      <SVG
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${baseWidth} ${baseWidth}`}
        ref={svgRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {wipPath && (
          <path d={wipPath} fill="none" stroke="#ccc" strokeWidth={6} strokeDasharray="6, 1" />
        )}

        {pointer && <circle fill="purple" r={10} cx={pointer[0]} cy={pointer[1]} />}

        {dots.map((pos, index) => (
          <Dot key={pos.toString()} position={pos} onClick={handleDotClick.bind(this, index)} />
        ))}
      </SVG>
    </Figure>
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
      } else if (index == 1) {
        const [px, py] = filtered[0];
        const [nx, ny] = norm([px, py], [x, y]);

        return `L ${x} ${y}`;
        // return `Q ${px + nx} ${py + ny} ${x} ${y}`;
      } else {
        return `L ${x} ${y}`;
        // return `T ${x} ${y}`;
      }
    })
    .join(",");
};

interface DotProps extends React.ComponentProps<"circle"> {
  position: Coords;
}

const Dot = ({ position: [x, y], ...rest }: DotProps) => {
  return (
    <>
      <circle r={12} cx={x} cy={y} fill="white" />
      <DotCircle r={7} cx={x} cy={y} {...rest}></DotCircle>
    </>
  );
};

const DotCircle = styled.circle`
  fill: white;
  stroke: black;
  stroke-width: 2.5;

  cursor: pointer;
  &:hover {
    fill: var(--color-selected-light);
  }
`;

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
const Figure = styled.figure`
  display: block;
  margin: 0;
  position: relative;

  > img {
    width: 100%;
  }
`;

const SVG = styled.svg`
  position: absolute;
  inset: 0 0 0 0;
`;
