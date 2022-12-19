import { useEffect, useRef, useCallback } from "react";
import useEvent from "react-use-event-hook";

type Timeout = ReturnType<typeof setTimeout>;

export interface UseIntervalOptions {
  ms: number;
  leading?: boolean;
}

export function useInterval(fn: () => void, opts: UseIntervalOptions) {
  const options = Object.assign({ leading: true }, opts);
  const timer = useRef<Timeout>();

  const tick = useEvent(() => {
    if (timer.current || options.leading) fn();
    timer.current = setTimeout(tick, options.ms);
  });

  useEffect(() => {
    tick();

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
}
