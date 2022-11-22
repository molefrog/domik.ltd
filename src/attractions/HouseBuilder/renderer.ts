import { HouseBlock, getBlockDef, Schema as SchemaBlocks, getBlockSprite } from "./house";
import { Body, Box } from "p2-es";
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

  // how many grid steps there is between the bottom of the house and bottom of the screen
  get houseMarginH() {
    return 2;
  }

  get scale() {
    // calculate approximate height of the tower
    const sceneHeight = this.objects
      .map(({ block }) => {
        return getBlockDef(block).height;
      })
      .reduce((acc, value, index, array) => {
        const isLast = index >= array.length - 1;
        return acc + value + (isLast ? 0 : 1);
      }, 0);

    const verticalCells = Math.min(40, Math.max(18, sceneHeight + this.houseMarginH));
    return this.canvas.height / verticalCells;
  }

  /**
   * Drawing and loading image sprites to ensure that they are
   * fully loaded when they are drawn on a canvas
   *
   * TODO: load sprites in parallel!
   */
  async loadSprites() {
    const blockSprites = Object.values(SchemaBlocks).flatMap(({ variants }) => variants);
    const toLoad = [groundSprite, ...blockSprites];

    for (const src of toLoad) {
      try {
        const img = await loadImage(src);
        this.#sprites[src] = img;
      } catch {}
    }
  }

  drawSprite(imgSrc: string, ...args: number[]) {
    const sprite = this.#sprites[imgSrc];

    if (sprite) {
      (this.canvasCtx.drawImage as Function)(sprite, ...args);
    }
  }

  /**
   * Allows to take the shapshot of the current canvas
   * and returns a method for saving the image to the disk

   */
  takePicture(format = "png"): [string, (filename: string) => void] {
    const uri = this.canvas.toDataURL(format);

    // gets the mimetype for this format
    const type = format.toLowerCase().replace(/jpg/i, "jpeg");
    const r = type.match(/png|jpeg|bmp|gif/)?.[0] || "png";
    const mimeType = "image/" + r;

    const saveFile = (filename = "") => {
      let saveLink = document.createElement("a");

      saveLink.download = filename;

      // replace the mimetype so the browser knows it needs to download the image
      const downloadURI = uri.replace(mimeType, "image/octet-stream");

      saveLink.href = downloadURI;
      saveLink.click();
    };

    return [uri, saveFile];
  }

  drawGround() {
    const sprite = this.#sprites[groundSprite];

    const ctx = this.canvasCtx;
    const [w, h] = this.canvasDimensions;
    const [gw, gh] = this.worldDimensions;

    ctx.save();

    // this magic constant is picked manually to achieve nice
    // positioning of the house on the ground
    const groundHeightCanvas = (6.5 * h) / gh;

    // aspect ratio of the ground in the viewport
    const arGround = w / groundHeightCanvas;

    // dimensions of the sub-image of the sprite
    const subImageW = sprite.height * arGround;
    const subImageH = sprite.height;

    this.drawSprite(
      groundSprite,
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

    if (!w || !h) return;

    // Clear the canvas
    ctx.clearRect(0, 0, w, h);

    this.drawGround();

    ctx.save();
    ctx.scale(this.scale, this.scale);

    const groundY = dh - this.houseMarginH;

    for (const { block, body } of this.objects.slice().reverse()) {
      ctx.save();

      ctx.beginPath();
      const boxShape = body.shapes[0] as Box;
      const blockDef = getBlockDef(block);

      const [x, y] = body.interpolatedPosition;
      const [bw, bh] = [boxShape.width, boxShape.height];

      ctx.translate(dw * 0.5 + x, groundY - y);
      ctx.rotate(body.angle);
      ctx.translate(-0.5 * bw, -0.5 * bh);

      const [spriteW, spriteY] = [getBlockDef(block).width, getBlockDef(block).height];
      this.drawSprite(getBlockSprite(block), 0, -getBlockDef(block).overflowY, spriteW, spriteY);

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
