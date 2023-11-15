import { Link } from "wouter";
import styled from "@emotion/styled";
import { useI18n } from "~/i18n/i18n";

import bannerImg from "~/assets/sprites/unlock-chapters-banner.svg";

interface NextChapterBannerProps {}

export function NextChapterBanner({}: NextChapterBannerProps) {
  const { t } = useI18n();

  return (
    <Container>
      <Banner aria-hidden={true} src={bannerImg} />

      <TextContainer>
        <div>
          <AvailableIn>
            <AvailableLabel>{t("storyPage.unlock.text")}</AvailableLabel>
          </AvailableIn>

          <Buttons>
            <Button primary to="/x">
              {t("storyPage.unlock.button")}
            </Button>
          </Buttons>
        </div>
      </TextContainer>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
`;

const Banner = styled.img`
  pointer-events: none;
  user-select: none;
  width: 100%;
  min-width: 600px;
`;

const AvailableIn = styled.div``;

const AvailableLabel = styled.div`
  line-height: 1.4;
  color: var(--color-text-gray);
`;

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

  margin-top: 12px;

  ${({ primary }) =>
    primary
      ? "background: var(--color-selected);"
      : "background: none; border: 3px solid var(--color-selected);"}

  @media (max-width: 640px) {
    flex: 1 1 100%;
    font-size: 16px;
    padding: 5px 12px;
    margin-top: 8px;
  }

  :hover {
    background: var(--color-selected-vivid);
    border-color: var(--color-selected-vivid);
  }
`;

const TextContainer = styled.div`
  position: absolute;
  top: 45%;
  right: 10%;
  left: 5%;
  bottom: 16%;
  font-size: 17px;

  display: flex;
  align-items: center;

  @media (max-width: 640px) {
    top: 46%;
    right: 3%;
    left: 7%;
    bottom: 16%;
    font-size: 16px;
  }
`;
