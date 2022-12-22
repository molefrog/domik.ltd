import React, { useLayoutEffect, useRef, useState } from "react";
import useEvent from "react-use-event-hook";

export const useIsInViewport = (ref: React.RefObject<HTMLElement>): boolean => {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver>();

  const observerCallback = useEvent((entries: IntersectionObserverEntry[]) => {
    const isIntersecting = Boolean(entries[0]?.isIntersecting);
    if (isVisible !== isIntersecting) setIsVisible(isIntersecting);
  });

  useLayoutEffect(() => {
    const elementToIntersect = ref.current;

    if (typeof IntersectionObserver === "undefined" || !elementToIntersect) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(observerCallback, { threshold: 0.0 });
    observerRef.current = observer;
    observer.observe(elementToIntersect);

    return () => {
      observer.unobserve(elementToIntersect);
      observer.disconnect();
      observerRef.current = undefined;
    };
  }, []);

  return isVisible;
};
