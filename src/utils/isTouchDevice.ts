export const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  Number(navigator?.["maxTouchPoints"]) > 0;
