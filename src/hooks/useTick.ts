import { useEffect, useRef, useCallback } from "react";

type Timeout = ReturnType<typeof setTimeout>;

export function useTick(
  fn: () => void,
  opts: { ms: number; leading?: boolean }
) {
  const options = Object.assign({ leading: true }, opts);
  const timer = useRef<Timeout>();

  const tick = useCallback(() => {
    if (timer.current || options.leading) fn();

    timer.current = setTimeout(tick, options.ms);
  }, []);

  useEffect(() => {
    tick();

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
}
