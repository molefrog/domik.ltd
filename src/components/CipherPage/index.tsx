import { useState, useRef, useEffect } from "react";
import { useRoute, useLocation } from "wouter";

import styled from "@emotion/styled";

import { CipherInput } from "~/components/CipherInput";
import { Compass } from "~/components/Compass";
import { rand } from "~/utils/rand";
import { useDocumentTitle } from "~/hooks/useDocumentTitle";

import useSound from "use-sound";
import clickVfx from "~/assets/sounds/click.m4a?url";

/*
 * Syncs currently selected cipher with the route
 */
const useCipher = (): [number, (x: number) => void] => {
  const [match, params] = useRoute<{ cipher: string }>("/x/0o:cipher");
  const [, navigate] = useLocation();

  const val = match ? parseInt(params.cipher, 8) : 0o0;

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
  const [cipher, setCipher] = useCipher();
  const [arrow, setArrow] = useState(0);
  const firstRender = useRef(true);

  const [play] = useSound(clickVfx);

  useDocumentTitle(cipherToTitle(cipher));

  // randomize on start
  useEffect(() => {
    // TODO: figure out why `useEffect` triggers twice
    if (firstRender.current) {
      firstRender.current = false;

      for (let i = 0, ms = 0; i < 3; ++i) {
        ms += rand(200, 800);

        setTimeout(() => {
          setCipher(rand(0o777777));
        }, ms);
      }
    }
  }, []);

  useEffect(() => {
    setArrow(rand(-360, 180));
    play();
  }, [cipher]);

  return (
    <Container>
      <EnterCipher>
        <EnterCipherHeader>Знаешь секретный шифр?</EnterCipherHeader>
        <EnterCipherTitle>
          Нет кода — нет и истории. Открывай доступ к новым главам, используя
          секретную последовательность символов.
        </EnterCipherTitle>
        <CipherInput cipher={cipher} onChange={(x) => setCipher(x)} />
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
