import styled from "@emotion/styled";

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";

import { buildCodeSequence, getLaunchDateForChapter } from "~/chapters";
import { NextChapterBanner } from "~/components/NextChapterBanner";
import { BumperCar } from "~/components/BumperCar";
import { ReadingProgress } from "../ReadingProgress";

import { newChapterUnlocked as newChapterUnlockedAtom, acceptedCipher } from "~/state";
import { delay } from "~/utils/promises";

type ChapterComponent = React.FunctionComponent;

// TODO: make sure chunk names are not exposed in the final bundle
const chapterModules = [
  () =>
    import("~/chapters/1-one/story.mdx") as unknown as Promise<{
      default: ChapterComponent;
    }>,
  () =>
    import("~/chapters/2-two/story.mdx") as unknown as Promise<{
      default: ChapterComponent;
    }>,
];

export const StoryPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [storedCipher, setStoredCipher] = useAtom(acceptedCipher);
  const [, navigate] = useLocation();
  const [chapterComponents, setChapterComponents] = useState<Array<ChapterComponent>>([]);
  const [newChapterUnlocked] = useAtom(newChapterUnlockedAtom);

  const firstChapterRef = useRef<HTMLDivElement>(null);
  const lastChapterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      try {
        const codes = await buildCodeSequence(storedCipher);

        // invalid secret code provided
        if (!codes.length) {
          throw new Error("Provided cipher is not valid!");
        }

        // dynamically load chapter modules
        const [, ...modules] = await Promise.all([
          delay(import.meta.env.DEV ? 0 : 2000), // artificial delay
          ...(await Promise.all(
            chapterModules.slice(0, codes.length).map((fn) => fn().then((mod) => mod.default))
          )),
        ]);

        setChapterComponents(modules);
      } catch (err) {
        console.error(err);

        if (!import.meta.env.DEV) {
          setStoredCipher(RESET);
          navigate("/");
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [storedCipher]);

  // automatically scroll to the last chapter
  useEffect(() => {
    if (chapterComponents && newChapterUnlocked) {
      setTimeout(() => lastChapterRef.current?.scrollIntoView({ behavior: "smooth" }), 600);
    }
  }, [chapterComponents]);

  if (isLoading) {
    return (
      <Loader>
        <div>
          <BumperCar animation width={128} />
        </div>
        <LoaderText>
          Подождите немножко,
          <br /> мы готовим для вас историю...
        </LoaderText>
      </Loader>
    );
  }

  // i hope there will be more chapters soon
  const maxProgress = Math.min(chapterComponents.length / 4.0, 1.0);

  return (
    <Story>
      <ReadingProgress startRef={firstChapterRef} endRef={lastChapterRef} max={maxProgress} />

      <Chapters>
        {chapterComponents.map((C, index) => {
          let ref = null;

          if (index === 0) ref = firstChapterRef;
          if (index === chapterComponents.length - 1) ref = lastChapterRef;

          return (
            <ChapterContent key={index} ref={ref}>
              <C />
            </ChapterContent>
          );
        })}

        <Banner>
          <NextChapterBanner launchDate={getLaunchDateForChapter(chapterComponents.length)} />
        </Banner>
      </Chapters>
    </Story>
  );
};

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
`;

const Chapters = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const ChapterContent = styled.div`
  padding-top: 48px;
`;

const Story = styled.article`
  padding: 0px 16px 128px 16px;
  max-width: 700px;
  margin: 0 auto;
`;

const Banner = styled.div`
  margin-top: 48px;
`;
