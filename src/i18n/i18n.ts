import { createContext, useContext } from "react";
import rosetta, { type Rosetta } from "rosetta";
import { en, ru } from "./translations";

export const i18n = rosetta({ en });

// set up translations
i18n.set("ru", ru);

const I18nContext = createContext(i18n);

export const useI18n = () => useContext(I18nContext);
