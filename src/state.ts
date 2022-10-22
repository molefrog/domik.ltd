import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const newChapterUnlocked = atom<boolean>(false);

type CipherInteger = number; // TODO
export const acceptedCipher = atomWithStorage<CipherInteger | undefined>("cipher", undefined);
