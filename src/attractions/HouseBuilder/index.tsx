import { Suspense, lazy, useRef, useState, useEffect } from "react";
import styled from "@emotion/styled";
import useIntersectionObserver from "@react-hook/intersection-observer";

import { InteractionBadge } from "~/components/InteractionBadge";
import { Loading } from "./Loading";

const LazyHouseBuilder = lazy(() => import("./HouseBuilder"));

export const HouseBuilder = () => {
  const ref = useRef<HTMLDivElement>(null);

  /*
   * Start loading everything just before a user sees that component
   */
  const [shouldRender, setShouldRender] = useState(false);
  const { isIntersecting } = useIntersectionObserver(ref, {
    rootMargin: "1024px 0px 1024px 0px",
  });

  useEffect(() => {
    if (isIntersecting) setShouldRender(true);
  }, [isIntersecting]);

  return (
    <InteractionBadge>
      <Container ref={ref}>
        {shouldRender ? (
          <Suspense fallback={<Loading />}>
            <LazyHouseBuilder />
          </Suspense>
        ) : (
          <Loading />
        )}
      </Container>
    </InteractionBadge>
  );
};

/**
 * Styles
 */

const Container = styled.div`
  position: relative;
  background: var(--color-embossed);
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1 / 1;

  @supports not (aspect-ratio: 1 / 1) {
    height: 420px;
  }
`;
