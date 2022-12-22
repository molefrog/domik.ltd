import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";

import { NextChapterBanner } from "~/components/NextChapterBanner";
import { getLaunchDateForChapter } from "~/chapters";

import { Billboard as BillboardImg } from "./Billboard";

import charactersLayerImg from "~/assets/main/characters.png";
import hillsBackLayerImg from "~/assets/main/hills-back.png";
import hillsFrontLayerImg from "~/assets/main/hills-front.png";

export const IndexPage = () => {
  return (
    <>
      <Global styles={styles} />

      <Centered>
        <HillsBack />
        <Billboard>
          <BillboardImg />
        </Billboard>

        <HillsFront />
        <Characters />
      </Centered>
    </>
  );
};

const styles = css`
  :root {
    --color-main-background: #c7c7c7;
    background: var(--color-main-background);
  }
`;

const Layer = styled.div`
  position: fixed;
  // pointer-events: none;
`;

const Billboard = styled(Layer)`
  left: calc(16px + 7vw);
  bottom: calc(280px + 10vh);
  right: 0;
  height: 320px;
  display: flex;
  justify-content: flex-start;
  aling-items: center;

  > svg {
    height: 100%;
  }

  @media (max-width: 640px), (max-height: 520px) {
    height: 220px;
    left: 24px;
    right: 24px;
    bottom: auto;
  }

  // center and resize based on screen width
  @media (max-width: 640px) {
    top: 50px;
    justify-content: center;
  }
`;

const Characters = styled(Layer)`
  background: url("${charactersLayerImg}") no-repeat left top / contain;
  left: calc(-32px + 10vw);
  right: 0;
  bottom: 0;
  height: 320px;

  @media (max-width: 640px), (max-height: 520px) {
    left: 32px;
    right: 32px;
    bottom: -6px;
    height: 216px;
  }

  @media (max-width: 640px), {
    background-position: center bottom;
  }
`;

const HillsBack = styled(Layer)`
  background: url("${hillsBackLayerImg}") no-repeat left top / auto 320px;
  right: 0;
  left: calc(-64px + 8vw);
  bottom: calc(180px + 10vh);
  height: 320px;

  @media (max-width: 640px), (max-height: 520px) {
    bottom: auto;
    top: 64px;
    left: 0;
    right: 0;
    background-size: auto 212px;
    height: 212px;
    background-position: center;
  }
`;

const HillsFront = styled(Layer)`
  background: url("${hillsFrontLayerImg}") no-repeat left top / auto 208px;
  left: calc(464px + 8vw);
  right: 0;
  bottom: 64px;
  height: 208px;

  @media (max-width: 640px), (max-height: 520px) {
    height: 148px;
    background-size: auto 148px;

    left: 364px;
    bottom: 24px;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const Centered = styled.div``;
