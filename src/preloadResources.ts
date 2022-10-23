import { useEffect } from "react";
import { delay } from "~/utils/promises";

enum PreloadStatus {
  idle,
  started,
  finished,
  errored,
}

let preloadStatus: PreloadStatus = PreloadStatus.idle;

interface ResourceDeclaration {
  load: () => Promise<{ default: string }>;
  type: "image" | "audio";
}

const resources: ResourceDeclaration[] = [
  { load: () => import("~/assets/sprites/bumper-car.png"), type: "image" },
  { load: () => import("~/assets/symbols/0.svg"), type: "image" },
  { load: () => import("~/assets/symbols/1.svg"), type: "image" },
  { load: () => import("~/assets/symbols/2.svg"), type: "image" },
  { load: () => import("~/assets/symbols/3.svg"), type: "image" },
  { load: () => import("~/assets/symbols/4.svg"), type: "image" },
  { load: () => import("~/assets/symbols/5.svg"), type: "image" },
  { load: () => import("~/assets/symbols/6.svg"), type: "image" },
  { load: () => import("~/assets/symbols/7.svg"), type: "image" },
  { load: () => import("~/assets/sounds/click.m4a?url"), type: "audio" },
  { load: () => import("~/assets/sounds/success.m4a?url"), type: "audio" },
  { load: () => import("~/assets/sprites/tv.png?url"), type: "image" },
];

export const usePreloadedResources = () => {
  useEffect(() => {
    if (preloadStatus !== PreloadStatus.idle) return;
    preloadStatus = PreloadStatus.started;

    (async () => {
      try {
        await Promise.race([delay(3000), Promise.allSettled(resources.map((r) => load(r)))]);

        preloadStatus = PreloadStatus.finished;
      } catch {
        preloadStatus = PreloadStatus.errored;
      }
    })();
  }, []);
};

const load = async (r: ResourceDeclaration) => {
  const { default: url } = await r.load();

  switch (r.type) {
    case "image":
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve();
        };

        img.src = url;
      });
      break;

    case "audio":
      await new Promise<void>((resolve) => {
        const audio = new Audio();
        audio.addEventListener("loadeddata", () => resolve());
        audio.preload = "auto";
        audio.autoplay = false;
        audio.src = url;
      });

      break;
  }

  return null;
};
