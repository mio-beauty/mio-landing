import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import heroImg from "../assets/img/banner.jpg";
import heroImg2 from "../assets/img/hero2.png";
import Navbar from "../components/Navbar.jsx";
import { useI18n } from "../i18n/I18nProvider.jsx";

export default function HomeSection() {
  const { t, get, numberLocale } = useI18n();
  const categories = get("home.categories", []);
  const stats = get("home.stats", []);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const formatCount = (value) => value.toLocaleString(numberLocale);

  return (
    <section className="bg-[#FFFFFF]">
      <div className="relative lg:h-screen">
        <div className="relative min-h-[100dvh] overflow-hidden lg:min-h-screen lg:bg-[#D0C1AD]">
          <div className="absolute inset-0 lg:hidden">
            <img
              src={heroImg2}
              alt=""
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="h-[100dvh] w-full object-cover object-top"
            />
          </div>

          <div className="absolute inset-0 hidden lg:block">
            <img
              src={heroImg}
              alt=""
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-right"
            />
          </div>

          <div className="relative z-[20] lg:px-36">
            <Navbar textColor="dark" />
          </div>

          <div
            className={`absolute inset-x-0 bottom-0 z-[1] px-4 pb-6 text-[#0B0B0B] transition-[opacity,transform] duration-700 ease-out lg:inset-auto lg:left-0 lg:top-1/2 lg:-translate-y-[56%] lg:px-36 lg:pb-0 lg:text-[#5F5A56] ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="flex max-w-[320px] flex-wrap gap-2 lg:max-w-none lg:gap-3">
              {categories.map((item) => (
                <button
                  key={item}
                  className="rounded-full border border-black/10 bg-white/82 px-3 py-1 text-[14px] font-medium text-[#0B0B0B] shadow-[0_10px_30px_rgba(80,72,63,0.08)] backdrop-blur-sm lg:border-0 lg:bg-white lg:px-2 lg:text-[16px] lg:text-[#4D4742] lg:backdrop-blur-none"
                >
                  {item}
                </button>
              ))}
            </div>

            <h1 className="max-w-[820px] py-4 text-[28px] leading-[0.96] font-normal text-[#0B0B0B] sm:text-[34px] lg:pt-6 lg:text-[59px] lg:text-[#3E3935]">
              {t("home.title")}
            </h1>

            <p className="max-w-[460px] pt-1 text-[15px] leading-[120%] font-normal text-[#343434] sm:text-[17px] lg:pt-2.5 lg:text-[20px] lg:text-[#6A645E]">
              {t("home.subtitleTop")}
            </p>

            <p className="max-w-[460px] text-[15px] leading-[120%] font-normal text-[#343434] sm:text-[17px] lg:text-[20px] lg:text-[#6A645E]">
              {t("home.subtitleBottom")}
            </p>

            <div className="pt-5 lg:hidden">
              <button className="flex h-[54px] w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-[#0B0B0B] px-4 text-[17px] font-medium text-white shadow-[0_14px_34px_rgba(11,11,11,0.18)]">
                {t("home.cta")} <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div
            className={`hidden transition-[opacity,transform] duration-700 ease-out lg:absolute lg:inset-x-0 lg:bottom-6 lg:z-[1] lg:flex lg:flex-col lg:gap-6 lg:px-36 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }`}
          >
            <div className="flex items-center gap-2 text-[#4D4742]">
              {stats.map((item, index) => (
                <div
                  key={`${item.text}-${index}`}
                  className="h-[156px] w-[33.333%] rounded-3xl  bg-[#fff]/60 p-6 text-[#4D4742] shadow-[0_14px_34px_rgba(145,124,104,0.08)]"
                >
                  <h3 className="text-5xl leading-[110%] font-normal text-[#3E3935] lg:text-7xl">
                    {formatCount(item.value)}
                    {item.suffix}
                  </h3>

                  <p className="mt-2 text-[16px] leading-5 font-medium text-[#6A645E]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <button className="flex h-[46px] w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-white px-4 text-[16px] font-medium text-[#0B0B0B]">
                {t("home.cta")} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white px-5 pb-6 pt-10 lg:hidden">
          <div className="flex flex-col gap-10">
            {stats.map((item, index) => (
              <div key={`${item.text}-${index}`} className="text-[#111111]">
                <h3 className="text-[48px] leading-[0.95] font-normal">
                  {formatCount(item.value)}
                  {item.suffix}
                </h3>

                <p className="mt-3 max-w-[240px] text-[15px] leading-[1.25] font-normal">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
