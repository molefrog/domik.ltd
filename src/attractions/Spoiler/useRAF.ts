import { useRef, useEffect, useLayoutEffect, useState } from "react";

// extends `FrameRequestCallback` with one extra argument –
// delta time from the last invocation
interface RafCallback {
  (...args: [...Parameters<FrameRequestCallback>, DOMHighResTimeStamp]): void;
}

export const useRAF = (callback: RafCallback, active: boolean = true) => {
  const raf = useRef<ReturnType<typeof requestAnimationFrame>>();
  const ts = useRef<DOMHighResTimeStamp>(0);

  /*
   * always use fresh version of the callback
   */
  const callbackRef = useRef<RafCallback>();

  // `handler` never changes!
  const [handler] = useState<FrameRequestCallback>(
    (): FrameRequestCallback => (time) => {
      raf.current = requestAnimationFrame(handler);

      // calculate the delta between now and the previous invocation
      if (ts.current <= 0) ts.current = performance.now();
      const dt = Math.abs(time - ts.current);
      ts.current = time;

      callbackRef.current?.(time, dt);
    }
  );

  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, []);

  useEffect(() => {
    if (active) raf.current = requestAnimationFrame(handler);

    return () => {
      cancelAnimationFrame(raf.current!);
      ts.current = 0;
    };
  }, [active]);
};
