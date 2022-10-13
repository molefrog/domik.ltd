import styled from "@emotion/styled";

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLocalStorage } from "~/hooks/useLocalStorage";

import { buildCodeSequence, getLaunchDateForChapter } from "~/chapters";
import { NextChapterBanner } from "~/components/NextChapterBanner";
import { BumperCar } from "~/components/BumperCar";

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
  const [storedCipher, setStoredCipher] = useLocalStorage<number>("cipher", 0);
  const [, navigate] = useLocation();
  const [chapterComponents, setChapterComponents] = useState<
    Array<ChapterComponent>
  >([]);

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
          delay(2000), // artificial delay
          ...(await Promise.all(
            chapterModules
              .slice(0, codes.length)
              .map((fn) => fn().then((mod) => mod.default))
          )),
        ]);

        setChapterComponents(modules);
      } catch (err) {
        console.error(err);
        setStoredCipher(0);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [storedCipher]);

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

  return (
    <Story>
      <Chapters>
        {chapterComponents.map((C, index) => {
          return (
            <ChapterContent key={index}>
              <C />
            </ChapterContent>
          );
        })}

        <NextChapterBanner
          launchDate={getLaunchDateForChapter(chapterComponents.length)}
        />
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
  margin-bottom: 48px;
`;

const Story = styled.article`
  padding: 48px 16px 128px 16px;
  max-width: 700px;
  margin: 0 auto;
`;
