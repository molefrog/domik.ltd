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
import { useChapterProgress } from "./useChapterProgress";
import { useDocumentTitle } from "~/hooks/useDocumentTitle";

type ChapterComponent = React.FunctionComponent;

interface ChapterModule {
  default: ChapterComponent;
  title: string | undefined;
}

// TODO: make sure chunk names are not exposed in the final bundle
const chapterModules = [
  () => import("~/chapters/1-one/story.mdx") as Promise<ChapterModule>,
  () => import("~/chapters/2-two/story.mdx") as Promise<ChapterModule>,
  () => import("~/chapters/3-three/story.mdx") as Promise<ChapterModule>,
  () => import("~/chapters/4-four/story.mdx") as Promise<ChapterModule>,
  () => import("~/chapters/5-five/story.mdx") as Promise<ChapterModule>,
];

export const StoryPage = () => {
  const [, navigate] = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [storedCipher, setStoredCipher] = useAtom(acceptedCipher);
  const [chapters, setChapters] = useState<Array<ChapterModule>>([]);
  const [newChapterUnlocked] = useAtom(newChapterUnlockedAtom);

  const [chapterRefs, setChapterRefs] = useState<Array<HTMLElement | null>>(() => []);
  const { progress, current: currentChapterIdx } = useChapterProgress(chapterRefs, [chapterRefs]);

  const chapterTitle = chapters[Number(currentChapterIdx)]?.title || "...";
  useDocumentTitle(chapterTitle);

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
          ...chapterModules.slice(0, codes.length).map((fn) => fn()),
        ]);

        setChapters(modules);
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
  const scrolledRef = useRef(false);

  useEffect(() => {
    if (chapterRefs?.length > 0 && newChapterUnlocked && !scrolledRef.current) {
      setTimeout(() => {
        const lastEl = chapterRefs[chapterRefs.length - 1];
        scrolledRef.current = true; // do that only once per page
        lastEl?.scrollIntoView({ behavior: "smooth" });
      }, 600);
    }
  }, [chapterRefs, newChapterUnlocked]);

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

  const maxProgress = Math.min(chapters.length / 6.0, 1.0);

  return (
    <Story>
      <ReadingProgress progress={progress} max={maxProgress} />

      <Chapters>
        {chapters.map((mod, index) => {
          const Mdx = mod.default;

          return (
            <ChapterContent
              key={index}
              ref={(el) => {
                if (el && chapterRefs[index] !== el) {
                  const refs = Array(chapters.length).fill(null);
                  for (let i of refs.keys()) {
                    refs[i] = i === index ? el : chapterRefs[i];
                  }
                  setChapterRefs(refs);
                }
              }}
            >
              <Mdx />
            </ChapterContent>
          );
        })}

        <Banner>
          <NextChapterBanner launchDate={getLaunchDateForChapter(chapters.length)} />
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
