import styled from "@emotion/styled";

interface Coordinates {
  x: number;
  y: number;
}

export type HiddenSecretProps = {
  // coordinates in %
  xPct?: number;
  yPct?: number;
  isRevealed?: boolean;
  debug?: boolean;
  image: string;
} & Coordinates;

export const HiddenSecret = ({
  xPct,
  yPct,
  isRevealed = false,
  debug = false,
  image,
}: HiddenSecretProps) => {
  const PointComponent = debug ? DebugPoint : MagnifyingGlass;

  return (
    <PointComponent
      style={{ left: `${xPct}%`, top: `${yPct}%` }}
      isRevealed={isRevealed}
      image={image}
    />
  );
};

const DebugPoint = styled.div<{ isRevealed: boolean; [key: string]: any }>`
  --size: 16px;

  position: absolute;
  top: 0%;
  left: 0%;

  width: var(--size);
  height: var(--size);
  margin-left: calc(-0.5 * var(--size));
  margin-top: calc(-0.5 * var(--size));
  border-radius: 100% 100%;

  box-shadow: 0px 0px 0px 6px white, 0 0px 12px 0px rgba(0, 0, 0, 0.4);
  background: rebeccapurple;
  ${(props) => props.isRevealed && "background: red;"};
`;

const MagnifyingGlass = styled.div<{ isRevealed: boolean; image: string }>`
  --size: 200px;
  --border-width: 12px;

  position: absolute;
  top: 0%;
  left: 0%;

  width: var(--size);
  height: var(--size);
  margin-left: calc(-0.5 * var(--size));
  margin-top: calc(-0.65 * var(--size));
  border-radius: 100% 100%;

  box-shadow: 0px 0px 0px 4px rgba(255, 255, 255, 0.1), 0 0px 12px 0px rgba(0, 0, 0, 0.4);
  background: rgb(255 255 255 / 0.6);

  transition: 0.3s transform cubic-bezier(0.34, 1.56, 0.64, 1),
    0.3s opacity cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(3px);
  pointer-events: none;

  ${({ isRevealed }) => {
    return (
      !isRevealed &&
      `
        transform: translateY(20%) scale(0.2, 0.2);
        opacity: 0;
      `
    );
  }}

  &:after {
    content: "";
    position: absolute;
    display: inline-block;
    width: calc(var(--size) - 2 * var(--border-width));
    height: calc(var(--size) - 2 * var(--border-width));

    background: url("${({ image }) => image}") center / cover no-repeat, rgb(255 255 255 / 0.3);
    border-radius: 100% 100%;
    top: var(--border-width);
    left: var(--border-width);
  }

  @media (max-width: 1024px) {
    --size: 162px;
    --border-width: 6px;
  }
`;
