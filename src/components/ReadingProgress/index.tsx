import { useState, useEffect, useCallback } from "react";
import { ProgressBar } from "./ProgressBar";

interface ReadingProgressProps {
  /*
   * The refs of elements that define start and end of the scroll
   */
  startRef: React.RefObject<HTMLDivElement>;
  endRef: React.RefObject<HTMLDivElement>;
}

export const ReadingProgress = ({ startRef, endRef }: ReadingProgressProps) => {
  const [progress, setProgress] = useState(0.0);

  const onScroll = useCallback((ev?: Event) => {
    if (startRef.current && endRef.current) {
      const { top: startY } = startRef.current.getBoundingClientRect();
      const { bottom } = endRef.current.getBoundingClientRect();

      const endY = bottom - window.innerHeight;

      if (startY >= 0) {
        setProgress(0.0);
      } else if (endY <= 0) {
        setProgress(1.0);
      } else {
        const x = startY / (startY - endY);
        setProgress(Math.round(x * 1000.0) / 1000.0); // round up 1 digit after the fpoint
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    return () => {
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    onScroll();
  });

  return <ProgressBar progress={progress} />;
};
