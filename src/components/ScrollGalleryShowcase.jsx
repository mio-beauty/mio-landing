import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import modalPng from "../assets/img/modal.png";
import ConsultationModal from "./ConsultationModal";

function clampInt(value, min, max) {
  return Math.min(max, Math.max(min, value | 0));
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

const DEFAULT_TITLES = [
  "Пигментация",
  "Чувствительность",
  "Сухость",
  "Акне и воспаления",
  "Тусклый тон",
];

const MODAL_IMAGES = DEFAULT_TITLES.map(() => modalPng);

export default function ScrollGalleryShowcase({
  images,
  title,
  buttonText,
  buttonHref,
}) {
  const safeImages = useMemo(() => {
    return Array.isArray(images) ? images.filter(Boolean) : [];
  }, [images]);
  const count = safeImages.length;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

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
  const axisRef = useRef("y");
  const stRef = useRef(null);
  const roRef = useRef(null);

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

    // Preload to avoid crossfade stutter.
    safeImages.forEach((img) => {
      if (!img?.src) return;
      const pre = new Image();
      pre.src = img.src;
    });

    const bgA = bgLayerRefA.current;
    const bgB = bgLayerRefB.current;
    const bgImgA = bgImgRefA.current;
    const bgImgB = bgImgRefB.current;
    const viewport = galleryViewportRef.current;
    const titleEl = titleRef.current;

    if (!bgA || !bgB || !bgImgA || !bgImgB || !viewport) return;

    const setTitleInstant = (nextIndex) => {
      if (!titleEl) return;
      const nextTitle = DEFAULT_TITLES[nextIndex] ?? title ?? "";
      titleEl.textContent = nextTitle;
    };

    const swapTitleTo = (nextIndex) => {
      if (!titleEl) return;
      const nextTitle = DEFAULT_TITLES[nextIndex] ?? title ?? "";
      if (titleEl.textContent === nextTitle) return;

      if (prefersReducedMotion) {
        titleEl.textContent = nextTitle;
        return;
      }

      gsap.killTweensOf(titleEl);
      const tl = gsap.timeline({
        defaults: { ease: "power2.out", overwrite: "auto" },
      });
      tl.to(titleEl, { autoAlpha: 0, y: -6, duration: 0.18 })
        .add(() => {
          titleEl.textContent = nextTitle;
        })
        .set(titleEl, { y: 6 })
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
    };

    const applyGalleryState = (nextActiveIndex, { immediate } = {}) => {
      const duration = prefersReducedMotion || immediate ? 0 : 0.9;
      const ease = "power3.out";
      const n = count;
      const step = stepPxRef.current;
      const axis = axisRef.current;

      itemsRef.current.forEach((el, originalIndex) => {
        if (!el) return;
        const pos = mod(originalIndex - nextActiveIndex, n); // 0 = active at top
        const v = pos * step;

        const isActive = pos === 0;

        el.setAttribute("aria-current", isActive ? "true" : "false");
        el.dataset.active = isActive ? "true" : "false";

        gsap.to(el, {
          x: axis === "x" ? v : 0,
          y: axis === "y" ? v : 0,
          duration,
          ease,
          overwrite: "auto",
        });

        el.style.zIndex = String(n - pos);
      });
    };

    const crossfadeBackgroundTo = (nextIndex) => {
      const duration = prefersReducedMotion ? 0 : 0.85;
      const ease = "power2.out";

      const next = safeImages[nextIndex];
      if (!next?.src) return;

      const showingA = activeBgLayerRef.current === 0;
      const inLayer = showingA ? bgB : bgA;
      const outLayer = showingA ? bgA : bgB;
      const inImg = showingA ? bgImgB : bgImgA;
      const outImg = showingA ? bgImgA : bgImgB;

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

    const setActiveIndexInternal = (nextIndex, { immediate } = {}) => {
      if (nextIndex === activeIndexRef.current) return;
      activeIndexRef.current = nextIndex;
      crossfadeBackgroundTo(nextIndex);
      applyGalleryState(nextIndex, { immediate });
      swapTitleTo(nextIndex);
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

    const onResize = () => {
      computeAxis();
      measureStep();
      applyGalleryState(activeIndexRef.current, { immediate: true });
      stRef.current?.refresh?.();
    };

    window.addEventListener("resize", onResize, { passive: true });
    roRef.current = new ResizeObserver(onResize);
    roRef.current.observe(viewport);

    const itemsForCleanup = itemsRef.current.slice();

    const scrollSteps = Math.max(1, count); // one "panel" per image
    stRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () => `+=${scrollSteps * window.innerHeight}`,
      pin: true,
      anticipatePin: 1,
      scrub: prefersReducedMotion ? false : 0.65,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (count <= 1) return;
        const idx = clampInt(self.progress * count, 0, count - 1);
        if (idx !== activeIndexRef.current) setActiveIndexInternal(idx);
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
  }, [count, prefersReducedMotion, safeImages, title]);

  if (count === 0) return null;

  const openModal = () => {
    const n = DEFAULT_TITLES.length || 1;
    setModalIndex(mod(activeIndexRef.current, n));
    setIsModalOpen(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      <div className="absolute inset-0">
        <div ref={bgLayerRefA} className="absolute inset-0">
          <img
            ref={bgImgRefA}
            src={safeImages[0]?.src}
            alt={safeImages[0]?.alt || ""}
            className="h-full w-full object-cover will-change-transform"
            draggable="false"
            decoding="async"
          />
        </div>
        <div ref={bgLayerRefB} className="absolute inset-0">
          <img
            ref={bgImgRefB}
            src={safeImages[0]?.src}
            alt={safeImages[0]?.alt || ""}
            className="h-full w-full object-cover will-change-transform"
            draggable="false"
            decoding="async"
          />
        </div>
      </div>

      <div className="relative z-10 flex h-full w-full items-end px-6 pb-6 sm:px-10 lg:px-20 md:items-center md:pb-0">
        <div className="absolute bottom-6 left-1/2 z-20 w-[calc(100%-3rem)] max-w-94 -translate-x-1/2 md:bottom-15 md:left-20 md:w-auto md:max-w-none md:translate-x-0">
          <a
            href={buttonHref || "#"}
            onClick={(e) => {
              e.preventDefault();
              openModal();
            }}
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 font-semibold leading-5 text-black cursor-pointer md:w-auto"
          >
            Посмотреть решения
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
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
            <p className="text-white leading-5 font-normal">{buttonText}</p>

            <h2
              ref={titleRef}
              className="text-[32px] font-medium leading-[120%] text-white pt-4 will-change-transform"
            >
              {DEFAULT_TITLES[0] ?? title}
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
      />
    </section>
  );
}
