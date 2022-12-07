import styled from "@emotion/styled";
import { useRef, ComponentProps } from "react";
import { MousePosition } from "@react-hook/mouse-position";
import { Compass } from "~/components/Compass";
import { useSpring, animated, config as springConfig } from "@react-spring/web";

export type CompassCursorProps = ComponentProps<typeof Compass> & {
  mousePosition: MousePosition;
  size?: number;
};

export const CompassCursor = ({
  mousePosition,
  size = 52,
  ...compassProps
}: CompassCursorProps) => {
  const coords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // last non-null coordinates
  const isOver = mousePosition.x !== null && mousePosition.y !== null;

  if (isOver) {
    coords.current.x = mousePosition.x!;
    coords.current.y = mousePosition.y!;
  }

  const styles = useSpring({
    x: coords.current.x,
    y: coords.current.y,
    opacity: isOver ? 1 : 0,
    scale: isOver ? 1 : 0,

    // twist it a bit on enter/exit
    rotate: isOver ? "2turn" : "0turn",
    config: springConfig.stiff,
  });

  return (
    <Cursor size={size} style={styles}>
      <Compass size={size} {...compassProps} />
    </Cursor>
  );
};

const Cursor = styled(animated.div)<{ size: number }>`
  --size: ${(props) => props.size + "px"};

  position: absolute;
  width: var(--size);
  height: var(--size);
  margin: calc(-0.5 * var(--size)) 0 0 calc(-0.5 * var(--size));
  top: 0;
  left: 0;

  pointer-events: none;
  filter: drop-shadow(0px 2px 12px rgba(0, 0, 0, 0.3));
`;
