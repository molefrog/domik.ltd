import { useState, useRef, useCallback, useEffect } from "react";
import useChange from "@react-hook/change";
import { useMediaQueries } from "@react-hook/media-query";
import styled from "@emotion/styled";

import { House, BlockType, buildBlock, allSprites } from "./house";
import { Controls, Button } from "./Controls";
import { rand } from "~/utils/rand";
import { useShutterSound, useClickSound, useRecorderSound } from "~/hooks/useSounds";
import { spriteStore } from "./spriteStore";

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

  const { matches } = useMediaQueries({
    tablet: "(max-width: 720px)",
    phone: "(max-width: 540px)",
  });

  const gridStep = matches.phone ? 20 : matches.tablet ? 24 : 32;

  // play sound whenever the house changes
  useChange(house, () => playClick());

  /**
   * Taking pictures of the house
   */
  const [pictureTaken, setPictureTaken] = useState<string>();
  const [flash, setFlash] = useState<boolean>(false);

  // exit the picture mode when simulation has been stopped
  useChange(simulationRunning, () => setPictureTaken(undefined));

  // save current simulator image
  const takePicture = useCallback(() => {
    const camera = simulatorRef.current?.takePicture("png");

    if (camera) {
      const [picture, saveFile] = camera;

      // wait and then open file dialog
      setTimeout(() => {
        const time = new Date();
        saveFile(`house-${time.getHours()}-${time.getMinutes()}.png`);
      }, 1000);

      setFlash(false);
      setTimeout(() => {
        setPictureTaken(picture);
        setFlash(true);

        setTimeout(() => {
          setFlash(false);
        }, 2500);
      }, 100);
    }

    playShutter();
  }, [playShutter]);

  /**
   * Button handlers
   */
  const randomizeHouse = useCallback(() => {
    setHouse(buildRandomHouse(rand(2)));
  }, []);

  // switch between simulator and builder
  const switchMode = useCallback(() => {
    setSimulationRunning((s) => !s);
    playRecorder();
  }, [playRecorder]);

  const controlButtonSizes = {
    width: `${gridStep * 2}px`,
    height: `${gridStep * 2}px`,
  };

  for (const sprite of allSprites) {
    spriteStore.prefetch(sprite);
    spriteStore.get(sprite);
  }

  return (
    <Container>
      {/*
          The editor can be in one of two states: building mode and 
          simulator mode
        */}
      {!simulationRunning && <Builder gridStep={gridStep} houseState={houseState} />}
      {simulationRunning && <Simulator houseState={houseState} ref={simulatorRef} />}

      <Shapshot
        visible={pictureTaken !== undefined}
        flash={flash}
        onClick={() => setPictureTaken(undefined)}
      >
        {pictureTaken && <img src={pictureTaken} />}
      </Shapshot>

      <Controls gap={gridStep * 0.5}>
        {!simulationRunning && (
          <Button {...controlButtonSizes} icon="shuffle" onClick={randomizeHouse} />
        )}

        {simulationRunning && (
          <Button {...controlButtonSizes} icon="camera" onClick={takePicture} />
        )}

        {/* Play/stop to switch between the states */}
        <Button
          {...controlButtonSizes}
          icon={simulationRunning ? "stop" : "play"}
          onClick={switchMode}
        />
      </Controls>
    </Container>
  );
};

export default HouseBuilder;

/**
 * Styles
 */

const Container = styled.div`
  position: relative;
  background: var(--color-embossed);
  width: 100%;
  height: 100%;
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
