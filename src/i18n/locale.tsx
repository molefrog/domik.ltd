import { useRouter, useParams, Route, Switch } from "wouter";
import { ReactNode, createContext, useContext } from "react";
import { useI18n } from "./i18n";

const LocaleContext = createContext<Locale>("en");

export type Locale = "en" | "ru";

export const useLocale = () => useContext(LocaleContext);

const DEFAULT_LOCALE = "en";

export const ExtractLocale = (props: { locale?: Locale; children: ReactNode }) => {
  // TODO: use `useParams` when wouter ships named params with constraints
  const paramLocale = useRouter().base.replace("/", "").toLowerCase() as Locale;
  const locale: Locale = props.locale ?? paramLocale;

  const i18n = useI18n();
  if (i18n.locale() !== locale) i18n.locale(locale);

  return <LocaleContext.Provider value={locale}>{props.children}</LocaleContext.Provider>;
};

/**
 * Extracts locale from the URL and creates a nested route
 */
export const RoutesWithLocale = ({ children }: { children: ReactNode }) => {
  return (
    <Switch>
      <Route path="/(ru|en)" nest>
        <ExtractLocale>{children}</ExtractLocale>
      </Route>

      <Route>
        <ExtractLocale locale={DEFAULT_LOCALE}>{children}</ExtractLocale>
      </Route>
    </Switch>
  );
};
