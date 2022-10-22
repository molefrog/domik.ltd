import { useState, useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import YouTube, { YouTubeProps } from "react-youtube";

import sprite from "~/assets/sprites/wondering-eyes.png";

interface TVProps extends React.ComponentProps<"a"> {
  video: string; // YouTube video ID
}

export const TV = ({ video, ...linkProps }: TVProps) => {
  const [shouldRenderTV, setShouldRenderTV] = useState(false);
  const [layerVisible, setLayerVisible] = useState(false);

  const videoReady = useCallback(
    (): YouTubeProps["onReady"] =>
      ({ target: video }) => {
        video.playVideo();
      },
    []
  );

  const videoEnded = useCallback(
    (): YouTubeProps["onEnd"] =>
      ({ target: video }) => {
        video.playVideo();
      },
    []
  );

  const mouseEntered = () => {
    setShouldRenderTV(true);
    setLayerVisible(true);
  };

  const mouseLeft = () => {
    setLayerVisible(false);
  };

  const videoOptions = useMemo(
    () => ({
      width: 320,
      height: 320,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        playsinline: 1,
        fs: 0,
        loop: 1,
        mute: 1,
      },
    }),
    []
  );

  return (
    <>
      {shouldRenderTV && (
        <Scene visible={layerVisible}>
          <YouTube opts={videoOptions} onReady={videoReady} onEnd={videoEnded} videoId={video} />
        </Scene>
      )}

      <Link
        href={`https://www.youtube.com/watch?v=${video}`}
        {...linkProps}
        onMouseEnter={mouseEntered}
        onMouseLeave={mouseLeft}
        target="_blank"
        rel="noreferrer noopener"
      >
        {linkProps.children}
        <Eyes />
      </Link>
    </>
  );
};

/**
 * Styles
 */
const Scene = styled.div<{ visible: boolean }>`
  position: fixed;
  inset: 0 0 0 0;
  z-index: 100;
  pointer-events: none;

  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(1px);

  ${({ visible }) => !visible && "display: none;"}
`;

const Link = styled.a`
  color: inherit;
  text-decoration: var(--color-text) underline;
  text-decoration-thickness: 2px;
  text-decoration-style: solid;
  cursor: pointer;

  :visited {
    color: inherit;
  }

  :hover {
    background-color: var(--color-selected);
    text-decoration: none;
  }

  :hover span:last-of-type {
    animation-duration: 0.5s;
  }
`;

/**
 * Eye icon and animations
 */
const spriteAnimation = keyframes`
  0%   {  background-position-x: calc(100% / (var(--total-frames) - 1) * 0); }
  100% {  background-position-x: calc(100% / (var(--total-frames) - 1) * var(--total-frames)); }
`;

const Eyes = styled.span`
  --total-frames: 4;
  background-image: url(${sprite});
  background-size: auto 100%;
  aspect-ratio: 1 / 1;

  animation: 1s normal infinite ${spriteAnimation};
  animation-timing-function: steps(var(--total-frames), jump-start);

  // position and alignment within a link
  display: inline-block;
  vertical-align: sub;
  width: 1em;
  margin-left: 0.08em;
`;
