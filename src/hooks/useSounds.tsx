import useSound from "use-sound";

import clickVfx from "~/assets/sounds/click.m4a?url";
import successVfx from "~/assets/sounds/success.m4a?url";
import popVfx from "~/assets/sounds/pop.m4a?url";
import resetVfx from "~/assets/sounds/error.m4a?url";

export const useClickSound = (...p: any[]) => useSound(clickVfx, ...p);
export const useSuccessSound = (...p: any[]) => useSound(successVfx, ...p);
export const usePopSound = (...p: any[]) => useSound(popVfx, ...p);
export const useResetSound = (...p: any[]) => useSound(resetVfx, ...p);
