import cartIcon from "../assets/imags/ic_cart.svg";
import supportIcon from "../assets/imags/ic_support.svg";
import { useI18n } from "../i18n/I18nProvider.jsx";

export default function ShowcaseConsultationCta() {
  const { t } = useI18n();

  return (
    <section className="flex justify-center bg-white px-2 py-12 sm:px-6 sm:py-20 lg:px-10 lg:py-[140px]">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center text-center">
        <div className="mx-auto flex w-full max-w-[734px] flex-col items-center">
          <h2 className="max-w-[300px] text-[15px] leading-[1.08] font-normal text-[#111111] sm:max-w-[520px] sm:text-[28px] lg:max-w-none lg:text-[48px]">
            {t("showcase.title")}
          </h2>
          <p className="pt-2 text-[11px] leading-[1.22] text-[#3F3F46] sm:pt-3 sm:text-[16px] lg:text-[18px]">
            {t("showcase.description")}
          </p>
        </div>

        <div className="grid w-full max-w-[868px] grid-cols-1 justify-center gap-2 pt-5 sm:pt-7 lg:grid-cols-2">
          <a
            href="#catalog"
            className="mx-auto flex h-[42px] w-full max-w-[430px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[#F2F2F2] px-5 text-[13px] font-medium text-[#171717] transition-colors duration-200 hover:bg-[#EBEBEB] sm:text-[15px] lg:text-[16px]"
          >
            <img src={cartIcon} alt="" className="h-[18px] w-[18px]" />
            <span>{t("showcase.productsCta")}</span>
          </a>

          <a
            href="#contact"
            className="mx-auto flex h-[42px] w-full max-w-[430px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1F1F1F] px-5 text-[13px] font-medium text-white transition-colors duration-200 hover:bg-[#2B2B2B] sm:text-[15px] lg:text-[16px]"
          >
            <img src={supportIcon} alt="" className="h-[18px] w-[18px]" />
            <span>{t("showcase.consultationCta")}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
