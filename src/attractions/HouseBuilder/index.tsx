import { useState, useCallback } from "react";
import styled from "@emotion/styled";

import { House, BlockType, buildBlock } from "./house";
import { Controls, Button } from "./Controls";
import { Builder } from "./Builder";

const buildInitialHouse = (): House => [
  buildBlock(BlockType.Roof),
  buildBlock(BlockType.Floor),
  buildBlock(BlockType.GroundFloor),
  buildBlock(BlockType.Base),
];

export const HouseBuilder = () => {
  const houseState = useState(() => buildInitialHouse());
  const [simulationRunning, setSimulationRunning] = useState(false);

  return (
    <Container>
      {!simulationRunning && <Builder houseState={houseState} />}

      <Controls>
        {!simulationRunning && <Button>@</Button>}
        <Button onClick={() => setSimulationRunning((s) => !s)}>
          {simulationRunning ? "=" : ">"}
        </Button>
      </Controls>
    </Container>
  );
};

24;

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
