import { Suspense, lazy } from "react";
import styled from "@emotion/styled";

import { InteractionBadge } from "~/components/InteractionBadge";
import { Loading } from "./Loading";

const LazyHouseBuilder = lazy(() => import("./HouseBuilder"));

export const HouseBuilder = () => {
  return (
    <Suspense
      fallback={
        <Container>
          <Loading />
        </Container>
      }
    >
      <InteractionBadge>
        <Container>
          <LazyHouseBuilder />
        </Container>
      </InteractionBadge>
    </Suspense>
  );
};

/**
 * Styles
 */

const Container = styled.div`
  position: relative;
  background: var(--color-embossed);
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
`;
