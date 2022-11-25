import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useAtom } from "jotai";
import { useLocation } from "wouter";

import { BumperCar } from "~/components/BumperCar";
import { Story, ChapterModule } from "./Story";
import { buildCodeSequence } from "~/chapters";
import { acceptedCipher } from "~/state";
import { delay } from "~/utils/promises";

// TODO: make sure chunk names are not exposed in the final bundle
const chapterModules = [
  () => import("~/chapters/1-one/story.mdx") as Promise<ChapterModule>,
  () => import("~/chapters/2-two/story.mdx") as Promise<ChapterModule>,
  () => import("~/chapters/3-three/story.mdx") as Promise<ChapterModule>,
  () => import("~/chapters/4-four/story.mdx") as Promise<ChapterModule>,
  () => import("~/chapters/5-five/story.mdx") as Promise<ChapterModule>,
];

export const StoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [storedCipher] = useAtom(acceptedCipher);
  const [, navigate] = useLocation();
  const [chapters, setChapters] = useState<Array<ChapterModule>>([]);

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
          navigate("/");
        }
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
`;
