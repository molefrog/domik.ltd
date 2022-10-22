import { useRef, useEffect, useState, useCallback } from "react";

/**
 * Like `useEffect<boolean>` but with delayed setter
 * @param initial Initial value
 * @param ms Timeout in ms
 * @returns
 */
export const useDelayedSwitch = (
  initial: boolean,
  ms: number,
  delayOn: boolean = false
): [boolean, (b: boolean) => void] => {
  type Timeout = ReturnType<typeof setTimeout>;

  const [val, setVal] = useState(initial);
  const timer = useRef<Timeout>();

  const update = useCallback((to: boolean) => {
    if (delayOn === to) {
      timer.current = setTimeout(() => setVal(to), ms);
    } else {
      clearTimeout(timer.current);
      setVal(to);
    }
  }, []);

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  return [val, update];
};
