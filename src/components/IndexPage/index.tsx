import styled from "@emotion/styled";
import { MainMenu } from "./MainMenu";
import { Billboard as BillboardImg } from "./Billboard";
import { Link } from "wouter";
import { useLocale } from "~/i18n/locale";

export const IndexPage = () => {
  const locale = useLocale();

  return (
    <>
      <Menu>
        <Billboard>
          <BillboardImg />
          <MainMenu />
        </Billboard>
      </Menu>

      <Footer>
        Unlock your fantasy home with 'Domik Limited'! ·{" "}
        <LangLink active={locale === "en"} to="~/en">
          English
        </LangLink>{" "}
        ·{" "}
        <LangLink active={locale === "ru"} to="~/ru">
          На русском
        </LangLink>
        <Sub>
          (as long as your dreams don't exceed our budget!)
          {" · "}
          <a href="https://github.com/molefrog/domik.ltd" rel="noopener noreferrer" target="_blank">
            Source on GitHub
          </a>
        </Sub>
      </Footer>
    </>
  );
};

const LangLink = styled(Link, {
  shouldForwardProp: (prop) => !["active"].includes(prop),
})<{ active?: boolean }>`
  ${({ active }) => active && `font-weight: 600;`}
`;

const Sub = styled.div`
  margin-top: 8px;
  font-size: 18px;
  opacity: 0.75;
`;

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px;

  font-size: 20px;
  color: var(--color-text-gray);
  text-align: center;
  text-shadow: 2px 0px 0px var(--color-bg), 0px 2px 0px var(--color-bg);

  a {
    color: inherit;
    text-decoration: underline;
  }
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
  overflow: hidden;

  @media (max-width: 1024px) {
    padding-top: 40px;
  }
`;

const Billboard = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
  width: 740px;
  flex-shrink: 0;

  > svg {
    width: 100%;
  }

  @media (max-width: 480px) {
    transform-origin: top center;
    transform: scale(0.7);
  }
`;
