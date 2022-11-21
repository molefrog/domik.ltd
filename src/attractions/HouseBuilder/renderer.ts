import { HouseBlock, getBlockDef } from "./house";
import { Body } from "p2-es";
import { useState } from "react";

import groundSprite from "./sprites/ground.png";

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.onabort = reject;

    img.src = src;
  });

export interface RenderObject {
  block: HouseBlock;
  body: Body;
}

export class Renderer {
  canvas!: HTMLCanvasElement;
  objects: Array<RenderObject> = [];

  #sprites: Record<string, HTMLImageElement> = {};

  /**
   * Transformation between canvas coordinates and world coordinates
   * (represented by grid cells). Scale factor is calculated to fit the
   * current house into the viewport perfectly
   */
  get canvasCtx() {
    return this.canvas.getContext("2d")!;
  }

  get canvasDimensions() {
    return [this.canvas.width, this.canvas.height];
  }

  get worldDimensions() {
    const [w, h] = this.canvasDimensions;
    const scale = this.scale;

    return [w / scale, h / scale];
  }

  get scale() {
    // calculate approximate height of the tower
    const verticalCells = this.objects
      .map(({ block }) => {
        return getBlockDef(block).height;
      })
      .reduce((acc, value, index, array) => {
        const isLast = index >= array.length - 1;
        return acc + value + (isLast ? 0 : 2);
      }, 0);

    return this.canvas.height / (verticalCells * 2);
  }

  async loadSprites() {
    const toLoad = [groundSprite];

    for (const src of toLoad) {
      try {
        const img = await loadImage(src);
        this.#sprites[src] = img;
      } catch {}
    }
  }

  drawSprite(
    ctx: CanvasRenderingContext2D,
    imgSrc: string,
    cx: number,
    cy: number,
    dw: number,
    dh: number,
    offsetX: number, // 0.0..1.0 of sprite width
    offsetY: number // 0.0..1.0 of sprite height
  ) {
    const sprite = this.#sprites[imgSrc];

    if (sprite) {
      ctx.drawImage(sprite, cx, cy, dw, dh);
    }
  }

  takePicture() {}

  drawGround() {
    const sprite = this.#sprites[groundSprite];
    if (!sprite) return;

    const ctx = this.canvasCtx;
    const [w, h] = this.canvasDimensions;
    const [gw, gh] = this.worldDimensions;

    ctx.save();

    const [spriteW, spriteH] = [sprite.width, sprite.height];
    const houseArea = 400; // fixed! defines how much space in the sprite a house consumes

    // ??? Figure out this one
    const x = 5; // (houseArea * gw) / w / (spriteW / spriteH);

    // ground height in world coordinates
    const groundHeight = x;

    const hGround = Math.min(6, Math.max(4, groundHeight));
    const groundHeightCanvas = h * (hGround / gh);

    // aspect ration of the ground in the viewport
    const arGround = w / groundHeightCanvas;

    // dimensions of the sub-image of the sprite
    const subImageW = sprite.height * arGround;
    const subImageH = sprite.height;

    ctx.drawImage(
      sprite,
      // center the sprite horizontally
      0.5 * (sprite.width - subImageW),
      0,
      subImageW,
      subImageH,
      0,
      h - groundHeightCanvas,
      w,
      groundHeightCanvas
    );

    ctx.restore();
  }

  render() {
    const ctx = this.canvasCtx;
    const [w, h] = this.canvasDimensions;
    const [dw, dh] = this.worldDimensions;

    // Clear the canvas
    ctx.clearRect(0, 0, w, h);

    this.drawGround();

    ctx.save();
    ctx.scale(this.scale, this.scale);

    const groundY = dh * 0.9;

    for (const { block, body } of this.objects) {
      ctx.save();

      ctx.strokeStyle = "red";
      ctx.lineWidth = 0.1;

      ctx.beginPath();
      const [x, y] = body.interpolatedPosition;
      const [bw, bh] = [getBlockDef(block).width, getBlockDef(block).height];

      ctx.translate(dw * 0.5 + x, groundY - y);
      ctx.rotate(body.angle);
      ctx.translate(-0.5 * bw, -0.5 * bh);

      ctx.rect(0, 0, bw, bh);

      ctx.stroke();
      ctx.closePath();

      ctx.restore();
    }

    ctx.restore(); // Restore global transform
  }
}

export const useRenderer = () => {
  const [renderer] = useState(() => {
    const r = new Renderer();
    r.loadSprites();

    return r;
  });
  return renderer;
};
