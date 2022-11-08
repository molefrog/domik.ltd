import styled from "@emotion/styled";
import { useRef, useState, useCallback } from "react";
import { Flipper, Flipped } from "react-flip-toolkit";

import { TokenType, Token, tokenize, tokensEqual, tokenToKey } from "./tokenizer";
import { rand } from "~/utils/rand";
import { shuffle } from "./shuffle";
import { useSuccessSound, useClickSound, useResetSound, usePopSound } from "~/hooks/useSounds";

interface Props {
  children: string;
  iterationsPerStep?: number;
  onComplete?: (state: boolean) => void;
}

const pick = <T,>(arr: T[]): T | undefined => arr[rand(arr.length)];

const oneSortPass = (array: Token[], ordered: Token[]): [Token[], boolean] => {
  let result = array.slice();
  let mapping: Record<number, number> = {};

  for (const [i, t] of array.entries()) {
    const isOnTheRightPlace = tokensEqual(t, ordered[i]);

    if (!isOnTheRightPlace) {
      const correctPlace = ordered.findIndex((tok) => tokensEqual(t, tok));
      mapping[i] = correctPlace;
    }
  }

  const candidate = pick(Object.keys(mapping));

  if (candidate !== undefined) {
    const from = Number(candidate);
    const to = mapping[from];

    const tmp = result[from];
    result[from] = result[to];
    result[to] = tmp;
  }

  return [result, Object.keys(mapping).length <= 1];
};

const SlurredSpeech_ = ({ children: text, onComplete, iterationsPerStep = 1 }: Props) => {
  const [tokenized] = useState(() => tokenize(text));
  const [wordTokens] = useState(() => tokenized.filter((t) => t.type !== TokenType.Punctuation));

  const [initialShuffle] = useState(() => shuffle(wordTokens));
  const [shuffledWords, setShuffledWords] = useState(() => initialShuffle);

  // does current shuffle matches the original order
  const isComplete = shuffledWords.every((t, index) => tokensEqual(t, wordTokens[index]));

  const tokensToRender = isComplete ? tokenized : shuffledWords;

  /*
   * Sorting while holding the mouse down
   */
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const cbRef = useRef<() => void>();
  const [holdIteration, setHoldIteration] = useState(0);

  const [playPop] = usePopSound({
    // increase sound pitch with every dot selected
    playbackRate: Math.min(0.3 + 0.05 * holdIteration, 1.5),
  });
  const [playReset] = useResetSound();
  const [playSuccess] = useSuccessSound();

  cbRef.current = () => {
    let result = shuffledWords;

    for (let i = 0, complete = false; i < iterationsPerStep; ++i) {
      [result, complete] = oneSortPass(result, wordTokens);
      setShuffledWords(result);
      if (complete) {
        playSuccess();
        return onComplete?.(true);
      }
    }

    playPop();
    setHoldIteration((x) => x + 1);

    timerRef.current = setTimeout(() => cbRef.current!(), rand(300, 600));
  };

  const reset = useCallback(
    (playSound = true) => {
      clearTimeout(timerRef.current);
      onComplete?.(false);
      setShuffledWords(initialShuffle);
      setHoldIteration(0);
      playSound && playReset();
    },
    [playReset, initialShuffle, onComplete]
  );

  const handleTouchStart = useCallback(() => {
    if (!isComplete) {
      cbRef.current!();
    } else {
      reset();
    }
  }, [isComplete, reset]);

  const handleTouchEnd = useCallback(() => {
    if (!isComplete) reset();
  }, [isComplete, reset, playReset]);

  const handleMouseLeave = useCallback(() => {
    if (!isComplete) reset(false);
  }, [isComplete, reset]);

  return (
    <Flipper flipKey={tokensToRender.map(tokenToKey).join()} element="p">
      <Text
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleMouseLeave}
        complete={isComplete}
      >
        <>
          {tokensToRender.map((token, index) => {
            const { token: letters } = token;
            const isOnTheRightPlace = isComplete ? true : tokensEqual(token, wordTokens[index]);

            return (
              <Flipped key={tokenToKey(token)} flipId={tokenToKey(token)}>
                <WordTag highlight={!isComplete} complete={isOnTheRightPlace}>
                  {isComplete ? letters : letters.toLowerCase()}
                </WordTag>
              </Flipped>
            );
          })}
        </>
      </Text>
    </Flipper>
  );
};

const Text = styled.div<{ complete: boolean }>`
  user-select: none;
  cursor: pointer;

  opacity: ${(props) => (props.complete ? "1.0" : "0.8")};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const WordTag = styled.span<{ highlight: boolean; complete: boolean }>`
  display: inline-block;
  white-space: pre-wrap;

  ${(props) =>
    props.highlight &&
    `
    background-color: var(--color-embossed);
    padding: 0 4px;
    padding-bottom: 2px;
    border-radius: 6px;
    line-height: 1.2;
    color: var(--color-text-gray);
    
    margin-right: 6px;
    box-shadow: 0.5px 1px 0px 0px rgba(0,0,0,0.15);
    transition: background-color 0.2s ease;
  `}

  ${(props) =>
    props.complete &&
    props.highlight &&
    `

    background-color: var(--color-selected-vivid);
    color: #444;
  `}
`;

/*
 * Entry point. Always remounts internal components when the input phrase is changed
 */
export const SlurredSpeech = (props: Props) => {
  return <SlurredSpeech_ key={props.children} {...props} />;
};
