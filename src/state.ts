import { atom, useAtom } from "jotai";

export const newChapterUnlocked = atom<boolean>(false);
export const useNewChapterUnlocked = () => useAtom(newChapterUnlocked);
