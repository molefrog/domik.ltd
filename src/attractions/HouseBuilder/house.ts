import { rand } from "~/utils/rand";

import base_1 from "./sprites/base-1.png";
import base_2 from "./sprites/base-2.png";
import floor_1 from "./sprites/floor-1.png";
import floor_2 from "./sprites/floor-2.png";
import floor_3 from "./sprites/floor-3.png";
import floor_4 from "./sprites/floor-4.png";
import groundFloor_1 from "./sprites/ground-floor-1.png";
import groundFloor_2 from "./sprites/ground-floor-2.png";
import roof_1 from "./sprites/roof-1.png";
import roof_2 from "./sprites/roof-2.png";

export enum BlockType {
  Roof = "Roof",
  Floor = "Floor",
  GroundFloor = "GroundFloor",
  Base = "Base",
}

/**
 * Schema defines how each block/floor is constructed, how many cells it occupies,
 * what sprites it can have etc.
 */
export interface BlockDeclaration {
  height: number;
  width: number;
  variants: string[];
}
export const Schema: Record<BlockType, BlockDeclaration> = {
  [BlockType.Roof]: {
    height: 2,
    width: 10,
    variants: [roof_1, roof_2],
  },
  [BlockType.Floor]: {
    height: 3,
    width: 10,
    variants: [floor_1, floor_2, floor_3, floor_4],
  },
  [BlockType.GroundFloor]: {
    height: 3,
    width: 10,
    variants: [groundFloor_1, groundFloor_2],
  },
  [BlockType.Base]: {
    height: 2,
    width: 10,
    variants: [base_1, base_2],
  },
};

export interface HouseBlock {
  id: string;
  type: BlockType;
  variant: number;
}

export const getBlockDef = (block: HouseBlock) => Schema[block.type];

export const getBlockSprite = (block: HouseBlock) => getBlockDef(block).variants[block.variant]!;

// creates new block with given properties
export const buildBlock = (
  type: BlockType,
  properties: Omit<Partial<HouseBlock>, "id"> = {}
): HouseBlock => {
  const id = `id-${rand(0xffffff)}`;
  const block = Object.assign({ id, type }, properties) as HouseBlock;

  block.variant = block.variant || rand(getBlockDef(block).variants.length);
  return block;
};
