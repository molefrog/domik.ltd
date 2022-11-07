import { ReactNode } from "react";
import styled from "@emotion/styled";

interface Props {
  sticky?: boolean;
}

export const Aside = styled.aside<Props>`
  width: var(--width);
  margin-right: calc(-1 * var(--width) - var(--margin-right));
  background: var(--color-embossed);
  border-radius: 8px;
  font-size: 16px;
  line-height: 24px;
  padding: 22px 26px;

  float: right;
  clear: both;
  opacity: 0.85;

  ${({ sticky }) =>
    sticky &&
    `
    // stick while scrolling
    position: sticky;
    top: 22px;
    bottom: 22px;
  `}

  --width: 290px;
  --margin-right: 48px;

  @media (max-width: 1360px) and (min-width: 1180px) {
    --width: 232px;
    --margin-right: 32px;

    font-size: 15px;
    line-height: 22px;
    padding: 16px 22px;
  }

  @media (max-width: 1180px) {
    --width: 100%;
    float: none;

    line-height: 26px;
    padding: 16px 22px;
    margin: 22px 0;

    padding: 26px 28px;
    position: static;
    opacity: 1;
  }

  *:first-of-type {
    margin-top: 0;
  }

  *:last-of-type {
    margin-bottom: 0;
  }
`;
