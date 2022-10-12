import { useState, useRef, useEffect } from "react";
import { useRoute, useLocation } from "wouter";

import styled from "@emotion/styled";

import { CipherInput, CipherInputRef, Cipher } from "~/components/CipherInput";
import { Compass } from "~/components/Compass";
import { rand } from "~/utils/rand";
import { useDocumentTitle } from "~/hooks/useDocumentTitle";
import { useClickSound, useSuccessSound } from "~/hooks/useSounds";

const DEFAULT_VALUE = 0o0;

/*
 * Syncs currently selected cipher with the route
 */
const useCipher = (): [Cipher, (x: Cipher) => void] => {
  const [match, params] = useRoute<{ cipher: string }>("/x/0o:cipher");
  const [, navigate] = useLocation();

  const val = match ? parseInt(params.cipher, 8) : DEFAULT_VALUE;

  return [
    val,
    (x) =>
      navigate(`/x/0o${x.toString(8).padStart(8, "0")}`, { replace: true }),
  ];
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
  const firstRender = useRef(true);
  const inputRef = useRef<CipherInputRef>(null);

  const [cipher, setCipher] = useCipher();
  const [arrow, setArrow] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(false);

  // sound fx
  const [playClick] = useClickSound();
  const [playSuccess] = useSuccessSound();

  const acceptCipher = (cipher: Cipher) => {
    setCipher(cipher);
    setInputDisabled(true);

    playSuccess();
    if (inputRef.current) inputRef.current.cipherAccepted();
  };

  // customize page title
  useDocumentTitle(cipherToTitle(cipher));

  // randomize on the start
  useEffect(() => {
    // TODO: figure out why `useEffect` triggers twice
    if (firstRender.current && cipher === DEFAULT_VALUE) {
      firstRender.current = false;

      for (let i = 0, ms = 0; i < 3; ++i) {
        ms += rand(200, 800);

        setTimeout(() => {
          setCipher(rand(0o777777));
        }, ms);
      }
    }
  }, []);

  // move the compass when the cipher is changed
  useEffect(() => {
    setArrow(rand(-360, 180));
    playClick();
  }, [cipher]);

  return (
    <Container>
      <EnterCipher>
        <EnterCipherHeader>Знаешь секретный шифр?</EnterCipherHeader>
        <EnterCipherTitle>
          Нет кода — нет и истории. Открывай доступ к новым главам, используя
          секретную последовательность символов.
        </EnterCipherTitle>

        <CipherInput
          ref={inputRef}
          cipher={cipher}
          readonly={inputDisabled}
          onChange={(x) => {
            setCipher(x);
            acceptCipher(0o10101010);
          }}
        />
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
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: 16px;
`;

const EnterCipher = styled.div`
  text-align: center;
  flex: 1 1;
  padding-top: 32px;
`;

const EnterCipherHeader = styled.h1`
  font-size: 32px;
  line-height: 1.2;
`;

const EnterCipherTitle = styled.h2`
  font-weight: normal;
  margin: 0 auto;
  margin-bottom: 48px;
  font-size: 22px;
  max-width: 680px;
  line-height: 1.4;
`;
