import styled from "@emotion/styled";

/**
 * Styles
 */

export const Controls = styled.div`
  --button-size: 64px;

  position: absolute;
  top: 24px;
  right: 24px;

  display: grid;
  column-gap: calc(var(--button-size) / 4);
  grid-auto-flow: column;
`;

export const Button = styled.button`
  width: var(--button-size);
  aspect-ratio: 1;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  padding: 0;

  background: var(--color-bg);
  box-shadow: 0px 1px 0px 1.5px #ddd, 0px 2px 0px 2px #bbb, 0px -1px 0px 1px #ddd;
  font-size: calc(var(--button-size) / 2);

  &:focus-visible {
    outline: var(--color-selected-vivid) dashed 4px;
    outline-offset: 4px;
  }

  &:hover {
    transform: scale(1.02, 1.02) translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }
`;
