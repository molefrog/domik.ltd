import { useState, useCallback, useMemo, useEffect, memo } from "react";
import styled from "@emotion/styled";
import YouTube, { YouTubeEvent } from "react-youtube";

import { useDelayedSwitch } from "~/hooks/useDelayedSwitch";
import { EyedLink } from "~/attractions/EyedLink";

import tvFrame from "~/assets/sprites/tv.png";
import noise from "~/assets/sprites/noise.gif";

interface TVProps extends React.ComponentProps<"a"> {
  video: string; // YouTube video ID
  from?: string; // Start playing video from this timestamp, e.g. "6:40"
  withSound?: boolean;
}

// Converts "1:30" to 90
const parseTimestamp = (ts?: string): number => {
  if (!ts) return 0;

  let [min, sec] = ts.split(":").map(Number);
  if (!sec) [min, sec] = [0, min];

  return min * 60 + sec;
};

export const TV = memo(function TV({ video, from, withSound = false, ...linkProps }: TVProps) {
  const [shouldRenderTV, setShouldRenderTV] = useDelayedSwitch(false, 2000);
  const [layerVisible, setLayerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const videoReady = useCallback(({ target: video }: YouTubeEvent) => {
    setIsLoading(false);
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
      width: 230,
      height: 200,
      playerVars: {
        start: parseTimestamp(from),
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        playsinline: 1,
        fs: 0,
        loop: 1,
        mute: withSound ? 0 : 1,
      },
    }),
    []
  );

  useEffect(() => {
    if (!shouldRenderTV) {
      setIsLoading(true);
    }
  }, [shouldRenderTV]);

  return (
    <>
      {shouldRenderTV && (
        <Scene visible={layerVisible}>
          <TVFrame noise={isLoading}>
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
});

/**
 * Styles
 */

const Screen = styled(YouTube)`
  position: absolute;
  z-index: 101;
  inset: 0 0 0 0;

  display: flex;
  align-items: center;
  justify-content: center;

  clip-path: inset(70px 45px 50px 45px);
  background: black;
`;

const TVFrame = styled.div<{ noise: boolean }>`
  width: 260px;
  aspect-ratio: 1/1;
  position: relative;

  :after {
    position: absolute;
    inset: 0 0 0 0;
    content: "";
    display: inline-block;
    z-index: 103;
    background: no-repeat center/contain url(${tvFrame});
  }

  :before {
    position: absolute;
    inset: 55px 60px 80px 60px;
    content: "";
    display: ${({ noise }) => (noise ? "inline-block" : "none")};
    z-index: 102;
    background: no-repeat center/contain url(${noise});
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
