import { MDXProvider as Provider } from "@mdx-js/react";
import { ReactNode } from "react";
import styled from "@emotion/styled";

import { TV } from "~/attractions/TV";

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

const A = styled.a`
  color: inherit;
  text-decoration: var(--color-text) underline;
  text-decoration-thickness: 2px;
  text-decoration-style: solid;

  :hover {
    background-color: var(--color-selected);
    text-decoration: none;
  }

  :after {
    content: "↗";
    font-size: small;
    font-weight: bold;
    translate: 10px;
  }
`;

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
  margin: 16px auto 40px auto;
`;

export const MdxProvider = (props: { children: ReactNode }) => {
  return (
    <Provider components={{ h1: H1, a: A, em: Em, p: P, Image, TV }}>{props.children}</Provider>
  );
};
