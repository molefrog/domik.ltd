import { useEffect, useCallback, useState, useRef, Dispatch, SetStateAction } from "react";
import { usePrevious } from "~/hooks/usePrevious";

type CurrentIndex = number | undefined;

interface ProgressState {
  progress: number;
  current: CurrentIndex;
}

/**
 * Calculates the chapter reading progress
 * @param elements Array of chapter elements, must be order of appearance in the document
 * @returns linear progress (0.0..1.0) and current chapter index
 */
export const useChapterProgress = (elements: Array<HTMLElement | null>, precision = 1000.0) => {
  const [progressState, setProgressState] = useState<ProgressState>({
    progress: 0,
    current: undefined,
  });

  const scrollTo = useCallback(
    (to: CurrentIndex) => {
      // array isn't ready yet
      if (elements.some((el) => !el)) return;
      to && elements[to]?.scrollIntoView(); // TODO: make it possible to use behavior: smooth
    },
    [elements]
  );

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
    setProgressState({ progress, current: idx === -1 ? undefined : idx });
  }, [elements]);

  useEffect(() => {
    document.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return Object.assign({ scrollTo }, progressState);
};

export const useSyncState = <T extends unknown>(
  lhs: [T, (v: T) => void],
  rhs: [T, (v: T) => void],
  priority: "left" | "right" = "left"
) => {
  const isFirstInit = useRef(true);
  const [[a, setA], [b, setB]] = [lhs, rhs];

  const prevA = usePrevious(a);
  const prevB = usePrevious(b);

  useEffect(() => {
    const onInit = isFirstInit.current;
    isFirstInit.current = false;

    console.log(`Change a: ${prevA} -> ${a}, b: ${prevB} -> ${b}`);

    if (a === b) return; // state is in sync

    if ((prevA !== a && prevB !== b) || onInit) {
      if (priority === "left") {
        console.log(`init B ${prevB} -> ${a}`);
      } else {
        console.log(`init A ${prevA} -> ${b}`);
      }

      priority === "left" ? setB(a) : setA(b);
    } else if (prevA !== a && prevB === b) {
      setB(a);

      console.log(`B ${prevB} -> ${a}`);
    } else if (prevA === a && prevB !== b) {
      setA(b);

      console.log(`A ${prevA} -> ${b}`);
    }
  }, [a, b, prevA, prevB]);

  useEffect(() => {
    return () => {
      console.log("unmoiunt");
    };
  }, []);
};
