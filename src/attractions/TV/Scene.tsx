import { useState, useCallback, useMemo, useEffect, useRef, memo } from "react";
import { useAtom } from "jotai";
import YouTube, { YouTubeEvent } from "react-youtube";
import styled from "@emotion/styled";

import { currentCassette, Cassette } from "./state";
import tvFrame from "~/assets/sprites/tv.png";
import noise from "~/assets/sprites/noise.gif";

// Converts "1:30" to 90
const parseTimestamp = (ts?: string): number => {
  if (!ts) return 0;

  let [min, sec] = ts.split(":").map(Number);
  if (!sec) [min, sec] = [0, min];

  return min * 60 + sec;
};

export const Scene = memo(function TV() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [insertedCassette, setInsertedCassette] = useState<Cassette>();

  const playerRef = useRef<YouTube>(null);
  const [cassette] = useAtom(currentCassette);

  useEffect(() => {
    const player = playerRef.current?.getInternalPlayer();

    if (cassette) {
      setIsPlaying(true);
      setInsertedCassette(cassette);
      player?.playVideo();
    } else {
      setIsPlaying(false);
      player?.pauseVideo();
    }
  }, [cassette]);

  const playerReady = useCallback(({ target: video }: YouTubeEvent) => {
    setIsLoading(false);
    video.playVideo();
  }, []);

  const videoEnded = useCallback(({ target: video }: YouTubeEvent) => {
    video.playVideo();
  }, []);

  const videoOptions = useMemo(() => {
    if (!insertedCassette) return {};

    return {
      width: 230,
      height: 200,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        playsinline: 1,
        fs: 0,
        loop: 1,
        start: parseTimestamp(insertedCassette.from),
        mute: insertedCassette.withSound ? 0 : 1,
      },
    };
  }, [insertedCassette]);

  return (
    <Overlay visible={isPlaying}>
      <TVFrame noise={isLoading}>
        {insertedCassette && (
          <Screen
            ref={playerRef}
            opts={videoOptions}
            onReady={playerReady}
            onEnd={videoEnded}
            videoId={insertedCassette.video}
          />
        )}
      </TVFrame>
    </Overlay>
  );
});

export default Scene;

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
const Overlay = styled.div<{ visible: boolean }>`
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
