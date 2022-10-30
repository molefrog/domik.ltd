import styled from "@emotion/styled";

import { WonderingEyes } from "~/attractions/EyedLink";

export const InteractionBadge = () => {
  return (
    <Badge>
      <WonderingEyes />
    </Badge>
  );
};

const Badge = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 100%;
  position: absolute;
  bottom: -12px;
  left: calc(50% - 21px);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0px 0px 5px 0px rgb(0 0 0 / 5%), 0px 1px 6px 0px rgb(0 0 0 / 10%);
`;
