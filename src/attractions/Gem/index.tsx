import styled from "@emotion/styled";

import useHover from "@react-hook/hover";
import useMouse, { MousePosition } from "@react-hook/mouse-position";
import { useEffect, useRef } from "react";

import { symbolForOct } from "~/assets/symbols/oct";
import { useRAF } from "../Spoiler/useRAF";

interface Props {
  oct: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

const useNegativePhotoEffect = (active: boolean) => {
  useEffect(() => {
    const html = document.documentElement;

    html.style.setProperty("transition", "filter 0.25s ease-in-out");
    if (active) html.style.setProperty("filter", "invert(1)");

    return () => {
      html.style.removeProperty("filter");
    };
  }, [active]);
};

export const Gem = (props: Props) => {
  const wrapperRef = useRef<HTMLElement>(null);
  const stoneRef = useRef<HTMLElement>(null);

  const isHovering = useHover(wrapperRef);
  const mousePosition = useMouse(wrapperRef);

  useNegativePhotoEffect(isHovering);

  // save fresh mouse position
  const mp = useRef<MousePosition>(mousePosition);
  mp.current = mousePosition;

  const anchorCoords = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    anchorCoords.current = [mousePosition.clientX!, mousePosition.clientY!];
  }, [mousePosition.isOver]);

  useRAF(() => {
    const el = stoneRef.current;
    const shadowEl = wrapperRef.current;

    if (!el || !shadowEl) return;

    const { clientX, clientY } = mp.current;

    let dx = clientX ? clientX - anchorCoords.current[0] : 0;
    let dy = clientY ? clientY - anchorCoords.current[1] : 0;

    const ll = Math.sqrt(dx * dx + dy * dy);
    dx /= ll;
    dy /= ll;

    const l = Math.sqrt(dx * dx + dy * dy + 1);

    const a = l ? dx / l : 0;
    const b = l ? dy / l : 0;
    const c = l ? 1 / l : 0;

    const alpha = 0.4 * Math.atan2(a, c);
    const betta = -0.4 * Math.atan2(b, c);

    el.style.transform = `perspective(60px) rotate3d(0, 1, 0, ${alpha}rad) rotate3d(1, 0, 0, ${betta}rad)`;
    shadowEl.style.setProperty("--shadow-offset", `${-a}`);
  }, isHovering);

  useEffect(() => {
    if (!isHovering) stoneRef.current?.style.removeProperty("transform");
  }, [isHovering]);

  return (
    <Wrapper ref={wrapperRef} hovered={isHovering}>
      <Gemstone hovered={isHovering}>
        <Stone
          ref={stoneRef}
          style={{
            backgroundImage: `url(${symbolForOct(props.oct)})`,
          }}
        ></Stone>
      </Gemstone>
    </Wrapper>
  );
};

const Wrapper = styled.span<{ hovered: boolean }>`
  --shadow-offset: 1;

  display: inline-block;
  width: 14px;
  vertical-align: baseline;
  transition: box-shadow 0.2s ease;
  position: relative;

  ${({ hovered }) =>
    hovered &&
    `
    filter: invert(1);
    box-shadow: calc(var(--shadow-offset) * 24px) -24px 96px 64px rgb(255 255 255 / 0.35);
  `}
`;

const Gemstone = styled.span<{ hovered: boolean }>`
  width: 48px;
  height: 48px;
  cursor: pointer;

  position: absolute;
  bottom: calc(-2px - 0.5 * (48px - 22px));
  left: calc(-0.5 * (48px - 14px));

  display: flex;
  align-items: center;
  justify-content: center;

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

  transition: transform 0.1s linear;
`;
