import styled from "@emotion/styled";
import { ChapterModule, totalNumberOfChapters } from "~/chapters";
import { Link, useLocation } from "wouter";
import { useLocale } from "~/i18n/locale";

import { useState } from "react";
import { useTransition, animated, config } from "@react-spring/web";

import lockIcon from "~/assets/icons/lock.svg";
import hamburderIcon from "~/assets/icons/hamburger.svg";

interface NavigationProps {
  chapters: ChapterModule[];
  currentChapter: number;
}

export const Navigation = ({ chapters, currentChapter }: NavigationProps) => {
  const [currentPath] = useLocation();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const transitions = useTransition(isOpen, {
    from: { opacity: 0, rotate: "35deg" },
    enter: { opacity: 1, rotate: "-1deg" },
    leave: { opacity: 0, rotate: "45deg" },
    config: (a, b, c) => {
      if (c === "enter") return config.wobbly;
      return config.stiff;
    },
  });

  return (
    <>
      {transitions((style, item) => {
        return (
          item && (
            <Menu style={style}>
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
                <LangSwitch role="radiogroup" aria-label="Switch language">
                  <LangSwitchItem
                    role="radio"
                    aria-label="English"
                    selected={locale === "en"}
                    href={`~/en${currentPath}`}
                  >
                    EN
                  </LangSwitchItem>
                  <LangSwitchItem
                    role="radio"
                    aria-label="Russian"
                    selected={locale === "ru"}
                    href={`~/ru${currentPath}`}
                  >
                    RU
                  </LangSwitchItem>
                </LangSwitch>
              </Bottom>
            </Menu>
          )
        );
      })}

      <Toggle aria-label="Open menu" active={isOpen} onClick={() => setIsOpen((x) => !x)}>
        <img alt="Menu" src={hamburderIcon} />
      </Toggle>
    </>
  );
};

const Toggle = styled.button<{ active: boolean }>`
  position: fixed;
  top: 20px;
  left: 20px;
  width: 48px;
  height: 48px;
  background: var(--color-embossed);
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  outline: none;
  border: 3px solid transparent;
  cursor: pointer;

  > img {
    opacity: 0.7;
  }

  &:hover {
    border-color: var(--color-selected);
  }

  ${({ active }) => active && "border-color: var(--color-selected);"}

  @media (max-width: 480px) {
    left: 12px;
    top: 12px;
  }
`;

const Chapter = styled(Link, {
  shouldForwardProp: (prop) => !["active"].includes(prop),
})<{ active?: boolean }>`
  display: flex;
  color: var(--color-text);

  background: var(--color-bg);
  margin-bottom: 8px;
  padding: 0 16px;
  height: 44px;
  border-radius: 6px;
  user-select: none;
  font-size: 18px;
  align-items: center;

  &:hover {
    box-shadow: inset 0 0 0 2px var(--color-selected-vivid);
  }

  ${({ active }) => active && "font-weight: 600"}
`;

const LockedChapter = styled(Chapter)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-embossed-dark);

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

const Menu = styled(animated.div)`
  --shadow-contour: 6px;

  position: fixed;
  left: 40px;
  top: 40px;
  width: 340px;
  padding: 36px 16px 16px;

  border-radius: 12px;
  background: var(--color-embossed);
  box-shadow: 0px 3px 0px 2px var(--color-embossed-dark),
    0px 0px 0px 1.5px var(--color-embossed-dark), 0px 2px 0px var(--shadow-contour) var(--color-bg);

  user-select: none;
  transform-origin: 16px 16px;

  @media (max-width: 480px) {
    --shadow-contour: 16px;

    left: 20px;
    top: 72px;
    width: calc(100% - 2 * 20px);
  }
`;
