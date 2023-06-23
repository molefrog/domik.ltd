import styled from "@emotion/styled";
import { Link, useLocation } from "wouter";
import { ChapterModule, totalNumberOfChapters } from "~/chapters";
import { useLocale } from "~/i18n/locale";

import { animated, SpringValue } from "@react-spring/web";

import lockIcon from "~/assets/icons/lock.svg";
import menuBorderImg from "~/assets/sprites/menu-borders.png";
import domikImg from "~/assets/sprites/menu-domik.svg";

import { ComponentProps } from "react";
import { ChapterCheckmark } from "./ChapterCheckmark";

export interface NavigationProps {
  chapters: ChapterModule[];
  currentChapter: number;
}

type MenuProps = NavigationProps & { onClose: () => void; style: MenuStyle };
type MenuStyle = { opacity: SpringValue<number>; rotate: SpringValue<string> };

export const MenuPopover = ({ currentChapter, chapters, style, onClose }: MenuProps) => {
  const [currentPath] = useLocation();
  const locale = useLocale();

  return (
    <Popover style={style}>
      <Home>
        <HomeImg src={domikImg} alt="Back to home page" />
      </Home>

      <Chapters>
        {chapters.map((module, index) => {
          let completion: ComponentProps<typeof Checkmark>["completion"] = null;

          if (index < currentChapter) {
            completion = "done";
          } else if (index === currentChapter) {
            completion = "inprogress";
          }

          return (
            <Chapter
              key={index}
              active={currentChapter === index}
              href={`/story/chapter-${index + 1}`}
              onClick={onClose}
            >
              <Checkmark completion={completion} />

              {module.title}
            </Chapter>
          );
        })}
        {chapters.length < totalNumberOfChapters && (
          <LockedChapter href="/x">
            {""}
            <img src={lockIcon} alt="This chapter is locked!" />
          </LockedChapter>
        )}
      </Chapters>

      <Bottom>
        <LangSwitch role="radiogroup" aria-label="Switch language">
          <LangSwitchItem
            role="radio"
            aria-label="English"
            selected={locale === "en"}
            href={`~/en${currentPath}`}
            onClick={onClose}
          >
            EN
          </LangSwitchItem>
          <LangSwitchItem
            role="radio"
            aria-label="Russian"
            selected={locale === "ru"}
            href={`~/ru${currentPath}`}
            onClick={onClose}
          >
            RU
          </LangSwitchItem>
        </LangSwitch>
      </Bottom>
    </Popover>
  );
};

const Checkmark = styled(ChapterCheckmark)`
  position: absolute;
  top: 0;
  left: -2px;
`;

const Chapters = styled.div`
  flex-grow: 1;
`;

const Chapter = styled(Link, {
  shouldForwardProp: (prop) => !["active"].includes(prop),
})<{ active?: boolean }>`
  display: flex;
  color: var(--color-text);

  height: 46px;
  border-bottom: 2px dashed var(--color-subtle-gray);
  user-select: none;
  font-size: 18px;
  align-items: center;
  padding: 0 12px;

  position: relative;

  &:hover {
    font-weight: 600;
  }

  ${({ active }) => active && "font-weight: 600;"}
`;

const LockedChapter = styled(Chapter)`
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    opacity: 0.6;
  }

  &:hover {
    > img {
      opacity: 1;
    }
  }
`;

const Home = styled.div`
  border-bottom: 2px dashed var(--color-subtle-gray);
  border-top: 2px dashed var(--color-subtle-gray);
  height: 44px;
  margin-top: 12px;
`;

const HomeImg = styled.img`
  width: 88px;
  margin-left: -2px;
  margin-top: -18px;
  transform: rotate(-1deg);
`;

const LangSwitch = styled.div`
  display: inline-flex;
  padding: 7px 8px;
  border-radius: 8px;

  box-shadow: inset 0px 1px 0px 1px var(--color-embossed-dark);
  border: 1px solid var(--color-embossed-dark);
`;

const Bottom = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;

const LangSwitchItem = styled(Link, {
  shouldForwardProp: (prop) => !["selected"].includes(prop),
})<{ selected?: boolean }>`
  display: inline-block;
  color: var(--color-text-gray);
  border-radius: 6px;
  padding: 4px 14px;
  font-size: 17px;
  gap: 4px;
  position: relative;
  top: 1px;

  ${({ selected }) =>
    selected &&
    `
      background: var(--color-embossed-dark);
      font-weight: 600;`}
`;

const Popover = styled(animated.div)`
  position: fixed;
  left: 40px;
  top: 40px;
  padding: 40px 34px;

  width: 350px;
  height: 500px;

  border-image-source: url(${menuBorderImg});
  border-image-slice: 200 190 fill;
  border-image-width: calc(95px * 0.8) calc(100px * 0.8);
  border-image-repeat: stretch;

  display: flex;
  flex-direction: column;

  user-select: none;
  transform-origin: 16px 16px;

  @media (max-width: 480px) {
    --pad: 12px;

    left: var(--pad);
    top: 72px;
    width: calc(100% - 2 * var(--pad));
    height: auto;
  }
`;
