import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import modalPng from "../assets/img/modal.png";
import ConsultationModal from "./ConsultationModal";
import { useI18n } from "../i18n/I18nProvider.jsx";

function clampInt(value, min, max) {
  return Math.min(max, Math.max(min, value | 0));
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

const DEFAULT_TITLES = [
  "Problem 1",
  "Problem 2",
  "Problem 3",
  "Problem 4",
  "Problem 5",
];

const MODAL_IMAGES = DEFAULT_TITLES.map(() => modalPng);
const SCROLL_STEP_VIEWPORT_RATIO = 0.72;

function getStableViewportHeight() {
  if (typeof window === "undefined") return 0;
  return Math.round(
    Math.max(
      window.innerHeight || 0,
      window.visualViewport?.height || 0,
      document.documentElement?.clientHeight || 0,
    ),
  );
}

function getVisibleViewportHeight() {
  if (typeof window === "undefined") return 0;
  return Math.round(
    window.visualViewport?.height ||
      window.innerHeight ||
      document.documentElement?.clientHeight ||
      0,
  );
}

export default function ScrollGalleryShowcase({
  images,
  title,
  buttonText,
  buttonHref,
}) {
  const { get, t } = useI18n();
  const defaultTitles = get("showcase.problemTitles", []);
  const safeImages = useMemo(() => {
    return Array.isArray(images) ? images.filter(Boolean) : [];
  }, [images]);
  const count = safeImages.length;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [modalOrigin, setModalOrigin] = useState(null);
  const [isButtonLaunching, setIsButtonLaunching] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isMobileTransitioning, setIsMobileTransitioning] = useState(false);
  const [mobileTransitionMs, setMobileTransitionMs] = useState(420);

  const sectionRef = useRef(null);
  const galleryViewportRef = useRef(null);
  const titleRef = useRef(null);
  const bgLayerRefA = useRef(null);
  const bgLayerRefB = useRef(null);
  const bgImgRefA = useRef(null);
  const bgImgRefB = useRef(null);
  const itemsRef = useRef([]);
  const activeIndexRef = useRef(0);
  const activeBgLayerRef = useRef(0);
  const stepPxRef = useRef(140);
  const startOffsetRef = useRef(0);
  const axisRef = useRef("y");
  const viewportSizeRef = useRef({ width: 0, height: 0 });
  const stRef = useRef(null);
  const roRef = useRef(null);
  const refreshRafRef = useRef(0);
  const decodedImagesRef = useRef(new Set());

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    );
  }, []);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    if (count === 0) return;
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    safeImages.forEach((img) => {
      if (!img?.src) return;
      const pre = new Image();
      pre.src = img.src;
      pre.decode?.().then(
        () => decodedImagesRef.current.add(img.src),
        () => decodedImagesRef.current.add(img.src),
      );
    });

    const bgA = bgLayerRefA.current;
    const bgB = bgLayerRefB.current;
    const bgImgA = bgImgRefA.current;
    const bgImgB = bgImgRefB.current;
    const viewport = galleryViewportRef.current;
    const titleEl = titleRef.current;
    const isDesktop =
      window.matchMedia?.("(min-width: 768px)")?.matches ?? false;
    const viewportHeight = isDesktop
      ? getStableViewportHeight()
      : getVisibleViewportHeight();

    if (!bgA || !bgB || !bgImgA || !bgImgB || !viewport) return;

    if (!isDesktop) {
      const setMobileHeight = () => {
        sectionRef.current?.style.setProperty(
          "--mio-showcase-height",
          `${getVisibleViewportHeight()}px`,
        );
      };

      setMobileHeight();
      setShowScrollHint(false);
      window.addEventListener("resize", setMobileHeight, { passive: true });
      window.visualViewport?.addEventListener("resize", setMobileHeight, {
        passive: true,
      });

      return () => {
        window.removeEventListener("resize", setMobileHeight);
        window.visualViewport?.removeEventListener("resize", setMobileHeight);
      };
    }

    const getTitleByIndex = (nextIndex) =>
      defaultTitles[nextIndex] ?? title ?? DEFAULT_TITLES[nextIndex] ?? "";

    const setTitleInstant = (nextIndex) => {
      if (!titleEl) return;
      titleEl.textContent = getTitleByIndex(nextIndex);
    };

    const swapTitleTo = (nextIndex, direction = 1) => {
      if (!titleEl) return;
      const nextTitle = getTitleByIndex(nextIndex);
      if (titleEl.textContent === nextTitle) return;

      if (prefersReducedMotion) {
        titleEl.textContent = nextTitle;
        return;
      }

      gsap.killTweensOf(titleEl);
      const offset = direction < 0 ? -12 : 12;
      const tl = gsap.timeline({
        defaults: { ease: "power2.out", overwrite: "auto" },
      });
      tl.to(titleEl, {
        autoAlpha: 0,
        y: direction < 0 ? 8 : -8,
        duration: 0.18,
      })
        .add(() => {
          titleEl.textContent = nextTitle;
        })
        .set(titleEl, { y: offset })
        .to(titleEl, { autoAlpha: 1, y: 0, duration: 0.28 });
    };

    const computeAxis = () => {
      axisRef.current = window.matchMedia?.("(min-width: 768px)")?.matches
        ? "y"
        : "x";
    };

    const measureStep = () => {
      const first = itemsRef.current?.[0];
      const rect = first?.getBoundingClientRect?.();
      const viewportRect = viewport.getBoundingClientRect?.();
      const axis = axisRef.current;
      const size =
        axis === "x"
          ? rect?.width
            ? Math.max(1, rect.width)
            : 80
          : rect?.height
            ? Math.max(1, rect.height)
            : 80;
      stepPxRef.current = size + 10;

      const viewportSize =
        axis === "x"
          ? viewportRect?.width
            ? Math.max(1, viewportRect.width)
            : size * 4
          : viewportRect?.height
            ? Math.max(1, viewportRect.height)
            : size * 4;

      const visibleSpan = size * 4 + 10 * 3;
      startOffsetRef.current = Math.max((viewportSize - visibleSpan) / 2, 0);
    };

    const VISIBLE_COUNT = 4;

    const applyGalleryState = (
      nextActiveIndex,
      { immediate, direction = 1 } = {},
    ) => {
      const duration =
        prefersReducedMotion || immediate ? 0 : isDesktop ? 0.62 : 0.28;
      const ease = "power3.out";
      const n = count;
      const step = stepPxRef.current;
      const startOffset = startOffsetRef.current;
      const axis = axisRef.current;

      gsap.killTweensOf(itemsRef.current.filter(Boolean));

      itemsRef.current.forEach((el, originalIndex) => {
        if (!el) return;

        const pos = mod(originalIndex - nextActiveIndex, n);
        const isActive = pos === 0;
        const prevSlotAttr = el.dataset.slot;
        const prevSlot = prevSlotAttr == null ? null : Number(prevSlotAttr);

        let slot = pos;
        let autoAlpha = pos < VISIBLE_COUNT ? 1 : 0;
        let scale = pos === 0 ? 1 : 0.965;

        if (direction > 0) {
          if (pos >= VISIBLE_COUNT) {
            slot = -1;
            autoAlpha = 0;
            scale = 0.92;
          }

          const enteringFromBottom =
            !immediate &&
            prevSlot != null &&
            prevSlot < 0 &&
            pos === VISIBLE_COUNT - 1;

          if (enteringFromBottom) {
            gsap.set(el, {
              x: axis === "x" ? startOffset + VISIBLE_COUNT * step : 0,
              y: axis === "y" ? startOffset + VISIBLE_COUNT * step : 0,
              autoAlpha: 0,
              scale: 0.9,
            });
            slot = VISIBLE_COUNT - 1;
            autoAlpha = 1;
            scale = 0.965;
          }
        } else {
          if (pos >= VISIBLE_COUNT) {
            slot = VISIBLE_COUNT;
            autoAlpha = 0;
            scale = 0.92;
          }

          const enteringFromTop =
            !immediate &&
            prevSlot != null &&
            prevSlot > VISIBLE_COUNT - 1 &&
            pos === 0;

          if (enteringFromTop) {
            gsap.set(el, {
              x: axis === "x" ? startOffset - step : 0,
              y: axis === "y" ? startOffset - step : 0,
              autoAlpha: 0,
              scale: 0.9,
            });
            slot = 0;
            autoAlpha = 1;
            scale = 1;
          }
        }

        const v = startOffset + slot * step;
        el.setAttribute("aria-current", isActive ? "true" : "false");
        el.dataset.active = isActive ? "true" : "false";
        el.dataset.slot = String(slot);

        gsap.to(el, {
          x: axis === "x" ? v : 0,
          y: axis === "y" ? v : 0,
          autoAlpha,
          scale,
          duration,
          ease,
          force3D: true,
          overwrite: "auto",
        });

        el.style.zIndex = String(
          slot >= 0 && slot < VISIBLE_COUNT ? VISIBLE_COUNT - slot : 0,
        );
      });
    };

    const crossfadeBackgroundTo = (nextIndex, immediate = false) => {
      const duration = prefersReducedMotion ? 0 : isDesktop ? 0.5 : 0.18;
      const ease = "power2.out";

      const next = safeImages[nextIndex];
      if (!next?.src) return;

      const showingA = activeBgLayerRef.current === 0;
      const inLayer = showingA ? bgB : bgA;
      const outLayer = showingA ? bgA : bgB;
      const inImg = showingA ? bgImgB : bgImgA;
      const outImg = showingA ? bgImgA : bgImgB;

      if (!decodedImagesRef.current.has(next.src) && !immediate) {
        bgImgA.src = next.src;
        bgImgA.alt = next.alt || "";
        bgImgB.src = next.src;
        bgImgB.alt = next.alt || "";
        gsap.set(bgA, { autoAlpha: 1 });
        gsap.set(bgB, { autoAlpha: 0 });
        activeBgLayerRef.current = 0;
        return;
      }

      inImg.src = next.src;
      inImg.alt = next.alt || "";

      gsap.killTweensOf([inLayer, outLayer]);
      gsap.set(inLayer, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { duration, ease, overwrite: "auto" },
      });
      gsap.set(inImg, {
        y: prefersReducedMotion ? 0 : 10,
        scale: prefersReducedMotion ? 1 : 1.03,
        force3D: true,
      });
      gsap.set(outImg, { y: 0, scale: 1, force3D: true });

      tl.to(inLayer, { autoAlpha: 1 }, 0)
        .to(inImg, { y: 0, scale: 1 }, 0)
        .to(outLayer, { autoAlpha: 0 }, 0)
        .eventCallback("onComplete", () => {
          activeBgLayerRef.current = showingA ? 1 : 0;
        });
    };

    const setActiveIndexInternal = (
      nextIndex,
      { immediate, direction } = {},
    ) => {
      if (nextIndex === activeIndexRef.current) return;
      const prevIndex = activeIndexRef.current;
      const jump = Math.abs(nextIndex - prevIndex);
      const resolvedDir =
        direction ??
        (nextIndex > prevIndex ? 1 : nextIndex < prevIndex ? -1 : 1);
      activeIndexRef.current = nextIndex;
      crossfadeBackgroundTo(nextIndex, immediate);
      applyGalleryState(nextIndex, {
        immediate: immediate || jump > 1,
        direction: resolvedDir,
      });
      swapTitleTo(nextIndex, resolvedDir);
    };

    activeIndexRef.current = 0;
    activeBgLayerRef.current = 0;
    setTitleInstant(0);

    bgImgA.src = safeImages[0].src;
    bgImgA.alt = safeImages[0].alt || "";
    bgImgB.src = safeImages[0].src;
    bgImgB.alt = safeImages[0].alt || "";
    gsap.set(bgA, { autoAlpha: 1 });
    gsap.set(bgB, { autoAlpha: 0 });

    computeAxis();
    measureStep();
    applyGalleryState(0, { immediate: true });
    sectionRef.current?.style.setProperty(
      "--mio-showcase-height",
      `${viewportHeight}px`,
    );

    const updateVisibleViewportHeight = () => {
      const nextVisibleHeight = getVisibleViewportHeight();
      sectionRef.current?.style.setProperty(
        "--mio-showcase-visible-height",
        `${nextVisibleHeight}px`,
      );
      if (!isDesktop) {
        sectionRef.current?.style.setProperty(
          "--mio-showcase-height",
          `${nextVisibleHeight}px`,
        );
        if (!refreshRafRef.current) {
          refreshRafRef.current = window.requestAnimationFrame(() => {
            refreshRafRef.current = 0;
            stRef.current?.refresh?.();
          });
        }
      }
    };

    updateVisibleViewportHeight();
    viewportSizeRef.current = {
      width: window.innerWidth,
      height: viewportHeight,
    };

    const onResize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = isDesktop
        ? getStableViewportHeight()
        : getVisibleViewportHeight();
      updateVisibleViewportHeight();
      const prevViewport = viewportSizeRef.current;
      const widthChanged = Math.abs(nextWidth - prevViewport.width) > 1;
      const heightChanged =
        isDesktop && Math.abs(nextHeight - prevViewport.height) > 120;

      if (!widthChanged && !heightChanged) {
        return;
      }

      viewportSizeRef.current = {
        width: nextWidth,
        height: nextHeight,
      };
      sectionRef.current?.style.setProperty(
        "--mio-showcase-height",
        `${nextHeight}px`,
      );
      computeAxis();
      measureStep();
      applyGalleryState(activeIndexRef.current, { immediate: true });
      stRef.current?.refresh?.();
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.visualViewport?.addEventListener(
      "resize",
      updateVisibleViewportHeight,
      {
        passive: true,
      },
    );
    roRef.current = new ResizeObserver(onResize);
    roRef.current.observe(viewport);

    const itemsForCleanup = itemsRef.current.slice();
    let hintTimer = 0;
    const hideScrollHint = () => {
      if (hintTimer) {
        window.clearTimeout(hintTimer);
        hintTimer = 0;
      }
      setShowScrollHint(false);
    };
    const queueScrollHint = () => {
      hideScrollHint();
      hintTimer = window.setTimeout(() => {
        setShowScrollHint(true);
        hintTimer = 0;
      }, 3000);
    };

    const scrollSteps = Math.max(1, count);
    stRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () =>
        `+=${Math.round(
          scrollSteps *
            getStableViewportHeight() *
            (isDesktop ? SCROLL_STEP_VIEWPORT_RATIO : 0.42),
        )}`,
      pin: true,
      refreshPriority: 30,
      anticipatePin: isDesktop ? 1 : 0,
      scrub: prefersReducedMotion ? false : isDesktop ? 0.38 : 0.08,
      invalidateOnRefresh: isDesktop,
      onEnter: queueScrollHint,
      onEnterBack: queueScrollHint,
      onLeave: hideScrollHint,
      onLeaveBack: hideScrollHint,
      onUpdate: (self) => {
        if (count <= 1) return;
        if (self.progress > 0.015 && self.progress < 0.985) {
          hideScrollHint();
          queueScrollHint();
        }
        const idx = clampInt(self.progress * count, 0, count - 1);
        if (idx !== activeIndexRef.current) {
          setActiveIndexInternal(idx, { direction: self.direction });
        }
      },
    });
    if (stRef.current.isActive) {
      queueScrollHint();
    }

    return () => {
      window.clearTimeout(hintTimer);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener(
        "resize",
        updateVisibleViewportHeight,
      );
      if (refreshRafRef.current) {
        window.cancelAnimationFrame(refreshRafRef.current);
        refreshRafRef.current = 0;
      }
      roRef.current?.disconnect?.();
      roRef.current = null;
      stRef.current?.kill?.();
      stRef.current = null;
      gsap.killTweensOf([
        bgA,
        bgB,
        bgImgA,
        bgImgB,
        titleEl,
        ...itemsForCleanup,
      ]);
    };
  }, [count, defaultTitles, prefersReducedMotion, safeImages, title]);

  if (count === 0) return null;

  const openModal = (triggerEl) => {
    const n = defaultTitles.length || DEFAULT_TITLES.length || 1;
    if (triggerEl) {
      const rect = triggerEl.getBoundingClientRect();
      setModalOrigin({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });
    }
    setModalIndex(mod(activeIndexRef.current || mobileIndex, n));
    setIsButtonLaunching(true);
    setIsModalOpen(true);
    window.setTimeout(() => {
      setIsButtonLaunching(false);
    }, 280);
  };

  const setMobileImageIndex = (nextIndex, isWrapJump = false) => {
    const duration = isWrapJump ? 180 : 420;
    setMobileTransitionMs(duration);
    setIsMobileTransitioning(true);
    setMobileIndex(mod(nextIndex, count));
    window.setTimeout(() => {
      setIsMobileTransitioning(false);
    }, duration);
  };

  const goToPreviousMobileImage = () => {
    setMobileImageIndex(mobileIndex - 1, mobileIndex === 0);
  };

  const goToNextMobileImage = () => {
    setMobileImageIndex(mobileIndex + 1, mobileIndex === count - 1);
  };

  return (
    <section
      ref={sectionRef}
      className={[
        "relative h-[var(--mio-showcase-height,100dvh)] min-h-[var(--mio-showcase-height,100svh)] w-full overflow-hidden md:h-screen md:min-h-screen",
        isMobileTransitioning ? "mio-showcase-mobile-switching" : "",
      ].join(" ")}
      style={{ "--mio-showcase-mobile-transition-ms": `${mobileTransitionMs}ms` }}
    >
      <div className="absolute inset-x-0 -top-12 -bottom-16 md:inset-0">
        <div ref={bgLayerRefA} className="absolute inset-0">
          <img
            ref={bgImgRefA}
            src={safeImages[mobileIndex]?.src}
            alt={safeImages[mobileIndex]?.alt || ""}
            className="h-full w-full object-cover object-[73%_center] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform md:object-center md:transition-none"
            draggable="false"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
        <div ref={bgLayerRefB} className="absolute inset-0">
          <img
            ref={bgImgRefB}
            src={safeImages[mobileIndex]?.src}
            alt={safeImages[mobileIndex]?.alt || ""}
            className="h-full w-full object-cover object-[73%_center] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform md:object-center md:transition-none"
            draggable="false"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      <div className="relative z-10 flex h-full w-full items-end px-6 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-12 sm:px-10 md:items-center md:pb-0 md:pt-0 lg:px-20">
        <div className="absolute right-6 top-[max(1.25rem,env(safe-area-inset-top))] z-30 rounded-full bg-white/82 px-3.5 py-2 text-[13px] font-semibold leading-none text-[#131314] shadow-[0_10px_24px_rgba(15,15,15,0.12)] backdrop-blur-md md:hidden">
          {mobileIndex + 1}/{count}
        </div>

        <div className="absolute bottom-15 left-20 z-20 hidden w-auto max-w-none md:block">
          <a
            href={buttonHref || "#"}
            onClick={(e) => {
              e.preventDefault();
              openModal(e.currentTarget);
            }}
            className="group inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-white px-6 py-3 font-semibold leading-5 text-black md:w-auto"
          >
            {t("showcase.modalButtonText")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className={[
                "translate-y-[2px] transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover:-translate-x-[2px] group-hover:translate-y-[3px]",
                isButtonLaunching
                  ? "translate-x-[9px] -translate-y-[8px] opacity-0"
                  : "",
              ].join(" ")}
            >
              <path
                d="M3.75 16.25L16.25 3.75M16.25 3.75H6.875M16.25 3.75V13.125"
                stroke="#131314"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
        <div
          className={[
            "pointer-events-none absolute left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[#131314]",
            "hidden bottom-[max(1rem,env(safe-area-inset-bottom))] md:flex md:bottom-8",
            "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            showScrollHint
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0",
          ].join(" ")}
          aria-hidden="true"
        >
          <span className="rounded-full bg-white/70 px-4 py-2 text-[12px] font-medium leading-none shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md md:text-[13px]">
            {t("showcase.scrollHint")}
          </span>
          <span className="relative h-9 w-5 rounded-full border border-[#131314]/70">
            <span className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#131314] motion-safe:animate-bounce" />
          </span>
        </div>
        <button
          type="button"
          onClick={goToPreviousMobileImage}
          className="absolute left-5 top-1/2 z-30 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[#e8e8e8] bg-white/90 text-[#1d1d1f] shadow-[0_10px_24px_rgba(15,15,15,0.12)] backdrop-blur-md transition-transform active:scale-95 md:hidden"
          aria-label="Previous showcase image"
        >
          <ChevronLeft size={21} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          onClick={goToNextMobileImage}
          className="absolute right-5 top-1/2 z-30 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[#e8e8e8] bg-white/90 text-[#1d1d1f] shadow-[0_10px_24px_rgba(15,15,15,0.12)] backdrop-blur-md transition-transform active:scale-95 md:hidden"
          aria-label="Next showcase image"
        >
          <ChevronRight size={21} strokeWidth={2.2} />
        </button>
        <div className="grid w-full translate-y-9 grid-cols-1 items-end gap-6 pb-18 md:translate-y-0 md:grid-cols-12 md:items-center md:gap-10 md:pb-0">
          <div className="rounded-[22px] bg-black/34 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-md md:col-span-5 md:max-w-130 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-0">
            <p className="font-normal leading-5 text-white md:text-[#131314]">
              {buttonText}
            </p>

            <h2
              ref={titleRef}
              key={`showcase-mobile-title-${mobileIndex}`}
              className="pt-4 pb-2 text-[32px] font-medium leading-[120%] text-white will-change-transform animate-[mioShowcaseMobileTitle_480ms_cubic-bezier(0.22,1,0.36,1)] md:animate-none md:text-[#131314]"
            >
              {defaultTitles[mobileIndex] ??
                title ??
                DEFAULT_TITLES[mobileIndex] ??
                DEFAULT_TITLES[0]}
            </h2>

            <button
              type="button"
              onClick={(e) => {
                openModal(e.currentTarget);
              }}
              className="mt-10 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold leading-none text-black shadow-[0_16px_38px_rgba(0,0,0,0.14)] transition-transform active:scale-[0.98] md:hidden"
              aria-label={t("showcase.modalButtonText")}
            >
              {t("showcase.modalButtonText")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className={[
                  "transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isButtonLaunching
                    ? "translate-x-[7px] -translate-y-[7px] opacity-0"
                    : "",
                ].join(" ")}
              >
                <path
                  d="M3.75 16.25L16.25 3.75M16.25 3.75H6.875M16.25 3.75V13.125"
                  stroke="#131314"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="hidden md:col-span-7 md:block">
            <div className="flex w-full items-center justify-center md:justify-end">
              <div
                ref={galleryViewportRef}
                className="relative h-20 w-full max-w-94 overflow-hidden md:h-130 md:w-20 md:max-w-none"
              >
                <div className="absolute inset-0">
                  {safeImages.map((img, i) => (
                    <div
                      key={img.id ?? i}
                      ref={(el) => {
                        itemsRef.current[i] = el;
                      }}
                      className={[
                        "absolute left-0 top-0 h-20 w-20 origin-top-left overflow-hidden",
                        "will-change-transform",
                        "md:left-auto md:right-0 md:origin-top-right",
                      ].join(" ")}
                    >
                      <img
                        src={img.src}
                        alt={img.alt || ""}
                        className="h-full w-full object-cover"
                        draggable="false"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc={MODAL_IMAGES[modalIndex] ?? modalPng}
        prefersReducedMotion={prefersReducedMotion}
        originRect={modalOrigin}
      />
    </section>
  );
}
