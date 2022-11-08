/*
 * Naive tokenizer that supports english and russian
 */
export enum TokenType {
  Word,
  Punctuation,
}

export type Token = {
  type: TokenType;
  token: string;
  pos: number;
};

export const tokenize = (input: string): Token[] =>
  Array.from(input.matchAll(/([а-яA-Я\w]+)|([^а-яA-Я\w]+)/gu)).map((match) => {
    return {
      token: match[0],
      type: match[1] !== undefined ? TokenType.Word : TokenType.Punctuation,
      pos: Number(match.index),
    };
  });

// indexing and comparison
export const tokenToKey = (token: Token) => `${token.token}${token.pos}`;
export const tokensEqual = (lhs: Token, rhs: Token) => tokenToKey(lhs) === tokenToKey(rhs);
