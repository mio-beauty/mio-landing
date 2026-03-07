import { useEffect, useRef } from "react";

export default function ConsultationModal({
  isOpen,
  onClose,
  imageSrc,
  prefersReducedMotion = false,
}) {
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);

    const t = window.setTimeout(() => {
      firstFieldRef.current?.focus?.();
    }, 0);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <div
      aria-hidden={!isOpen}
      className={[
        "fixed inset-0 z-50 flex items-center justify-center p-6 md:p-10",
        "bg-black/55 backdrop-blur-[2px]",
        "transition-opacity duration-200 ease-out",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
      ].join(" ")}
      style={prefersReducedMotion ? { transition: "none" } : undefined}
      onClick={() => onClose?.()}
    >
      <div
        className="relative w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          className="absolute -top-17 right-0 z-10 grid h-12 w-12 place-items-center rounded-full bg-white shadow-md cursor-pointer"
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
          role="dialog"
          aria-modal="true"
          className={[
            "w-full overflow-hidden rounded-3xl bg-white shadow-2xl",
            "transition-transform duration-200 ease-out",
            isOpen ? "translate-y-0 scale-100" : "translate-y-2 scale-[0.98]",
          ].join(" ")}
        >
          <div className="grid h-full grid-cols-1 md:grid-cols-2">
            <div className="relative h-56 md:h-full">
              <img
                src={imageSrc}
                alt=""
                className="h-full w-full object-cover"
                draggable="false"
                decoding="async"
              />
            </div>

            <div className=" flex flex-col justify-center items-center gap-8 p-6 md:p-20">
              <h3 className="text-[26px] font-semibold leading-[120%] text-black md:text-[32px] mb-6">
                Оставьте свои контактные данные для консультации.
              </h3>

              <form className="w-full flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-black">Имя</span>
                    <input
                      ref={firstFieldRef}
                      type="text"
                      placeholder="Ваше имя"
                      className="mt-2 h-9 w-full rounded-[8px] border border-[#CCCCCC] px-4 text-black outline-none focus:border-black/30"
                    />
                  </label>
                  <label className="block mb-5">
                    <span className="text-sm font-medium text-black">
                      Телефон номер
                    </span>
                    <input
                      type="tel"
                      placeholder="+998"
                      className="mt-2 h-9 w-full rounded-[8px] border border-[#CCCCCC] px-4 text-black outline-none focus:border-black/30"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  className="inline-flex h-11 w-full items-center justify-center rounded-[8px] bg-black px-6 font-normal text-white cursor-pointer"
                >
                  Получить консультацию
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
