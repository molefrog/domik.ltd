import { useState } from "react";
import { animated, useSpring, config } from "@react-spring/web";

import { usePrevious } from "~/hooks/usePrevious";

export interface ChapterCheckmarkProps {
  className?: string;
  completion: "done" | "inprogress" | null;
}

export const ChapterCheckmark = ({ completion, className }: ChapterCheckmarkProps) => {
  const [circlePathLength, setCirclePathLength] = useState(0);
  const [donePathLength, setDonePathLength] = useState(0);

  const circleStyle = useSpring({
    from: {
      strokeDasharray: circlePathLength,
      strokeDashoffset: circlePathLength,
      opacity: 0,
    },
    to: {
      strokeDasharray: circlePathLength,
      strokeDashoffset: completion === "inprogress" ? 0 : circlePathLength,
      opacity: circlePathLength > 0 ? 1 : 0,
    },
    config: (key) => {
      if (key === "opacity") return { duration: 0 };
      if (completion !== "inprogress") return { duration: 200 };

      return config.default;
    },
  });

  const doneStyle = useSpring({
    from: {
      strokeDasharray: donePathLength,
      strokeDashoffset: donePathLength,
      opacity: 0,
    },
    to: {
      strokeDasharray: donePathLength,
      strokeDashoffset: completion === "done" ? 0 : donePathLength,
      opacity: donePathLength > 0 ? 1 : 0,
    },
    config: (key) => {
      if (key === "opacity") return { duration: 0 };
      if (completion !== "done") return { duration: 200 };

      return config.default;
    },
  });

  return (
    <svg
      className={className}
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <animated.path
        d="M8 26.6994C16.8 20.9984 34.84 10.3945 36.6 13.5871C38.8 17.5778 7.45 27.2698 11.3 27.8399C15.15 28.41 48.7 15.8678 39.35 19.8585C30 23.8492 10.75 32.4007 13.5 32.9708C16.25 33.5409 36.6 25.559 41 26.6994"
        stroke="var(--color-selected-vivid)"
        strokeWidth="2.5"
        style={doneStyle}
        ref={(ref) => ref && setDonePathLength(ref.getTotalLength())}
      />

      <animated.path
        d="M2 29.427C2 29.427 3.72738 10.676 20.5076 8.47528C37.2879 6.27451 44.2961 21.8575 43.9901 29.427C43.6841 36.9965 37.4261 42 27.9897 42C17.0726 42 8.24818 31.4896 9.29448 21.3937C10.6369 8.63318 27.9897 -3.83127 44 13.5479"
        stroke="var(--color-selected-vivid)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={circleStyle}
        ref={(ref) => ref && setCirclePathLength(ref.getTotalLength())}
      />
    </svg>
  );
};
