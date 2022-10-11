import { useState } from "react";
import { Link } from "wouter";
import styled from "@emotion/styled";

import { useTick } from "~/hooks/useTick";

interface Props {
  launchDate: Date;
}

export function NextChapterBanner({ launchDate }: Props) {
  const [countdown, setCountdown] = useState<Array<number>>([0, 0, 0, 0]);

  useTick(
    () => {
      const diff = launchDate.getTime() - Date.now();

      if (diff <= 0) setCountdown([0, 0, 0]);

      setCountdown([
        Math.floor(diff / 1000 / 60 / 60 / 24), // days
        Math.floor((diff / 1000 / 60 / 60) % 60), // hours
        Math.floor((diff / 1000 / 60) % 60), // mins
        Math.floor((diff / 1000) % 60), // seconds
      ]);
    },
    { ms: 1000 }
  );

  return (
    <Link to="/enc">
      <Container className="next-chapter-banner">
        <AvailableIn>
          <AvailableLabel>
            Интересно, что будет дальше? <br />
            Ждите анонса следующей главы
          </AvailableLabel>

          <Countdown>
            {countdown.map((t) => String(t).padStart(2, "0")).join(" : ")}
          </Countdown>
        </AvailableIn>
        <Button>Я не могу больше ждать!</Button>
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
  margin-bottom: 16px;
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
  margin: 16px 0;

  .next-chapter-banner:hover & {
    background: var(--color-selected);
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
