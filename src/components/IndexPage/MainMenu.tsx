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
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`;

const Button = styled(Link, {
  shouldForwardProp: (prop) => !["primary"].includes(prop),
})<{ primary: boolean }>`
  padding: 7px 14px;
  border-radius: 10px;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  color: inherit;
  border: 3px solid transparent;

  transform: rotate(-3deg);

  ${({ primary }) =>
    primary
      ? "background: #575756; color: white; "
      : "background: none; border: 3px solid #575756;"}

  @media (max-width: 640px) {
    flex: 1 1 100%;
  }

  :hover {
    background: var(--color-selected-vivid);
    border-color: var(--color-selected-vivid);
    color: var(--color-text);
  }
`;

const Menu = styled.div`
  margin: 0 16px;
  border-radius: 16px;
  font-size: 18px;
  padding: 2px;

  background: var(--color-bg);
  box-shadow: 0px 0px 12px 12px var(--color-bg);
`;
