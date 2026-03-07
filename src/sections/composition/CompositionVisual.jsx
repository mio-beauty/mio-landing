import SpfImage from "../../assets/img/spf.png";

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
  return (
    <div className="relative mx-auto ">
      <div className="relative mx-auto h-105 w-full sm:h-120 lg:h-140">
        <div
          ref={orbitRef}
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        >
          <svg
            className="h-80 w-155 opacity-70 sm:h-95 sm:w-185 lg:h-162.5 lg:w-350"
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
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-80 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9),rgba(246,246,244,0)_62%)] blur-2xl sm:h-95 sm:w-95 lg:h-110 lg:w-110"
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
              className="h-auto w-64 select-none drop-shadow-[0_40px_70px_rgba(15,23,42,0.16)] sm:w-72 lg:w-102.25"
              // style={{ transform: "rotate(-5deg)" }}
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
            Shop now
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:absolute lg:inset-0 lg:mt-0 lg:block">
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
                className="pointer-events-none w-full max-w-none flex flex-col items-center gap-4 rounded-2xl bg-[#F8F8F8] p-5 text-center  will-change-transform sm:p-6 lg:pointer-events-auto lg:max-w-62.5 lg:p-6"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white">
                  {f.iconSrc}
                </div>
                <div>
                  <h3 className="mt-5 text-[15px] font-medium leading-snug tracking-[-0.01em] text-slate-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
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
