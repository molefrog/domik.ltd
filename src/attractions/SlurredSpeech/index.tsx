import styled from "@emotion/styled";
import { useRef, useState, useCallback } from "react";
import { Flipper, Flipped } from "react-flip-toolkit";

import { TokenType, Token, tokenize, tokensEqual, tokenToKey } from "./tokenizer";
import { rand } from "~/utils/rand";
import { shuffle } from "./shuffle";

interface Props {
  children: string;
  iterationsPerStep?: number;
  onComplete?: () => void;
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

const SlurredSpeech_ = ({ children: text, onComplete, iterationsPerStep = 5 }: Props) => {
  const [tokenized] = useState(() => tokenize(text));
  const [wordTokens] = useState(() => tokenized.filter((t) => t.type !== TokenType.Punctuation));

  const [initialShuffle] = useState(() => shuffle(wordTokens));
  const [shuffledWords, setShuffledWords] = useState(() => initialShuffle);

  // does current shuffle matches the original order
  const isOrdered = shuffledWords.every((t, index) => tokensEqual(t, wordTokens[index]));

  const tokensToRender = isOrdered ? tokenized : shuffledWords;

  /*
   * Sorting while holding the mouse down
   */
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const cbRef = useRef<() => void>();

  cbRef.current = () => {
    let result = shuffledWords;

    for (let i = 0, complete = false; i < iterationsPerStep; ++i) {
      [result, complete] = oneSortPass(result, wordTokens);
      setShuffledWords(result);
      if (complete) return onComplete?.();
    }

    timerRef.current = setTimeout(() => cbRef.current!(), rand(200, 600));
  };

  const handleTouchStart = useCallback(() => {
    cbRef.current!();
  }, [shuffledWords, wordTokens]);

  const handleTouchEnd = useCallback(() => {
    if (!isOrdered) {
      clearTimeout(timerRef.current);
      setShuffledWords(initialShuffle);
    }
  }, [isOrdered, initialShuffle]);

  return (
    <Flipper flipKey={tokensToRender.map(tokenToKey).join()}>
      <Text onMouseDown={handleTouchStart} onMouseUp={handleTouchEnd} onMouseLeave={handleTouchEnd}>
        <>
          {tokensToRender.map((token, index) => {
            const { token: letters } = token;
            const isOnTheRightPlace = isOrdered ? true : tokensEqual(token, wordTokens[index]);

            return (
              <Flipped key={tokenToKey(token)} flipId={tokenToKey(token)}>
                <WordTag highlight={!isOrdered} complete={isOnTheRightPlace}>
                  {isOrdered ? letters : letters.toLowerCase()}
                </WordTag>
              </Flipped>
            );
          })}
        </>
      </Text>
    </Flipper>
  );
};

const Text = styled.div`
  user-select: none;
  cursor: pointer;
`;

const WordTag = styled.span<{ highlight: boolean; complete: boolean }>`
  display: inline-block;
  white-space: pre-wrap;

  ${(props) =>
    props.highlight &&
    `
    background-color: blue;
    padding: 0 4px;
    padding-bottom: 2px;
    border-radius: 6px;
    line-height: 1.3;
    color: white;
    
    margin-right: 2px;
  `}

  ${(props) =>
    props.complete &&
    props.highlight &&
    `
    background-color: red;
  `}
`;

/*
 * Entry point. Always remounts internal components when the input phrase is changed
 */
export const SlurredSpeech = (props: Props) => {
  return <SlurredSpeech_ key={props.children} {...props} />;
};
