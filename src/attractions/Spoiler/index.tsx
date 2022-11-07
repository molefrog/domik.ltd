import { PropsWithChildren, ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

interface Props {
  reveal?: boolean;
}

export const Spoiler = ({ children, ...props }: PropsWithChildren<Props>) => {
  return <Secret {...props}>{children}</Secret>;
};

export const Secret = styled.span<Props>`
  ${(props) =>
    !props.reveal &&
    css`
      filter: blur(6px);
      user-select: none;
    `}
`;
