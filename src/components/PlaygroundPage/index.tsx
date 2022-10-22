import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

import sprite from "~/assets/sprites/wondering-eyes.png";

export default function PlaygroundPage() {
  return (
    <Container>
      You can only{" "}
      <Link href="https://google.com">
        see this
        <Eyes />
      </Link>{" "}
      in dev environment!
    </Container>
  );
}

const Link = styled.a`
  color: inherit;
  text-decoration: var(--color-text) underline;
  text-decoration-thickness: 2px;
  text-decoration-style: solid;
  cursor: pointer;

  :visited {
    color: inherit;
  }

  :hover {
    background-color: var(--color-selected);
    text-decoration: none;
  }

  :hover span:last-of-type {
    animation-duration: 0.5s;
  }
`;

const spriteAnimation = keyframes`
  0%   {  background-position-x: calc(100% / (var(--total-frames) - 1) * 0); }
  100% {  background-position-x: calc(100% / (var(--total-frames) - 1) * var(--total-frames)); }
`;

const Eyes = styled.span`
  --total-frames: 4;
  background-image: url(${sprite});
  background-size: auto 100%;
  aspect-ratio: 1 / 1;

  animation: 1s normal infinite ${spriteAnimation};
  animation-timing-function: steps(var(--total-frames), jump-start);

  // position and alignment within a link
  display: inline-block;
  vertical-align: sub;
  width: 1em;
  margin-left: 0.08em;
`;

const Container = styled.div`
  padding: 48px 16px 128px 16px;
  max-width: 700px;
  margin: 0 auto;
`;
