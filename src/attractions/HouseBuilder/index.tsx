import { useState, Fragment, useCallback } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Flipper, Flipped } from "react-flip-toolkit";

import { Schema, HouseBlock, BlockType, getBlockDef, getBlockSprite, buildBlock } from "./house";
import { rand } from "~/utils/rand";

import gridTile from "./images/grid-tile.svg";

const buildInitialHouse = (): Array<HouseBlock> => [
  buildBlock(BlockType.Roof),
  buildBlock(BlockType.Floor),
  buildBlock(BlockType.GroundFloor),
  buildBlock(BlockType.Base),
];

export const HouseBuilder = () => {
  const [house, updateHouse] = useState(() => buildInitialHouse());

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
    <Container>
      <Flipper flipKey={house.length}>
        <Grid>
          {house.map((block, index) => {
            const isLast = index === house.length - 1;

            return (
              <Fragment key={block.id}>
                <Flipped flipId={block.id}>
                  <Block
                    style={{ gridRowEnd: `span ${getBlockDef(block).height}` }}
                    onClick={() => changeFloorVariant(index)}
                  >
                    <BlockImg src={getBlockSprite(block)} />
                  </Block>
                </Flipped>
                {!isLast && (
                  <Separator>
                    <button onClick={() => buildNewFloor(index)}>+</button>
                    <button onClick={() => demolishFloor(index)}>-</button>
                  </Separator>
                )}
              </Fragment>
            );
          })}
        </Grid>
      </Flipper>
    </Container>
  );
};

24;

/**
 * Styles
 */

const Container = styled.div``;

const Grid = styled.div`
  --grid-step: 32px;
  aspect-ratio: 1 / 1;
  overflow-y: auto;

  background-image: url("${gridTile + "#svgView(viewBox(0,0,32,32))"}");
  background-size: 32px 32px;

  padding: calc(var(--grid-step));
  border-radius: 6px;

  display: grid;
  grid-template-columns:
    repeat(2, var(--grid-step))
    [start] repeat(2, var(--grid-step))
    [wall-start] repeat(6, var(--grid-step))
    [wall-end] repeat(2, var(--grid-step))
    [end]
    repeat(2, var(--grid-step));

  grid-auto-rows: var(--grid-step);
  justify-content: center;
`;

const Block = styled.div`
  grid-column: start / end;
  grid-row-end: span 3;
`;

const BlockImg = styled.img`
  object-fit: contain;
  object-position: center bottom;
  width: 100%;
  height: 100%;
`;

const Separator = styled.div`
  grid-column: start / end;
  grid-row-end: span 1;

  background: gray;
  opacity: 0.5;
`;
