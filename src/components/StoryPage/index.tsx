import { useRef, useEffect } from "react";

import styled from "@emotion/styled";

import ChapterOne from "~/chapters/1-one/story.mdx";
import { NextChapterBanner } from "~/components/NextChapterBanner";

const ChapterContent = styled.div`
  max-width: 700px;
  margin: 16px auto;
`;

export const StoryPage = () => {
  return (
    <ChapterContent>
      <ChapterOne />
      <NextChapterBanner launchDate={new Date("2022-10-15")} />
    </ChapterContent>
  );
};
