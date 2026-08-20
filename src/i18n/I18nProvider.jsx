import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const [language, setLanguageState] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_LANGUAGE;

    const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(storedLanguage)
      ? storedLanguage
      : DEFAULT_LANGUAGE;
  });
  const pendingScrollRef = useRef(null);

  const setLanguage = useCallback((nextLanguage) => {
    if (typeof window !== "undefined") {
      const scrollY = window.scrollY;
      const distanceFromBottom =
        document.documentElement.scrollHeight - scrollY - window.innerHeight;

      pendingScrollRef.current = {
        scrollY,
        distanceFromBottom,
      };
    }

    setLanguageState(nextLanguage);
  }, []);

  useLayoutEffect(() => {
    const pendingScroll = pendingScrollRef.current;
    if (pendingScroll === null || typeof window === "undefined") return;

    const restoreScroll = () => {
      const isNearBottom = pendingScroll.distanceFromBottom < 24;
      const targetY = isNearBottom
        ? Math.max(
            0,
            document.documentElement.scrollHeight -
              window.innerHeight -
              pendingScroll.distanceFromBottom,
          )
        : pendingScroll.scrollY;

      globalThis.__mioLenis?.scrollTo(targetY, { immediate: true });
      window.scrollTo(0, targetY);
    };

    restoreScroll();
    const frameId = window.requestAnimationFrame(restoreScroll);
    pendingScrollRef.current = null;

    return () => window.cancelAnimationFrame(frameId);
  }, [language, setLanguage]);

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
  }, [language, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
