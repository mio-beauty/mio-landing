import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useI18n } from "../i18n/I18nProvider.jsx";
import checkFilledIconImg from "../assets/img/ic_check_filled.svg";
import closeFilledIconImg from "../assets/img/ic_close_filled.svg";

export default function ConsultationModal({
  isOpen,
  onClose,
  imageSrc,
  product = null,
  prefersReducedMotion = false,
  originRect = null,
}) {
  const { language, t } = useI18n();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const firstFieldRef = useRef(null);
  const phoneFieldRef = useRef(null);
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const imageWrapRef = useRef(null);
  const imageRef = useRef(null);
  const bodyRef = useRef(null);
  const closeButtonRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const tlRef = useRef(null);

  const formatPhone = (value) => {
    let numbers = value.replace(/\D/g, "");
    if (numbers.startsWith("998")) numbers = numbers.slice(3);
    numbers = numbers.slice(0, 9);

    let formatted = "+998";
    if (numbers.length > 0) formatted += " " + numbers.slice(0, 2);
    if (numbers.length > 2) formatted += " " + numbers.slice(2, 5);
    if (numbers.length > 5) formatted += " " + numbers.slice(5, 7);
    if (numbers.length > 7) formatted += " " + numbers.slice(7, 9);

    return formatted + (numbers.length === 0 ? " " : "");
  };

  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value));
    if (submitStatus === "error") setSubmitStatus("idle");
  };

  const handlePhoneFocus = () => {
    window.requestAnimationFrame(() => {
      const input = phoneFieldRef.current;
      input?.setSelectionRange?.(input.value.length, input.value.length);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || phone.replace(/\D/g, "").length < 12) {
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      if (!response.ok) throw new Error("Contact form request failed");

      setName("");
      setPhone("+998 ");
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("failed");
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    globalThis.__mioLenis?.stop?.();

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);

    const timeoutId = window.setTimeout(() => {
      firstFieldRef.current?.focus?.();
    }, 180);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
      globalThis.__mioLenis?.start?.();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (submitStatus !== "success" && submitStatus !== "failed") {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setSubmitStatus("idle");
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [submitStatus]);

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;
  const originCenterX = originRect
    ? originRect.left + originRect.width / 2
    : viewportWidth / 2;
  const originCenterY = originRect
    ? originRect.top + originRect.height / 2
    : viewportHeight / 2;
  const targetCenterX = viewportWidth / 2;
  const targetCenterY = viewportHeight / 2;
  const translateX = originRect ? originCenterX - targetCenterX : 0;
  const translateY = originRect ? originCenterY - targetCenterY : 28;
  const scaleX = originRect ? Math.max(originRect.width / 920, 0.18) : 0.92;
  const scaleY = originRect ? Math.max(originRect.height / 560, 0.12) : 0.94;
  const closedScale = Math.min(scaleX, scaleY);

  useLayoutEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const imageWrap = imageWrapRef.current;
    const image = imageRef.current;
    const body = bodyRef.current;
    const closeButton = closeButtonRef.current;
    const title = titleRef.current;
    const form = formRef.current;

    if (!backdrop || !panel || !body || !closeButton || !title || !form) {
      return undefined;
    }

    tlRef.current?.kill();

    if (prefersReducedMotion) {
      gsap.set(backdrop, { autoAlpha: isOpen ? 1 : 0 });
      gsap.set(panel, {
        autoAlpha: isOpen ? 1 : 0,
        x: 0,
        y: 0,
        scale: isOpen ? 1 : 0.98,
        rotate: 0,
        borderRadius: isOpen ? 28 : 999,
      });
      gsap.set([body, closeButton, title, form, imageWrap, image], {
        autoAlpha: isOpen ? 1 : 0,
        y: 0,
        x: 0,
        scale: 1,
      });
      return undefined;
    }

    const closedState = {
      x: translateX,
      y: translateY,
      scale: closedScale,
      rotate: translateX * 0.008,
      borderRadius: 999,
      autoAlpha: 0.98,
    };

    if (isOpen) {
      gsap.set(backdrop, { autoAlpha: 0 });
      gsap.set(panel, closedState);
      gsap.set(closeButton, { autoAlpha: 0, scale: 0.86, y: 16 });
      gsap.set(body, { autoAlpha: 0, y: 22 });
      gsap.set(title, { autoAlpha: 0, y: 18 });
      gsap.set(form, { autoAlpha: 0, y: 26 });

      if (imageWrap) gsap.set(imageWrap, { autoAlpha: 0, x: -26, scale: 1.03 });
      if (image) gsap.set(image, { scale: 1.1 });

      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

      tl.to(backdrop, {
        autoAlpha: 1,
        duration: 0.28,
        ease: "power2.out",
      })
        .to(
          panel,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            borderRadius: 28,
            duration: 0.58,
            ease: "expo.out",
          },
          0,
        )
        .to(
          closeButton,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.28,
            ease: "power3.out",
          },
          0.18,
        )
        .to(
          body,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.34,
            ease: "power3.out",
          },
          0.16,
        )
        .to(
          title,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.32,
            ease: "power3.out",
          },
          0.2,
        )
        .to(
          form,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.36,
            ease: "power3.out",
          },
          0.24,
        );

      if (imageWrap && image) {
        tl.to(
          imageWrap,
          {
            autoAlpha: 1,
            x: 0,
            scale: 1,
            duration: 0.42,
            ease: "power3.out",
          },
          0.08,
        ).to(
          image,
          {
            scale: 1,
            duration: 0.58,
            ease: "power2.out",
          },
          0.08,
        );
      }

      tlRef.current = tl;
    } else {
      gsap.set(backdrop, { autoAlpha: 1 });
      gsap.set(panel, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        borderRadius: 28,
      });
      gsap.set([body, closeButton, title, form], {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
      });
      if (imageWrap) gsap.set(imageWrap, { autoAlpha: 1, x: 0, scale: 1 });
      if (image) gsap.set(image, { scale: 1 });

      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

      tl.to([form, title], {
        autoAlpha: 0,
        y: -10,
        duration: 0.18,
        ease: "power2.in",
        stagger: 0.03,
      })
        .to(
          body,
          {
            autoAlpha: 0,
            y: -8,
            duration: 0.2,
            ease: "power2.in",
          },
          0.02,
        )
        .to(
          closeButton,
          {
            autoAlpha: 0,
            scale: 0.9,
            y: 10,
            duration: 0.18,
            ease: "power2.in",
          },
          0,
        )
        .to(
          panel,
          {
            x: translateX,
            y: translateY,
            scale: closedScale,
            rotate: translateX * 0.008,
            borderRadius: 999,
            autoAlpha: 0.96,
            duration: 0.38,
            ease: "expo.inOut",
          },
          0.06,
        )
        .to(
          backdrop,
          {
            autoAlpha: 0,
            duration: 0.18,
            ease: "power2.out",
          },
          0.14,
        );

      tlRef.current = tl;
    }

    return () => {
      tlRef.current?.kill();
    };
  }, [closedScale, isOpen, prefersReducedMotion, translateX, translateY]);

  return (
    <>
      <div
      ref={backdropRef}
      aria-hidden={!isOpen}
      className={[
        "fixed inset-0 z-50 flex items-center justify-center p-6 md:p-10",
        "bg-[rgba(15,12,10,0.46)] backdrop-blur-[10px]",
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      ].join(" ")}
      onClick={() => onClose?.()}
    >
      <div
        className="relative w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label={t("modal.close")}
          className="absolute -top-17 right-0 z-10 grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-white/92 shadow-[0_18px_48px_rgba(18,12,8,0.16)] backdrop-blur-md"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5 5L15 15M15 5L5 15"
              stroke="#131314"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          className="relative w-full overflow-hidden bg-[#F7F2EC] shadow-[0_38px_120px_rgba(19,14,11,0.22)]"
        >
          <div className="grid h-full grid-cols-1 md:grid-cols-2">
            <div
              ref={imageWrapRef}
              className="relative block h-64 md:h-full"
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt=""
                className="h-full w-full object-cover"
                draggable="false"
                decoding="async"
              />
            </div>

            <div
              ref={bodyRef}
              className="flex flex-col items-center justify-center gap-8 bg-[#F7F2EC] p-6 md:p-20"
            >
              <h3
                ref={titleRef}
                className="mb-6 text-[26px] font-semibold leading-[120%] text-black md:text-[32px]"
              >
                {product?.title ?? t("modal.title")}
              </h3>

              {product ? (
                <div ref={formRef} className="flex w-full flex-col gap-5">
                  <p className="text-[15px] leading-[1.5] text-[#5F5B57] md:text-[17px]">
                    {product.details?.[language] ?? product.details?.en}
                  </p>
                  <div className="rounded-2xl border border-black/10 bg-white/45 p-4 text-sm leading-[1.5] text-[#77716B]">
                    {t("products.detailsPlaceholder")}
                  </div>
                </div>
              ) : (
                <form ref={formRef} className="flex w-full flex-col gap-6" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-4">
                    <label className="block">
                      <span className="text-sm font-medium text-black">
                        {t("modal.name")}
                      </span>
                      <input
                        ref={firstFieldRef}
                        type="text"
                        placeholder={t("modal.namePlaceholder")}
                        value={name}
                        onChange={(event) => {
                          setName(event.target.value);
                          if (submitStatus === "error") setSubmitStatus("idle");
                        }}
                        className="mt-2 h-9 w-full rounded-lg border border-[#CCCCCC] bg-white/86 px-4 text-black outline-none focus:border-black/30"
                      />
                    </label>
                    <label className="mb-5 block">
                      <span className="text-sm font-medium text-black">
                        {t("modal.phone")}
                      </span>
                      <input
                        ref={phoneFieldRef}
                        type="tel"
                        inputMode="tel"
                        placeholder={t("modal.phonePlaceholder")}
                        value={phone}
                        onChange={handlePhoneChange}
                        onFocus={handlePhoneFocus}
                        className="mt-2 h-9 w-full rounded-lg border border-[#CCCCCC] bg-white/86 px-4 text-black outline-none focus:border-black/30"
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitStatus === "loading"}
                    className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-[#1D1B19] px-6 font-normal text-white disabled:cursor-wait disabled:opacity-70"
                  >
                    {submitStatus === "loading" ? "..." : t("modal.cta")}
                  </button>
                  {submitStatus === "error" && (
                    <p className="-mt-3 text-sm text-red-600">{t("modal.validationError")}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>

      {(submitStatus === "success" || submitStatus === "failed") && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[100] flex w-[calc(100%-32px)] max-w-xl -translate-x-1/2 items-center gap-2 rounded-xl border border-[#757575] bg-[#000000D9] px-3 py-2.5 shadow-[0_18px_48px_rgba(18,12,8,0.2)] backdrop-blur-md"
        >
          <img
            src={
              submitStatus === "success"
                ? checkFilledIconImg
                : closeFilledIconImg
            }
            alt=""
          />
          <p className="text-[16px] text-white">
            {t(
              submitStatus === "success"
                ? "modal.success"
                : "modal.submitError",
            )}
          </p>
        </div>
      )}
    </>
  );
}
