import { atom } from "jotai";

export interface Cassete {
  video: string;
  from?: string;
}

export const currentCassette = atom<Cassete | null>(null);
