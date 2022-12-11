export type Point = [number, number];

// [0, 2π] => [0, 360]
export const radToDeg = (rad: number) => (360.0 * rad) / (2 * Math.PI);

// linear interpolation
export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

export const angleAndDistanceBetween = ([ax, ay]: Point, [bx, by]: Point): [number, number] => {
  const Δ = Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
  const α = -Math.atan2(by - ay, bx - ax);

  return [α, Δ];
};
