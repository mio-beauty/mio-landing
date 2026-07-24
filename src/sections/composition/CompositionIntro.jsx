import { useI18n } from "../../i18n/I18nProvider.jsx";

export default function CompositionIntro({ headingRef, paragraphRef }) {
  const { get, t } = useI18n();
  const headingLines = get("composition.headingLines", []);

  return (
    <header className="max-w-170 lg:col-span-5">
      <h2
        ref={headingRef}
        className="max-w-[320px] text-[18px] font-semibold leading-[1.04] text-[#0B0B0B] sm:max-w-[560px] sm:text-[30px] lg:max-w-none lg:text-[36px]"
      >
        {headingLines.map((line) => (
          <span key={line} data-title-line className="block">
            {line}
          </span>
        ))}
      </h2>
      <p
        ref={paragraphRef}
        className="mt-3 max-w-[340px] text-[11px] leading-[1.08] text-[#0B0B0B] sm:mt-5 sm:max-w-[620px] sm:text-[14px] sm:leading-4"
      >
        {t("composition.description")}
      </p>
    </header>
  );
}
