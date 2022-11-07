import { useEffect, useCallback, useState, useMemo } from "react";

interface ProgressState {
  progress: number;
  current: number | undefined;
}

/**
 * Calculates the chapter reading progress
 * @param elements Array of chapter elements, must be order of appearance in the document
 * @returns linear progress (0.0..1.0) and current chapter index
 */
export const useChapterProgress = (
  elements: Array<HTMLElement | null>,
  dependencies: any[] = [],
  precision = 1000.0
) => {
  const [result, setResult] = useState<ProgressState>({ progress: 0, current: undefined });

  const onScroll = useCallback(() => {
    let progress = 0;

    // array isn't ready yet
    if (!elements.length || elements.some((el) => !el)) return;

    const rects = elements.map((el) => el!.getBoundingClientRect());

    /*
     * get `progress` based on a current placement of first and last elements in the viewport
     */
    const { top: startY } = rects[0]; // top of the first element
    const { bottom } = rects[rects.length - 1]; // bottom of the last one

    const endY = bottom - window.innerHeight;

    if (startY >= 0) {
      progress = 0.0;
    } else if (endY <= 0) {
      progress = 1.0;
    } else {
      // set with precision
      progress = Math.round((startY / (startY - endY)) * precision) / precision;
    }

    const idx = rects.findIndex(({ bottom }) => bottom > 0);
    setResult({ progress, current: idx === -1 ? undefined : idx });
  }, [elements]);

  useEffect(() => {
    document.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, dependencies);

  return result;
};
