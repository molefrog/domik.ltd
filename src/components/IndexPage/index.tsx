import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";

import styled from "@emotion/styled";

import { NextChapterBanner } from "~/components/NextChapterBanner";
import { getLaunchDateForChapter, isValidCode } from "~/chapters";
import { useLocalStorage } from "~/hooks/useLocalStorage";

export const IndexPage = () => {
  const [storedCipher] = useLocalStorage<number>("cipher", 0);
  const [, navigate] = useLocation();

  useEffect(() => {
    isValidCode(storedCipher).then((valid) => {
      if (valid) navigate("story");
    });
  });

  return (
    <Centered>
      <NextChapterBanner launchDate={getLaunchDateForChapter(0)} />
    </Centered>
  );
};

const Centered = styled.div`
  display: grid;
  grid-template-columns: minmax(0px, 640px);
  padding: 16px;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
`;
