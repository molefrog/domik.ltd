import { atom } from "jotai";

export interface Cassette {
  video: string;
  from?: string;
  withSound?: boolean;
}

export const currentCassette = atom<Cassette | null>(null);
