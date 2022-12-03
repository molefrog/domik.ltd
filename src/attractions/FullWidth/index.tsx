import { ComponentProps } from "react";
import styled from "@emotion/styled";

export interface FullWidthCustomProps {}

export type FullWidthProps = FullWidthCustomProps & ComponentProps<"div">;

export const FullWidth = (props: FullWidthProps) => {
  return (
    <Expanded>
      <Inner {...props} />
    </Expanded>
  );
};

export const Expanded = styled.div`
  width: 100vw;
  margin-left: calc(-50vw + 50%);

  // use dynamic viewport units if supported
  @supports (width: 100dvw) {
    width: 100dvw;
    margin-left: calc(-50dvw + 50%);
  }
`;

const Inner = styled.div<FullWidthCustomProps>`
  margin: 0 auto; // center within parent
`;
