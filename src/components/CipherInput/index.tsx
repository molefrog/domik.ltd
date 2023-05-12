import { useState, forwardRef, useImperativeHandle } from "react";
import styled from "@emotion/styled";

import { CipherCharSelect, Direction } from "~/components/CipherCharSelect";
import { rand } from "~/utils/rand";
import { delay } from "~/utils/promises";

export type Cipher = number;
export type Bit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface Props {
  cipher: Cipher;
  onChange?: (c: Cipher) => void;
  shuffleRest?: boolean;
  readonly?: boolean;
}

/*
 * Ref interface to control the input from the outside
 */
export interface CipherInputRef {
  cipherAccepted: () => Promise<void>;
}

const toOct = (num: number, max: number = 8): Array<Bit> => {
  return Number(num)
    .toString(8)
    .slice(0, max)
    .padStart(max, "0")
    .split("")
    .map((d) => Number(d) as Bit);
};

function pickRandomBit(current: Bit): Bit {
  const options: Array<Bit> = [0, 1, 2, 3, 4, 5, 6, 7];

  const pickFrom = options.filter((x) => x !== current);
  return pickFrom[rand(pickFrom.length)];
}

export const CipherInput = forwardRef<CipherInputRef, Props>(
  ({ cipher, onChange, shuffleRest = true, readonly = false }, ref) => {
    const [lastChangeAt, setLastChangeAt] = useState(-1);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Convert to array of octal bits
    const bits = toOct(cipher);

    // Customize the ref
    useImperativeHandle(ref, () => ({
      async cipherAccepted() {
        for (let i = 0; i < 8; ++i) {
          setSelectedIndex(i);
          await delay(40);
        }
      },
    }));

    const clickHandler = (position: number) => {
      if (readonly) {
        return;
      }

      let newNumber = bits.slice();

      newNumber.forEach((val, index) => {
        if (index === position) {
          // increment selected bit
          newNumber[index] = ((newNumber[index] + 1) % 8) as Bit;
        } else if (shuffleRest && index > position) {
          // shuffle remaining bits
          newNumber[index] = pickRandomBit(val);
        }
      });

      onChange?.(parseInt(newNumber.join(""), 8));
      setLastChangeAt(position);
    };

    return (
      <Cipher>
        {bits.map((digit, index) => {
          return (
            <CipherCharSelect
              key={index}
              selected={index <= selectedIndex}
              direction={lastChangeAt === index ? Direction.Forward : undefined}
              onClick={() => clickHandler(index)}
              value={digit}
            />
          );
        })}
      </Cipher>
    );
  }
);

const Cipher = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 100px));
  justify-content: center;
  grid-gap: 10px;

  @container (max-width: 920px) {
    grid-template-columns: repeat(4, 100px);
  }

  @container (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, 80px);
  }
`;
