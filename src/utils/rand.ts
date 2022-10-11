export function rand(a: number, b: number = 0) {
  if (b === undefined) [a, b] = [0, a];

  return a + Math.floor(Math.random() * Math.abs(b - a));
}
