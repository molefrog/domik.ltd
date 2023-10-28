import { useLocation, Router } from "wouter";
import { ReactNode, createContext, useContext } from "react";
import { useI18n } from "./i18n";

const LocaleContext = createContext<Locale>("en");

export type Locale = "en" | "ru";

export const useLocale = () => useContext(LocaleContext);

const DEFAULT_LOCALE = "en";

/**
 * Extracts locale from the URL and creates a nested router context
 */
export const RoutesWithLocale = ({ children }: { children: ReactNode }) => {
  const [location] = useLocation();
  const [, locale] = /^\/(ru|en)/i.exec(location) ?? [];

  const currentLocale = (locale ?? DEFAULT_LOCALE).toLowerCase() as Locale;
  const routerBase = locale ? `/${locale}` : ""; // all nested routes will be relative to /:locale

  const i18n = useI18n();
  if (i18n.locale() !== currentLocale) i18n.locale(currentLocale);

  return (
    <LocaleContext.Provider value={currentLocale}>
      <Router key={currentLocale} base={routerBase}>
        {children}
      </Router>
    </LocaleContext.Provider>
  );
};
