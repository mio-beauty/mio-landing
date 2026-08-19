import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SectionShell from "./SectionShell.jsx";
import { useI18n } from "../i18n/I18nProvider.jsx";
import products from "../data/products.js";

const featuredVisuals = [
  "from-[#FFF2EC] via-[#FFE4DA] to-[#FFD0C1]",
  "from-[#F4F4F3] via-[#EEF2F6] to-[#DFE8F3]",
];

const scrollToContactSection = () => {
  if (typeof document === "undefined") return;

  const contactSection =
    document.getElementById("contact") || document.getElementById("contacts");

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

function FeaturedProductCard({
  title,
  subtitle,
  description,
  image,
  imageClassName,
  accentClassName,
  buttonClassName,
  buyNowLabel,
}) {
  return (
    <article className="overflow-hidden border border-[#0000000D] bg-white">
      <div
        className={`relative isolate flex aspect-[0.92] items-center justify-center overflow-hidden bg-gradient-to-b sm:aspect-[1/1.02] lg:aspect-[1/1.05] ${accentClassName} before:absolute before:inset-auto before:bottom-[12%] before:left-1/2 before:h-34 before:w-34 before:-translate-x-1/2 before:rounded-full before:blur-[12px] sm:before:h-42 sm:before:w-42 lg:before:h-50 lg:before:w-50`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.55),transparent_22%,transparent_78%,rgba(255,255,255,0.38))]" />
        <img
          src={image}
          alt={title}
          className={`relative z-10 h-full w-full ${imageClassName}`}
        />
      </div>

      <div className="flex flex-col gap-4 p-4 mb-4 sm:p-5 lg:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[28px] leading-[0.98] font-medium text-[#111111] sm:text-[34px] lg:text-[40px]">
              {title}
            </h3>
            <span className="rounded-full bg-[#FF8B64] px-1.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1D1D1E] sm:text-[11px]">
              {subtitle}
            </span>
          </div>
          <p className="max-w-[42ch] pt-2 text-[15px] leading-[1.2] text-[#6F6F73] sm:text-[18px] lg:text-[20px] lg:leading-none">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={scrollToContactSection}
          className={` w-full cursor-pointer rounded-full px-5 py-3 text-[14px] leading-none font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 sm:text-[15px] lg:text-[16px] ${buttonClassName}`}
        >
          {buyNowLabel}
        </button>
      </div>
    </article>
  );
}

function ProductCard({ title, description, image, imageClassName, buyLabel }) {
  return (
    <article className="group flex h-full min-w-0 flex-col transition-transform duration-300 md:hover:-translate-y-1">
      <div className="overflow-hidden rounded-[14px] bg-[#F7F1EC]">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className={`aspect-[0.93] w-full rounded-4 transition-transform duration-500 md:group-hover:scale-[1.04] ${imageClassName}`}
        />
      </div>

      <div className="flex flex-1 flex-col pt-3 sm:pt-4">
        <div className="h-[88px] sm:h-[82px]">
          <h3 className="line-clamp-2 text-[18px] leading-[1.15] font-medium text-[#111111] sm:text-[20px]">
            {title}
          </h3>
          <p className="line-clamp-2 pt-2 text-[13px] leading-[1.35] text-[#66666A] sm:text-[14px]">
            {description}
          </p>
        </div>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={scrollToContactSection}
            className="w-full cursor-pointer rounded-full bg-[#1D1D1D] px-5 py-2.5 text-[12px] leading-none font-medium text-white transition-colors duration-200 md:hover:bg-[#2B2B2B] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D1D1D]/20"
          >
            {buyLabel}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProductsSection() {
  const { language, t } = useI18n();
  const [showAllProducts, setShowAllProducts] = useState(false);
  const productScrollerRef = useRef(null);

  // Expanding the catalog changes the height of this section. Refresh the
  // review pin after the new grid has been laid out so its scroll trigger
  // starts at the real section position instead of the old one.
  useLayoutEffect(() => {
    if (!showAllProducts || typeof window === "undefined") return undefined;

    const refresh = () => ScrollTrigger.refresh();
    const frameId = window.requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(refresh)
      : null;
    if (resizeObserver && productScrollerRef.current) {
      resizeObserver.observe(productScrollerRef.current);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("load", refresh);
      resizeObserver?.disconnect();
    };
  }, [showAllProducts]);

  const scrollProducts = (direction) => {
    productScrollerRef.current?.scrollBy({
      left: direction * Math.max(productScrollerRef.current.clientWidth * 0.8, 280),
      behavior: "smooth",
    });
  };
  const localizedProducts = useMemo(
    () => products.map((product) => ({
      id: product.id,
      image: product.image,
      title: product[language]?.[0] ?? product.en[0],
      description: product[language]?.[1] ?? product.en[1],
    })),
    [language],
  );
  const featuredProducts = useMemo(
    () =>
      localizedProducts.slice(0, 2).map((product, index) => ({
        ...product,
        imageClassName: "object-cover object-center scale-[1.03]",
        accentClassName: `${featuredVisuals[index]} before:bg-[radial-gradient(circle_at_center,_rgba(255,132,104,0.5),_rgba(255,132,104,0)_68%)]`,
        buttonClassName:
          "bg-[#1D1D1D] text-white md:hover:bg-[#2B2B2B] focus-visible:ring-[#1D1D1D]/20",
        subtitle: index === 0 ? "Bestseller" : "MIO Beauty",
        buyNowLabel: t("products.buyNow"),
      })),
    [localizedProducts, t],
  );
  const productCards = useMemo(
    () =>
      localizedProducts.slice(2).map((product) => ({
        ...product,
        imageClassName: "object-cover object-center",
        buyLabel: t("products.buy"),
      })),
    [localizedProducts, t],
  );

  return (
    <SectionShell id="products">
      <div className="flex flex-col items-center">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col">
          <span id="catalog" className="block scroll-mt-28" aria-hidden="true" />
          <div className="grid gap-px bg-[#0000000D] lg:grid-cols-2">
            {featuredProducts.map((product) => (
              <FeaturedProductCard key={product.id} {...product} />
            ))}
          </div>

          <div
            className={`bg-white py-10 sm:px-5 sm:py-12 lg:rounded-[32px] lg:px-4 lg:py-15 ${showAllProducts ? "mb-10 px-4 pb-16 sm:mb-14 lg:mb-20 lg:pb-24" : "pl-4 pr-0"}`}
          >
            <div className="mx-auto flex items-end justify-between gap-4 pb-6 text-left sm:text-center">
              <h2 className="text-[30px] leading-[1.02] font-medium text-[#111111] sm:text-[42px] sm:leading-[1.05] lg:text-[50px]">
                {t("products.allTitle")}
              </h2>
              {!showAllProducts && (
                <div className="hidden shrink-0 gap-2 lg:flex">
                  <button
                    type="button"
                    aria-label="Previous products"
                    onClick={() => scrollProducts(-1)}
                    className="group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#1D1D1D] text-[0px] text-[#1D1D1D] transition-all duration-200 hover:bg-[#1D1D1D] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D1D1D]/20 active:scale-95"
                  >
                    <ArrowLeft aria-hidden="true" size={19} strokeWidth={1.6} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Next products"
                    onClick={() => scrollProducts(1)}
                    className="group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#1D1D1D] text-[0px] text-[#1D1D1D] transition-all duration-200 hover:bg-[#1D1D1D] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D1D1D]/20 active:scale-95"
                  >
                    <ArrowRight aria-hidden="true" size={19} strokeWidth={1.6} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    →
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 sm:mt-8">
              <div
                ref={productScrollerRef}
                className={showAllProducts
                  ? "grid grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-3 xl:grid-cols-5"
                  : "flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 pr-0 scrollbar-hide"}
              >
                {productCards.map((product) => (
                  <div
                    key={product.id}
                    className={showAllProducts
                      ? "h-full min-w-0"
                      : "product-card-shell h-full w-[280px] max-w-[calc(100vw-60px)] shrink-0 snap-start last:pr-4"}
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            </div>

            {!showAllProducts && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllProducts(true)}
                  className="cursor-pointer rounded-full bg-[#1D1D1D] px-7 py-3 text-[13px] font-medium text-white transition-colors duration-200 hover:bg-[#2B2B2B] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1D1D1D]/20"
                >
                  {t("products.allTitle")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
