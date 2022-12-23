import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";

import { MainMenu } from "./MainMenu";
import { Billboard as BillboardImg } from "./Billboard";
import charactersLayerImg from "~/assets/main/characters.png";

export const IndexPage = () => {
  return (
    <>
      <Billboard>
        <BillboardImg />
      </Billboard>

      <Characters />

      <Menu>
        <MainMenu />
      </Menu>
    </>
  );
};

const Menu = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 360px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-height: 800px) {
    top: 280px;
  }

  @media (max-height: 640px) {
    top: 230px;
  }

  @media (max-height: 520px) {
    top: 160px;
  }
`;

const Billboard = styled.div`
  --height: 340px;

  position: fixed;
  left: 0;
  right: 0;
  height: var(--height);
  top: calc(3vh);
  top: calc(3svh);
  display: flex;
  justify-content: center;
  aling-items: center;

  > svg {
    height: 100%;
  }

  @media (max-height: 800px) {
    height: calc(0.8 * var(--height));
  }

  @media (max-height: 640px) {
    height: calc(0.6 * var(--height));
  }

  @media (max-height: 520px) {
    height: calc(0.45 * var(--height));
  }
`;

const Characters = styled.div`
  --height: 280px;

  position: fixed;
  background: url("${charactersLayerImg}") no-repeat center bottom / contain;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--height);

  @media (max-height: 800px) {
    height: calc(0.9 * var(--height));
  }

  @media (max-height: 640px) {
    height: calc(0.7 * var(--height));
  }

  @media (max-height: 520px) {
    height: calc(0.6 * var(--height));
  }
`;
