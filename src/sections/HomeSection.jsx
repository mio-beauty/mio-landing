import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import heroImg from "../assets/img/hero-img.png";
import heroImg2 from "../assets/img/hero2.png";

export default function HomeSection() {
  const categories = ["АКНЕ", "ПИГМЕНТАЦИЯ", "СУХОСТЬ", "ЧУВСТВИТЕЛЬНОСТЬ"];

  const stats = [
    { value: 100000, text: "Клиентов выбрали MIO Beauty", suffix: "+" },
    { value: 92, text: "Клиентов возвращаются снова", suffix: "%" },
    { value: 300, text: "Заказов доставляем в день заказа", suffix: "+" },
  ];

  const mobileStatsRef = useRef(null);
  const desktopStatsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 },
    );

    const targets = [mobileStatsRef.current, desktopStatsRef.current].filter(Boolean);
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return undefined;

    let frameId = 0;
    const durationMs = 1400;
    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = easeOutCubic(progress);

      setCounts(stats.map((item) => Math.round(item.value * eased)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [hasAnimated]);

  const formatCount = (value) => value.toLocaleString("ru-RU");

  return (
    <section className="bg-[#FFFFFF]">
      <div className="relative lg:h-screen">
        <div className="relative min-h-[100dvh] overflow-hidden lg:min-h-screen lg:bg-[#D0C1AD]">
          <div className="absolute inset-0 lg:hidden">
            <img
              src={heroImg2}
              alt=""
              className="h-[100dvh] w-full object-cover object-top"
            />
          </div>

          <div className="absolute inset-0 hidden lg:block">
            <img
              src={heroImg}
              alt=""
              className="h-full w-full object-cover object-right"
            />
          </div>

          <div className="relative z-[20] lg:px-36">
            <Navbar />
          </div>

          <div className="absolute inset-x-0 bottom-0 z-[1] px-4 pb-6 text-white lg:inset-auto lg:left-0 lg:top-1/2 lg:-translate-y-[56%] lg:px-36 lg:pb-0">
            <div className="flex max-w-[320px] flex-wrap gap-2 lg:max-w-none lg:gap-3">
              {categories.map((item, index) => (
                <button
                  key={index}
                  className="rounded-2xl bg-white px-3 py-1 text-[14px] font-medium text-[#0B0B0B] lg:px-2 lg:text-[16px]"
                >
                  {item}
                </button>
              ))}
            </div>

            <h1 className="max-w-[820px] py-4 text-[28px] leading-[0.96] font-normal sm:text-[34px] lg:pt-6 lg:text-[59px]">
              Поможем подобрать уход под проблему вашей кожи
            </h1>

            <p className="max-w-[460px] pt-1 text-[15px] leading-[120%] font-normal sm:text-[17px] lg:pt-2.5 lg:text-[20px]">
              Не знаете, с чего начать уход?
            </p>

            <p className="max-w-[460px] text-[15px] leading-[120%] font-normal sm:text-[17px] lg:text-[20px]">
              Подскажем, какие средства подойдут именно вашей коже
            </p>

            <div className="pt-5 lg:hidden">
              <button className="flex h-[54px] w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-white px-4 text-[17px] font-medium text-[#0B0B0B]">
                Получить подбор ухода <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="hidden lg:absolute lg:inset-x-0 lg:bottom-6 lg:z-[1] lg:flex lg:flex-col lg:gap-6 lg:px-36">
            <div ref={desktopStatsRef} className="flex items-center gap-2 text-white">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="h-[156px] w-[33.333%] rounded-3xl bg-[#ffffff4d] p-6 text-white"
                >
                  <h3 className="text-5xl leading-[110%] font-normal lg:text-7xl">
                    {formatCount(counts[index])}
                    {item.suffix}
                  </h3>

                  <p className="mt-2 text-[16px] leading-5 font-medium">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <button className="flex h-[46px] w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-white px-4 text-[16px] font-medium text-[#0B0B0B]">
                Получить подбор ухода <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div ref={mobileStatsRef} className="bg-white px-5 pb-6 pt-10 lg:hidden">
          <div className="flex flex-col gap-10">
            {stats.map((item, index) => (
              <div key={index} className="text-[#111111]">
                <h3 className="text-[48px] leading-[0.95] font-normal">
                  {formatCount(counts[index])}
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
