import { useEffect, useRef, useState } from "react";

export default function Navbar({ textColor = "white" }) {
  const [openLang, setOpenLang] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [activeLang, setActiveLang] = useState("Русский");
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

  const handleSelectLanguage = (lang) => {
    setActiveLang(lang);
    setOpenLang(false);
  };

  return (
    <div className="flex justify-between items-center lg:pt-12 pt-4 lg:px-0 px-4 bg-transparent relative">
      <img
        className="w-37.25 h-6 lg:w-auto lg:h-auto"
        src={
          textColor === "dark"
            ? "/src/assets/imags/Logo-dark.svg"
            : "/src/assets/imags/Logo.svg"
        }
        alt="MIO BEAUTY"
      />

      <ul
        className={`hidden lg:flex items-center gap-10 text-sm font-medium cursor-pointer ${
          textColor === "dark" ? "text-[#0B0B0B]" : "text-[#FFFFFF]"
        }`}
      >
        <li>Контакты</li>
        <li>Результаты</li>
        <li>Состав</li>
        <li>Отзывы</li>
        <li>Вопросы</li>
        <li>О нас</li>

        <li className="relative" ref={langRef}>
          <img
            src={
              textColor === "dark"
                ? "/src/assets/imags/ic_language-dark.svg"
                : "/src/assets/imags/ic_language.svg"
            }
            alt="Translate"
            className="cursor-pointer"
            onClick={() => setOpenLang((prev) => !prev)}
          />

          <div
            className={`absolute right-0 mt-3 w-40 rounded-2xl p-4 bg-white z-50 flex flex-col gap-2
            transition-all duration-200 ease-out origin-top shadow-[0_0_24px_rgba(41,42,53,0.1)]
            ${
              openLang
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            <div
              onClick={() => handleSelectLanguage("Русский")}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="text-sm text-[#0B0B0B]">Русский</span>
              {activeLang === "Русский" && (
                <img src="/src/assets/imags/ic_check.svg" alt="" />
              )}
            </div>

            <div
              onClick={() => handleSelectLanguage("English")}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="text-sm text-[#0B0B0B]">English</span>
              {activeLang === "English" && (
                <img src="/src/assets/imags/ic_check.svg" alt="" />
              )}
            </div>

            <div
              onClick={() => handleSelectLanguage("Uzbek")}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="text-sm text-[#0B0B0B]">Uzbek</span>
              {activeLang === "Uzbek" && (
                <img src="/src/assets/imags/ic_check.svg" alt="" />
              )}
            </div>
          </div>
        </li>
      </ul>

      <img
        src={
          textColor === "dark"
            ? "/src/assets/imags/ic_burger2-dark.svg"
            : "/src/assets/imags/ic_burger2.svg"
        }
        alt="Menu"
        className="block lg:hidden cursor-pointer"
        onClick={() => setOpenMenu(true)}
      />

      <div
        onClick={() => setOpenMenu(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${
          openMenu
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 right-0 w-full h-screen flex flex-col justify-between bg-white lg:hidden z-50
        transform transition-transform duration-300 ease-in-out
        ${openMenu ? "translate-x-0" : "translate-x-full pointer-events-none"}`}
      >
        <div>
          <div className="flex justify-between px-4 py-4">
            <img src="/src/assets/imags/burger-logo.svg" alt="" />

            <img
              src="/src/assets/imags/ic_X_mark.svg"
              alt="Close"
              className="cursor-pointer"
              onClick={() => setOpenMenu(false)}
            />
          </div>

          <ul className="flex flex-col px-4">
            <li className="flex items-center justify-between py-4">
              <span className="text-[#0B0B0B] text-sm">Контакты</span>
              <img src="/src/assets/imags/chevron.svg" alt="" />
            </li>

            <li className="flex items-center justify-between py-4">
              <span className="text-[#0B0B0B] text-sm">Результаты</span>
              <img src="/src/assets/imags/chevron.svg" alt="" />
            </li>

            <li className="flex items-center justify-between py-4">
              <span className="text-[#0B0B0B] text-sm">Состав</span>
              <img src="/src/assets/imags/chevron.svg" alt="" />
            </li>

            <li className="flex items-center justify-between py-4">
              <span className="text-[#0B0B0B] text-sm">Отзывы</span>
              <img src="/src/assets/imags/chevron.svg" alt="" />
            </li>

            <li className="flex items-center justify-between py-4">
              <span className="text-[#0B0B0B] text-sm">Вопросы</span>
              <img src="/src/assets/imags/chevron.svg" alt="" />
            </li>

            <li className="flex items-center justify-between py-5">
              <span className="text-[#0B0B0B] text-sm">О нас</span>
              <img src="/src/assets/imags/chevron.svg" alt="" />
            </li>
          </ul>
        </div>

        <ul className="flex justify-center font-semibold gap-14 text-[16px] py-6">
          <li
            onClick={() => handleSelectLanguage("Русский")}
            className={`cursor-pointer ${
              activeLang === "Русский" ? "text-[#131314]" : "text-[#C4C4CC]"
            }`}
          >
            Русский
          </li>

          <li
            onClick={() => handleSelectLanguage("English")}
            className={`cursor-pointer ${
              activeLang === "English" ? "text-[#131314]" : "text-[#C4C4CC]"
            }`}
          >
            English
          </li>

          <li
            onClick={() => handleSelectLanguage("Uzbek")}
            className={`cursor-pointer ${
              activeLang === "Uzbek" ? "text-[#131314]" : "text-[#C4C4CC]"
            }`}
          >
            Uzbek
          </li>
        </ul>
      </div>
    </div>
  );
}
