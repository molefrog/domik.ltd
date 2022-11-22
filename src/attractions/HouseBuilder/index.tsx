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

  const [pictureTaken, setPictureTaken] = useState<string>();
  const [flash, setFlash] = useState<boolean>(false);

  const [playShutter] = useShutterSound();
  const [playClick] = useClickSound();
  const [playRecorder] = useRecorderSound();

  const houseBeforeUpdate = usePrevious(house);

  useEffect(() => {
    if (houseBeforeUpdate) playClick();
  }, [houseBeforeUpdate, house]);

  useEffect(() => {
    setPictureTaken(undefined);
  }, [simulationRunning]);

  // save current simulator image
  const takePicture = useCallback(() => {
    const camera = simulatorRef.current?.takePicture("png");

    if (camera) {
      const [picture, saveFile] = camera;

      // wait and then open file dialog
      setTimeout(() => {
        const time = new Date();
        // saveFile(`house-${time.getHours()}-${time.getMinutes()}.png`);
      }, 1000);

      setFlash(false);
      setTimeout(() => {
        setPictureTaken(picture);
        setFlash(true);

        setTimeout(() => {
          setFlash(false);
        }, 2200);
      }, 100);
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

        <Shapshot
          visible={pictureTaken !== undefined}
          flash={flash}
          onClick={() => setPictureTaken(undefined)}
        >
          {pictureTaken && <img src={pictureTaken} />}
        </Shapshot>

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

const Shapshot = styled.div<{ visible: boolean; flash?: boolean }>`
  position: absolute;
  inset: 0 0 0 0;
  background: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  visibility: hidden;
  cursor: pointer;

  > img {
    width: 100%;
    height: 100%;
    object-position: center;
    object-fit: contain;
  }

  &:after {
    content: "";
    display: inline-block;
    position: absolute;
    inset: 0 0 0 0;
    background: white;
    pointer-events: none;
    opacity: 1;
    visibility: hidden;
  }

  ${({ visible = false }) =>
    visible &&
    `
    pointer-events: auto;
    visibility: visible;
    transition: none;
  `}

  ${({ flash = false }) =>
    flash &&
    `
    &:after {
      visibility: visible;
      opacity: 0;
      transition: opacity 1s 0.2s linear;
    }
  `}
`;
