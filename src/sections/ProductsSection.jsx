import { useMemo } from "react";
import SectionShell from "./SectionShell.jsx";
import { useI18n } from "../i18n/I18nProvider.jsx";
import p1 from "../assets/img/p1.jpg";
import p2 from "../assets/img/p2.jpg";
import p3 from "../assets/img/p3.jpg";
import p4 from "../assets/img/p4.jpg";
import p5 from "../assets/img/p5.jpg";
import p6 from "../assets/img/p6.jpg";
import p7 from "../assets/img/p7.jpg";

const featuredProductVisuals = [
  {
    id: 1,
    image: p2,
    imageClassName: "object-cover object-center scale-[1.03]",
    accentClassName:
      "from-[#FFF2EC] via-[#FFE4DA] to-[#FFD0C1] before:bg-[radial-gradient(circle_at_center,_rgba(255,132,104,0.82),_rgba(255,132,104,0)_68%)]",
    buttonClassName:
      "bg-[#1D1D1D] text-white md:hover:bg-[#2B2B2B] focus-visible:ring-[#1D1D1D]/20",
  },
  {
    id: 2,
    image: p1,
    imageClassName: "object-cover object-center scale-[1.02]",
    accentClassName:
      "from-[#F4F4F3] via-[#EEF2F6] to-[#DFE8F3] before:bg-[radial-gradient(circle_at_center,_rgba(255,173,120,0.56),_rgba(255,173,120,0)_70%)]",
    buttonClassName:
      "bg-[#1D1D1D] text-white md:hover:bg-[#2B2B2B] focus-visible:ring-[#1D1D1D]/20",
  },
];

const productCardVisuals = [
  {
    id: 1,
    image: p3,
    imageClassName: "object-cover object-center",
  },
  {
    id: 2,
    image: p4,
    imageClassName: "object-cover object-center",
  },
  {
    id: 3,
    image: p5,
    imageClassName: "object-cover object-center",
  },
  {
    id: 4,
    image: p6,
    imageClassName: "object-cover object-center",
  },
  {
    id: 5,
    image: p7,
    imageClassName: "object-cover object-center",
  },
];

const scrollToContactSection = () => {
  if (typeof document === "undefined") return;

  const contactSection =
    document.getElementById("cantact") || document.getElementById("contacts");

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
            <span className="rounded-full bg-[#FF8B64] px-1.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white sm:text-[11px]">
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
          className={`aspect-[0.93] w-full rounded-4 transition-transform duration-500 md:group-hover:scale-[1.04] ${imageClassName}`}
        />
      </div>

      <div className="flex flex-1 flex-col pt-3 sm:pt-4">
        <div>
          <h3 className="text-[18px] leading-[1.15] font-medium text-[#111111] sm:text-[20px]">
            {title}
          </h3>
          <p className="pt-2 text-[13px] leading-[1.35] text-[#8A8A8D] sm:text-[14px]">
            {description}
          </p>
        </div>

        <div className="mt-auto pt-6">
          <button
            type="button"
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
  const { get, t } = useI18n();
  const featuredLocaleProducts = get("products.featured", []);
  const productLocaleCards = get("products.cards", []);
  const featuredProducts = useMemo(
    () =>
      featuredLocaleProducts.map((product, index) => ({
        ...product,
        ...featuredProductVisuals[index],
        buyNowLabel: t("products.buyNow"),
      })),
    [featuredLocaleProducts, t],
  );
  const productCards = useMemo(
    () =>
      productLocaleCards.map((product, index) => ({
        ...product,
        ...productCardVisuals[index],
        buyLabel: t("products.buy"),
      })),
    [productLocaleCards, t],
  );

  return (
    <SectionShell id="products">
      <div className="flex flex-col items-center">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col">
          <div className="grid gap-px bg-[#0000000D] lg:grid-cols-2">
            {featuredProducts.map((product) => (
              <FeaturedProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="bg-white py-10 pl-4 pr-0 sm:px-5 sm:py-12 lg:rounded-[32px] lg:px-4 lg:py-15">
            <div className="mx-auto pb-6 text-left sm:text-center">
              <h2 className="text-[30px] leading-[1.02] font-medium text-[#111111] sm:text-[42px] sm:leading-[1.05] lg:text-[50px]">
                {t("products.allTitle")}
              </h2>
            </div>

            <div className="mt-6 sm:mt-8">
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 pr-0 scrollbar-hide sm:grid sm:snap-none sm:grid-cols-2 sm:gap-x-3 sm:gap-y-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-5">
                {productCards.map((product) => (
                  <div
                    key={product.id}
                    className="w-[calc(100vw-60px)] max-w-[280px] shrink-0 snap-start first:pl-0 last:pr-4 sm:w-auto sm:max-w-none sm:shrink sm:last:pr-0"
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
