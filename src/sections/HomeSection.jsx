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
  const [animatedStats, setAnimatedStats] = useState([]);

  useEffect(() => {
    let fallbackId = 0;

    const revealHome = () => {
      setIsVisible(true);
    };

    if (document.querySelector(".loading-intro")) {
      window.addEventListener("mio:intro-complete", revealHome, { once: true });
      fallbackId = window.setTimeout(revealHome, 5200);
    } else {
      fallbackId = window.setTimeout(revealHome, 120);
    }

    return () => {
      window.clearTimeout(fallbackId);
      window.removeEventListener("mio:intro-complete", revealHome);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let lastWidth = window.innerWidth;

    const setStableMobileHeroHeight = () => {
      document.documentElement.style.setProperty(
        "--mio-mobile-hero-height",
        `${window.innerHeight}px`,
      );
    };

    const handleViewportResize = () => {
      const nextWidth = window.innerWidth;

      if (Math.abs(nextWidth - lastWidth) < 24) {
        return;
      }

      lastWidth = nextWidth;
      setStableMobileHeroHeight();
    };

    setStableMobileHeroHeight();
    window.addEventListener("resize", handleViewportResize);
    window.addEventListener("orientationchange", setStableMobileHeroHeight);

    return () => {
      window.removeEventListener("resize", handleViewportResize);
      window.removeEventListener("orientationchange", setStableMobileHeroHeight);
    };
  }, []);

  useEffect(() => {
    if (!stats.length) {
      return undefined;
    }

    if (!isVisible) {
      return undefined;
    }

    let frameId = 0;
    const duration = 1500;
    const startTime = performance.now();
    const easeOut = (value) => 1 - Math.pow(1 - value, 3);

    const tick = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = easeOut(progress);

      setAnimatedStats(
        stats.map((item) => Math.round(item.value * easedProgress)),
      );

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isVisible, stats]);

  const formatCount = (value) => value.toLocaleString(numberLocale);

  return (
    <section className="bg-[#FFFFFF]">
      <div className="relative lg:h-screen">
        <div className="relative min-h-[var(--mio-mobile-hero-height,100svh)] overflow-hidden lg:min-h-screen lg:bg-[#D0C1AD]">
          <div className="absolute inset-0 lg:hidden">
            <img
              src={heroImg2}
              alt=""
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="h-[var(--mio-mobile-hero-height,100svh)] w-full object-cover object-top"
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

          <div
            className="relative z-[20] lg:px-36"
          >
            <Navbar textColor="dark" reveal={isVisible} />
          </div>

          <div
            className={`absolute inset-x-0 bottom-0 z-[1] px-4 pb-6 text-[#0B0B0B] transition-[opacity,transform] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] lg:inset-auto lg:left-0 lg:top-1/2 lg:-translate-y-[56%] lg:px-36 lg:pb-0 lg:text-[#5F5A56] ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "-translate-y-[10px] opacity-0"
            }`}
          >
            <div className="rounded-[24px] bg-white/78 p-3.5 shadow-[0_18px_48px_rgba(38,31,25,0.14)] backdrop-blur-md sm:max-w-[440px] sm:p-4 lg:max-w-none lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
            <div className="flex max-w-[320px] flex-wrap gap-1.5 lg:max-w-none lg:gap-3">
              {categories.map((item, index) => (
                <button
                  key={item}
                  className="rounded-full border border-black/10 bg-white/82 px-2.5 py-1 text-[12px] font-medium text-[#0B0B0B] shadow-[0_10px_30px_rgba(80,72,63,0.08)] backdrop-blur-sm sm:text-[13px] lg:border-0 lg:bg-white lg:px-2 lg:text-[16px] lg:text-[#4D4742] lg:backdrop-blur-none"
                  style={{
                    transition:
                      "opacity 560ms cubic-bezier(0.22,1,0.36,1), transform 560ms cubic-bezier(0.22,1,0.36,1)",
                    transitionDelay: isVisible ? `${120 + index * 55}ms` : "0ms",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? "translate3d(0, 0, 0)"
                      : "translate3d(0, -10px, 0)",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>

            <h1
              className="max-w-[820px] pb-2.5 pt-3 text-[25px] leading-[1.02] font-normal text-[#0B0B0B] sm:text-[31px] lg:pb-4 lg:pt-6 lg:text-[59px] lg:leading-[0.96] lg:text-[#3E3935]"
              style={{
                transition:
                  "opacity 760ms cubic-bezier(0.22,1,0.36,1), transform 760ms cubic-bezier(0.22,1,0.36,1)",
                transitionDelay: isVisible ? "220ms" : "0ms",
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translate3d(0, 0, 0)"
                  : "translate3d(0, -10px, 0)",
              }}
            >
              <span className="block font-medium text-[#0B0B0B] lg:text-[#2F2A26]">
                {t("home.titleLead")}
              </span>
              <span className="block pt-1 text-[#3C3733] lg:inline lg:pt-0 lg:text-[#5F5A56]">
                {t("home.titleRest")}
              </span>
            </h1>

            <p
              className="max-w-[460px] pt-0 text-[13.5px] leading-[1.24] font-normal text-[#343434] sm:text-[16px] lg:pt-2.5 lg:text-[20px] lg:leading-[120%] lg:text-[#6A645E]"
              style={{
                transition:
                  "opacity 640ms cubic-bezier(0.22,1,0.36,1), transform 640ms cubic-bezier(0.22,1,0.36,1)",
                transitionDelay: isVisible ? "360ms" : "0ms",
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translate3d(0, 0, 0)"
                  : "translate3d(0, -10px, 0)",
              }}
            >
              {t("home.subtitleTop")}
            </p>

            <p
              className="max-w-[460px] text-[13.5px] leading-[1.24] font-normal text-[#343434] sm:text-[16px] lg:text-[20px] lg:leading-[120%] lg:text-[#6A645E]"
              style={{
                transition:
                  "opacity 640ms cubic-bezier(0.22,1,0.36,1), transform 640ms cubic-bezier(0.22,1,0.36,1)",
                transitionDelay: isVisible ? "430ms" : "0ms",
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translate3d(0, 0, 0)"
                  : "translate3d(0, -10px, 0)",
              }}
            >
              {t("home.subtitleBottom")}
            </p>

            <div
              className="pt-4 lg:hidden"
              style={{
                transition:
                  "opacity 640ms cubic-bezier(0.22,1,0.36,1), transform 640ms cubic-bezier(0.22,1,0.36,1)",
                transitionDelay: isVisible ? "520ms" : "0ms",
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translate3d(0, 0, 0)"
                  : "translate3d(0, -10px, 0)",
              }}
            >
              <a
                href="#contact"
                className="flex h-[48px] w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-[#0B0B0B] px-4 text-[15.5px] font-medium text-white shadow-[0_14px_34px_rgba(11,11,11,0.18)]"
              >
                {t("home.cta")} <ArrowRight size={18} />
              </a>
            </div>
            </div>
          </div>

          <div
            className={`hidden transition-[opacity,transform] duration-700 ease-out lg:absolute lg:inset-x-0 lg:bottom-6 lg:z-[1] lg:flex lg:flex-col lg:gap-6 lg:px-36 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "-translate-y-[10px] opacity-0"
            }`}
          >
            <div className="flex items-center gap-2 text-[#4D4742]">
              {stats.map((item, index) => (
                <div
                  key={`${item.text}-${index}`}
                  className="h-[156px] w-[33.333%] rounded-3xl  bg-[#fff]/60 p-6 text-[#4D4742] shadow-[0_14px_34px_rgba(145,124,104,0.08)]"
                >
                  <h3 className="text-5xl leading-[110%] font-normal text-[#3E3935] lg:text-7xl">
                    {formatCount(animatedStats[index] ?? 0)}
                    {item.suffix}
                  </h3>

                  <p className="mt-2 text-[16px] leading-5 font-medium text-[#6A645E]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <a
                href="#contact"
                className="flex h-[46px] w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-white px-4 text-[16px] font-medium text-[#0B0B0B]"
              >
                {t("home.cta")} <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white px-5 pb-6 pt-10 lg:hidden">
          <div className="flex flex-col gap-10">
            {stats.map((item, index) => (
              <div key={`${item.text}-${index}`} className="text-[#111111]">
                <h3 className="text-[48px] leading-[0.95] font-normal">
                    {formatCount(animatedStats[index] ?? 0)}
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
