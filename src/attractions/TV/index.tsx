import { useState, useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import YouTube, { YouTubeEvent } from "react-youtube";

import { useDelayedSwitch } from "~/hooks/useDelayedSwitch";
import { EyedLink } from "~/attractions/EyedLink";

import tvFrame from "~/assets/sprites/tv.svg";

interface TVProps extends React.ComponentProps<"a"> {
  video: string; // YouTube video ID
}

export const TV = ({ video, ...linkProps }: TVProps) => {
  const [shouldRenderTV, setShouldRenderTV] = useDelayedSwitch(false, 2000);
  const [layerVisible, setLayerVisible] = useState(false);

  const videoReady = useCallback(({ target: video }: YouTubeEvent) => {
    video.playVideo();
  }, []);

  const videoEnded = useCallback(({ target: video }: YouTubeEvent) => {
    video.playVideo();
  }, []);

  const mouseEntered = () => {
    setShouldRenderTV(true);
    setLayerVisible(true);
  };

  const mouseLeft = () => {
    setLayerVisible(false);
    setShouldRenderTV(false);
  };

  const videoOptions = useMemo(
    () => ({
      width: 220,
      height: 220,
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
          <TVFrame>
            <Screen opts={videoOptions} onReady={videoReady} onEnd={videoEnded} videoId={video} />
          </TVFrame>
        </Scene>
      )}

      <EyedLink
        href={`https://www.youtube.com/watch?v=${video}`}
        {...linkProps}
        onMouseEnter={mouseEntered}
        onMouseLeave={mouseLeft}
      />
    </>
  );
};

/**
 * Styles
 */

const Screen = styled(YouTube)`
  position: absolute;
  z-index: 101;
  inset: 30px 0 0 0;

  clip-path: inset(50px 40px 20px 20px);
  background: black;
`;

const TVFrame = styled.div`
  width: 240px;
  aspect-ratio: 1/1;
  position: relative;

  :after {
    position: absolute;
    inset: 0 0 0 0;
    content: "";
    display: inline-block;
    z-index: 102;
    background: no-repeat center/contain url(${tvFrame});
  }
`;

// overlay with the TV
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
