export default function CompositionIntro({ headingRef, paragraphRef }) {
  return (
    <header className="lg:col-span-5 max-w-170">
      <h2
        ref={headingRef}
        className="text-[24px] font-semibold leading-[120%] text-[#0B0B0B] sm:text-[36px]"
      >
        <span data-title-line className="block">
          Натуральный состав и
        </span>
        <span data-title-line className="block">
          европейские ингредиенты
        </span>
      </h2>
      <p
        ref={paragraphRef}
        className="mt-6 text-[14px] leading-4 text-[#0B0B0B]"
      >
        Мы выбираем экологичный уход, используя минимум химии и максимум
        натуральных компонентов, чтобы ваша кожа сияла здоровьем.
      </p>
    </header>
  );
}
