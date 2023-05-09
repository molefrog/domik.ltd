import { useLocation, Router, useRouter } from "wouter";
import { ReactNode, createContext, useContext } from "react";

const LocaleContext = createContext<Locale>("en");

export type Locale = "en" | "ru";

export const useLocale = () => useContext(LocaleContext);

const DEFAULT_LOCALE = "ru";

/**
 * Extracts locale from the URL and creates a nested router context
 */
export const RoutesWithLocale = ({ children }: { children: ReactNode }) => {
  const [location] = useLocation();
  const [, locale] = /^\/(ru|en)/i.exec(location) ?? [];

  const currentLocale = (locale ?? DEFAULT_LOCALE).toLowerCase() as Locale;
  const routerBase = locale ? `/${locale}` : ""; // all nested routes will be relative to /:locale

  return (
    <LocaleContext.Provider value={currentLocale}>
      <Router base={routerBase} parent={useRouter()}>
        {children}
      </Router>
    </LocaleContext.Provider>
  );
};
