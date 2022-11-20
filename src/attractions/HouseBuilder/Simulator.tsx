import {
  useState,
  Fragment,
  useCallback,
  Dispatch,
  SetStateAction,
  forwardRef,
  useImperativeHandle,
} from "react";
import styled from "@emotion/styled";

import { Schema, House, BlockType, getBlockDef, getBlockSprite, buildBlock } from "./house";

interface Props {
  houseState: [House, Dispatch<SetStateAction<House>>];
}

export type SimulatorHandle = {
  takePicture: () => void;
};

export const Simulator = forwardRef<SimulatorHandle, Props>((props, ref) => {
  const [house, updateHouse] = props.houseState;

  useImperativeHandle(ref, () => ({
    takePicture: () => alert("bar"),
  }));

  // opens in a new window by default
  return <Container />;
});

/**
 * Styles
 */
const Container = styled.div`
  width: 100%;
  height: 100%;
`;
