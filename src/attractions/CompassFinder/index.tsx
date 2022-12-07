import styled from "@emotion/styled";
import React, { useState, PropsWithChildren, useRef, ComponentProps } from "react";
import useMouse, { MousePosition } from "@react-hook/mouse-position";

import { InteractionBadge } from "~/components/InteractionBadge";
import { CompassCursor } from "./CompassCursor";

interface CompassFinderProps {
  image: string;
}

type Point = [number, number];

const cursorCoordinates = (
  { elementHeight, elementWidth, x, y }: MousePosition,
  nominalWidth: number
): Point => {
  if (x === null || y === null || !elementHeight || !elementHeight) {
    return [0, 0];
  }

  const scale = nominalWidth / elementWidth!;

  const _x = Math.round(x * scale); // we don't need much precision here
  const _y = Math.round(y * scale);

  return [_x, _y];
};

const angleAndDistanceBetween = ([ax, ay]: Point, [bx, by]: Point) => {
  const Δ = Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
  const α = -Math.atan2(by - ay, bx - ax);

  return [α, Δ];
};

export const CompassFinder = (props: CompassFinderProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const opts = useMouse(ref, { enterDelay: 100 });

  const nominalWidth = 1200;

  const cursor = cursorCoordinates(opts, nominalWidth);
  const target: Point = [600, 200];

  const [alpha, d] = angleAndDistanceBetween(cursor, target);

  return (
    <InteractionBadge>
      {d}
      <Finder ref={ref}>
        <Field src={props.image} />

        <CompassCursor size={64} mousePosition={opts} angleRad={alpha} />
        {/* 
        <MagnifyingGlass />
        <MagnifyingGlass />
        <MagnifyingGlass /> */}
      </Finder>
    </InteractionBadge>
  );
};

const MagnifyingGlass = styled.div`
  position: absolute;
  top: 2%;
  left: 20%;

  width: 220px;
  height: 220px;
  margin-left: -90px;
  margin-top: -90px;
  border-radius: 180px;

  box-shadow: 0px 0px 0px 6px white, 0 0px 12px 0px rgba(0, 0, 0, 0.4);
  background: rgb(255 255 255 / 0.6);

  transition: 0.4s transform cubic-bezier(0.82, 0.09, 0.54, 1.76), 0.3s opacity ease-in;
  backdrop-filter: blur(4px);

  &:hover {
    transform: translateY(20%) scale(0.2, 0.2);
    opacity: 0;
  }
`;

const Field = styled.img`
  width: 100%;
  cursor: none;
`;

const Finder = styled.div`
  position: relative;
`;
