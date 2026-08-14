import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import faceImg from "../assets/img/face.jpg";
import face2Img from "../assets/img/face2.jpg";
import face3Img from "../assets/img/face3.jpg";
import face4Img from "../assets/img/face4.jpg";
import result1Img from "../assets/img/result1.png";
import { useI18n } from "../i18n/I18nProvider.jsx";

const PREVIEWS = [faceImg, face2Img, face3Img, face4Img, result1Img];
const PREVIEW_EDGE_GUTTER = 24;
const PREVIEW_SCALE_EASE = "cubic-bezier(0.32, 0, 0.67, 0)";
const PREVIEW_ENTER_SCALE = 0.18;
const PREVIEW_CLOSE_SCALE = 0;
const PREVIEW_HIDE_DELAY_MS = 120;
const SCROLL_IDLE_DELAY_MS = 140;

export default function TrustSection() {
  const { get, t } = useI18n();
  const translatedItems = get("trust.items", []);
  const items = useMemo(
    () =>
      translatedItems.map((item, index) => ({
        ...item,
        preview: PREVIEWS[index],
      })),
    [translatedItems],
  );

  const sectionRef = useRef(null);
  const previewRef = useRef(null);
  const labelRef = useRef(null);
  const labelTextRef = useRef(null);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "01");
  const [hoveredId, setHoveredId] = useState(null);
  const [hoverPreview, setHoverPreview] = useState({ visible: false });
  const [isPreviewMounted, setIsPreviewMounted] = useState(false);
  const pointerPositionRef = useRef({ x: 0, y: 0 });
  const showFrameRef = useRef(0);
  const moveXRef = useRef(null);
  const moveYRef = useRef(null);
  const moveLabelXRef = useRef(null);
  const moveLabelYRef = useRef(null);
  const moveLabelTextXRef = useRef(null);
  const moveLabelTextYRef = useRef(null);
  const scrollIdleTimeoutRef = useRef(0);
  const isScrollLockedRef = useRef(false);

  useEffect(() => {
    if (items[0]?.id) {
      setActiveId(items[0].id);
    }
  }, [items]);

  const activeItem = useMemo(
    () => items.find((item) => item.id === activeId) ?? items[0],
    [activeId, items],
  );
  const activeIndex = useMemo(
    () => items.findIndex((item) => item.id === activeItem?.id),
    [activeItem, items],
  );

  useLayoutEffect(() => {
    const preview = previewRef.current;
    const label = labelRef.current;
    const labelText = labelTextRef.current;
    if (!preview || !label || !labelText) return undefined;

    const ctx = gsap.context(() => {
      moveXRef.current = gsap.quickTo(preview, "left", {
        duration: 0.95,
        ease: "power3",
      });
      moveYRef.current = gsap.quickTo(preview, "top", {
        duration: 0.95,
        ease: "power3",
      });
      moveLabelXRef.current = gsap.quickTo(label, "left", {
        duration: 0.38,
        ease: "power3",
      });
      moveLabelYRef.current = gsap.quickTo(label, "top", {
        duration: 0.38,
        ease: "power3",
      });
      moveLabelTextXRef.current = gsap.quickTo(labelText, "x", {
        duration: 0.45,
        ease: "power3",
      });
      moveLabelTextYRef.current = gsap.quickTo(labelText, "y", {
        duration: 0.45,
        ease: "power3",
      });
    }, preview);

    return () => ctx.revert();
  }, [isPreviewMounted]);

  useEffect(() => {
    if (hoverPreview.visible) {
      setIsPreviewMounted(true);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsPreviewMounted(false);
    }, PREVIEW_HIDE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [hoverPreview.visible]);

  useEffect(
    () => () => {
      if (showFrameRef.current) {
        window.cancelAnimationFrame(showFrameRef.current);
      }
      if (scrollIdleTimeoutRef.current) {
        window.clearTimeout(scrollIdleTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const dismissPreview = () => {
      isScrollLockedRef.current = true;
      if (showFrameRef.current) {
        window.cancelAnimationFrame(showFrameRef.current);
        showFrameRef.current = 0;
      }
      if (scrollIdleTimeoutRef.current) {
        window.clearTimeout(scrollIdleTimeoutRef.current);
      }
      setHoverPreview((current) => ({
        ...current,
        visible: false,
      }));
      setHoveredId(null);
      moveLabelTextXRef.current?.(0);
      moveLabelTextYRef.current?.(0);

      scrollIdleTimeoutRef.current = window.setTimeout(() => {
        isScrollLockedRef.current = false;
      }, SCROLL_IDLE_DELAY_MS);
    };

    window.addEventListener("scroll", dismissPreview, { passive: true });
    window.addEventListener("hashchange", dismissPreview);

    return () => {
      window.removeEventListener("scroll", dismissPreview);
      window.removeEventListener("hashchange", dismissPreview);
    };
  }, []);

  const updatePreviewPosition = (event) => {
    if (isScrollLockedRef.current) return;

    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;
    const maxX = rect.width - PREVIEW_EDGE_GUTTER;
    const maxY = rect.height - PREVIEW_EDGE_GUTTER;
    const minX = PREVIEW_EDGE_GUTTER;
    const minY = PREVIEW_EDGE_GUTTER;

    if (
      relativeX < minX ||
      relativeY < minY ||
      relativeX > maxX ||
      relativeY > maxY
    ) {
      setHoverPreview((current) => ({
        ...current,
        visible: false,
      }));
      return;
    }

    pointerPositionRef.current = { x: event.clientX, y: event.clientY };

    if (!hoverPreview.visible) {
      previewRef.current?.style.setProperty("left", `${event.clientX}px`);
      previewRef.current?.style.setProperty("top", `${event.clientY}px`);
      labelRef.current?.style.setProperty("left", `${event.clientX}px`);
      labelRef.current?.style.setProperty("top", `${event.clientY}px`);
    }

    moveXRef.current?.(event.clientX);
    moveYRef.current?.(event.clientY);
    moveLabelXRef.current?.(event.clientX);
    moveLabelYRef.current?.(event.clientY);
    moveLabelTextXRef.current?.(Math.max(-8, Math.min(8, event.movementX * 0.9)));
    moveLabelTextYRef.current?.(Math.max(-8, Math.min(8, event.movementY * 0.9)));

    if (!isPreviewMounted) {
      setIsPreviewMounted(true);
      setHoverPreview({ visible: false });

      if (showFrameRef.current) {
        window.cancelAnimationFrame(showFrameRef.current);
      }

      showFrameRef.current = window.requestAnimationFrame(() => {
        showFrameRef.current = window.requestAnimationFrame(() => {
          setHoverPreview({ visible: true });
        });
      });
      return;
    }

    setHoverPreview({ visible: true });
  };

  const handleItemEnter = (itemId, event) => {
    if (isScrollLockedRef.current) return;
    setActiveId(itemId);
    setHoveredId(itemId);
    updatePreviewPosition(event);
  };

  const handleItemMove = (itemId, event) => {
    if (isScrollLockedRef.current) return;
    if (activeId !== itemId) {
      setActiveId(itemId);
    }
    if (hoveredId !== itemId) {
      setHoveredId(itemId);
    }

    updatePreviewPosition(event);
  };

  const hidePreview = () => {
    if (showFrameRef.current) {
      window.cancelAnimationFrame(showFrameRef.current);
      showFrameRef.current = 0;
    }
    setHoverPreview((current) => ({
      ...current,
      visible: false,
    }));
    setHoveredId(null);
    moveLabelTextXRef.current?.(0);
    moveLabelTextYRef.current?.(0);
  };

  useEffect(() => {
    if (!isPreviewMounted) return;

    const { x, y } = pointerPositionRef.current;
    previewRef.current?.style.setProperty("left", `${x}px`);
    previewRef.current?.style.setProperty("top", `${y}px`);
    labelRef.current?.style.setProperty("left", `${x}px`);
    labelRef.current?.style.setProperty("top", `${y}px`);
  }, [isPreviewMounted]);

  return (
    <section
      ref={sectionRef}
      id="results"
      className="relative isolate z-20 overflow-hidden bg-[#FBF9F6] pb-0 pt-8 lg:overflow-visible lg:px-36 lg:py-18"
      onPointerLeave={hidePreview}
    >
      <div className="px-4 lg:px-0">
        <div className="mb-8 flex items-end justify-between gap-6 border-b border-[#DED8D1] pb-4 lg:mb-0">
          <h3 className="max-w-[640px] text-[clamp(2rem,9vw,3.25rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-[#171411] lg:text-[64px]">
            {t("trust.title")}
          </h3>
          <p className="hidden max-w-[280px] text-right text-[15px] leading-[1.35] text-[#7D7369] lg:block">
            {t("trust.description")}
          </p>
        </div>
      </div>

      {isPreviewMounted && (
        <>
          <div
            ref={previewRef}
            className="pointer-events-none fixed left-0 top-0 z-[120] hidden h-[380px] w-[300px] origin-center overflow-hidden rounded-[6px] bg-[#E8DFD4] shadow-[0_30px_80px_rgba(34,24,16,0.16)] transition-transform duration-[120ms] will-change-transform lg:block"
            style={{
              transform: `translate3d(-50%, -50%, 0) scale(${hoverPreview.visible ? 1 : isPreviewMounted ? PREVIEW_CLOSE_SCALE : PREVIEW_ENTER_SCALE})`,
              transitionTimingFunction: PREVIEW_SCALE_EASE,
            }}
          >
            <div
              className="relative h-full w-full"
              style={{
                top: `${activeIndex * -100}%`,
                transition: "top 0.55s cubic-bezier(0.76, 0, 0.24, 1)",
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex h-full w-full items-center justify-center"
                >
                  <img
                    src={item.preview}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,20,16,0.06)_0%,rgba(24,20,16,0.18)_100%)]" />
          </div>

          <div
            ref={labelRef}
            className="pointer-events-none fixed left-0 top-0 z-[130] hidden h-[80px] w-[80px] origin-center items-center justify-center rounded-full border border-white/30 bg-white/16 text-[14px] font-medium text-white shadow-[0_10px_35px_rgba(17,12,8,0.22)] backdrop-blur-[14px] transition-transform duration-[120ms] will-change-transform lg:flex"
            style={{
              transform: `translate3d(-50%, -50%, 0) scale(${hoverPreview.visible ? 1 : isPreviewMounted ? 0 : PREVIEW_ENTER_SCALE})`,
              transitionTimingFunction: PREVIEW_SCALE_EASE,
            }}
          >
            <span ref={labelTextRef} className="block will-change-transform">
              {t("trust.hoverLabel")}
            </span>
          </div>
        </>
      )}

      <div className="relative flex flex-col">
        {items.map((item) => {
          const isActive = hoveredId === item.id;

          return (
            <article
              key={item.id}
              className="cursor-pointer border-b border-[#DED8D1] transition-colors duration-300"
              onPointerEnter={(event) => handleItemEnter(item.id, event)}
              onPointerMove={(event) => handleItemMove(item.id, event)}
              onFocus={() => {
                setActiveId(item.id);
                setHoveredId(item.id);
              }}
              onPointerLeave={hidePreview}
            >
              <div className="px-4 py-6 lg:px-0 lg:py-12">
                <div className="flex flex-col gap-4 lg:hidden">
                  <div className="mb-2 text-[12px] font-medium tracking-[0.18em] text-[#9C9287] uppercase">
                    {item.id}
                  </div>
                  <h2 className="text-[30px] leading-[0.98] tracking-[-0.05em] text-[#191512]">
                    {item.title}
                  </h2>
                  <p className="max-w-[320px] text-[15px] leading-[1.35] text-[#7D7369]">
                    {item.service}
                  </p>
                </div>

                <div className="hidden lg:grid lg:grid-cols-[120px_minmax(0,1fr)_320px] lg:items-center lg:gap-6">
                  <div
                    className={`text-[68px] leading-none tracking-[-0.05em] transition-colors duration-300 ${
                      isActive ? "text-[#1B1714]" : "text-[#C9C2B9]"
                    }`}
                  >
                    {item.id}
                  </div>

                  <h2
                    className={`min-w-0 text-[76px] leading-[0.94] tracking-[-0.06em] transition-colors duration-300 ${
                      isActive ? "text-[#1B1714]" : "text-[#C9C2B9]"
                    }`}
                  >
                    {item.title}
                  </h2>

                  <p
                    className={`justify-self-end text-right text-[18px] leading-[1.2] transition-colors duration-300 ${
                      isActive ? "text-[#2D241B]" : "text-[#A79D92]"
                    }`}
                  >
                    {item.service}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
