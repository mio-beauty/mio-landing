import { useLayoutEffect, useMemo, useRef, useState } from "react";
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
  return Math.round(window.visualViewport?.height || window.innerHeight || 0);
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
    const isDesktop = window.matchMedia?.("(min-width: 768px)")?.matches ?? false;
    const viewportHeight = getStableViewportHeight();

    if (!bgA || !bgB || !bgImgA || !bgImgB || !viewport) return;

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
      tl.to(titleEl, { autoAlpha: 0, y: direction < 0 ? 8 : -8, duration: 0.18 })
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
      const duration = prefersReducedMotion || immediate ? 0 : isDesktop ? 0.62 : 0.28;
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
    viewportSizeRef.current = {
      width: window.innerWidth,
      height: viewportHeight,
    };

    const onResize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = getStableViewportHeight();
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
      computeAxis();
      measureStep();
      applyGalleryState(activeIndexRef.current, { immediate: true });
      stRef.current?.refresh?.();
    };

    window.addEventListener("resize", onResize, { passive: true });
    roRef.current = new ResizeObserver(onResize);
    roRef.current.observe(viewport);

    const itemsForCleanup = itemsRef.current.slice();

    const scrollSteps = Math.max(1, count);
    stRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () =>
        `+=${Math.round(
          scrollSteps *
            viewportHeight *
            (isDesktop ? SCROLL_STEP_VIEWPORT_RATIO : 0.42),
        )}`,
      pin: true,
      refreshPriority: 30,
      anticipatePin: isDesktop ? 1 : 0,
      scrub: prefersReducedMotion ? false : isDesktop ? 0.38 : 0.08,
      invalidateOnRefresh: isDesktop,
      onUpdate: (self) => {
        if (count <= 1) return;
        const idx = clampInt(self.progress * count, 0, count - 1);
        if (idx !== activeIndexRef.current) {
          setActiveIndexInternal(idx, { direction: self.direction });
        }
      },
    });

    return () => {
      window.removeEventListener("resize", onResize);
      roRef.current?.disconnect?.();
      roRef.current = null;
      stRef.current?.kill?.();
      stRef.current = null;
      gsap.killTweensOf([bgA, bgB, ...itemsForCleanup]);
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
    setModalIndex(mod(activeIndexRef.current, n));
    setIsButtonLaunching(true);
    setIsModalOpen(true);
    window.setTimeout(() => {
      setIsButtonLaunching(false);
    }, 280);
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] min-h-[100svh] w-full overflow-hidden md:h-screen"
    >
      <div className="absolute inset-0">
        <div ref={bgLayerRefA} className="absolute inset-0">
          <img
            ref={bgImgRefA}
            src={safeImages[0]?.src}
            alt={safeImages[0]?.alt || ""}
            className="h-full w-full object-cover will-change-transform"
            draggable="false"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
        <div ref={bgLayerRefB} className="absolute inset-0">
          <img
            ref={bgImgRefB}
            src={safeImages[0]?.src}
            alt={safeImages[0]?.alt || ""}
            className="h-full w-full object-cover will-change-transform"
            draggable="false"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      <div className="relative z-10 flex h-full w-full items-end px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-10 md:items-center md:pb-0 lg:px-20">
        <div className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-20 w-[calc(100%-3rem)] max-w-94 -translate-x-1/2 md:bottom-15 md:left-20 md:w-auto md:max-w-none md:translate-x-0">
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
        <div className="grid w-full grid-cols-1 items-end gap-6 pb-24 md:grid-cols-12 md:items-center md:gap-10 md:pb-0">
          <div className="md:col-span-5 md:max-w-130">
            <p className="font-normal leading-5 text-white">{buttonText}</p>

            <h2
              ref={titleRef}
              className="pt-4 text-[32px] font-medium leading-[120%] text-white will-change-transform"
            >
              {defaultTitles[0] ?? title ?? DEFAULT_TITLES[0]}
            </h2>
          </div>

          <div className="md:col-span-7">
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
