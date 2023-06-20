import { Fragment, useCallback, Dispatch, SetStateAction } from "react";
import styled from "@emotion/styled";
import { Flipper, Flipped } from "react-flip-toolkit";

import { Schema, House, BlockType, getBlockDef, getBlockSprite, buildBlock } from "./house";
import { Button } from "./Controls";
import { rand } from "~/utils/rand";

import gridTile from "./images/grid-tile.svg";

interface Props {
  houseState: [House, Dispatch<SetStateAction<House>>];
  gridStep: number;
}

export const Builder = ({ houseState, gridStep }: Props) => {
  const [house, updateHouse] = houseState;

  /**
   * Methods for changing the house layout
   */
  const buildNewFloor = useCallback(
    (after: number, variant?: number) => {
      const def = Schema[BlockType.Floor];
      variant = variant || rand(def.variants.length);

      const floor = buildBlock(BlockType.Floor, {
        variant,
      });

      updateHouse([...house.slice(0, after + 1), floor, ...house.slice(after + 1)]);
    },
    [house]
  );

  const demolishFloor = useCallback(
    (after: number) => {
      updateHouse([...house.slice(0, after + 1), ...house.slice(after + 2)]);
    },
    [house]
  );

  const changeFloorVariant = useCallback(
    (at: number) => {
      const block = house[at];
      const def = getBlockDef(block);

      house[at] = Object.assign(block, {
        variant: (block.variant + 1) % def.variants.length,
      });

      updateHouse(house.slice());
    },
    [house]
  );

  // opens in a new window by default
  return (
    <Grid flipKey={house.length} spring="gentle" gridStep={gridStep}>
      {house.map((block, index) => {
        const isLast = index === house.length - 1;
        const nextBlock = house[index + 1];
        const hasSeparator = !isLast;
        const hasControls =
          hasSeparator && [BlockType.Floor, BlockType.GroundFloor].includes(nextBlock?.type);
        const canRemoveBlock = hasControls && nextBlock?.type === BlockType.Floor;

        const blockHeight = getBlockDef(block).height;

        // button dimensions
        const buttonWidth = `${gridStep * 2}px`;
        const buttonHeight = `${gridStep * 1}px`;

        return (
          <Fragment key={block.id}>
            <Flipped flipId={block.id} stagger>
              <Block
                style={{ gridRowEnd: `span ${blockHeight}` }}
                onClick={() => changeFloorVariant(index)}
              >
                <BlockImg src={getBlockSprite(block)} />
              </Block>
            </Flipped>
            {hasSeparator &&
              (hasControls ? (
                <Flipped flipId={"separator-" + block.id}>
                  <SeparatorWithControls>
                    <Button
                      icon="plus"
                      width={buttonWidth}
                      height={buttonHeight}
                      onClick={() => buildNewFloor(index)}
                    />

                    {canRemoveBlock && (
                      <Button
                        icon="minus"
                        width={buttonWidth}
                        height={buttonHeight}
                        onClick={() => demolishFloor(index)}
                      />
                    )}
                  </SeparatorWithControls>
                </Flipped>
              ) : (
                <Separator />
              ))}
          </Fragment>
        );
      })}
    </Grid>
  );
};

// Returns SVG fragment identifier with changed viewport
const svgWithViewport = (path: string, size: number) => {
  return `${path}#svgView(viewBox(0,0,${size},${size}))`;
};

/**
 * Styles
 */
const Grid = styled(Flipper)<{ gridStep: number }>`
  --grid-step: ${(props) => props.gridStep}px;
  width: 100%;
  height: 100%;

  background: -1px -1px repeat local url("${({ gridStep }) => svgWithViewport(gridTile, gridStep)}");

  background-size: ${(props) => `${props.gridStep}px ${props.gridStep}px`};
  padding: calc(var(--grid-step));
  box-shadow: inset 0px 0px 0px calc(var(--grid-step) / 2) var(--color-embossed);
  border-radius: 8px;

  display: grid;
  grid-template-columns:
    [grid-start]
    repeat(2, var(--grid-step))
    [sprite-start] repeat(2, var(--grid-step))
    [wall-start] repeat(6, var(--grid-step))
    [wall-end] repeat(2, var(--grid-step))
    [sprite-end]
    repeat(2, var(--grid-step))
    [grid-end];

  grid-auto-rows: var(--grid-step);
  justify-content: flex-start;
  user-select: none;

  /*
   * Custom scrollbars
   */
  scrollbar-color: var(--color-selected);
  overflow-y: scroll;
  // don't scroll the parent element once reaches the end of scroll
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 22px;
  }

  &::-webkit-scrollbar-thumb {
    border: 8px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    background-color: var(--color-selected);
    border-radius: 12px;
  }
`;

const Block = styled.div`
  grid-column: sprite-start / sprite-end;
  grid-row-end: span 3;
  cursor: e-resize;
`;

const BlockImg = styled.img`
  object-fit: contain;
  object-position: center bottom;
  width: 100%;
  height: 100%;
`;

const Separator = styled.div`
  grid-column: wall-start / wall-end;
  grid-row-end: span 1;
`;

const SeparatorWithControls = styled(Separator)`
  grid-row-end: span 2;
  display: grid;
  column-gap: 16px;
  grid-auto-flow: column;
  justify-content: center;
  align-content: center;
`;
