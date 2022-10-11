import { useState, useRef, useEffect } from "react";
import { useRoute, useLocation } from "wouter";

import styled from "@emotion/styled";
import css from "@emotion/css";

import { CipherInput } from "~/components/CipherInput";
import { rand } from "~/utils/rand";

/*
 * Syncs currently selected cipher with the route
 */
const useCipher = (): [number, (x: number) => void] => {
  const [match, params] = useRoute<{ cipher: string }>("/enc/0o:cipher");
  const [, navigate] = useLocation();

  const val = match ? parseInt(params.cipher, 8) : 0o0;

  return [val, (x) => navigate(`/enc/0o${x.toString(8)}`, { replace: true })];
};

export function CipherPage() {
  const [cipher, setCipher] = useCipher();
  const firstRender = useRef(true);

  // randomize on start
  useEffect(() => {
    // TODO: figure out why `useEffect` triggers twice
    if (firstRender.current) {
      firstRender.current = false;

      for (let i = 0, ms = 100; i < 4; ++i) {
        ms += rand(200, 800);

        setTimeout(() => {
          setCipher(rand(0o77777777));
        }, ms);
      }
    }
  }, []);

  return (
    <Container>
      <EnterCipher>
        <EnterCipherHeader>Знаешь ли ты секретный код?</EnterCipherHeader>
        <EnterCipherTitle>
          Нет кода — нет и истории, таковы правила. Наберись терпения, дорогой
          друг.
        </EnterCipherTitle>
        <CipherInput cipher={cipher} onChange={(x) => setCipher(x)} />
      </EnterCipher>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: stretch;
`;

const EnterCipher = styled.div`
  text-align: center;
  flex: 1 1;
  padding-bottom: 220px;
`;

const EnterCipherHeader = styled.h1`
  font-size: 36px;
  line-height: 1.2;
`;

const EnterCipherTitle = styled.h2`
  font-weight: normal;
  margin: 0 auto;
  margin-bottom: 48px;
  font-size: 24px;
  max-width: 640px;
  line-height: 1.4;
`;
