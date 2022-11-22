import { createFetchStore } from "react-suspense-fetch";

/*
 * Loads an image by its url
 */
export const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.onabort = reject;

    img.src = src;
  });

export const spriteStore = createFetchStore(async (src: string) => {
  try {
    return [await loadImage(src), src];
  } catch (error) {
    // because we use suspense for data fetching, we still want to show the component even if
    // one of the sprites fails to load
    return [undefined, src];
  }
});
