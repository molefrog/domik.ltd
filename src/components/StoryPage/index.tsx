import { useRef, useEffect } from "react";

import styled from "@emotion/styled";

import ChapterOne from "~/chapters/1-one/story.mdx";
import { NextChapterBanner } from "~/components/NextChapterBanner";

export const StoryPage = () => {
  return (
    <Story>
      <Chapters>
        <ChapterContent>
          <ChapterOne />
        </ChapterContent>
        <NextChapterBanner launchDate={new Date("2022-10-15")} />
      </Chapters>
    </Story>
  );
};

const Chapters = styled.article`
  max-width: 700px;
  margin: 0 auto;
`;

const ChapterContent = styled.div`
  margin-bottom: 48px;
`;

const Story = styled.article`
  padding: 32px 16px 128px 16px;
  max-width: 700px;
  margin: 0 auto;
`;
