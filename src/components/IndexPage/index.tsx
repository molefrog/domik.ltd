import styled from "@emotion/styled";
import { MainMenu } from "./MainMenu";
import { Billboard as BillboardImg } from "./Billboard";

export const IndexPage = () => {
  return (
    <Menu>
      <Billboard>
        <BillboardImg />
      </Billboard>

      <MainMenu />
    </Menu>
  );
};

const Menu = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 196px;
`;

const Billboard = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  align-self: stretch;

  > svg {
    width: 100%;
    min-width: 600px;
    max-width: 720px;
  }
`;
