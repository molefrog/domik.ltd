import { useState } from "react";

import styled from "@emotion/styled";
import css from "@emotion/css";

import { CipherCharSelect, Direction } from "~/components/CipherCharSelect";

type Cipher = number;
type Bit = number;

interface Props {
  cipher: Cipher;
  onChange?: (c: Cipher) => void;
  shuffleRest?: boolean;
}

const toOct = (num: number, max: number = 8): Array<number> => {
  return Number(num)
    .toString(8)
    .slice(0, max)
    .padStart(max, "0")
    .split("")
    .map((d) => Number(d));
};

function pickRandomBit(current: Bit): Bit {
  const options = [0, 1, 2, 3, 4, 5, 6, 7].filter((x) => x !== current);
  return options[Math.floor(Math.random() * options.length)];
}

export function CipherInput({ cipher, onChange, shuffleRest = true }: Props) {
  const [lastChangeAt, setLastChangeAt] = useState(0);
  const bits = toOct(cipher);

  const change = (position: number) => {
    let newNumber = bits.slice();

    newNumber.forEach((val, index) => {
      const shouldChange =
        index === position || (shuffleRest && index > position);
      if (shouldChange) newNumber[index] = pickRandomBit(val);
    });

    onChange?.(parseInt(newNumber.join(""), 8));
    setLastChangeAt(position);
  };

  return (
    <Cipher>
      {bits.map((digit, bit) => {
        return (
          <CipherCharSelect
            direction={lastChangeAt === bit ? Direction.Forward : undefined}
            key={bit}
            onClick={() => change(bit)}
            value={digit}
          />
        );
      })}
    </Cipher>
  );
}

const Cipher = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 100px));
  justify-content: center;
  grid-gap: 10px;
`;
