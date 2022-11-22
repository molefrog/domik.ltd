import styled from "@emotion/styled";
import { WonderingEyes } from "~/attractions/EyedLink";

export const Loading = () => {
  return (
    <Loader>
      <WonderingEyes speed={0.5} />
    </Loader>
  );
};

/**
 * Styles
 */

const Loader = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: var(--color-embossed);

  span {
    opacity: 0.4;
  }
`;
