import styled from "@emotion/styled";
import { ChapterModule, totalNumberOfChapters } from "~/chapters";
import { Link, useLocation } from "wouter";
import { useLocale } from "~/i18n/locale";

import lockIcon from "~/assets/icons/lock.svg";

interface NavigationProps {
  chapters: ChapterModule[];
  currentChapter: number;
}

export const Navigation = ({ chapters, currentChapter }: NavigationProps) => {
  const [currentPath] = useLocation();
  const locale = useLocale();

  return (
    <Menu>
      {chapters.map((module, index) => {
        return (
          <Chapter
            key={index}
            active={currentChapter === index}
            href={`/story/chapter-${index + 1}`}
          >
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

      <Bottom>
        <LangSwitch>
          <LangSwitchItem selected={locale === "en"} href={`~/en${currentPath}`}>
            EN
          </LangSwitchItem>
          <LangSwitchItem selected={locale === "ru"} href={`~/ru${currentPath}`}>
            RU
          </LangSwitchItem>
        </LangSwitch>
      </Bottom>
    </Menu>
  );
};

const Chapter = styled(Link, {
  shouldForwardProp: (prop) => !["active"].includes(prop),
})<{ active?: boolean }>`
  display: block;
  color: var(--color-text-gray);

  background: var(--color-bg);
  margin-bottom: 8px;
  padding: 12px 12px;
  height: 54px;
  border-radius: 8px;
  user-select: none;

  ${({ active }) => (active ? "&:hover, & {" : "&:hover {")}
    background: rgb(var(--color-selected-rgb) / 0.8);
    color: var(--color-text);
  }

  ${({ active }) => active && "font-weight: 600"}
`;

const LockedChapter = styled(Chapter)`
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    opacity: 0.6;
  }

  &:hover {
    background: var(--color-embossed-dark);
  }
`;

const LangSwitch = styled.div`
  display: inline-flex;
  background: var(--color-bg);
  padding: 7px 8px;
  border-radius: 8px;

  box-shadow: inset 0px 2px 0px 1px var(--color-embossed-dark);
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

const Menu = styled.div`
  --shadow-contour: 6px;

  position: fixed;
  left: 32px;
  top: 32px;
  width: 360px;
  padding: 16px 16px;

  border-radius: 12px;
  background: var(--color-embossed);
  box-shadow: 0px 3px 0px 2px var(--color-embossed-dark),
    0px 0px 0px 1.5px var(--color-embossed-dark), 0px 2px 0px var(--shadow-contour) var(--color-bg);

  @media (max-width: 480px) {
    left: 20px;
    top: 20px;
    width: calc(100% - 2 * 20px);

    --shadow-contour: 16px;
  }
`;
