import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useAtom } from "jotai";
import { useLocation } from "wouter";

import { BumperCar } from "~/components/BumperCar";
import { Story } from "./Story";
import { checkCipherValidity, ChapterModule, chapterModules } from "~/chapters";
import { acceptedCipher } from "~/state";
import { delay } from "~/utils/promises";
import { useI18n, useLocale } from "~/i18n/hooks";

export const StoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [storedCipher, setStoredCipher] = useAtom(acceptedCipher);
  const [, navigate] = useLocation();
  const [chapters, setChapters] = useState<Array<ChapterModule>>([]);

  const locale = useLocale();
  const { t } = useI18n();

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      try {
        const { valid, chaptersUnlocked } = await checkCipherValidity(storedCipher);

        // invalid secret code provided
        if (!valid) {
          setStoredCipher(undefined);
          throw new Error("Provided cipher is not valid!");
        }

        // dynamically load chapter modules
        const [, ...modules] = await Promise.all([
          delay(import.meta.env.DEV ? 0 : 2000), // artificial delay
          ...chapterModules.slice(0, chaptersUnlocked).map((fn) => fn(locale)),
        ]);

        setChapters(modules);
      } catch (err) {
        console.error(err);
        navigate("/x");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [locale, storedCipher, setStoredCipher]);

  if (isLoading) {
    return (
      <Loader>
        <div>
          <BumperCar animation width={128} />
        </div>
        <LoaderText>
          {t("storyPage.loader.lineOne")}
          <br />
          {t("storyPage.loader.lineTwo")}
        </LoaderText>
      </Loader>
    );
  }

  if (chapters.length) {
    return <Story key={chapters.length} chapters={chapters} />;
  }

  return null;
};

/**
 * Styles
 */
const Loader = styled.div`
  text-align: center;
  opacity: 0.7;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  padding-bottom: 128px;

  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: wait;

  & > div:first-of-type {
    transform: scale(-1, 1);
  }
`;

const LoaderText = styled.div`
  font-size: 20px;
  color: var(--color-text-gray);
  margin-top: 12px;
  line-height: 32px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;
