import { useEffect, useRef, useState } from "react";
import burgerLogoImg from "../assets/img/burger-logo.svg";
import chevronImg from "../assets/img/chevron.svg";
import closeIconImg from "../assets/img/ic_X_mark.svg";
import burgerIconImg from "../assets/img/ic_burger2.svg";
import checkIconImg from "../assets/img/ic_check.svg";
import languageIconImg from "../assets/img/ic_language.svg";
import logoImg from "../assets/img/Logo.svg";

const NAV_ITEMS = [
  { label: "Контакты", href: "#contacts" },
  { label: "Результаты", href: "#results" },
  { label: "Состав", href: "#composition" },
  { label: "Отзывы", href: "#reviews" },
  { label: "Вопросы", href: "#questions" },
  { label: "О нас", href: "#about" },
];

const LANGUAGES = ["Русский", "English", "Uzbek"];

export default function Navbar({ textColor = "white" }) {
  const [openLang, setOpenLang] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [activeLang, setActiveLang] = useState("Русский");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoverOffsets, setHoverOffsets] = useState({});
  const langRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setOpenLang(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!openMenu) {
      document.body.style.overflow = "";
      return undefined;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [openMenu]);

  const resetNavHover = () => {
    setHoveredIndex(null);
    setHoverOffsets({});
  };

  const handleSelectLanguage = (lang) => {
    setActiveLang(lang);
    setOpenLang(false);
  };

  const handleNavMove = (index, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 8;

    setHoverOffsets((current) => ({
      ...current,
      [index]: {
        x: offsetX,
        y: offsetY,
      },
    }));
  };

  const desktopTextColor =
    textColor === "dark" ? "text-[#0B0B0B]" : "text-[#FFFFFF]";
  const activeLanguageIndex = LANGUAGES.indexOf(activeLang);

  return (
    <div className="relative z-[200] flex items-center justify-between bg-transparent px-4 pt-4 lg:px-0 lg:pt-12">
      <img
        className="h-[24px] w-[149px] lg:h-auto lg:w-auto"
        src={logoImg}
        alt="MIO BEAUTY"
      />

      <ul
        className={`hidden cursor-pointer items-center gap-10 text-sm font-medium lg:flex ${desktopTextColor}`}
      >
        {NAV_ITEMS.map((item, index) => {
          const offset = hoverOffsets[index] ?? { x: 0, y: 0 };
          const isHovered = hoveredIndex === index;

          return (
            <li
              key={item.href}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={resetNavHover}
              onMouseMove={(event) => handleNavMove(index, event)}
            >
              <a
                href={item.href}
                onClick={resetNavHover}
                className="relative block transition-transform duration-300 ease-out"
                style={{
                  transform: isHovered
                    ? `translate3d(${offset.x}px, ${offset.y}px, 0)`
                    : "translate3d(0, 0, 0)",
                }}
              >
                {item.label}
              </a>

              <span
                className="pointer-events-none absolute left-1/2 top-full mt-3 h-1.5 w-1.5 rounded-full bg-current transition-all duration-300 ease-out"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered
                    ? `translate3d(calc(-50% + ${offset.x * 0.65}px), ${offset.y * 0.4}px, 0) scale(1)`
                    : "translate3d(-50%, -4px, 0) scale(0.4)",
                }}
              />
            </li>
          );
        })}

        <li className="relative" ref={langRef}>
          <button
            type="button"
            className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
            onClick={() => setOpenLang((prev) => !prev)}
            aria-expanded={openLang}
            aria-label="Select language"
          >
            <img
              src={languageIconImg}
              alt=""
              className={`transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${openLang ? "scale-95" : "scale-100"}`}
            />
          </button>

          <div
            className={`absolute right-0 top-full z-50 mt-3 w-44 origin-top-right overflow-hidden rounded-[20px] bg-white/95 p-2 shadow-[0_18px_44px_rgba(18,18,18,0.16)] ring-1 ring-black/5 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              openLang
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-3 scale-[0.78] opacity-0"
            }`}
            style={{
              transformOrigin: "calc(100% - 18px) 0%",
            }}
          >
            {LANGUAGES.map((lang, index) => {
              const isActive = activeLang === lang;

              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm transition-colors duration-200 ${
                    isActive
                      ? "bg-black/[0.04] text-[#0B0B0B]"
                      : "text-[#0B0B0B] hover:bg-black/[0.03]"
                  }`}
                  style={{
                    opacity: openLang ? 1 : 0,
                    transform: openLang
                      ? "translate3d(0, 0, 0)"
                      : "translate3d(0, -8px, 0)",
                    transition:
                      "opacity 320ms cubic-bezier(0.22,1,0.36,1), transform 320ms cubic-bezier(0.22,1,0.36,1)",
                    transitionDelay: openLang ? `${index * 55}ms` : "0ms",
                  }}
                >
                  <span>{lang}</span>
                  {isActive && <img src={checkIconImg} alt="" />}
                </button>
              );
            })}
          </div>
        </li>
      </ul>

      <button
        type="button"
        className="block cursor-pointer lg:hidden"
        onClick={() => setOpenMenu(true)}
        aria-label="Open menu"
      >
        <img src={burgerIconImg} alt="" />
      </button>

      <div
        onClick={() => setOpenMenu(false)}
        className={`fixed inset-0 z-[900] bg-black/40 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          openMenu
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`fixed top-0 right-0 z-[1000] flex h-[100dvh] w-full flex-col justify-between bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          openMenu
            ? "pointer-events-auto translate-x-0"
            : "pointer-events-none translate-x-full"
        }`}
      >
        <div className="flex h-full min-h-0 flex-col justify-between overflow-hidden">
          <div className="min-h-0 flex-1 overflow-hidden">
            <div className="flex justify-between px-4 pb-4 pt-[max(16px,env(safe-area-inset-top))]">
              <img src={burgerLogoImg} alt="" />

              <button
                type="button"
                onClick={() => setOpenMenu(false)}
                aria-label="Close menu"
              >
                <img src={closeIconImg} alt="" />
              </button>
            </div>

            <ul className="flex flex-col px-4">
              {NAV_ITEMS.map((item, index) => (
                <li
                  key={item.href}
                  style={{
                    opacity: openMenu ? 1 : 0,
                    transform: openMenu
                      ? "translate3d(0, 0, 0)"
                      : "translate3d(42px, 0, 0)",
                    transition:
                      "opacity 420ms cubic-bezier(0.22,1,0.36,1), transform 420ms cubic-bezier(0.22,1,0.36,1)",
                    transitionDelay: openMenu ? `${110 + index * 55}ms` : "0ms",
                  }}
                >
                  <a
                    href={item.href}
                    onClick={() => {
                      resetNavHover();
                      setOpenMenu(false);
                    }}
                    className="flex items-center justify-between py-4"
                  >
                    <span className="text-sm text-[#0B0B0B]">{item.label}</span>
                    <img src={chevronImg} alt="" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="shrink-0 px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-6"
            style={{
              opacity: openMenu ? 1 : 0,
              transform: openMenu
                ? "translate3d(0, 0, 0)"
                : "translate3d(32px, 0, 0)",
              transition:
                "opacity 380ms cubic-bezier(0.22,1,0.36,1), transform 380ms cubic-bezier(0.22,1,0.36,1)",
              transitionDelay: openMenu ? "260ms" : "0ms",
            }}
          >
            <div className="relative">
              <div
                className="pointer-events-none absolute bottom-0 left-0 flex w-1/3 justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: `translateX(${activeLanguageIndex * 100}%)`,
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#2D241B]" />
              </div>

              <ul className="relative grid grid-cols-3 pb-4 text-[16px] font-semibold">
                {LANGUAGES.map((lang) => (
                  <li key={lang}>
                    <button
                      type="button"
                      onClick={() => handleSelectLanguage(lang)}
                      className={`relative z-10 w-full px-3 py-2 text-center text-[15px] tracking-[-0.02em] transition-colors duration-300 ${
                        activeLang === lang ? "text-[#2D241B]" : "text-[#8D7B6A]"
                      }`}
                    >
                      {lang}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
