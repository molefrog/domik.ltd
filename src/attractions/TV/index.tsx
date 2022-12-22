import React, { useState, useCallback, useEffect, useRef, memo, lazy, Suspense } from "react";
import { useAtom } from "jotai";
import useMousePosition from "@react-hook/mouse-position";

import { EyedLink, EyedLinkProps } from "~/attractions/EyedLink";
import { isTouchDevice } from "~/utils/isTouchDevice";
import { useDelayedSwitch } from "~/hooks/useDelayedSwitch";
import { currentCassette } from "./state";

import styled from "@emotion/styled";

interface TVProps extends React.ComponentProps<"a"> {
  video: string; // YouTube video ID
  from?: string; // Start playing video from this timestamp, e.g. "6:40"
  withSound?: boolean;
}

/*
 * Turn on TV with debounce, but turn off immediately
 */

export const TV = memo(function TV({ video, from, withSound = false, ...linkProps }: TVProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const mousePosition = useMousePosition(linkRef, {
    fps: 8, // we don't really care about mouse position here
  });

  const isPlaying = useDelayedSwitch(mousePosition.isOver, {
    switchOnDelay: isTouchDevice ? 0 : 250,
    switchOffDelay: isTouchDevice ? 500 : 0,
  });

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isTouchDevice) e.preventDefault();
  }, []);

  const [, loadCassette] = useAtom(currentCassette);

  useEffect(() => {
    loadCassette(isPlaying ? { video, from, withSound } : null);
  }, [isPlaying]);

  return (
    <Link
      ref={linkRef}
      href={`https://www.youtube.com/watch?v=${video}`}
      onClick={handleClick}
      {...(linkProps as EyedLinkProps)}
    />
  );
});

const Link = styled(EyedLink)`
  // disable default iOS touch behaviour
  user-select: none;
  touch-action: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
`;

/**
 * TV Scene
 */
const LazyScene = lazy(() => import("./Scene"));

export const TVPlayer = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const [cassette] = useAtom(currentCassette);

  // load the player when the first cassette is set
  useEffect(() => {
    if (cassette && !shouldRender) setShouldRender(true);
  }, [cassette]);

  return shouldRender ? (
    <Suspense>
      <LazyScene />
    </Suspense>
  ) : null;
};
