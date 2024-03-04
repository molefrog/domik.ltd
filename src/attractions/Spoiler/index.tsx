import { ComponentProps, ReactNode } from "react";
import styled from "@emotion/styled";
import isPropValid from "@emotion/is-prop-valid";
import { css } from "@emotion/react";

import { Spoiler as Spoiled } from "spoiled";

const supportsCSSHoudini = typeof CSS !== "undefined" && "paintWorklet" in CSS;

type SpoilerProps = ComponentProps<typeof Spoiled>;

export const Spoiler = (props: SpoilerProps) => {
  if (!supportsCSSHoudini) {
    return <Fallback {...props} />;
  }

  return <StyledSpoiler {...props} theme="light" density={0.12} />;
};

const StyledSpoiler = styled(Spoiled)``;

/** For browsers that don't support CSS Paint API (Houdini) */
const Fallback = styled("span", {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== "hidden",
})<SpoilerProps>`
  user-select: initial;
  transition: filter 0.3s ease, color 0.3s ease;
  ${(props) =>
    props.hidden &&
    css`
      filter: blur(3px);
      color: rgba(0, 0, 0, 0.3);
      user-select: none;
    `}
`;
