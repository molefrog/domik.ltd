import { useState, ComponentPropsWithoutRef } from "react";
import { useTick } from "~/hooks/useTick";

interface CountdownProps extends ComponentPropsWithoutRef<"div"> {
  to: Date;
}

export function Countdown({ to, ...props }: CountdownProps) {
  const [countdown, setCountdown] = useState<Array<number>>([0, 0, 0, 0]);

  useTick(
    () => {
      const diff = (to || new Date()).getTime() - Date.now();

      setCountdown([
        Math.max(0, Math.floor(diff / 1000 / 60 / 60 / 24)), // days
        Math.max(0, Math.floor((diff / 1000 / 60 / 60) % 24)), // hours
        Math.max(0, Math.floor((diff / 1000 / 60) % 60)), // mins
        Math.max(0, Math.floor((diff / 1000) % 60)), // seconds
      ]);
    },
    { ms: 1000 }
  );

  return <div {...props}>{countdown.map((t) => String(t).padStart(2, "0")).join(" : ")}</div>;
}
