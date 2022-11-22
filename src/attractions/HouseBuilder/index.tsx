import { useState, useRef, useCallback, useEffect } from "react";
import styled from "@emotion/styled";

import { House, BlockType, buildBlock } from "./house";
import { Controls, Button } from "./Controls";
import { InteractionBadge } from "~/components/InteractionBadge";
import { rand } from "~/utils/rand";
import { useShutterSound, useClickSound, usePopSound, useRecorderSound } from "~/hooks/useSounds";
import { usePrevious } from "~/hooks/usePrevious";

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
  const [house, setHouse] = houseState;
  const [simulationRunning, setSimulationRunning] = useState(false);
  const simulatorRef = useRef<SimulatorHandle>(null);

  const [playShutter] = useShutterSound();
  const [playClick] = useClickSound();
  const [playRecorder] = useRecorderSound();

  const houseBeforeUpdate = usePrevious(house);

  useEffect(() => {
    if (houseBeforeUpdate) playClick();
  }, [houseBeforeUpdate, house]);

  // save current simulator image
  const takePicture = useCallback(() => {
    const camera = simulatorRef.current?.takePicture("png");

    if (camera) {
      const [, saveFile] = camera;
      const time = new Date();
      saveFile(`house-${time.getHours()}-${time.getMinutes()}.png`);
    }

    playShutter();
  }, [playShutter]);

  // replace the house with a random one
  const randomizeHouse = useCallback(() => {
    setHouse(buildRandomHouse(rand(2)));
    playClick();
  }, [playClick]);

  // switch between simulator and builder
  const switchMode = useCallback(() => {
    setSimulationRunning((s) => !s);
    playRecorder();
  }, [playRecorder]);

  return (
    <InteractionBadge>
      <Container>
        {/*
          The editor can be in one of two states: building mode and 
          simulator mode
        */}
        {!simulationRunning && <Builder houseState={houseState} />}
        {simulationRunning && <Simulator houseState={houseState} ref={simulatorRef} />}

        <Controls>
          {!simulationRunning && <Button icon="shuffle" onClick={randomizeHouse} />}

          {simulationRunning && <Button icon="camera" onClick={takePicture} />}

          {/* Play/stop to switch between the states */}
          <Button icon={simulationRunning ? "stop" : "play"} onClick={switchMode} />
        </Controls>
      </Container>
    </InteractionBadge>
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
