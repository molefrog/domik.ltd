import styled from "@emotion/styled";
import { useRef, useState, useCallback } from "react";

import { TV } from "~/attractions/TV";
import { ConnectTheDots } from "~/attractions/ConnectTheDots";
import { Emotion } from "~/attractions/Emotion";
import { Spoiler } from "~/attractions/Spoiler";
import { SlurredSpeech } from "~/attractions/SlurredSpeech";
import { HouseBuilder } from "~/attractions/HouseBuilder";
import { FullWidth } from "~/attractions/FullWidth";
import { Navigation } from "../Navigation";
import * as Credits from "~/attractions/Credits";
import mapImage from "~/chapters/3-three/map.webp";

import { CompassFinder, HiddenSecret } from "~/attractions/CompassFinder";
import finderMock from "./finder-mock.png";

const revealTitles = true;

export default function PlaygroundPage() {
  const [revealSpoiler, setRevealSpoiler] = useState(false);

  return (
    <Container>
      <Navigation chapters={[]} currentChapter={0} />
      <p>
        Смотри, какая <TV video="dQw4w9WgXcQ">нелепая схема</TV>, — мне бросилась в глаза книжечка
        на стенде, в котором обычно продавались путеводители и карты. Только эта книга отличалась от
        других. В отличие от нормальных карт, она была нарисована руки и вместо городов на ней были
        изображены какие-то странные предметы: унитаз, кегли от боулинга, точилка для карандашей.
      </p>
      {/* Finder */}
      <FullWidth style={{ maxWidth: "1000px" }}>
        <CompassFinder fieldImg={finderMock} fieldImgDimensions={[1330, 568]}>
          <HiddenSecret x={0.75} y={0.2} image={finderMock} debug />
          <HiddenSecret x={0.25} y={0.2} image={finderMock} debug />
          <HiddenSecret x={0.9} y={0.35} image={finderMock} debug />
        </CompassFinder>
      </FullWidth>
      <br />
      <br />
      <HouseBuilder />
      <SlurredSpeech>
        Смотри, какая нелепая схема, — мне бросилась в глаза книжечка на стенде, в котором обычно
        продавались путеводители и карты. Только эта книга отличалась от других. В отличие от
        нормальных карт, она была нарисована руки и вместо городов на ней были изображены какие-то
        странные предметы: унитаз, кегли от боулинга, точилка для карандашей.
      </SlurredSpeech>
      of emotions a person can experience: <Emotion feeling="happiness">happiness</Emotion> and
      <br />
      You can only <TV video="dQw4w9WgXcQ">see this</TV> in dev environment! There are whole variety
      sadness
      <p>
        Что ж, всё оказалось не так плохо, как я думал.{" "}
        <Spoiler hidden={!revealSpoiler} onClick={() => setRevealSpoiler((t) => !t)}>
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
