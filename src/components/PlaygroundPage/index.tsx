import styled from "@emotion/styled";
import { useRef, useState, useCallback } from "react";

import { TV } from "~/attractions/TV";
import { ConnectTheDots } from "~/attractions/ConnectTheDots";
import mapImage from "~/chapters/3-three/map.webp";

export default function PlaygroundPage() {
  return (
    <Container>
      You can only <TV video="dQw4w9WgXcQ">see this</TV> in dev environment!
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
