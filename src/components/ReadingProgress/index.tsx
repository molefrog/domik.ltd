import styled from "@emotion/styled";

import { useState, useEffect, useCallback } from "react";

import { ProgressBar } from "./ProgressBar";
import { BumperCar } from "~/components/BumperCar";

interface ReadingProgressProps {
  startElement: HTMLElement | null;
  endElement: HTMLElement | null;
}

export const ReadingProgress = (props: ReadingProgressProps) => {
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback((ev: Event) => {
    const startel = document.querySelector(".chapter-0");
    const endel = document.querySelector(".chapter-1");

    if (startel && endel) {
      const { top: startY } = startel.getBoundingClientRect();
      const { bottom } = endel.getBoundingClientRect();

      const endY = bottom - window.innerHeight;

      if (startY >= 0) {
        setProgress(0.0);
      } else if (endY <= 0) {
        setProgress(1.0);
      } else {
        const x = startY / (startY - endY);
        setProgress(Math.round(x * 1000.0) / 1000.0);
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

  return <ProgressBar progress={progress} />;
};
