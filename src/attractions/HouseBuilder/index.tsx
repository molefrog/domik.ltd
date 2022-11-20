import { useState, useRef, useCallback } from "react";
import styled from "@emotion/styled";

import { House, BlockType, buildBlock } from "./house";
import { Controls, Button } from "./Controls";
import { rand } from "~/utils/rand";

// display modes
import { Builder } from "./Builder";
import { Simulator, SimulatorHandle } from "./Simulator";

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
  const simulatorRef = useRef<SimulatorHandle>(null);

  const randomizeHouse = useCallback(() => {
    setHouse(buildRandomHouse(rand(2)));
  }, []);

  return (
    <Container>
      {!simulationRunning && <Builder houseState={houseState} />}
      {simulationRunning && <Simulator houseState={houseState} ref={simulatorRef} />}

      <Controls>
        {!simulationRunning && <Button onClick={randomizeHouse}>@</Button>}
        {simulationRunning && (
          <Button onClick={() => simulatorRef.current?.takePicture()}>o</Button>
        )}

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
