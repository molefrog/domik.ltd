import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";

import { NextChapterBanner } from "~/components/NextChapterBanner";

import { Billboard as BillboardImg } from "./Billboard";
import charactersLayerImg from "~/assets/main/characters.png";

export const IndexPage = () => {
  return (
    <>
      <Global styles={styles} />

      <Centered>
        <Billboard>
          <BillboardImg />
        </Billboard>

        <MenuLayer>
          <NextChapterBanner launchDate={new Date(2023, 1, 1)} />
        </MenuLayer>

        <Characters />
      </Centered>
    </>
  );
};

const styles = css`
  :root {
    --color-main-background: var(--color-subtle-gray);
    background: var(--color-main-background);
  }
`;

const Layer = styled.div`
  position: fixed;
  pointer-events: none;
`;

const MenuLayer = styled(Layer)`
  left: 0;
  right: 0;
  top: 360px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-height: 800px) {
    top: 260px;
  }

  @media (max-height: 640px) {
    top: 230px;
  }

  @media (max-height: 520px) {
    top: 160px;
  }

  @media (max-width: 420px), (max-height: 468px) {
    left: 460px;

    justify-content: flex-start;
    top: 0;
    bottom: 0;
  }
`;

const Billboard = styled(Layer)`
  --height: 340px;

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

  @media (max-width: 420px), (max-height: 468px) {
    justify-content: flex-start;
    left: 16px;
    background-position: bottom left;
  }
`;

const Characters = styled(Layer)`
  --height: 280px;

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

  @media (max-width: 420px), (max-height: 468px) {
    left: 48px;
    background-position: bottom left;
  }
`;

const Centered = styled.div``;
