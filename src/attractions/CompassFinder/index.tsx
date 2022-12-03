import styled from "@emotion/styled";
import React, { useState, PropsWithChildren } from "react";

import { InteractionBadge } from "~/components/InteractionBadge";

interface CompassFinderProps {
  image: string;
}

export const CompassFinder = (props: CompassFinderProps) => {
  return (
    <InteractionBadge>
      <Finder>
        <Field src={props.image} />

        <MagnifyingGlass />
      </Finder>
    </InteractionBadge>
  );
};

const MagnifyingGlass = styled.div`
  position: absolute;
  top: 2%;
  left: 20%;

  width: 180px;
  height: 180px;
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
`;

const Finder = styled.div`
  position: relative;
`;
