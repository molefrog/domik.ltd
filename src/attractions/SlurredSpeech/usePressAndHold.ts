import { useState, useEffect, useCallback } from "react";

/**
 * Subscribes to mouse/touch events and returns a boolean value indicating long press
 */
export const usePressAndHold = <T extends HTMLElement>(): [boolean, (el: T) => void] => {
  const [el, setEl] = useState<T>();
  const [isHolding, setIsHolding] = useState(false);

  const onTouchStart = useCallback((e: TouchEvent) => {
    e.cancelable && e.preventDefault();
    setIsHolding(true);
  }, []);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    e.cancelable && e.preventDefault();
    setIsHolding(false);
  }, []);

  const onMouseDown = useCallback(() => {
    setIsHolding(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsHolding(false);
  }, []);

  const onMouseUp = useCallback(() => {
    setIsHolding(false);
  }, []);

  useEffect(() => {
    if (!el) return;

    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [el]);

  // update state when ref is changed to resubscribe to events
  const refCb = useCallback((el: T) => setEl(el), []);
  return [isHolding, refCb];
};
