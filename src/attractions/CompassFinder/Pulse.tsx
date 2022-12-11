import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { animated, useTransition, easings } from "@react-spring/web";

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

  useEffect(() => {
    if (!frequency) return;

    function throwPlume() {
      tm = setTimeout(throwPlume, 1000 / frequency);

      setPulses((pulses) => {
        const pulse = { radius: 3.0, duration: 4000 };
        return [pulse, ...pulses];
      });
    }

    let tm = setTimeout(throwPlume, 1 / frequency);
    return () => clearTimeout(tm);
  }, [frequency]);

  return transitions((styles, _item) => <Plume style={styles} />);
};

const Plume = styled(animated.div)`
  position: absolute;
  inset: 8px 8px 8px 8px;
  border-radius: 100% 100%;
  will-change: transform, opacity;
  background: var(--color-selected-vivid);
`;
