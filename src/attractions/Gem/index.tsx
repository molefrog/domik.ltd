import styled from "@emotion/styled";

import useHover from "@react-hook/hover";
import useMouse, { MousePosition } from "@react-hook/mouse-position";
import { useEffect, useRef } from "react";

import { symbolForOct } from "~/assets/symbols/oct";

interface Props {
  oct: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

const Wrapper = styled.span<{ hovered: boolean }>`
  display: inline-block;
  width: 14px;
  vertical-align: baseline;
  position: relative;
  perspective: 100px;
  transition: box-shadow 0.4s ease 0.2s;

  ${({ hovered }) =>
    hovered &&
    `
    filter: invert(1);
    box-shadow: 0px -6px 64px 32px rgb(255 255 255 / 0.5);
  `}
`;

const Gemstone = styled.span<{ hovered: boolean }>`
  width: 18px;
  height: 22px;
  cursor: pointer;

  position: absolute;
  bottom: -1px;

  transition: transform 0.15s ease-out 0.2s;
  ${({ hovered }) => hovered && `transform: translate3d(0, -32px, 0) scale(4.0);`}
`;

const Stone = styled.span`
  --shadow-color: #c3c3c2;
  display: inline-block;
  width: 18px;
  height: 22px;
  background: var(--color-embossed);
  border-radius: 3px;
  box-shadow: 0px 0.5px 0px 1px var(--shadow-color), 0px 0px 0px 0.8px var(--shadow-color),
    inset 0px 1px 0px 0px white;

  background-repeat: no-repeat;
  background-position: center;
  background-size: 80%;
`;

/*

 */
export const Gem = (props: Props) => {
  const elRef = useRef<HTMLElement>(null);
  const isHovering = useHover(elRef);
  const mousePosition = useMouse(elRef);

  const anchorCoords = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const html = document.documentElement;

    html.style.setProperty("transition", "filter 0.25s ease-in-out");
    if (isHovering) html.style.setProperty("filter", "invert(1)");

    return () => {
      html.style.removeProperty("filter");
    };
  }, [isHovering]);

  useEffect(() => {
    anchorCoords.current = [Number(mousePosition.clientX), Number(mousePosition.clientY)];
  }, [mousePosition.isOver]);

  return (
    <Wrapper ref={elRef} hovered={isHovering}>
      <Gemstone hovered={isHovering}>
        <Stone
          style={{
            backgroundImage: `url(${symbolForOct(props.oct)})`,
          }}
        ></Stone>
      </Gemstone>
    </Wrapper>
  );
};
