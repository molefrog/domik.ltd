import { useRouter, useParams, Route, Switch, useRoute } from "wouter";
import { PropsWithChildren, ReactNode, createContext, useContext } from "react";
import { useI18n } from "./i18n";

const LOCALES = ["en", "ru"] as const;
const DEFAULT_LOCALE = "en";

type Locale = (typeof LOCALES)[number];

const LocaleCtx = createContext<Locale>("en");

export const useLocale = () => useContext(LocaleCtx);

const WithLocale = ({ children, locale }: PropsWithChildren<{ locale: Locale }>) => {
  // setup I18n with the provided locale, so that all translations are updated
  const i18n = useI18n();
  if (i18n.locale() !== locale) i18n.locale(locale);

  return <LocaleCtx.Provider value={locale} children={children} />;
};

/**
 * Extracts locale from the URL and creates a nested route
 */
export const RoutesWithLocale = ({ children }: { children: ReactNode }) => {
  const [, params] = useRoute("/:locale?/*");
  const locale = params?.locale as Locale;

  if (LOCALES.includes(locale)) {
    return (
      <Route path={`/:${locale}`} nest>
        <WithLocale locale={locale} children={children} />
      </Route>
    );
  } else {
    // not a valid locale
    return <WithLocale locale={DEFAULT_LOCALE} children={children} />;
  }
};
