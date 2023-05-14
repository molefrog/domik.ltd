import { FunctionComponent } from "react";
import { Locale } from "~/i18n/locale";

type Code = string;

export const IV: Code = "15726312"; // the code of the 0 chapter (publicly available)

const bytesToOct = (bytes: number[]): Code =>
  bytes
    .map((b) => b.toString(8).padStart(3, "0"))
    .join("")
    .slice(0, 8);

/*
 * Generates a new code based on the given one
 * Hashes the code (as an octal string) with SHA-256
 * and then takes the first 8 octal digits
 */
async function digest(code: Code): Promise<Code> {
  const msgUint8 = new TextEncoder().encode(code);
  const hash = await crypto.subtle.digest("SHA-256", msgUint8);

  return bytesToOct([...new Uint8Array(hash)]);
}

/**
 * Builds a sequence of valid codes from the given end code
 * If a sequence can't be built, returns an empty array
 */
async function buildCodeSequence(code?: Code | number, tries = 6) {
  if (!code) return [];

  if (typeof code === "number") {
    code = code.toString(8).padStart(8, "0");
  }

  let seq = [];

  while (tries-- >= 0) {
    if (code === IV) return seq.reverse();
    seq.push(code);

    code = await digest(code);
  }

  return [];
}

const REQUIRE_CODE_FOR_EACH_CHAPTER = true;

interface CipherValidity {
  valid: boolean;
  chaptersUnlocked: number;
  startReadingFromChapter?: number;
}

/*
 * Checks if the code matches any chapter from the book
 */
export async function checkCipherValidity(code?: Code | number): Promise<CipherValidity> {
  if (!REQUIRE_CODE_FOR_EACH_CHAPTER) {
    // first tree chapters are available without a code
    if (code === undefined) return { valid: true, chaptersUnlocked: 3 };

    const codes = await buildCodeSequence(code);

    if (codes.length % 3 !== 0) {
      // code only works for 3, 6, and so on chapters
      return { valid: false, chaptersUnlocked: 0 };
    }

    return {
      valid: codes.length > 0,
      chaptersUnlocked: codes.length,
      // 2 -> 1, 3 -> 1, 4 -> 4, 6 -> 4
      startReadingFromChapter: 3 * (Math.ceil(codes.length / 3) - 1) + 1,
    };
  }

  // normal mode: require a code for each chapter
  const codes = await buildCodeSequence(code);
  return { valid: codes.length > 0, chaptersUnlocked: codes.length };
}

/*
 * Chapters available
 */
export function getLaunchDateForChapter(num: number): Date {
  const startDate = new Date("2022-12-26T07:00:00");

  return new Date(startDate.getTime() + num * 24 * 60 * 60 * 1000);
}

export interface ChapterModule {
  default: FunctionComponent;
  title: string | undefined;
}

export const chapterModules = [
  (l: Locale) => import(`~/chapters/1-one/${l}.mdx`) as Promise<ChapterModule>,
  (l: Locale) => import(`~/chapters/2-two/${l}.mdx`) as Promise<ChapterModule>,
  (l: Locale) => import(`~/chapters/3-three/${l}.mdx`) as Promise<ChapterModule>,
  (l: Locale) => import(`~/chapters/4-four/${l}.mdx`) as Promise<ChapterModule>,
  (l: Locale) => import(`~/chapters/5-five/${l}.mdx`) as Promise<ChapterModule>,
  (l: Locale) => import(`~/chapters/6-six/${l}.mdx`) as Promise<ChapterModule>,
];

export const totalNumberOfChapters = chapterModules.length;
