import { createFetchStore } from "react-suspense-fetch";

/*
 * Loads an image by its url
 */
export const loadImage = (src: string) =>
  new Promise<HTMLImageElement | undefined>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(undefined);
    img.onabort = () => resolve(undefined);

    img.src = src;
  });

export const spriteStore = createFetchStore(async (src: string) => {
  const result = [await loadImage(src), src];
  console.log("load");
  return result;
});
