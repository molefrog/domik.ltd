import { useRef, useEffect } from "react";

export const useRaf = (callback: FrameRequestCallback, active: boolean = true) => {
  const raf = useRef<ReturnType<typeof requestAnimationFrame>>();
  const ts = useRef<DOMHighResTimeStamp>();
  const handler = useRef<FrameRequestCallback>();

  handler.current =
    handler.current ||
    ((t) => {
      raf.current = requestAnimationFrame(handler.current!);
      const diff = ts.current ? t - ts.current : 0.16;
      ts.current = t;
      callback(diff);
    });

  useEffect(() => {
    if (active) raf.current = requestAnimationFrame(handler.current!);
    return () => {
      cancelAnimationFrame(raf.current!);
      raf.current = undefined;
      ts.current = 0;
    };
  }, [active]);
};

export default useRaf;
