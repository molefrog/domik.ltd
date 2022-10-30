import styled from "@emotion/styled";
import { useRef, useState, useCallback } from "react";
import { TV } from "~/attractions/TV";

export default function PlaygroundPage() {
  return (
    <Container>
      You can only <TV video="dQw4w9WgXcQ">see this</TV> in dev environment!
      <br />
      <Points />
    </Container>
  );
}

const Container = styled.div`
  padding: 48px 16px 128px 16px;
  max-width: 700px;
  margin: 0 auto;
`;

/**
 * SVG Exp
 */
type Coords = [number, number];

const Points = () => {
  const [pointer, setPointer] = useState<Coords>();
  const [isDrawing, setIsDrawing] = useState(false);
  const [connIndices, setConnIndices] = useState<number[]>([]);

  const svgRef = useRef<SVGSVGElement>(null);

  const dots: Coords[] = [
    [120, 30],
    [400, 320],
    [40, 200],
    [500, 400],
  ];

  // the path that is currently being built
  const wipPath = buildPath([...connIndices.map((i) => dots[i]), pointer]);

  // to draw the final path
  const finalPath = buildPath(connIndices.map((i) => dots[i]));

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
    <>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 670 670"
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
      </svg>
    </>
  );
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
        const cx = x; // (px - x) * 0.5;
        const cy = y; // -1 * (py - y) * 0.5;

        return `Q ${x} ${y} ${cx} ${cy}`;
      } else {
        return `T ${x} ${y}`;
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
