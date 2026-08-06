import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "./locales/en.json";
import ru from "./locales/ru.json";
import uz from "./locales/uz.json";

const STORAGE_KEY = "mio-language";
const DEFAULT_LANGUAGE = "uz";
const SUPPORTED_LANGUAGES = ["uz", "ru", "en"];

const resources = {
  uz,
  ru,
  en,
};

const I18nContext = createContext(null);

function getNestedValue(source, path) {
  return path.split(".").reduce((current, key) => current?.[key], source);
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_LANGUAGE;

    const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(storedLanguage)
      ? storedLanguage
      : DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const dictionary = resources[language] ?? resources[DEFAULT_LANGUAGE];

    return {
      language,
      languages: SUPPORTED_LANGUAGES,
      setLanguage,
      t(path, fallback = "") {
        const result = getNestedValue(dictionary, path);
        return typeof result === "string" ? result : fallback;
      },
      get(path, fallback = null) {
        const result = getNestedValue(dictionary, path);
        return result ?? fallback;
      },
      numberLocale:
        language === "ru" ? "ru-RU" : language === "en" ? "en-US" : "uz-UZ",
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
