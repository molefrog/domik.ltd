import styled from "@emotion/styled";
import * as RadixSlider from "@radix-ui/react-slider";
import { ComponentProps } from "react";

export const Slider = (props: ComponentProps<typeof RadixSlider.Root>) => {
  return (
    <SliderBox>
      <SliderRoot {...props}>
        <SliderTrack />
        <SliderThumb />
      </SliderRoot>
    </SliderBox>
  );
};

const SliderBox = styled.div`
  height: 42px;
  width: 168px;
  border-radius: 10px;
  background: white;
  box-shadow: 0px 0px 5px 0px rgb(0 0 0 / 5%), 0px 1px 6px 0px rgb(0 0 0 / 10%);
  padding: 0 16px;
  touch-action: none;
  user-select: none;
`;

const SliderRoot = styled(RadixSlider.Root)`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
`;

const SliderTrack = styled(RadixSlider.Track)`
  background-color: var(--blackA10);
  position: relative;
  flex-grow: 1;
  height: 8px;
  background: var(--color-embossed-dark);
  border-radius: 4px;
  box-shadow: inset 0px 0px 5px 0px rgb(0 0 0 / 10%);
`;

const SliderThumb = styled(RadixSlider.Thumb)`
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-selected);
  cursor: grab;
  border: 4px solid transparent;

  &:active {
    cursor: grabbing;
  }

  &:focus {
    outline: none;
    border-color: var(--color-selected-vivid);
  }
`;
