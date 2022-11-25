import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAtom } from "jotai";

import styled from "@emotion/styled";

import { NextChapterBanner } from "~/components/NextChapterBanner";
import { getLaunchDateForChapter, checkCipherValidity } from "~/chapters";
import { acceptedCipher } from "~/state";

export const IndexPage = () => {
  const [storedCipher] = useAtom(acceptedCipher);
  const [, navigate] = useLocation();

  useEffect(() => {
    checkCipherValidity(storedCipher).then(({ valid }) => {
      if (valid) navigate("/story");
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
