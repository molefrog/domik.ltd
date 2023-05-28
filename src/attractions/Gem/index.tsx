import styled from "@emotion/styled";

import { useClickOutside } from "@mantine/hooks";
import useMouse, { MousePosition } from "@react-hook/mouse-position";
import { useEffect, useRef, useState } from "react";

import { symbolForOct } from "~/assets/symbols/oct";
import { useRAF } from "../Spoiler/useRAF";

import { isTouchDevice } from "~/utils/isTouchDevice";

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
  const [touchToggle, setTouchToggle] = useState(false);

  const wrapperRef = useClickOutside(() => {
    setTouchToggle(false);
  });
  const mousePosition = useMouse(wrapperRef);

  const stoneRef = useRef<HTMLElement>(null);

  // on touch devices tap to toggle, on desktop hover to toggle
  const isHovering = isTouchDevice ? touchToggle : mousePosition.isOver;

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
    <Wrapper ref={wrapperRef} hovered={isHovering} onClick={() => setTouchToggle((x) => !x)}>
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
  touch-action: none;
  user-select: none;

  ${({ hovered }) =>
    hovered &&
    `
    filter: invert(1);
    box-shadow: calc(var(--shadow-offset) * 24px) -24px 96px 64px rgb(255 255 255 / 0.35);
  `}
`;

const Gemstone = styled.span<{ hovered: boolean }>`
  --hover-area: 52px;

  width: var(--hover-area);
  height: var(--hover-area);
  cursor: pointer;

  position: absolute;
  bottom: calc(-2px - 0.5 * (var(--hover-area) - 22px));
  left: calc(-0.5 * (var(--hover-area) - 14px));

  display: flex;
  align-items: center;
  justify-content: center;

  transition: transform 0.15s ease-out 0.2s;
  ${({ hovered }) => hovered && `transform: translateY(-32px) scale(4.0);`}
  will-change: transform;
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
  will-change: transform;
`;
