import { MDXProvider as Provider } from "@mdx-js/react";
import { ReactNode } from "react";
import styled from "@emotion/styled";

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
  text-decoration: var(--color-selected) underline;
  text-decoration-thickness: 4px;
  text-decoration-skip-ink: none;
  text-decoration-style: dotted;

  :hover {
    color: var(--color-selected);
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

export const MdxProvider = (props: { children: ReactNode }) => {
  return (
    <Provider components={{ a: A, em: Em, p: P, Image }}>
      {props.children}
    </Provider>
  );
};
