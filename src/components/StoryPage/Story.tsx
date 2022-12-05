import { useState, useEffect, FunctionComponent, useCallback } from "react";
import styled from "@emotion/styled";
import { useLocation, useRoute } from "wouter";

import { getLaunchDateForChapter } from "~/chapters";
import { NextChapterBanner } from "~/components/NextChapterBanner";
import { ReadingProgress } from "../ReadingProgress";

// hooks
import { useChapterProgress, useSyncState } from "./useChapterProgress";
import { useDocumentTitle } from "~/hooks/useDocumentTitle";

export interface ChapterModule {
  default: FunctionComponent;
  title: string | undefined;
}

export interface StoryProps {
  chapters: ChapterModule[];
}

type CurrentChapter = number | undefined;

export const Story = ({ chapters }: StoryProps) => {
  const [chapterElements, setChapterElements] = useState<Array<HTMLElement>>(() => []);
  const [chapterRefs] = useState(() => Array(chapters.length).fill(undefined));

  const { progress, current: currentChapterIdx, scrollTo } = useChapterProgress(chapterRefs);

  const routeState = useChapterNumberFromRoute(chapters.length);
  const scrollState: typeof routeState = [currentChapterIdx, scrollTo];

  // syncs the two states together: whenever one is changed the other one
  // gets updated automatically
  useSyncState(routeState, scrollState);

  const chapterTitle = chapters[Number(currentChapterIdx)]?.title || "...";
  useDocumentTitle(chapterTitle);

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
                chapterRefs[index] = el;

                if (chapterRefs.every((x) => x) && chapterElements.length <= 0) {
                  setChapterElements(chapterRefs);
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

/**
 * A custom location hook to provide the mapping between the current route
 * and the chapter being read
 * @returns {state} current chapter index (starting with 1)
 */
const useChapterNumberFromRoute = (max: number): [CurrentChapter, (v: CurrentChapter) => void] => {
  const [match, params] = useRoute("/story/chapter-:num");
  const [, navigate] = useLocation();

  // extracts number from the route, returns undefined if parsing has failed,
  // or the number is out of bounds
  let number;
  if (match && params?.num) {
    const parsed = parseInt(params.num) - 1;
    number = parsed <= max ? parsed : undefined;
  }

  const setNumber = useCallback(
    (v: CurrentChapter) => {
      if (v !== undefined) {
        navigate(`/story/chapter-${v + 1}`);
      } else {
        navigate("/story");
      }
    },
    [navigate]
  );

  return [number, setNumber];
};

/**
 * Styles
 */
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