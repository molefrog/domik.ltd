import { Link } from "wouter";
import { Countdown } from "~/components/Countdown";

import styled from "@emotion/styled";

interface NextChapterBannerProps {
  launchDate: Date;
}

export function NextChapterBanner({ launchDate }: NextChapterBannerProps) {
  launchDate = new Date(2023, 1, 1);
  const isPastLaunchDate = launchDate.getTime() - Date.now() < 0;

  return (
    <Container>
      <AvailableIn>
        <AvailableLabel>
          {!isPastLaunchDate ? "Интересно, что же будет дальше?" : "Новая глава уже доступна!"}
        </AvailableLabel>

        <CountdownLabel to={launchDate} />
      </AvailableIn>

      <Buttons>
        <Button primary to="/x">
          {"Ввести код"}
        </Button>
        <SubscribeButton target="_blank" rel="noreferrer noopener" href="https://t.me/domik_ltd">
          Узнать о выходе
        </SubscribeButton>
      </Buttons>
    </Container>
  );
}

const AvailableIn = styled.div`
  margin-right: 24px;
`;

const AvailableLabel = styled.div`
  max-width: 320px;
  line-height: 1.4;
  margin-bottom: 10px;
  color: var(--color-text-gray);
`;

const CountdownLabel = styled(Countdown)`
  font-size: 32px;
  font-weight: bold;
  white-space: nowrap;
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
`;

const Button = styled(Link)<{ primary: boolean }>`
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
