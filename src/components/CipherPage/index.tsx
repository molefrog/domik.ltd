import { useState, useRef, useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { useDebounce } from "use-debounce";
import { useAtom } from "jotai";

import styled from "@emotion/styled";

import { CipherInput, CipherInputRef, Cipher } from "~/components/CipherInput";
import { Compass } from "~/components/Compass";
import { rand } from "~/utils/rand";
import { useDocumentTitle } from "~/hooks/useDocumentTitle";
import { useClickSound, useSuccessSound } from "~/hooks/useSounds";
import { delay } from "~/utils/promises";
import { checkCipherValidity } from "~/chapters";
import { newChapterUnlocked, acceptedCipher } from "~/state";
import "~/utils/squircle";

import closeIcon from "~/assets/icons/close.svg";

const DEFAULT_VALUE = 0o0;

/*
 * Syncs currently selected cipher with the route
 */
const useCipher = (): [Cipher, (x: Cipher) => void] => {
  const [match, params] = useRoute<{ cipher: string }>("/x/0o:cipher");
  const [, navigate] = useLocation();

  const val = match ? parseInt(params.cipher, 8) : DEFAULT_VALUE;

  return [val, (x) => navigate(`/x/0o${x.toString(8).padStart(8, "0")}`, { replace: true })];
};

const cipherToTitle = (cipher: number) => {
  const mapping: { [k: string]: string } = {
    "0": "の",
    "1": "ム",
    "2": "ひ",
    "3": "ど",
    "4": "ろ",
    "5": "み",
    "6": "ど",
    "7": "ゆ",
  };

  const octChars = cipher.toString(8).padStart(8, "0").split("");
  return octChars.map((x) => mapping[x]).join(" ");
};

export function CipherPage() {
  const [cipher, setCipher] = useCipher();
  const [arrow, setArrow] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setStoredCipher] = useAtom(acceptedCipher);
  const [, setNewChapterUnlocked] = useAtom(newChapterUnlocked);

  const firstRender = useRef(true);
  const inputRef = useRef<CipherInputRef>(null);

  const [, navigate] = useLocation();

  // sound fx
  const [playClick] = useClickSound();
  const [playSuccess] = useSuccessSound();

  // when the sequence entered matches the secret
  const acceptCipher = async (cipher: Cipher, navigateToChapter: number) => {
    setCipher(cipher);
    setInputDisabled(true);

    playSuccess();

    if (inputRef.current) {
      await inputRef.current.cipherAccepted();
    }

    await delay(1000);
    setIsLoading(true);
    await delay(250);

    // let other components know
    setNewChapterUnlocked(true);

    // save the matched cipher
    setStoredCipher(cipher);
    navigate(`/story/chapter-${navigateToChapter}`);
  };

  // customize page title
  useDocumentTitle(cipherToTitle(cipher));

  // randomize on the start
  useEffect(() => {
    if (firstRender.current && cipher === DEFAULT_VALUE) {
      firstRender.current = false;

      for (let i = 0, ms = 0; i < 4; ++i) {
        ms += rand(100, 500);

        setTimeout(() => {
          setCipher(rand(0o77777777));
        }, ms);
      }
    }
  }, []);

  // move the compass when the cipher is changed
  useEffect(() => {
    setArrow(rand(-360, 180));
    playClick();
  }, [cipher]);

  /*
   * Check the cipher validity. These checks involve hashing which could be expensive,
   * so we only run the check no often than in 300ms
   */
  const [debouncedCipher] = useDebounce(cipher, 300);

  // check the cipher validity
  useEffect(() => {
    (async () => {
      const { valid, chaptersUnlocked, startReadingFromChapter } = await checkCipherValidity(
        debouncedCipher
      );

      const navigateToChapter = startReadingFromChapter ?? chaptersUnlocked;

      if (valid) acceptCipher(debouncedCipher, navigateToChapter);
    })();
  }, [debouncedCipher]);

  return (
    <Container fadeOut={isLoading}>
      <Link href="/">
        <Close aria-label="Close">
          <img src={closeIcon} alt="Go back"></img>
        </Close>
      </Link>

      <EnterCipher>
        <EnterCipherHeader>Знаешь секретный шифр?</EnterCipherHeader>
        <EnterCipherTitle>
          Нет кода — нет и истории. Открывай доступ к новым главам, используя секретную
          последовательность символов.
        </EnterCipherTitle>

        <InputContainer>
          <CipherInput
            ref={inputRef}
            cipher={cipher}
            readonly={inputDisabled}
            onChange={(x) => setCipher(x)}
          />
        </InputContainer>
      </EnterCipher>

      <Bottom>
        <Compass size={80} angle={arrow} />
      </Bottom>
    </Container>
  );
}

/**
 * Styles
 */

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  opacity: 0.2;
  pointer-events: none;

  @media (max-width: 768px) {
    padding: 16px 0;
  }
`;

const Container = styled.div<{ fadeOut?: boolean }>`
  min-height: 100vh;
  min-height: 100svh; // mobile Safari
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  transition: opacity 0.3s ease, transform 1s ease;
  position: relative;

  ${(props) =>
    props.fadeOut &&
    `
    opacity: 0;
    transform: translateY(100px);
    `}
`;

const EnterCipher = styled.div`
  text-align: center;
  flex: 1 1;
  padding: 64px 16px 32px 16px;
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 48px 16px;
  }
`;

const EnterCipherHeader = styled.h1`
  font-size: 32px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const EnterCipherTitle = styled.h2`
  font-weight: normal;
  margin: 0 auto;
  margin-bottom: 48px;
  font-size: 22px;
  max-width: 680px;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 17px;
  }
`;

const InputContainer = styled.div`
  margin-bottom: 96px;

  @media (max-width: 768px) {
    margin-bottom: 48px;
  }
`;

const Close = styled.button`
  width: 56px;
  height: 56px;

  position: absolute;
  z-index: 100;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  top: 24px;
  right: 24px;
  flex: 0 0 auto;

  user-select: none;
  cursor: pointer;
  appearance: none;
  outline: none;
  border: none;
  background: var(--color-embossed);
  box-sizing: border-box;

  --squircle-radius: 12px;
  --squircle-smooth: 0.6;
  --squircle-color: #664eff;
  mask-image: paint(squircle);
  border-radius: 12px;

  &:focus-visible {
    box-shadow: inset 0px 0px 0px 4px var(--color-selected-vivid);
  }

  & img {
    width: 20px;
    opacity: 0.25;
  }

  &:hover img {
    opacity: 0.75;
  }

  &:active img {
    opacity: 1;
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    top: 12px;
    right: 12px;

    & img {
      width: 16px;
    }
  }
`;
