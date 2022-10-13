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
export async function digest(code: Code): Promise<Code> {
  const msgUint8 = new TextEncoder().encode(code);
  const hash = await crypto.subtle.digest("SHA-256", msgUint8);

  return bytesToOct([...new Uint8Array(hash)]);
}

/**
 * Builds a sequence of valid codes from the given end code
 * If a sequence can't be built, returns an empty array
 */
export async function buildCodeSequence(code?: Code | number, tries = 16) {
  if (!code) return [];

  if (typeof code === "number") {
    code = code.toString(8).padStart(8, "0");
  }

  let seq = [];

  while (--tries > 0) {
    if (code === IV) return seq.reverse();
    seq.push(code);

    code = await digest(code);
  }

  return [];
}

/*
 * Checks if the code matches any chapter from the book
 */
export async function isValidCode(code?: Code | number) {
  const codes = await buildCodeSequence(code);
  return codes.length > 0;
}

export function getLaunchDateForChapter(num: number): Date {
  const startDate = new Date("2022-10-14"); // every Friday

  return new Date(startDate.getTime() + num * 7 * 24 * 60 * 60 * 1000);
}
