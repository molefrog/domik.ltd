import styled from "@emotion/styled";
import { useRef, useState, useCallback } from "react";
import { Flipper, Flipped } from "react-flip-toolkit";

import { TokenType, Token, tokenize } from "./tokenizer";

interface Props {
  children: string;
  onComplete?: () => void;
}

function shuffleArray<T>(array: T[]) {
  array = array.slice();

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

// indexing and comparison
const tokenKey = (token: Token) => `${token.token}${token.pos}`;
const areTokensEqual = (lhs: Token, rhs: Token) => tokenKey(lhs) === tokenKey(rhs);

const SlurredSpeech_ = ({ children: text, onComplete }: Props) => {
  const [tokenized] = useState(() => tokenize(text));
  const [wordTokens] = useState(() => tokenized.filter((t) => t.type !== TokenType.Punctuation));

  const [shuffledWords, setShuffledWords] = useState(() => shuffleArray(wordTokens));

  // does current shuffle matches the original order
  const isOrdered = shuffledWords.every((t, index) => areTokensEqual(t, wordTokens[index]));

  const tokensToRender = isOrdered ? tokenized : shuffledWords;

  return (
    <Flipper flipKey={tokensToRender.map(tokenKey).join()}>
      <div onClick={() => setShuffledWords([])}>
        <>
          {tokensToRender.map((token) => {
            const { token: letters } = token;

            return (
              <Flipped key={tokenKey(token)} flipId={tokenKey(token)}>
                <WordTag finalized={isOrdered}>
                  {isOrdered ? letters : letters.toLowerCase()}
                </WordTag>
              </Flipped>
            );
          })}
        </>
      </div>
    </Flipper>
  );
};

const WordTag = styled.span<{ finalized: boolean }>`
  display: inline-block;
  white-space: pre-wrap;

  ${(props) =>
    !props.finalized &&
    `
    background-color: blue;
    padding: 0 4px;
    padding-bottom: 2px;
    border-radius: 6px;
    line-height: 1.3;
    color: white;
    
    margin-right: 2px;
  `}
`;

/*
 * Entry point. Always remounts internal components when the input phrase is changed
 */
export const SlurredSpeech = (props: Props) => {
  return <SlurredSpeech_ key={props.children} {...props} />;
};
