import { useState, useCallback, useEffect, useRef, memo, lazy, Suspense } from "react";
import { useAtom } from "jotai";

import { EyedLink } from "~/attractions/EyedLink";
import { currentCassette } from "./state";

interface TVProps extends React.ComponentProps<"a"> {
  video: string; // YouTube video ID
  from?: string; // Start playing video from this timestamp, e.g. "6:40"
  withSound?: boolean;
}

/*
 * Turn on TV with debounce, but turn off immediately
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
  const isPlaying = useDelayedHover(hoverOver, 250);
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
