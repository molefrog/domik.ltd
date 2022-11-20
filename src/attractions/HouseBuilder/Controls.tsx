import styled from "@emotion/styled";

/**
 * Styles
 */

export const Controls = styled.div`
  position: absolute;
  top: 32px;
  right: 29px;

  display: grid;
  column-gap: 16px;
  grid-auto-flow: column;
`;

export const Button = styled.button<{ size?: number; aspect?: string }>`
  --button-size: ${({ size }) => size || 64}px;

  width: var(--button-size);
  aspect-ratio: ${({ aspect }) => aspect || 1};
  border-radius: 6px;
  border: none;
  cursor: pointer;
  padding: 0;

  background: var(--color-bg);
  box-shadow: 0px 1px 0px 1.5px #ddd, 0px 2px 0px 2px #bbb, 0px -1px 0px 1px #ddd;
  font-size: calc(var(--button-size) / 2);

  &:focus-visible {
    outline: var(--color-selected-vivid) dashed 4px;
    outline-offset: 6px;
  }

  &:hover {
    transform: scale(1.02, 1.02) translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }
`;
