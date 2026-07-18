import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import VoiceReviewPhone from "../components/VoiceReviewPhone";
import iphoneMockupImg from "../assets/imags/iphone_mockup_1x1.svg";
import productImg from "../assets/img/cream.png";
import phoneShotImg from "../assets/img/screenshoot.jpg";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

const VOICE_REVIEW_AUDIO_URL = "/audio/voice-review-demo.wav";

const REVIEW_STEPS = [
  {
    id: "review-1",
    order: "01",
    tags: ["Акне", "Чувствительная кожа", "Результат через 1 месяц"],
    concernTitle: "С чем обратилась",
    concernText: "Высыпания, чувствительность и неровный тон кожи",
    resultTitle: "Что получила",
    resultText: "Более спокойную кожу и понятный ежедневный уход",
    productTitle: "Увлажняющий крем",
    productDescription:
      "Глубоко питает кожу, помогает удерживать влагу и делает её мягкой",
    screenImage: phoneShotImg,
    voiceReview: {
      audioUrl: VOICE_REVIEW_AUDIO_URL,
      customerName: "Haydarova Munisa",
      city: "Andijon",
    },
  },
  {
    id: "review-2",
    order: "02",
    tags: ["Сухость", "Стянутость", "Ежедневный уход"],
    concernTitle: "С чем обратилась",
    concernText: "Сухость после умывания, стянутость и ощущение уставшей кожи",
    resultTitle: "Что получила",
    resultText: "Комфорт после очищения и более мягкую, спокойную кожу",
    productTitle: "Очищающая пенка",
    productDescription:
      "Бережно очищает, не пересушивает и поддерживает комфорт кожи",
    screenImage: phoneShotImg,
    voiceReview: {
      audioUrl: VOICE_REVIEW_AUDIO_URL,
      customerName: "Karimova Malika",
      city: "Toshkent",
    },
  },
  {
    id: "review-3",
    order: "03",
    tags: ["Покраснение", "Чувствительность", "Восстановление"],
    concernTitle: "С чем обратилась",
    concernText: "Покраснение, реактивность кожи и дискомфорт после ухода",
    resultTitle: "Что получила",
    resultText: "Более ровный тон и снижение чувствительности кожи",
    productTitle: "Успокаивающая сыворотка",
    productDescription:
      "Снижает чувствительность и помогает коже быстрее восстановиться",
    screenImage: phoneShotImg,
    voiceReview: {
      audioUrl: VOICE_REVIEW_AUDIO_URL,
      customerName: "Tohirova Shaxnoza",
      city: "Namangan",
    },
  },
  {
    id: "review-4",
    order: "04",
    tags: ["Тусклый тон", "Неровность", "Сияние"],
    concernTitle: "С чем обратилась",
    concernText: "Тусклый цвет лица, неровный тон и ощущение уставшей кожи",
    resultTitle: "Что получила",
    resultText: "Более свежий вид и визуально более ровный тон",
    productTitle: "Крем для восстановления",
    productDescription:
      "Поддерживает защитный барьер и делает тон кожи более ровным",
    screenImage: phoneShotImg,
    voiceReview: {
      audioUrl: VOICE_REVIEW_AUDIO_URL,
      customerName: "Usmonova Nilufar",
      city: "Samarqand",
    },
  },
];

const MOTION_MS = 760;
const MOTION_SEC = 0.76;
const PRODUCT_EXIT_MS = 760;

function ReviewInfo({ title, text }) {
  return (
    <div>
      <p className="text-[12px] font-semibold leading-none text-[#919191] sm:text-[13px]">
        {title}
      </p>
      <p className="mt-2 max-w-[455px] text-[15px] leading-[1.34] text-[#1f1f1f] sm:mt-3 sm:text-[18px]">
        {text}
      </p>
    </div>
  );
}

export default function ReviewSection() {
  const totalSteps = REVIEW_STEPS.length;

  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const phonePinRef = useRef(null);
  const leftContentRef = useRef(null);
  const headerRef = useRef(null);
  const rightRef = useRef(null);
  const lastStepRef = useRef(0);

  const [activeStep, setActiveStep] = useState(0);
  const [reviewMode, setReviewMode] = useState("text");
  const [visibleProducts, setVisibleProducts] = useState(() => [
    { ...REVIEW_STEPS[0], phase: "entered" },
  ]);
  const step = REVIEW_STEPS[activeStep];

  const syncVisibleProducts = useCallback((nextStepIndex) => {
    const desiredIds = REVIEW_STEPS.slice(0, nextStepIndex + 1)
      .map((item) => item.id)
      .reverse();

    setVisibleProducts((prev) => {
      const prevMap = new Map(prev.map((item) => [item.id, item]));
      const entering = desiredIds
        .filter((id) => !prevMap.has(id))
        .map((id) => {
          const source = REVIEW_STEPS.find((item) => item.id === id);
          return source ? { ...source, phase: "entering" } : null;
        })
        .filter(Boolean);

      const persisted = prev.map((item) => {
        if (desiredIds.includes(item.id)) {
          return {
            ...item,
            phase: item.phase === "exiting" ? "entered" : item.phase,
          };
        }

        return {
          ...item,
          phase: "exiting",
        };
      });

      return [...entering, ...persisted];
    });
  }, []);

  const updateStep = useCallback(
    (nextStepIndex) => {
      setActiveStep(nextStepIndex);
      syncVisibleProducts(nextStepIndex);
    },
    [syncVisibleProducts],
  );

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const createStoryTrigger = ({ pin }) => {
        const triggerEl = sectionRef.current;
        const pinEl = pinRef.current;
        if (!triggerEl || !pinEl) return null;

        return ScrollTrigger.create({
          trigger: triggerEl,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * totalSteps * 0.88)}`,
          pin: pin ? pinEl : false,
          refreshPriority: pin ? 20 : 0,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const nextIndex = clamp(
              Math.floor(self.progress * totalSteps),
              0,
              totalSteps - 1,
            );

            if (nextIndex !== lastStepRef.current) {
              lastStepRef.current = nextIndex;
              updateStep(nextIndex);
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
          const phoneEl = phonePinRef.current;
          if (!triggerEl || !phoneEl) return () => {};
          const mobileScrollDistance = Math.round(
            window.innerHeight * totalSteps * 0.92,
          );

          const progressSt = ScrollTrigger.create({
            trigger: triggerEl,
            start: "top top+=16",
            end: () => `+=${mobileScrollDistance}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const nextIndex = clamp(
                Math.floor(self.progress * totalSteps),
                0,
                totalSteps - 1,
              );

              if (nextIndex !== lastStepRef.current) {
                lastStepRef.current = nextIndex;
                updateStep(nextIndex);
              }
            },
          });

          const pinSt = ScrollTrigger.create({
            trigger: phoneEl,
            start: "top top+=16",
            end: () => `+=${mobileScrollDistance}`,
            pin: phoneEl,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 10,
          });

          return () => {
            progressSt.kill();
            pinSt.kill();
          };
        },
      );

      mm.add("(prefers-reduced-motion: reduce)", () => {
        lastStepRef.current = 0;
        updateStep(0);
        return () => {};
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, [totalSteps, updateStep]);

  useLayoutEffect(() => {
    const animatedTargets = [leftContentRef.current].filter(Boolean);

    gsap.fromTo(
      animatedTargets,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: MOTION_SEC,
        ease: "power2.out",
        stagger: 0.05,
        overwrite: true,
      },
    );
  }, [activeStep]);

  useEffect(() => {
    const hasEntering = visibleProducts.some(
      (item) => item.phase === "entering",
    );
    const hasExiting = visibleProducts.some((item) => item.phase === "exiting");
    if (!hasEntering && !hasExiting) return undefined;

    let frameId = 0;
    let timeoutId = 0;

    if (hasEntering) {
      frameId = window.requestAnimationFrame(() => {
        setVisibleProducts((prev) =>
          prev.map((item) =>
            item.phase === "entering" ? { ...item, phase: "entered" } : item,
          ),
        );
      });
    }

    if (hasExiting) {
      timeoutId = window.setTimeout(() => {
        setVisibleProducts((prev) =>
          prev.filter((item) => item.phase !== "exiting"),
        );
      }, PRODUCT_EXIT_MS);
    }

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [visibleProducts]);

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="relative overflow-x-hidden scroll-mt-28 bg-white text-black lg:overflow-hidden"
    >
      <div className="mx-auto w-full px-4 py-10 sm:px-8 lg:px-8 lg:py-12 xl:px-10">
        <div
          ref={pinRef}
          className="grid gap-y-6 lg:min-h-[100vh] lg:grid-cols-[minmax(260px,1fr)_360px_minmax(260px,1fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-10 lg:gap-y-8 xl:grid-cols-[minmax(320px,1fr)_380px_minmax(320px,1fr)] xl:gap-x-12"
        >
          <div className="lg:col-start-2 lg:row-start-1">
            <div ref={headerRef} className="mx-auto text-center">
              <h2 className="pb-2 text-[28px] font-semibold leading-none text-[#161616] sm:text-[34px]">
                Отзывы клиентов
              </h2>
              <p className="mt-3 pb-5 text-[14px] leading-[1.25] text-[#969696] sm:mt-4 sm:pb-6 sm:text-[18px]">
                Скриншоты из мессенджеров и соцсетей
              </p>

              <div className="hidden rounded-full bg-[#f3f3f3] p-1 sm:inline-flex">
                <button
                  type="button"
                  onClick={() => setReviewMode("text")}
                  className={[
                    "rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors sm:px-7 sm:py-3 sm:text-[16px]",
                    reviewMode === "text"
                      ? "bg-[#1d1d1f] text-white"
                      : "text-[#212121]",
                  ].join(" ")}
                >
                  Текст
                </button>
                <button
                  type="button"
                  onClick={() => setReviewMode("voice")}
                  className={[
                    "rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors sm:px-7 sm:py-3 sm:text-[16px]",
                    reviewMode === "voice"
                      ? "bg-[#1d1d1f] text-white"
                      : "text-[#212121]",
                  ].join(" ")}
                >
                  Голосовые
                </button>
              </div>
            </div>
          </div>

          <div className="order-2 lg:col-start-1 lg:row-start-2 lg:self-start lg:pt-6">
            <div className="mx-auto max-w-[560px] lg:mx-0 lg:pl-10 lg:pr-8 xl:pl-14">
              <div className="hidden items-start gap-2 text-[#101010] sm:flex sm:gap-3">
                <div className="relative h-[150px] overflow-hidden lg:h-[166px]">
                  <div
                    className="transition-transform ease-[cubic-bezier(.16,1,.3,1)] will-change-transform"
                    style={{
                      transform: `translateY(-${activeStep * 25}%)`,
                      transitionDuration: `${MOTION_MS}ms`,
                    }}
                  >
                    {REVIEW_STEPS.map((item) => (
                      <div
                        key={item.id}
                        className="flex h-[150px] items-start text-[120px] font-normal leading-[0.92] tracking-[-0.075em] lg:h-[166px] lg:text-[142px]"
                      >
                        {Number(item.order)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 text-[34px] font-medium leading-none tracking-[-0.04em] lg:pt-6 lg:text-[38px]">
                  /{totalSteps}
                </div>
              </div>

              <div ref={leftContentRef}>
                <div className="hidden max-w-[470px] flex-wrap gap-x-2 gap-y-2 py-3 sm:flex sm:gap-x-3 sm:gap-y-2.5">
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#f5f5f5] px-3 py-2 text-[13px] leading-none text-[#222222] sm:px-5 sm:py-2.5 sm:text-[15px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className=" h-px w-full max-w-[520px] bg-[#e8e8e8]" />

                <div className="hidden sm:flex sm:flex-col sm:gap-6 sm:pt-4">
                  <ReviewInfo
                    title={step.concernTitle}
                    text={step.concernText}
                  />
                  <ReviewInfo title={step.resultTitle} text={step.resultText} />
                </div>
              </div>
            </div>
          </div>

          <div
            ref={phonePinRef}
            className="order-1 z-10 self-start lg:static lg:col-start-2 lg:row-start-2 lg:justify-self-center lg:self-start lg:pt-2"
          >
            <div className="mb-4 flex justify-center sm:hidden ">
              <div className="inline-flex rounded-full bg-[#f3f3f3] p-1">
                <button
                  type="button"
                  onClick={() => setReviewMode("text")}
                  className={[
                    "rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors",
                    reviewMode === "text"
                      ? "bg-[#1d1d1f] text-white"
                      : "text-[#212121]",
                  ].join(" ")}
                >
                  Текст
                </button>
                <button
                  type="button"
                  onClick={() => setReviewMode("voice")}
                  className={[
                    "rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors",
                    reviewMode === "voice"
                      ? "bg-[#1d1d1f] text-white"
                      : "text-[#212121]",
                  ].join(" ")}
                >
                  Голосовые
                </button>
              </div>
            </div>

            <div className="mx-auto pt-4 flex justify-center lg:mt-0 lg:w-[360px] xl:w-[380px]">
              {reviewMode === "text" ? (
                <div className="relative w-[min(300px,82vw)] sm:w-[min(324px,79vw)] xl:w-[344px]">
                  <div className="relative mx-auto aspect-[1014/2048] w-full">
                    <div className="absolute bottom-[2.65%] left-[2.55%] right-[2.55%] top-[2.55%] overflow-hidden rounded-[42px] bg-white">
                      <div className="absolute inset-0">
                        <div
                          className="flex h-full w-full transition-transform ease-[cubic-bezier(.16,1,.3,1)]"
                          style={{
                            transform: `translateX(-${activeStep * 100}%)`,
                            transitionDuration: `${MOTION_MS}ms`,
                          }}
                        >
                          {REVIEW_STEPS.map((item) => (
                            <img
                              key={item.id}
                              src={item.screenImage}
                              alt=""
                              draggable="false"
                              className="h-full w-full flex-none object-cover object-top"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <img
                      src={iphoneMockupImg}
                      alt=""
                      draggable="false"
                      className="absolute inset-0 h-full w-full select-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative w-[min(300px,82vw)] sm:w-[min(324px,79vw)] xl:w-[344px]">
                  <div className="relative mx-auto aspect-[1014/2048] w-full">
                    <div className="absolute bottom-[2.65%] left-[2.55%] right-[2.55%] top-[2.55%] overflow-hidden rounded-[42px] bg-white">
                      <VoiceReviewPhone
                        key={step.id}
                        audioUrl={step.voiceReview.audioUrl}
                        customerName={step.voiceReview.customerName}
                        city={step.voiceReview.city}
                        productImage={productImg}
                      />
                    </div>

                    <img
                      src={iphoneMockupImg}
                      alt=""
                      draggable="false"
                      className="absolute inset-0 h-full w-full select-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="order-3 hidden lg:col-start-3 lg:row-start-2 lg:block lg:self-start lg:pt-10">
            {reviewMode === "text" ? (
              <div ref={rightRef} className="mx-auto w-fit lg:mx-0">
                <div className="flex flex-col">
                  {visibleProducts.map((product) => (
                    <div
                      key={product.id}
                      className={[
                        "overflow-hidden transition-[max-height,opacity,transform,padding] ease-[cubic-bezier(.16,1,.3,1)] will-change-transform",
                        product.phase === "entered"
                          ? "max-h-40 pb-2 opacity-100"
                          : "",
                        product.phase === "entered" ? "translate-y-0" : "",
                        product.phase === "entering"
                          ? "max-h-0 pb-0 -translate-y-3 opacity-0"
                          : "",
                        product.phase === "exiting"
                          ? "max-h-0 pb-0 -translate-y-3 opacity-0"
                          : "",
                      ].join(" ")}
                      style={{
                        transitionDuration: `${MOTION_MS}ms`,
                      }}
                    >
                      <article
                        className={[
                          "inline-flex rounded-[16px] border border-[#e8e8e8] bg-white pr-3 py-3",
                          "transform-gpu transition-all ease-[cubic-bezier(.16,1,.3,1)] will-change-transform",
                          product.phase === "entered"
                            ? "translate-x-0 translate-y-0 scale-100 opacity-100"
                            : "",
                          product.phase === "entering"
                            ? "translate-x-6 -translate-y-3 scale-[0.985] opacity-0"
                            : "",
                          product.phase === "exiting"
                            ? "translate-x-6 -translate-y-3 scale-[0.985] opacity-0"
                            : "",
                        ].join(" ")}
                        style={{
                          transitionDuration: `${MOTION_MS}ms`,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden">
                            <img
                              src={productImg}
                              alt=""
                              draggable="false"
                              loading="lazy"
                              className="h-full w-full object-contain"
                            />
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-[18px] font-semibold leading-[1.1] text-[#1d1d1f] sm:text-[22px]">
                              {product.productTitle}
                            </h3>
                            <p className="mt-3 max-w-[350px] text-[16px] leading-[1.28] text-[#8f8f8f]">
                              {product.productDescription}
                            </p>
                          </div>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
