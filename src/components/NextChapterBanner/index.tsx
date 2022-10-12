import { useState } from "react";
import { Link } from "wouter";
import styled from "@emotion/styled";

import { useTick } from "~/hooks/useTick";

interface Props {
  launchDate: Date;
  title?: string;
}

export function NextChapterBanner({ launchDate, title }: Props) {
  const [countdown, setCountdown] = useState<Array<number>>([0, 0, 0, 0]);

  useTick(
    () => {
      const diff = launchDate.getTime() - Date.now();

      setCountdown([
        Math.max(0, Math.floor(diff / 1000 / 60 / 60 / 24)), // days
        Math.max(0, Math.floor((diff / 1000 / 60 / 60) % 24)), // hours
        Math.max(0, Math.floor((diff / 1000 / 60) % 60)), // mins
        Math.max(0, Math.floor((diff / 1000) % 60)), // seconds
      ]);
    },
    { ms: 1000 }
  );

  const isPastLaunchDate = countdown.every((c) => c === 0);

  return (
    <Link to="/x">
      <Container className="next-chapter-banner">
        <AvailableIn>
          {title === undefined && (
            <AvailableLabel>
              {!isPastLaunchDate
                ? "Интересно, что будет же дальше?"
                : "Новая глава уже доступна!"}
            </AvailableLabel>
          )}

          {title && <AvailableLabel>{title}</AvailableLabel>}

          <Countdown>
            {countdown.map((t) => String(t).padStart(2, "0")).join(" : ")}
          </Countdown>
        </AvailableIn>
        <Button>
          {!isPastLaunchDate ? "Не могу больше ждать!" : "Ввести код"}
        </Button>
      </Container>
    </Link>
  );
}

const AvailableIn = styled.div`
  flex: 1 1 auto;
  margin-right: 24px;
`;

const AvailableLabel = styled.div`
  max-width: 320px;
  line-height: 1.4;
  margin-bottom: 10px;
  color: var(--color-text-gray);
`;

const Countdown = styled.div`
  font-size: 32px;
  font-weight: bold;
  white-space: nowrap;
`;

const Button = styled.a`
  background: var(--color-selected-light);
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .next-chapter-banner:hover & {
    background: var(--color-selected);
  }

  @media (max-width: 640px) {
    width: 100%;
    margin-top: 32px;
    text-align: center;
  }
`;

const Container = styled.div`
  background: var(--color-embossed);
  padding: 32px;
  border-radius: 16px;
  font-size: 17px;
  cursor: pointer;
  user-select: none;

  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;
