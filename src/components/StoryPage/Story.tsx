import { useState, useEffect, useRef, FunctionComponent } from "react";
import styled from "@emotion/styled";

import { useLocation } from "wouter";
import { useAtom } from "jotai";

import { getLaunchDateForChapter } from "~/chapters";
import { NextChapterBanner } from "~/components/NextChapterBanner";
import { ReadingProgress } from "../ReadingProgress";
import { newChapterUnlocked as newChapterUnlockedAtom } from "~/state";
import { useChapterProgress } from "./useChapterProgress";
import { useDocumentTitle } from "~/hooks/useDocumentTitle";

export interface ChapterModule {
  default: FunctionComponent;
  title: string | undefined;
}

export interface StoryProps {
  chapters: ChapterModule[];
}

export const Story = ({ chapters }: StoryProps) => {
  const [, navigate] = useLocation();
  const [newChapterUnlocked] = useAtom(newChapterUnlockedAtom);

  const [chapterRefs, setChapterRefs] = useState<Array<HTMLElement | null>>(() => []);
  const { progress, current: currentChapterIdx } = useChapterProgress(chapterRefs, [chapterRefs]);

  const chapterTitle = chapters[Number(currentChapterIdx)]?.title || "...";
  useDocumentTitle(chapterTitle);

  // useSyncState(useA(), useB());

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

  const maxProgress = Math.min(chapters.length / 6.0, 1.0);

  return (
    <Article>
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
    </Article>
  );
};

const Chapters = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const ChapterContent = styled.div`
  padding-top: 48px;
`;

const Article = styled.article`
  padding: 0px 16px 128px 16px;
  max-width: 700px;
  margin: 0 auto;
`;

const Banner = styled.div`
  margin-top: 48px;
`;
