import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const Glow = styled.span`
  opacity: 0;
  content: "";
  position: absolute;
  inset: 0 0 0 0;

  // rounded squircle borders
  --squircle-radius: 16px;
  --squircle-smooth: 0.6;
  mask-image: paint(squircle);
  z-index: -1;
  transition: opacity 0.1s ease;

  @media (prefers-reduced-motion) {
    animation-duration: 15s;
  }
`;

/*
 * Happiness
 */
const happinessAnimation = keyframes`
  0%   { background-position: 0% 82% }
  50%  { background-position: 100% 19% }
  100% { background-position: 0% 82% }
`;

export const Happiness = styled(Glow)`
  animation: ${happinessAnimation} 1s ease infinite reverse;
  background: linear-gradient(
    90deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 1000% 1000%;
`;

/*
 * Sadness
 */
const sadnessAnimation = keyframes`
  0%   { background-position: 0% 0% }
  25%   { background-position: 0% 100% }
  50%   { background-position: 100% 100% }
  75%   { background-position: 100% 0% }
`;

export const Sadness = styled(Glow)`
  background: radial-gradient(circle, #555, #999);
  background-size: 200% 200%;
  animation: ${sadnessAnimation} 2s ease infinite;
`;

/*
 * Anxiety
 */
const anxietyAnimation = keyframes`
  0%, 100%  { background: #8293f5; }
  10% { background: red; }
  30% { background: #8293f5; };
  40% { background: red; }
`;

export const Anxiety = styled(Glow)`
  animation: ${anxietyAnimation} 1s ease infinite;
`;

/*
 * Fear
 */
const fearAnimation = keyframes`
  0%  { background: #000; }
  100%  { background: #999; }
`;

export const Fear = styled(Glow)`
  animation: ${fearAnimation} 0.15s linear infinite;
`;
