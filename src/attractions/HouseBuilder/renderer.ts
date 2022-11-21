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

  async loadImages() {
    const toLoad = [groundSprite];

    for (const src of toLoad) {
      try {
        const img = await loadImage(src);
        this.#sprites[src] = img;
      } catch {}
    }
  }

  drawImage(ctx: CanvasRenderingContext2D, imgSrc: string, ...rest: any[]) {
    const sprite = this.#sprites[imgSrc];

    if (sprite) {
      (ctx.drawImage as Function).call(ctx, sprite, ...rest);
    }
  }

  takePicture() {}

  scale() {
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

  render() {
    const ctx = this.canvas.getContext("2d")!;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Clear the canvas
    ctx.clearRect(0, 0, w, h);

    const scale = this.scale();

    // Note that we need to flip the y axis since Canvas pixel coordinates
    // goes from top to bottom, while physics does the opposite.
    ctx.save();
    ctx.translate(0.5 * w, 0.5 * h); // Translate to the center
    ctx.scale(scale, -scale); // Zoom in and flip y axis

    this.drawImage(ctx, groundSprite, 0, 0, 4, 4);

    for (const { block, body } of this.objects) {
      ctx.save();

      ctx.strokeStyle = "red";
      ctx.lineWidth = 0.1;
      // ctx.translate(§)
      // ctx.strokeStyle = "black";
      ctx.beginPath();
      const [x, y] = body.interpolatedPosition;
      const [w, h] = [getBlockDef(block).width, getBlockDef(block).height];

      ctx.translate(-x - 0.5 * w, y + 0.5 * h);
      ctx.rotate(body.angle);

      ctx.translate(x + 0.5 * w, -y - 0.5 * h);

      // ctx.translate(-x - 0.5 * w, y + 0.5 * h);

      // ctx.rect(-0.5 * w, -0.5 * h, w, h);
      ctx.rect(x - 0.5 * w, y - 0.5 * h, w, h);

      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }

    // Restore global transform
    ctx.restore();
  }
}

export const useRenderer = () => {
  const [renderer] = useState(() => {
    const r = new Renderer();
    r.loadImages();

    return r;
  });
  return renderer;
};
