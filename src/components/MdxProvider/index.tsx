import { MDXProvider as Provider } from "@mdx-js/react";
import React, { ReactNode } from "react";
import styled from "@emotion/styled";

import { TV } from "~/attractions/TV";
import { EyedLink } from "~/attractions/EyedLink";
import { ConnectTheDots } from "~/attractions/ConnectTheDots";
import { Emotion } from "~/attractions/Emotion";
import { Aside } from "~/attractions/Aside";
import { Spoiler } from "~/attractions/Spoiler";
import { SlurredSpeech } from "~/attractions/SlurredSpeech";
import { HouseBuilder } from "~/attractions/HouseBuilder";
import { FullWidth } from "~/attractions/FullWidth";
import { CompassFinder, HiddenSecret } from "~/attractions/CompassFinder";
import { Gem } from "~/attractions/Gem";
import * as Credits from "~/attractions/Credits";

interface ImageProps {
  width?: string;
  float?: "left" | "right";
}

const Img_ = styled.img<ImageProps>`
  width: ${(props) => props.width || "100%"};
  ${(props) => props.float && `float: ${props.float};`}
  ${(props) => props.float === "left" && "margin-right: 24px;"}
  ${(props) => props.float === "right" && "margin-left: 24px;"}
`;

const Image = (props: ImageProps) => <Img_ {...props} />;

const P = styled.p`
  hyphens: auto;
`;

const Em = styled.em`
  text-decoration: var(--color-selected) wavy underline;
  text-decoration-thickness: 2px;
  text-decoration-skip-ink: none;
`;

const H1 = styled.h1`
  text-align: center;
  max-width: 400px;
  margin: 0px auto 40px auto;
`;

export const MdxProvider = (props: { children: ReactNode }) => {
  return (
    <Provider
      components={{
        h1: H1,
        // see https://github.com/mdx-js/mdx/discussions/2086
        a: EyedLink as React.FunctionComponent<JSX.IntrinsicElements["a"]>,
        em: Em,
        p: P,
        Aside,
        Image,
        TV,
        EyedLink,
        ConnectTheDots,
        Emotion,
        Spoiler,
        SlurredSpeech,
        HouseBuilder,
        FullWidth,
        CompassFinder,
        HiddenSecret,
        Gem,
        Credits,
      }}
    >
      {props.children}
    </Provider>
  );
};
