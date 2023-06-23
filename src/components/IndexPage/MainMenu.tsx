import styled from "@emotion/styled";
import { Link } from "wouter";

import { useI18n } from "~/i18n/i18n";

export const MainMenu = () => {
  const i18n = useI18n();

  return (
    <Menu>
      <Buttons>
        <Button primary to="/story">
          {i18n.t("indexPage.readTheStory")}
        </Button>
      </Buttons>
    </Menu>
  );
};

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 640px) {
    flex-wrap: wrap;
    min-width: initial;
  }
`;

const Button = styled(Link, {
  shouldForwardProp: (prop) => !["primary"].includes(prop),
})<{ primary: boolean }>`
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 18px;
  white-space: nowrap;
  text-align: center;
  color: inherit;
  border: 3px solid transparent;
  min-width: 174px;

  transform: rotate(-4deg);
  box-shadow: 0px 3px 0px 2px var(--color-selected-vivid),
    0px 0px 0px 2px var(--color-selected-vivid);

  ${({ primary }) => (primary ? "background: #ffd172;" : "background: var(--color-bg);")}

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
  font-size: 18px;
  padding: 2px;
  position: absolute;
  top: 226px;
  left: 368px;
`;
