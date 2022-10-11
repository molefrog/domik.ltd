import { useRef, useEffect } from "react";

import styled from "@emotion/styled";

import ChapterOne from "~/chapters/1-one/story.mdx";
import { NextChapterBanner } from "~/components/NextChapterBanner";

import car from "~/assets/bumper-car.svg";

export const StoryPage = () => {
  return (
    <Story>
      <Car src={car} />
      <Chapters>
        <ChapterContent>
          <ChapterOne />
        </ChapterContent>
        <NextChapterBanner launchDate={new Date("2022-10-15")} />
      </Chapters>
    </Story>
  );
};

const Car = styled.img`
  width: 160px;
  filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.2))
    drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.2));
`;

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
