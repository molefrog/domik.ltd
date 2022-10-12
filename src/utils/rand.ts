export function rand(a: number, b?: number) {
  if (b === undefined) [a, b] = [0, a];

  return a + Math.floor(Math.random() * Math.abs(b - a));
}
