import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { animated, useTransition, easings } from "@react-spring/web";
import useLatest from "@react-hook/latest";

interface PulseObj {
  radius: number;
  duration: number;
}

export interface PulseProps {
  frequency: number;
}

export const Pulse = ({ frequency }: PulseProps) => {
  const [pulses, setPulses] = useState<PulseObj[]>([]);

  const transitions = useTransition(pulses, {
    enter: (item) => ({ scale: item.radius, opacity: 0 }),
    from: { scale: 1.0, opacity: 0.3 },
    config: (item) => ({
      duration: item.duration,
      easing: easings.linear,
    }),
    onRest: (_result, _spring, item) => {
      // remove the item
      setPulses((pulses) => pulses.filter((x) => x !== item));
    },
  });

  const freshFreq = useLatest(frequency);

  useEffect(() => {
    if (!freshFreq.current) return;
    let tm = 0;

    function throwPlume() {
      tm = setTimeout(throwPlume, 1000 / freshFreq.current);

      setPulses((pulses) => {
        const t = (Math.min(Math.max(freshFreq.current, 0.25), 2.0) - 0.25) / 1.75;
        const r = 1.5 + 3 * t;
        const pulse = { radius: r, duration: r * 1500 };
        return [pulse, ...pulses];
      });
    }

    throwPlume();
    return () => clearTimeout(tm);
  }, [!frequency]); // turn on and off

  return transitions((styles, _item) => <Plume style={styles} />);
};

const Plume = styled(animated.div)`
  position: absolute;
  inset: 8px 8px 8px 8px;
  border-radius: 100% 100%;
  will-change: transform, opacity;
  background: var(--color-selected-vivid);
`;
