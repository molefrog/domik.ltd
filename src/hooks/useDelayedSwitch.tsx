import { useRef, useEffect, useState } from "react";
import { usePrevious } from "./usePrevious";

interface Options {
  switchOnDelay?: number;
  switchOffDelay?: number;
}

type Timeout = ReturnType<typeof setTimeout>;

/**
 * Boolean with delayed on/off
 * @param initial Initial value
 * @param ms Timeout in ms
 * @returns
 */
export const useDelayedSwitch = (input: boolean, options: Options = {}): boolean => {
  const { switchOnDelay = 0, switchOffDelay = 0 } = options;

  const [val, setVal] = useState(() => input);
  const prevInput = usePrevious(input);

  const timer = useRef<Timeout>();

  useEffect(() => {
    if (prevInput === undefined || prevInput === input) return; // nothing to change yet

    clearTimeout(timer.current);
    const wait = input ? switchOnDelay : switchOffDelay;

    if (!wait) return setVal(input);
    timer.current = setTimeout(() => {
      setVal(input);
    }, wait);
  }, [input]);

  return val;
};
