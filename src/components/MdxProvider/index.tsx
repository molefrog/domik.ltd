import { MDXProvider as Provider } from "@mdx-js/react";
import { ReactNode } from "react";
import styled from "@emotion/styled";

const A = styled.a`
  color: inherit;
  text-decoration: var(--color-text-highlight) underline;
  text-decoration-thickness: 2px;
  text-decoration-skip-ink: none;

  :hover {
    color: var(--color-text-highlight);
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
  text-decoration: var(--color-text-highlight) wavy underline;
  text-decoration-thickness: 2px;
  text-decoration-skip-ink: none;
`;

export const MdxProvider = (props: { children: ReactNode }) => {
  return (
    <Provider components={{ a: A, em: Em, p: P }}>{props.children}</Provider>
  );
};
