import useSound from "use-sound";

import clickVfx from "~/assets/sounds/click.m4a?url";
import successVfx from "~/assets/sounds/success.m4a?url";

export const useClickSound = () => useSound(clickVfx);
export const useSuccessSound = () => useSound(successVfx);
