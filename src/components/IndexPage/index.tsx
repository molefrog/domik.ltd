import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";

import { NextChapterBanner } from "~/components/NextChapterBanner";
import { getLaunchDateForChapter } from "~/chapters";

import charactersLayerImg from "~/assets/main/characters.png";
import billboardLayerImg from "~/assets/main/billboard.png";
import hillsBackLayerImg from "~/assets/main/hills-back.png";

export const IndexPage = () => {
  return (
    <>
      <Global styles={styles} />

      <Centered>
        <NextChapterBanner launchDate={getLaunchDateForChapter(0)} />

        <HillsBack />
        <Billboard />
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
  --scale: 0.8;

  background: url("${billboardLayerImg}") no-repeat top left / contain;
  min-width: 160px;
  width: calc(544px * var(--scale));
  height: calc(372px * var(--scale));

  left: calc(128px * var(--scale) + 5vw);
  bottom: calc(180px * var(--scale) + 20vh);

  // center and resize based on screen width
  @media (max-width: 768px) {
    width: auto;
    left: calc(72px * var(--scale));
    right: calc(72px * var(--scale));
    bottom: calc(220px * var(--scale) + 20vh);
    background-position-x: center;
  }

  @media (max-height: 640px) {
    --scale: 0.6;
    top: calc(32px * var(--scale));
    bottom: auto;
  }

  @media (max-height: 468px) {
    --scale: 0.5;
    bottom: auto;
  }
`;

const Characters = styled(Layer)`
  --scale: 0.8;

  background: url("${charactersLayerImg}") no-repeat left bottom / contain;

  width: calc(560px * var(--scale));
  height: calc(356px * var(--scale));

  bottom: -6px;
  left: calc(12px * var(--scale) + 10vw);

  // center and resize based on screen width
  @media (max-width: 768px) {
    width: auto;
    left: calc(40px * var(--scale));
    right: calc(40px * var(--scale));
    background-position-x: center;
  }

  @media (max-height: 640px) {
    --scale: 0.6;
  }

  @media (max-height: 468px) {
    --scale: 0.5;
  }
`;

const HillsBack = styled(Layer)`
  --scale: 0.8;
  background: url("${hillsBackLayerImg}") no-repeat left bottom / contain;

  width: calc(1144px * var(--scale));
  height: calc(200px * var(--scale));

  left: calc(-12px + 3vw);
  bottom: calc(380px * var(--scale) + 15vh);

  // center and resize based on screen width
  @media (max-width: 768px) {
    bottom: calc(480px * var(--scale) + 15vh);
    // width: auto;
    // left: calc(-100px * var(--scale));
    // right: calc(-100px * var(--scale));
    // background-position-x: center;
  }

  @media (max-height: 640px) {
    --scale: 0.6;
    top: calc(64px * var(--scale));
  }

  @media (max-height: 468px) {
    --scale: 0.5;
  }
`;

const Centered = styled.div`
  // display: grid;
  // grid-template-columns: minmax(0px, 640px);
  // padding: 16px;
  // min-height: 100vh;
  // align-items: center;
  // justify-content: center;
`;
