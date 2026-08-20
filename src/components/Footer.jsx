import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import footerLogoImg from "../assets/img/Logo-footer.svg";
import footerOrangeLogoImg from "../assets/img/Logo-footer-orange.svg";
import { useI18n } from "../i18n/I18nProvider.jsx";

export default function Footer() {
  const { get, t } = useI18n();
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState(false);
  const infoLinks = get("footer.infoLinks", []);
  const infoLinkTargets = ["#results", "#composition", "#reviews"];

  const formatPhone = (value) => {
    let numbers = value.replace(/\D/g, "");
    if (numbers.startsWith("998")) numbers = numbers.slice(3);
    numbers = numbers.slice(0, 9);

    if (numbers.length === 0) return "+998 ";

    let formatted = "+998";
    if (numbers.length > 0) formatted += " " + numbers.slice(0, 2);
    if (numbers.length > 2) formatted += " " + numbers.slice(2, 5);
    if (numbers.length > 5) formatted += " " + numbers.slice(5, 7);
    if (numbers.length > 7) formatted += " " + numbers.slice(7, 9);

    return formatted;
  };

  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value));
    if (error) setError(false);
  };

  const handlePhoneFocus = () => {
    setFocused(true);
    if (!phone) setPhone("+998 ");
  };

  const handlePhoneBlur = () => {
    setFocused(false);
    if (phone === "+998 " || phone === "+998") setPhone("");
  };

  const handleSubmit = () => {
    const phoneNumbers = phone.replace(/\D/g, "");

    if (!phone.trim() || phone === "+998 " || phoneNumbers.length < 12) {
      setPhone("");
      setError(true);
      return;
    }

    setPhone("");
    setError(false);

    const telegramText = encodeURIComponent(
      `Assalomu alaykum, konsultatsiya uchun raqamim: ${phone}`,
    );
    window.open(`https://t.me/miobeauty?text=${telegramText}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="bg-[#1D1D1E] text-white">
      <div className="p-3 lg:pb-[102px]">
        <img className="h-auto w-full" src={footerLogoImg} alt="" />
      </div>

      <div className="flex flex-col lg:px-20">
        <div className="hidden pb-6 lg:block">
          <img src={footerOrangeLogoImg} alt="logo" />
        </div>

        <div className="flex flex-col items-start px-4 lg:flex-row lg:justify-between lg:px-0">
          <div className="flex gap-12 py-7 pb-0 text-sm lg:order-2 lg:text-2xl">
            <ul className="flex flex-col gap-3">
              <li className="font-semibold">{t("footer.infoTitle")}</li>
              {infoLinks.map((item, index) => (
                <li key={item}>
                  <a href={infoLinkTargets[index] ?? "#"}>{item}</a>
                </li>
              ))}
            </ul>

            <ul className="flex flex-col gap-3 text-sm">
              <li className="font-semibold">{t("footer.contactsTitle")}</li>
              <li className="flex">
                <a href="https://t.me/miobeauty" target="_blank" rel="noreferrer">Telegram</a>
                <ArrowUpRight size={16} />
              </li>
              <li className="flex">
                <a href="https://www.instagram.com/miobeautyuz/" target="_blank" rel="noreferrer">Instagram</a>
                <ArrowUpRight size={16} />
              </li>
              <li className="flex">
                <a href="https://www.facebook.com/miobeautyuz/" target="_blank" rel="noreferrer">Facebook</a>
                <ArrowUpRight size={16} />
              </li>
              <li>+998 90 001 04 44</li>
            </ul>
          </div>

          <div className="lg:order-1 lg:w-[50%]">
            <p className="text-2xl font-semibold lg:text-[32px]">
              {t("footer.contactHeading")}
            </p>

            <div className="flex flex-col gap-2 py-6 pb-0 text-sm">
              <p>{t("footer.phoneLabel")}</p>

              <div className="flex flex-col gap-2 lg:flex-row">
                <div className="relative lg:w-[60%]">
                  <input
                    className={`w-full rounded-full border-none bg-[#FFFFFF] px-3 py-2.5 outline-none ${
                      focused || phone ? "text-[#0B0B0B]" : "text-[#5F5F5F]"
                    }`}
                    placeholder={!error ? "+998" : ""}
                    type="text"
                    inputMode="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    onFocus={handlePhoneFocus}
                    onBlur={handlePhoneBlur}
                  />

                  {error && !phone && !focused && (
                    <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-[#5F5F5F]">
                      +998<span className="text-red-500">*</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  className="flex items-center justify-center rounded-full border-none bg-[#FFFFFF] px-5 py-2.5 font-medium text-[#0B0B0B]"
                >
                  {t("footer.cta")}
                  <ArrowRight size={18} />
                </button>
              </div>

              <p className="text-[16px] text-[#B8B8B8]">{t("footer.helper")}</p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-10 pt-8 text-lg text-[#B8B8B8] lg:px-0">
          <p className="text-sm">{t("footer.copyright")}</p>
        </div>
      </div>
    </section>
  );
}
