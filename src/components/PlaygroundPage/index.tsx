import styled from "@emotion/styled";
import { useRef, useState, useCallback } from "react";

import { TV } from "~/attractions/TV";
import { ConnectTheDots } from "~/attractions/ConnectTheDots";
import { Emotion } from "~/attractions/Emotion";
import { Spoiler } from "~/attractions/Spoiler";
import mapImage from "~/chapters/3-three/map.webp";

export default function PlaygroundPage() {
  const [revealSpoiler, setRevealSpoiler] = useState(false);

  return (
    <Container>
      You can only <TV video="dQw4w9WgXcQ">see this</TV> in dev environment! There are whole variety
      of emotions a person can experience: <Emotion feeling="happiness">happiness</Emotion> and
      sadness
      <p>
        Что ж, всё оказалось не так плохо, как я думал.{" "}
        <Spoiler reveal={revealSpoiler} onClick={() => setRevealSpoiler((t) => !t)}>
          По крайней мере, я смог неторопливо проехать несколько метров. Я делал пару попыток, а
          потом брал небольшой перерыв, и уже через час вождения окончательно перестроился.
        </Spoiler>{" "}
        Это было здорово! Мне так понравилось управлять машинкой, что дальнейшую часть пути я вёл в
        прекрасном настроении.
      </p>
      <Block>
        <ConnectTheDots
          baseWidth={670}
          dots={[
            [187, 338],
            [206, 498],
            [338, 537],
            [475, 500],
            [562, 315],
            [404, 312],
          ]}
          initialPath={[]}
          successPredicate={(seq) => seq[seq.length - 1] === 2 && seq[0] === 0}
          image={mapImage}
        />
      </Block>
    </Container>
  );
}

const Container = styled.div`
  padding: 48px 16px 128px 16px;
  max-width: 700px;
  margin: 0 auto;
`;

const Block = styled.div`
  margin: 24px 0;
`;
