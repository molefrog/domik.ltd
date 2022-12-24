import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import styled from "@emotion/styled";
import { Link } from "wouter";

import { acceptedCipher } from "~/state";
import { checkCipherValidity } from "~/chapters";

export const MainMenu = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [chaptersUnlocked, setChaptersUnlocked] = useState(0);
  const [storedCipher] = useAtom(acceptedCipher);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { chaptersUnlocked } = await checkCipherValidity(storedCipher);
      setChaptersUnlocked(chaptersUnlocked);
      setIsLoading(false);
    })();
  }, []);

  return (
    <Menu>
      {!isLoading && (
        <Buttons>
          {chaptersUnlocked <= 0 ? (
            <>
              <Button primary to="/x">
                Читать первую главу
              </Button>
            </>
          ) : (
            <>
              <Button primary to="/x">
                Открыть новую главу
              </Button>
              <Button to="/story">Продолжить читать</Button>
            </>
          )}
        </Buttons>
      )}
    </Menu>
  );
};

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 520px;

  @media (max-width: 640px) {
    flex-wrap: wrap;
    min-width: initial;
  }
`;

const Button = styled(Link, {
  shouldForwardProp: (prop) => !["primary"].includes(prop),
})<{ primary: boolean }>`
  padding: 7px 14px;
  border-radius: 10px;
  font-size: 18px;
  white-space: nowrap;
  text-align: center;
  color: inherit;
  border: 3px solid transparent;

  transform: rotate(-3deg);
  box-shadow: 0px 3px 0px 2px var(--color-text), 0px 0px 0px 2px var(--color-text);

  ${({ primary }) =>
    primary ? "background: var(--color-selected);" : "background: var(--color-bg); "}

  transition: transform 0.15s ease;
  flex: 1 1 100%;

  :hover {
    background: var(--color-selected-vivid);
    border-color: var(--color-selected-vivid);
    color: var(--color-text);
    transform: translate(0, 3px) rotate(1deg);
  }
`;

const Menu = styled.div`
  margin: 0 16px;
  border-radius: 16px;
  font-size: 18px;
  padding: 2px;
`;
