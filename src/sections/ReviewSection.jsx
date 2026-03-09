import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import productImg from "../assets/img/cream.png";
import phoneFrameImg from "../assets/img/phone.png";
import phoneShot from "../assets/img/screenshoot.jpg";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

const REVIEW_STEPS = [
  {
    id: "step-1",
    stepNumber: 1,
    tags: ["Акне", "Чувствительная кожа", "Результат через 1 месяц"],
    concernText: "Высыпания, чувствительность, неровный тон",
    resultText: "Более спокойную кожу и понятный ежедневный уход",
    productTitle: "Увлажняющий крем",
    productDescription:
      "Глубоко питает кожу, помогает удерживать влагу и делает её мягкой",
    phoneImage: phoneShot,
    reviewTitle: "Первый отзыв",
    reviewSnippet:
      "Кожа стала ощущаться намного комфортнее уже в первые недели ухода",
  },
  {
    id: "step-2",
    stepNumber: 2,
    tags: ["Сухость", "Стянутость", "Ежедневный уход"],
    concernText: "Сухость после умывания и постоянное чувство стянутости",
    resultText: "Комфорт после очищения и более мягкую кожу",
    productTitle: "Очищающая пенка",
    productDescription:
      "Бережно очищает, не пересушивает и поддерживает комфорт кожи",
    phoneImage: phoneShot,
    reviewTitle: "Второй отзыв",
    reviewSnippet:
      "После очищения кожа перестала быть сухой и более спокойно реагирует на уход",
  },
  {
    id: "step-3",
    stepNumber: 3,
    tags: ["Покраснение", "Чувствительность", "Восстановление"],
    concernText: "Покраснение, реактивность кожи и дискомфорт",
    resultText: "Более ровный тон и уменьшение чувствительности",
    productTitle: "Успокаивающая сыворотка",
    productDescription:
      "Снижает чувствительность и помогает коже быстрее восстановиться",
    phoneImage: phoneShot,
    reviewTitle: "Третий отзыв",
    reviewSnippet:
      "Уход стал ощущаться мягче, а кожа выглядит более сбалансированной",
  },
  {
    id: "step-4",
    stepNumber: 4,
    tags: ["Тусклый тон", "Неровность", "Сияние"],
    concernText: "Тусклый цвет лица и ощущение уставшей кожи",
    resultText: "Более свежий вид и визуально ровный тон",
    productTitle: "Крем для восстановления",
    productDescription:
      "Поддерживает защитный барьер и делает тон кожи более ровным",
    phoneImage: phoneShot,
    reviewTitle: "Четвертый отзыв",
    reviewSnippet: "Кожа стала выглядеть свежее, а тон стал заметно аккуратнее",
  },
  {
    id: "step-5",
    stepNumber: 5,
    tags: ["Обезвоженность", "Шелушение", "Мягкость"],
    concernText: "Шелушение, нехватка влаги и потеря мягкости",
    resultText: "Более напитанную, мягкую и спокойную кожу",
    productTitle: "Питательный крем",
    productDescription:
      "Интенсивно смягчает, поддерживает комфорт и уменьшает сухость",
    phoneImage: phoneShot,
    reviewTitle: "Пятый отзыв",
    reviewSnippet:
      "Текстура кожи стала приятнее, а ощущение сухости заметно уменьшилось",
  },
  {
    id: "step-6",
    stepNumber: 6,
    tags: ["Комплексный уход", "Комфорт", "Результат"],
    concernText: "Хотелось собрать понятный и комфортный уход без перегруза",
    resultText: "Удобную систему ухода и заметно более ухоженный вид кожи",
    productTitle: "Финальный уходовый крем",
    productDescription:
      "Завершает рутину, поддерживает комфорт и улучшает общее состояние кожи",
    phoneImage: phoneShot,
    reviewTitle: "Шестой отзыв",
    reviewSnippet:
      "Наконец появился понятный уход, который приятно использовать каждый день",
  },
];

export default function ReviewSection() {
  const totalSteps = REVIEW_STEPS.length;

  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const counterRef = useRef(null);
  const tagsRef = useRef(null);
  const infoRef = useRef(null);
  const lastStepRef = useRef(0);

  const [activeStep, setActiveStep] = useState(0);
  const step = REVIEW_STEPS[activeStep];

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(
        [counterRef.current, tagsRef.current, infoRef.current].filter(Boolean),
        { willChange: "transform,opacity" },
      );

      const mm = gsap.matchMedia();

      const createStoryTrigger = ({ pin }) => {
        const triggerEl = sectionRef.current;
        const pinEl = pinRef.current;
        if (!triggerEl || !pinEl) return null;

        return ScrollTrigger.create({
          trigger: triggerEl,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * totalSteps * 0.9)}`,
          pin: pin ? pinEl : false,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = clamp(
              Math.floor(self.progress * totalSteps),
              0,
              totalSteps - 1,
            );
            if (idx !== lastStepRef.current) {
              lastStepRef.current = idx;
              setActiveStep(idx);
            }
          },
        });
      };

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const st = createStoryTrigger({ pin: true });
          return () => st?.kill();
        },
      );

      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          const triggerEl = sectionRef.current;
          if (!triggerEl) return () => {};

          const st = ScrollTrigger.create({
            trigger: triggerEl,
            start: "top 75%",
            end: "bottom 25%",
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = clamp(
                Math.floor(self.progress * totalSteps),
                0,
                totalSteps - 1,
              );
              if (idx !== lastStepRef.current) {
                lastStepRef.current = idx;
                setActiveStep(idx);
              }
            },
          });

          return () => st.kill();
        },
      );

      mm.add("(prefers-reduced-motion: reduce)", () => {
        lastStepRef.current = 0;
        setActiveStep(0);
        return () => {};
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, [totalSteps]);

  useLayoutEffect(() => {
    gsap.fromTo(
      [counterRef.current, tagsRef.current, infoRef.current].filter(Boolean),
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
        overwrite: true,
      },
    );
  }, [activeStep]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white text-black"
    >
      <div className="relative mx-auto max-w-[1440px] px-4 py-14 sm:px-8 lg:px-20 lg:py-20">
        <div
          ref={pinRef}
          className="grid gap-10 lg:min-h-[78vh] lg:grid-cols-[420px_minmax(520px,1fr)_360px] lg:items-start lg:gap-14"
        >
          <div className="lg:pt-8">
            <div ref={counterRef} className="select-none">
              <div className="text-[96px] font-medium leading-none tracking-[-0.04em] text-black sm:text-[112px] lg:text-[140px]">
                {pad2(activeStep + 1)}
              </div>
            </div>

            <div ref={tagsRef} className="mt-7 flex flex-wrap gap-3">
              {step.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-zinc-100 px-5 py-2 text-[14px] font-medium leading-none text-black shadow-[0_10px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/5"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 h-px w-full bg-black/10" />

            <div ref={infoRef} className="mt-10 space-y-8">
              <div>
                <p className="text-sm font-semibold text-black/45">
                  С чем обратилась
                </p>
                <p className="mt-2 max-w-[420px] text-base leading-relaxed text-black/60">
                  {step.concernText}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-black/45">
                  Что получила
                </p>
                <p className="mt-2 max-w-[420px] text-base leading-relaxed text-black/60">
                  {step.resultText}
                </p>
              </div>
            </div>
          </div>

          {/* Center phone (smaller + higher) */}
          <div className="flex justify-center lg:-mt-10 lg:justify-self-center lg:pt-0">
            <div className="relative w-[min(320px,80vw)]">
              <div className="absolute -inset-10 rounded-[64px] bg-[radial-gradient(closest-side,rgba(255,138,92,0.10),transparent_62%)] blur-3xl" />

              <div className="relative">
                <div className="relative mx-auto aspect-[369/750] w-full">
                  {/* Screen */}
                  <div className="absolute bottom-[4.4%] left-[6.4%] right-[6.4%] top-[3.6%] overflow-hidden rounded-[34px] bg-white">
                    {/* Screenshot slider (no opacity; just horizontal slide) */}
                    <div className="absolute inset-0 z-0">
                      <div
                        className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
                        style={{
                          transform: `translateX(-${activeStep * 100}%)`,
                        }}
                      >
                        {REVIEW_STEPS.map((s) => (
                          <img
                            key={s.id}
                            src={s.phoneImage}
                            alt=""
                            draggable="false"
                            loading="lazy"
                            className="h-full w-full flex-none object-cover"
                          />
                        ))}
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/90 to-white/0" />
                    </div>

                    <div className="absolute inset-x-0 top-0 z-30 px-5 pt-4">
                      <div className="flex items-center justify-between text-[12px] font-medium text-black/70">
                        <span>4:20</span>
                        <span className="opacity-0">.</span>
                        <span className="flex items-center gap-2">
                          <span className="inline-flex items-end gap-0.5">
                            <span className="h-1.5 w-0.5 rounded-full bg-black/55" />
                            <span className="h-2.5 w-0.5 rounded-full bg-black/55" />
                            <span className="h-3.5 w-0.5 rounded-full bg-black/55" />
                            <span className="h-4.5 w-0.5 rounded-full bg-black/55" />
                          </span>
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5 text-black/55"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 12.55a11 11 0 0114.08 0" />
                            <path d="M8.5 16.1a6 6 0 017 0" />
                            <path d="M12 19h.01" />
                          </svg>
                          <span className="h-2.5 w-5 rounded-sm border border-black/40" />
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[13px]">
                        <span className="font-medium text-[#FF8A5C]">
                          {"\u2039"} Назад
                        </span>
                        <span className="font-semibold tracking-[0.08em] text-black/80">
                          #{String(step.stepNumber).padStart(6, "0")}
                        </span>
                        <span className="grid h-8 w-8 place-items-center">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5 text-black/70"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
                            <path d="M13.73 21a2 2 0 01-3.46 0" />
                          </svg>
                        </span>
                      </div>

                      <div className="mt-3 flex gap-2">
                        {REVIEW_STEPS.map((s, i) => (
                          <div
                            key={s.id}
                            className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/10"
                          >
                            <div
                              className="h-full rounded-full bg-[#FF8A5C]"
                              style={{
                                width: i <= activeStep ? "100%" : "0%",
                                transition:
                                  "width 520ms cubic-bezier(.22,1,.36,1)",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Frame */}
                  <img
                    src={phoneFrameImg}
                    alt=""
                    draggable="false"
                    className="absolute inset-0 h-full w-full select-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right cards */}
          <div className="lg:pt-10">
            <article
              key={step.id}
              className="rounded-3xl bg-white p-6 text-black shadow-[0_22px_70px_rgba(0,0,0,0.12)] ring-1 ring-black/5"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-zinc-100">
                  <img
                    src={productImg}
                    alt=""
                    draggable="false"
                    loading="lazy"
                    className="h-full w-full object-contain p-2"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-semibold leading-tight">
                    {step.productTitle}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-black/55">
                    {step.productDescription}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
