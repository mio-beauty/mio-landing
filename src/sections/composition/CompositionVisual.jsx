import SpfImage from "../../assets/img/optimized/spf.webp";
import { useI18n } from "../../i18n/I18nProvider.jsx";

export default function CompositionVisual({
  orbitRef,
  productOuterRef,
  productInnerRef,
  cursorCtaRef,
  features,
  cardsOuterRefs,
  cardsFloatRefs,
  cardsInnerRefs,
}) {
  const { t } = useI18n();

  return (
    <div className="relative mx-auto w-full">
      <div className="relative mx-auto h-[310px] w-full sm:h-[430px] lg:h-140">
        <div
          ref={orbitRef}
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        >
          <svg
            className="h-[220px] w-[410px] opacity-70 sm:h-95 sm:w-185 lg:h-162.5 lg:w-350"
            viewBox="0 0 920 460"
            fill="none"
            style={{ transform: "rotate(9.36deg)" }}
            aria-hidden="true"
          >
            <ellipse
              cx="460"
              cy="230"
              rx="420"
              ry="170"
              stroke="#CCCCCC"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9),rgba(246,246,244,0)_62%)] blur-2xl sm:h-95 sm:w-95 lg:h-110 lg:w-110"
          aria-hidden="true"
        />

        <div
          ref={productOuterRef}
          className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        >
          <div ref={productInnerRef} className="will-change-transform">
            <img
              src={SpfImage}
              alt="Product bottle"
              width="896"
              height="1200"
              className="w-42.5 select-none sm:w-72 lg:w-125"
              draggable="false"
            />
          </div>

          <div
            ref={cursorCtaRef}
            className={[
              "pointer-events-none absolute left-0 top-0 z-40",
              "flex w-28.75 h-28.75 items-center justify-center gap-2",
              "rounded-full px-3.75 py-2",
              "cursor-pointer",
              "bg-black/10 text-white text-sm font-normal",
              "backdrop-blur-sm",
              "opacity-0 scale-0 select-none will-change-transform transform-gpu",
            ].join(" ")}
            aria-hidden="true"
          >
            {t("composition.contactCta")}
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-3 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-6 lg:absolute lg:inset-0 lg:mt-0 lg:block">
        {features.map((f, i) => (
          <article
            key={f.title}
            className={[
              "relative",
              "lg:absolute",
              "w-full lg:w-72.5 xl:w-77.5",
              f.posLg,
            ].join(" ")}
            ref={(el) => {
              cardsOuterRefs.current[i] = el;
            }}
          >
            <div
              ref={(el) => {
                cardsFloatRefs.current[i] = el;
              }}
              className="will-change-transform"
            >
              <div
                ref={(el) => {
                  cardsInnerRefs.current[i] = el;
                }}
                className="pointer-events-none flex min-h-[156px] w-full max-w-none flex-col items-center gap-3 rounded-[16px] bg-white px-3 py-4 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)] will-change-transform sm:min-h-[210px] sm:gap-4 sm:rounded-3xl sm:p-6 lg:pointer-events-auto lg:max-w-62.5 lg:p-6"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white sm:h-12 sm:w-12">
                  {f.iconSrc}
                </div>
                <div>
                  <h3 className="mt-3 text-[13px] font-medium leading-[1.05] tracking-[-0.01em] text-slate-900 sm:mt-5 sm:text-[15px] sm:leading-snug">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[11px] leading-[1.1] text-slate-600 sm:text-[13px] sm:leading-relaxed">
                    {f.text}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
