import { useState, useCallback, useEffect, useRef, memo, lazy } from "react";
import { useAtom } from "jotai";

import { EyedLink } from "~/attractions/EyedLink";
import { currentCassette } from "./state";

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

/*
 * Turn on with debounce, turn off immediately
 */
function useDelayedHover(hover: boolean, delay: number, defValue: boolean = false) {
  type Timeout = ReturnType<typeof setTimeout>;

  const [val, setVal] = useState(defValue);
  const tmo = useRef<Timeout>();

  useEffect(() => {
    if (hover) {
      if (!tmo.current) tmo.current = setTimeout(() => setVal(hover), delay);
    } else {
      if (tmo.current) {
        clearTimeout(tmo.current);
        tmo.current = undefined;
      }
      setVal(hover);
    }
  }, [hover]);

  return val;
}

export const TV = memo(function TV({ video, from, withSound = false, ...linkProps }: TVProps) {
  const [hoverOver, setHoverOver] = useState(false);
  const isPlaying = useDelayedHover(hoverOver, 300);
  const [cassette, loadCassette] = useAtom(currentCassette);

  const mouseEntered = useCallback(() => setHoverOver(true), []);
  const mouseLeft = useCallback(() => setHoverOver(false), []);

  useEffect(() => {
    loadCassette(isPlaying ? { video, from } : null);
  }, [isPlaying]);

  return (
    <>
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
 * TV Scene
 */

const LazyScene = lazy(() => import("./Scene"));

export const TVPlayer = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const [cassette, loadCassette] = useAtom(currentCassette);

  useEffect(() => {
    if (cassette && !shouldRender) {
      setShouldRender(true);
      console.log("load new cassette");
    }
  }, [cassette]);

  return null;
  // return shouldRender ? <LazyScene /> : null;
};
