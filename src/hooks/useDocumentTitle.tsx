import { useEffect, useRef } from "react";

export function useDocumentTitle(title: string): void {
  const prev = useRef<string>();

  // restore the original title on mount
  useEffect(() => {
    return () => {
      document.title = String(prev.current);
    };
  }, []);

  useEffect(() => {
    if (prev.current == undefined) {
      prev.current = document.title;
    }

    document.title = title;
  }, [title]);
}
