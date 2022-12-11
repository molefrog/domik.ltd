import useSize from "@react-hook/size";
import { RefObject, useEffect, useState } from "react";

/**
 * Allows to control element's horizontal progress [0.0..1.0]
 *
 * @param ref a reference DOM element reference
 * @returns useState-like array
 */
export const useHorizontalScrollProgress = (
  ref: RefObject<HTMLElement>
): [number, (v: number) => void] => {
  const [progress, setProgress] = useState(0); // 0..1
  const [w, h] = useSize(ref);

  useEffect(() => {
    const handler = () => {
      const el = ref.current;
      if (!el) return;

      const progress = el.scrollLeft / (el.scrollWidth - el.clientWidth || 1.0);
      setProgress(progress);
    };

    ref.current?.addEventListener("scroll", handler);
    handler();
    return () => {
      ref.current?.removeEventListener("scroll", handler);
    };
  }, [w, h]);

  const [update] = useState(() => (value: number) => {
    const el = ref.current;
    if (!el) return;

    el.scrollLeft = value * (el.scrollWidth - el.clientWidth);
    setProgress(value);
  });

  return [progress, update];
};
