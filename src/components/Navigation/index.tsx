import styled from "@emotion/styled";

import { useState } from "react";
import { useTransition, config, easings } from "@react-spring/web";
import { useClickOutside } from "@mantine/hooks";

import { MenuPopover, NavigationProps } from "./MenuPopover";
import hamburderIcon from "~/assets/icons/hamburger.svg";

export const Navigation = (props: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [closeDelay, setCloseDelay] = useState(0);

  const transitions = useTransition(isOpen, {
    from: { opacity: 0, y: "-100%", rotate: "-25deg" },
    enter: { opacity: 1, y: "0", rotate: "0deg" },
    leave: { opacity: 1, y: "-120%", rotate: "0deg" },
    config: (_, __, state) => {
      if (state === "leave") {
        return { duration: 650, easing: easings.easeInOutBack };
      }

      return config.stiff;
    },
    delay: isOpen ? 0 : closeDelay,
  });

  const closeMenu = (delay: number) => {
    setCloseDelay(delay);
    setIsOpen(false);
  };

  const popoverRef = useClickOutside(() => closeMenu(0));

  return (
    <div ref={popoverRef}>
      {transitions((style, item) => {
        return item && <MenuPopover style={style} onClose={() => closeMenu(1000)} {...props} />;
      })}

      <Toggle aria-label="Open menu" active={isOpen} onClick={() => setIsOpen((x) => !x)}>
        <img alt="Menu" src={hamburderIcon} />
      </Toggle>
    </div>
  );
};

const Toggle = styled.button<{ active: boolean }>`
  position: fixed;
  top: 20px;
  left: 20px;
  width: 52px;
  height: 52px;
  background: var(--color-embossed);
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  outline: none;
  border: 3px solid transparent;
  cursor: pointer;
  transition: opacity 150ms ease 800ms;
  z-index: 50;

  > img {
    opacity: 0.7;
  }

  &:hover {
    border-color: var(--color-selected);
  }

  ${({ active }) =>
    active &&
    `
    opacity: 0;
    pointer-events: none;
    transition-delay: 0s;
  `}

  @media (max-width: 480px) {
    left: 12px;
    top: 12px;
  }
`;
