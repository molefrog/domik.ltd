import { useState, useCallback } from "react";
import styled from "@emotion/styled";

import { House, BlockType, buildBlock } from "./house";
import { Controls, Button } from "./Controls";
import { Builder } from "./Builder";
import { rand } from "~/utils/rand";

/*
 * Generates a random house structure with a given number of main floors
 */
const buildRandomHouse = (numberOfMainFloors = 0): House => [
  buildBlock(BlockType.Roof),
  ...Array(numberOfMainFloors)
    .fill(0)
    .map(() => buildBlock(BlockType.Floor)),
  buildBlock(BlockType.GroundFloor),
  buildBlock(BlockType.Base),
];

export const HouseBuilder = () => {
  const houseState = useState(() => buildRandomHouse());
  const [, setHouse] = houseState;
  const [simulationRunning, setSimulationRunning] = useState(false);

  const randomizeHouse = useCallback(() => {
    setHouse(buildRandomHouse(rand(2)));
  }, []);

  return (
    <Container>
      {!simulationRunning && <Builder houseState={houseState} />}

      <Controls>
        {!simulationRunning && <Button onClick={randomizeHouse}>@</Button>}
        <Button onClick={() => setSimulationRunning((s) => !s)}>
          {simulationRunning ? "=" : ">"}
        </Button>
      </Controls>
    </Container>
  );
};

/**
 * Styles
 */

const Container = styled.div`
  position: relative;
  background: var(--color-embossed);
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
`;
