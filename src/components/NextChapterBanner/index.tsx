import { Link } from "wouter";
import { Countdown } from "~/components/Countdown";

import styled from "@emotion/styled";
import { useI18n } from "~/i18n/i18n";

interface NextChapterBannerProps {}

export function NextChapterBanner({}: NextChapterBannerProps) {
  const { t } = useI18n();

  return (
    <Container>
      <AvailableIn>
        <AvailableLabel>{t("storyPage.unlock.text")}</AvailableLabel>
      </AvailableIn>

      <Buttons>
        <Button primary to="/x">
          {t("storyPage.unlock.button")}
        </Button>
      </Buttons>
    </Container>
  );
}

const AvailableIn = styled.div`
  margin-right: 24px;
`;

const AvailableLabel = styled.div`
  line-height: 1.4;
  color: var(--color-text-gray);
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
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

  ${({ primary }) =>
    primary
      ? "background: var(--color-selected);"
      : "background: none; border: 3px solid var(--color-selected);"}

  @media (max-width: 640px) {
    flex: 1 1 100%;
  }

  :hover {
    background: var(--color-selected-vivid);
    border-color: var(--color-selected-vivid);
  }
`;

const SubscribeButton = Button.withComponent("a");

const Container = styled.div`
  background: var(--color-embossed);
  padding: 32px;
  border-radius: 16px;
  font-size: 17px;
`;
