import {
  useRef,
  Dispatch,
  SetStateAction,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import styled from "@emotion/styled";
import * as p2 from "p2-es";
import useSize from "@react-hook/size";

import { useRenderer, RenderObject } from "./renderer";
import {
  Schema,
  House,
  BlockType,
  getBlockDef,
  getBlockSprite,
  buildBlock,
  HouseBlock,
} from "./house";

const getMassOfBlock = (block: HouseBlock) => {
  switch (block.type) {
    case BlockType.Base:
      return 2;
    case BlockType.Floor:
      return 1;
    default:
      return 5;
  }
};

/*
 * Runs physics simulation
 */
function simulate(house: House, renderer: ReturnType<typeof useRenderer>) {
  // Create a physics world, where bodies and constraints live
  const world = new p2.World({
    gravity: [0, -9.82],
  });

  const objects: Array<RenderObject> = [];
  let lastY = 1;

  house
    .slice()
    .reverse()
    .forEach((block, index) => {
      const def = getBlockDef(block);

      const body = new p2.Body({
        mass: getMassOfBlock(block),
        position: [0, lastY + 0.5 * def.height],
        angle: -0.1 + 0.2 * Math.random(),
      });

      lastY += def.height + 2;

      const shape = new p2.Box({
        height: def.height - def.overflowY,
        width: def.width,
      });

      body.addShape(shape);
      world.addBody(body);

      objects.push({
        body,
        block,
      });
    });

  // Create an infinite ground plane body
  const groundBody = new p2.Body({
    mass: 0, // Setting mass to 0 makes it static
  });
  const groundShape = new p2.Plane();
  groundBody.addShape(groundShape);
  world.addBody(groundBody);

  const fixedTimeStep = 1 / 60; // seconds
  const maxSubSteps = 10; // Max sub steps to catch up with the wall clock

  let lastTime = 0;
  let animationFrame: number | undefined;

  // Animation loop
  function animate(time: number) {
    animationFrame = requestAnimationFrame(animate);

    var deltaTime = lastTime ? (time - lastTime) / 1000 : 0;
    deltaTime = Math.min(1 / 10, deltaTime);
    lastTime = time;

    // Move bodies forward in time
    world.step(fixedTimeStep, deltaTime, maxSubSteps);

    // Render the circle at the current interpolated position
    renderer.objects = objects;
    renderer.render();

    lastTime = time;
  }

  animationFrame = requestAnimationFrame(animate);

  return () => {
    // stops the simulation
    cancelAnimationFrame(animationFrame!);
  };
}

interface Props {
  houseState: [House, Dispatch<SetStateAction<House>>];
}

export type SimulatorHandle = {
  takePicture: () => void;
};

export const Simulator = forwardRef<SimulatorHandle, Props>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [house] = props.houseState;
  const renderer = useRenderer();

  useImperativeHandle(ref, () => ({
    takePicture: () => renderer.takePicture(),
  }));

  // reruns the simulation whenever the house layout changes
  useEffect(() => {
    renderer.canvas = canvasRef.current!;
    return simulate(house, renderer);
  }, [house]);

  const [width, height] = useSize(containerRef);
  const pixelRatio = Math.min(devicePixelRatio || 1.0, 1.5);

  return (
    <Container ref={containerRef}>
      <Canvas ref={canvasRef} width={width * pixelRatio} height={height * pixelRatio} />
    </Container>
  );
});

/**
 * Styles
 */
const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
