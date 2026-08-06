import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

import VoiceReviewPhone from "../components/VoiceReviewPhone";
import { useI18n } from "../i18n/I18nProvider.jsx";
import iphoneMockupImg from "../assets/imags/iphone_mockup_1x1.svg";
import productImg from "../assets/img/cream.png";
import phoneShotImg1 from "../assets/img/ph1.jpg";
import phoneShotImg2 from "../assets/img/ph2.jpg";
import phoneShotImg3 from "../assets/img/ph3.jpg";
import phoneShotImg4 from "../assets/img/ph4.jpg";
import voiceReviewAudio1 from "../assets/img/mp1.mp3";
import voiceReviewAudio2 from "../assets/img/mp2.mp3";
import voiceReviewAudio3 from "../assets/img/mp3.mp3";
import voiceReviewAudio4 from "../assets/img/mp4.mp3";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

const REVIEW_STEP_VISUALS = [
  {
    id: "review-1",
    order: "01",
    screenImage: phoneShotImg1,
    voiceReview: {
      audioUrl: voiceReviewAudio1,
      customerName: "Munisa",
      city: "Andijon",
    },
  },
  {
    id: "review-2",
    order: "02",
    screenImage: phoneShotImg2,
    voiceReview: {
      audioUrl: voiceReviewAudio2,
      customerName: "Malika",
      city: "Toshkent",
    },
  },
  {
    id: "review-3",
    order: "03",
    screenImage: phoneShotImg3,
    voiceReview: {
      audioUrl: voiceReviewAudio3,
      customerName: "Shaxnoza",
      city: "Namangan",
    },
  },
  {
    id: "review-4",
    order: "04",
    screenImage: phoneShotImg4,
    voiceReview: {
      audioUrl: voiceReviewAudio4,
      customerName: "Nilufar",
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
  const { get, t } = useI18n();
  const reviewLocaleSteps = get("reviews.steps", []);
  const reviewSteps = useMemo(
    () =>
      reviewLocaleSteps.map((step, index) => ({
        ...REVIEW_STEP_VISUALS[index],
        ...step,
      })),
    [reviewLocaleSteps],
  );
  const totalSteps = reviewSteps.length;

  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const leftContentRef = useRef(null);
  const headerRef = useRef(null);
  const rightRef = useRef(null);
  const lastStepRef = useRef(0);

  const [activeStep, setActiveStep] = useState(0);
  const [reviewMode, setReviewMode] = useState("text");
  const [reviewTransitionMs, setReviewTransitionMs] = useState(MOTION_MS);
  const [visibleProducts, setVisibleProducts] = useState(() =>
    REVIEW_STEP_VISUALS[0]
      ? [{ ...REVIEW_STEP_VISUALS[0], phase: "entered" }]
      : [],
  );
  const step = reviewSteps[activeStep] ?? reviewSteps[0] ?? null;

  const syncVisibleProducts = useCallback(
    (nextStepIndex) => {
      const desiredIds = reviewSteps
        .slice(0, nextStepIndex + 1)
        .map((item) => item.id)
        .reverse();

      setVisibleProducts((prev) => {
        const prevMap = new Map(prev.map((item) => [item.id, item]));
        const entering = desiredIds
          .filter((id) => !prevMap.has(id))
          .map((id) => {
            const source = reviewSteps.find((item) => item.id === id);
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
    },
    [reviewSteps],
  );

  const updateStep = useCallback(
    (nextStepIndex) => {
      if (!totalSteps) return;
      const resolvedIndex = clamp(nextStepIndex, 0, totalSteps - 1);
      lastStepRef.current = resolvedIndex;
      setActiveStep(resolvedIndex);
      syncVisibleProducts(resolvedIndex);
    },
    [syncVisibleProducts, totalSteps],
  );

  const goToPreviousStep = useCallback(() => {
    setReviewTransitionMs(activeStep === 0 ? 220 : MOTION_MS);
    updateStep(activeStep === 0 ? totalSteps - 1 : activeStep - 1);
  }, [activeStep, totalSteps, updateStep]);

  const goToNextStep = useCallback(() => {
    setReviewTransitionMs(activeStep === totalSteps - 1 ? 220 : MOTION_MS);
    updateStep(activeStep === totalSteps - 1 ? 0 : activeStep + 1);
  }, [activeStep, totalSteps, updateStep]);

  useEffect(() => {
    if (!reviewSteps.length) return;

    setVisibleProducts((prev) => {
      if (!prev.length) {
        return [{ ...reviewSteps[0], phase: "entered" }];
      }

      return prev
        .map((item) => {
          const source = reviewSteps.find(
            (stepItem) => stepItem.id === item.id,
          );
          return source ? { ...source, phase: item.phase } : null;
        })
        .filter(Boolean);
    });
  }, [reviewSteps]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const triggerEl = sectionRef.current;
          const pinEl = pinRef.current;
          if (!triggerEl || !pinEl) return () => {};

          const st = ScrollTrigger.create({
            trigger: triggerEl,
            start: "top top",
            end: () =>
              `+=${Math.round(window.innerHeight * totalSteps * 0.88)}`,
            pin: pinEl,
            refreshPriority: 20,
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
                updateStep(nextIndex);
              }
            },
          });

          return () => st.kill();
        },
      );

      mm.add("(prefers-reduced-motion: reduce)", () => {
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

  if (!step) return null;

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="relative overflow-x-hidden scroll-mt-28 bg-white text-black lg:overflow-hidden"
    >
      <div className="mx-auto w-full px-4 py-6 sm:px-8 sm:py-8 lg:px-8 lg:py-12 xl:px-10">
        <div
          ref={pinRef}
          className="grid gap-y-6 lg:min-h-[100vh] lg:grid-cols-[minmax(260px,1fr)_360px_minmax(260px,1fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-10 lg:gap-y-8 xl:grid-cols-[minmax(320px,1fr)_380px_minmax(320px,1fr)] xl:gap-x-12"
        >
          <div className="lg:col-start-2 lg:row-start-1">
            <div ref={headerRef} className="mx-auto text-center">
              <h2 className="pb-2 text-[28px] font-semibold leading-none text-[#161616] sm:text-[34px]">
                {t("reviews.title")}
              </h2>
              <p className="mt-3 pb-5 text-[14px] leading-[1.25] text-[#969696] sm:mt-4 sm:pb-6 sm:text-[18px]">
                {t("reviews.description")}
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
                  {t("reviews.modes.text")}
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
                  {t("reviews.modes.voice")}
                </button>
              </div>
            </div>
          </div>

          <div className="order-2 lg:col-start-1 lg:row-start-2 lg:self-start lg:pt-6">
            <div className="mx-auto max-w-[560px] lg:mx-0 lg:pl-10 lg:pr-8 xl:pl-14">
              <div className="hidden items-start gap-3 text-[#101010] lg:flex">
                <div className="relative h-[166px] overflow-hidden">
                  <div
                    className="transition-transform ease-[cubic-bezier(.16,1,.3,1)] will-change-transform"
                    style={{
                      transform: `translateY(-${activeStep * 25}%)`,
                      transitionDuration: `${reviewTransitionMs}ms`,
                    }}
                  >
                    {reviewSteps.map((item) => (
                      <div
                        key={item.id}
                        className="flex h-[166px] items-start text-[142px] font-normal leading-[0.92] tracking-[-0.075em]"
                      >
                        {Number(item.order)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 text-[38px] font-medium leading-none tracking-[-0.04em]">
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

                <div className="h-px w-full max-w-[520px] bg-[#e8e8e8]" />

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
            className="relative order-1 z-10 self-start lg:col-start-2 lg:row-start-2 lg:justify-self-center lg:self-start lg:pt-2"
          >
            <div className="absolute right-2 top-[68px] z-40 flex items-center rounded-full bg-white/88 px-3 py-2 text-[13px] font-semibold leading-none text-[#101010] shadow-[0_10px_24px_rgba(15,15,15,0.12)] backdrop-blur-md sm:right-4 sm:top-20 lg:hidden">
              <div className="relative h-4 min-w-2.5 overflow-hidden">
                <div
                  className="transition-transform ease-[cubic-bezier(.16,1,.3,1)] will-change-transform"
                  style={{
                    transform: `translateY(-${activeStep * 16}px)`,
                    transitionDuration: `${reviewTransitionMs}ms`,
                  }}
                >
                  {reviewSteps.map((item) => (
                    <div key={item.id} className="h-4 leading-4">
                      {Number(item.order)}
                    </div>
                  ))}
                </div>
              </div>
              <span className="ml-0.5 text-[#767676]">/{totalSteps}</span>
            </div>

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
                  {t("reviews.modes.text")}
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
                  {t("reviews.modes.voice")}
                </button>
              </div>
            </div>

            <div className="mx-auto grid grid-cols-[30px_minmax(0,1fr)_30px] items-center gap-0 pt-4 sm:grid-cols-[38px_minmax(0,1fr)_38px] lg:flex lg:w-[360px] lg:justify-center xl:w-[380px]">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="relative z-30 grid h-8 w-8 -translate-x-1 place-items-center rounded-full border border-[#e8e8e8] bg-white text-[#1d1d1f] shadow-[0_10px_24px_rgba(15,15,15,0.1)] transition-transform hover:scale-105 active:scale-95 sm:h-10 sm:w-10 sm:-translate-x-2 lg:hidden"
                aria-label="Previous review"
              >
                <ChevronLeft size={20} strokeWidth={2.2} />
              </button>

              <div className="flex justify-center">
              {reviewMode === "text" ? (
                <div className="relative w-[min(330px,90vw)] sm:w-[min(344px,82vw)] xl:w-[344px]">
                  <div className="relative mx-auto aspect-[1014/2048] w-full">
                    <div className="absolute bottom-[1.55%] left-[4.05%] right-[4.05%] top-[1.55%] overflow-hidden rounded-[38px] bg-white">
                      <div className="absolute inset-0">
                        <div
                          className="flex h-full w-full transition-transform ease-[cubic-bezier(.16,1,.3,1)]"
                          style={{
                            transform: `translateX(-${activeStep * 100}%)`,
                            transitionDuration: `${reviewTransitionMs}ms`,
                          }}
                        >
                          {reviewSteps.map((item) => (
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
                      className="pointer-events-none absolute inset-0 h-full w-full select-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative w-[min(330px,90vw)] sm:w-[min(344px,82vw)] xl:w-[344px]">
                  <div className="relative mx-auto aspect-[1014/2048] w-full">
                    <div className="absolute bottom-[1.55%] left-[4.05%] right-[4.05%] top-[1.55%] overflow-hidden rounded-[38px] bg-white">
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
                      className="pointer-events-none absolute inset-0 h-full w-full select-none"
                    />
                  </div>
                </div>
              )}
              </div>

              <button
                type="button"
                onClick={goToNextStep}
                className="relative z-30 grid h-8 w-8 translate-x-1 place-items-center rounded-full border border-[#e8e8e8] bg-white text-[#1d1d1f] shadow-[0_10px_24px_rgba(15,15,15,0.1)] transition-transform hover:scale-105 active:scale-95 sm:h-10 sm:w-10 sm:translate-x-2 lg:hidden"
                aria-label="Next review"
              >
                <ChevronRight size={20} strokeWidth={2.2} />
              </button>
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
                        transitionDuration: `${reviewTransitionMs}ms`,
                      }}
                    >
                      <article
                        className={[
                          "inline-flex rounded-[16px] border border-[#e8e8e8] bg-white py-3 pr-3",
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
                          transitionDuration: `${reviewTransitionMs}ms`,
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
