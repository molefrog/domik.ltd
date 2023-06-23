import styled from "@emotion/styled";
import { MainMenu } from "./MainMenu";
import { Billboard as BillboardImg } from "./Billboard";

export const IndexPage = () => {
  return (
    <Menu>
      <Billboard>
        <BillboardImg />
        <MainMenu />
      </Billboard>
    </Menu>
  );
};

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 80px;

  @media (max-width: 1024px) {
    padding-top: 40px;
  }

  @media (max-width: 768px) {
    padding-top: 20px;
  }
`;

const Billboard = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
  width: 740px;
  flex-shrink: 0;

  @media (max-width: 380px) {
    margin-left: -24px;
  }
`;
